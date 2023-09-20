import calendarize from 'calendarize'
import dayjs from 'dayjs'
import * as React from 'react'
import { Platform, Text, TouchableOpacity, View, ViewStyle } from 'react-native'

import { u } from '../commonStyles'
import { useNow } from '../hooks/useNow'
import { usePanResponder } from '../hooks/usePanResponder'
import {
  CalendarCellStyle,
  CalendarCellTextStyle,
  EventCellStyle,
  EventRenderer,
  HorizontalDirection,
  ICalendarEventBase,
  WeekNum,
} from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import { getWeeksWithAdjacentMonths } from '../utils/datetime'
import { typedMemo } from '../utils/react'
import { CalendarEventForMonthView } from './CalendarEventForMonthView'

interface CalendarBodyForMonthViewProps<T extends ICalendarEventBase> {
  containerHeight: number
  targetDate: dayjs.Dayjs
  events: T[]
  style: ViewStyle
  eventCellStyle?: EventCellStyle<T>
  calendarCellStyle?: CalendarCellStyle
  calendarCellTextStyle?: CalendarCellTextStyle
  hideNowIndicator?: boolean
  showAdjacentMonths: boolean
  onPressCell?: (date: Date) => void
  onPressDateHeader?: (date: Date) => void
  onPressEvent?: (event: T) => void
  onSwipeHorizontal?: (d: HorizontalDirection) => void
  renderEvent?: EventRenderer<T>
  maxVisibleEventCount: number
  weekStartsOn: WeekNum
  eventMinHeightForMonthView: number
  moreLabel: string
  onPressMoreLabel?: (events: T[], date: Date) => void
  sortedMonthView: boolean
  renderCustomDateForMonth?: (date: Date) => React.ReactElement | null
}

function _CalendarBodyForMonthView<T extends ICalendarEventBase>({
  containerHeight,
  targetDate,
  style,
  onPressCell,
  onPressDateHeader,
  events,
  onPressEvent,
  eventCellStyle,
  calendarCellStyle,
  calendarCellTextStyle,
  onSwipeHorizontal,
  hideNowIndicator,
  showAdjacentMonths,
  renderEvent,
  maxVisibleEventCount,
  weekStartsOn,
  eventMinHeightForMonthView,
  moreLabel,
  onPressMoreLabel,
  sortedMonthView,
  renderCustomDateForMonth,
}: CalendarBodyForMonthViewProps<T>) {
  const { now } = useNow(!hideNowIndicator)
  const [calendarWidth, setCalendarWidth] = React.useState<number>(0)

  const panResponder = usePanResponder({
    onSwipeHorizontal,
  })

  const weeks = showAdjacentMonths
    ? getWeeksWithAdjacentMonths(targetDate, weekStartsOn)
    : calendarize(targetDate.toDate(), weekStartsOn)

  const minCellHeight = containerHeight / 5 - 30
  const theme = useTheme()

  const getCalendarCellStyle = React.useMemo(
    () => (typeof calendarCellStyle === 'function' ? calendarCellStyle : () => calendarCellStyle),
    [calendarCellStyle],
  )

  const getCalendarCellTextStyle = React.useMemo(
    () =>
      typeof calendarCellTextStyle === 'function'
        ? calendarCellTextStyle
        : () => calendarCellTextStyle,
    [calendarCellTextStyle],
  )

  const sortedEvents = React.useCallback(
    (day: dayjs.Dayjs) => {
      if (!sortedMonthView) {
        return events.filter(({ start, end }) =>
          day.isBetween(dayjs(start).startOf('day'), dayjs(end).endOf('day'), null, '[)'),
        )
      } else {
        /**
         * Better way to sort overlapping events that spans accross multiple days
         * For example, if you want following events
         * Event 1, start = 01/01 12:00, end = 02/01 12:00
         * Event 2, start = 02/01 12:00, end = 03/01 12:00
         * Event 3, start = 03/01 12:00, end = 04/01 12:00
         *
         * When drawing calendar in month view, event 3 should be placed at 3rd index for 03/01, because Event 2 are placed at 2nd index for 02/01 and 03/01
         *
         */
        let min = day.startOf('day'),
          max = day.endOf('day')

        //filter all events that starts from the current week until the current day, and sort them by reverse starting time
        let filteredEvents = events
          .filter(
            ({ start, end }) =>
              dayjs(end).isAfter(day.startOf('week')) && dayjs(start).isBefore(max),
          )
          .sort((a, b) => {
            if (dayjs(a.start).isSame(b.start, 'day')) {
              const aDuration = dayjs.duration(dayjs(a.end).diff(dayjs(a.start))).days()
              const bDuration = dayjs.duration(dayjs(b.end).diff(dayjs(b.start))).days()
              return aDuration - bDuration
            }
            return b.start.getTime() - a.start.getTime()
          })

        /**
         * find the most relevant min date to filter the events
         * in the example:
         * 1. when rendering for 01/01, min date will be 01/01 (start of day for event 1)
         * 2. when rendering for 02/01, min date will be 01/01 (start of day for event 1)
         * 3. when rendering for 03/01, min date will be 01/01 (start of day for event 1)
         * 4. when rendering for 04/01, min date will be 01/01 (start of day for event 1)
         * 5. when rendering for 05/01, min date will be 05/01 (no event overlaps with 05/01)
         */
        filteredEvents.forEach(({ start, end }) => {
          if (dayjs(end).isAfter(min) && dayjs(start).isBefore(min)) {
            min = dayjs(start).startOf('day')
          }
        })

        filteredEvents = filteredEvents
          .filter(
            ({ start, end }) => dayjs(end).endOf('day').isAfter(min) && dayjs(start).isBefore(max),
          )
          .reverse()
        /**
         * We move eligible event to the top
         * For example, when rendering for 03/01, Event 3 should be moved to the top, since there is a gap left by Event 1
         */
        let finalEvents: T[] = []
        let tmpDay: dayjs.Dayjs = day.startOf('week')
        //re-sort events from the start of week until the calendar cell date
        //optimize sorting of event nodes and make sure that no empty gaps are left on top of calendar cell
        while (!tmpDay.isAfter(day)) {
          filteredEvents.forEach((event) => {
            if (dayjs(event.end).isBefore(tmpDay.startOf('day'))) {
              let eventToMoveUp = filteredEvents.find((e) =>
                dayjs(e.start).startOf('day').isSame(tmpDay.startOf('day')),
              )
              if (eventToMoveUp != undefined) {
                //remove eventToMoveUp from finalEvents first
                if (finalEvents.indexOf(eventToMoveUp) > -1) {
                  finalEvents.splice(finalEvents.indexOf(eventToMoveUp), 1)
                }

                if (finalEvents.indexOf(event) > -1) {
                  finalEvents.splice(finalEvents.indexOf(event), 1, eventToMoveUp)
                } else {
                  finalEvents.push(eventToMoveUp)
                }
              }
            } else if (finalEvents.indexOf(event) == -1) {
              finalEvents.push(event)
            }
          })

          tmpDay = tmpDay.add(1, 'day')
        }

        return finalEvents
      }
    },
    [events, sortedMonthView],
  )

  const renderDateCell = (date: dayjs.Dayjs | null, index: number) => {
    if (date && renderCustomDateForMonth) {
      return renderCustomDateForMonth(date.toDate())
    }

    return (
      <Text
        style={[
          { textAlign: 'center' },
          theme.typography.sm,
          {
            color:
              date?.format('YYYY-MM-DD') === now.format('YYYY-MM-DD')
                ? theme.palette.primary.main
                : date?.month() !== targetDate.month()
                ? theme.palette.gray['500']
                : theme.palette.gray['800'],
          },
          {
            ...getCalendarCellTextStyle(date?.toDate(), index),
          },
        ]}
      >
        {date && date.format('D')}
      </Text>
    )
  }

  return (
    <View
      style={[
        {
          height: containerHeight,
        },
        u['flex-column'],
        u['flex-1'],
        u['border-b'],
        u['border-l'],
        u['border-r'],
        u['rounded'],
        { borderColor: theme.palette.gray['200'] },
        style,
      ]}
      onLayout={({ nativeEvent: { layout } }) => setCalendarWidth(layout.width)}
      {...panResponder.panHandlers}
    >
      {weeks.map((week, i) => (
        <View
          key={i}
          style={[
            u['flex-1'],
            theme.isRTL ? u['flex-row-reverse'] : u['flex-row'],
            Platform.OS === 'android' && style, // TODO: in Android, backgroundColor is not applied to child components
            {
              minHeight: minCellHeight,
            },
          ]}
        >
          {week
            .map((d) =>
              showAdjacentMonths ? targetDate.date(d) : d > 0 ? targetDate.date(d) : null,
            )
            .map((date, ii) => (
              <TouchableOpacity
                onPress={() => date && onPressCell && onPressCell(date.toDate())}
                style={[
                  i > 0 && u['border-t'],
                  theme.isRTL && ii > 0 && u['border-r'],
                  !theme.isRTL && ii > 0 && u['border-l'],
                  { borderColor: theme.palette.gray['200'] },
                  u['p-2'],
                  u['flex-1'],
                  u['flex-column'],
                  {
                    minHeight: minCellHeight,
                  },
                  {
                    ...getCalendarCellStyle(date?.toDate(), i),
                  },
                ]}
                key={ii}
              >
                <TouchableOpacity
                  onPress={() =>
                    date &&
                    (onPressDateHeader
                      ? onPressDateHeader(date.toDate())
                      : onPressCell && onPressCell(date.toDate()))
                  }
                >
                  {renderDateCell(date, i)}
                </TouchableOpacity>
                {date &&
                  sortedEvents(date).reduce(
                    (elements, event, index, events) => [
                      ...elements,
                      index > maxVisibleEventCount ? null : index === maxVisibleEventCount ? (
                        <Text
                          key={index}
                          style={[
                            theme.typography.moreLabel,
                            { marginTop: 2, color: theme.palette.moreLabel },
                          ]}
                          onPress={() => onPressMoreLabel?.(events, date.toDate())}
                        >
                          {moreLabel.replace(
                            '{moreCount}',
                            `${events.length - maxVisibleEventCount}`,
                          )}
                        </Text>
                      ) : (
                        <CalendarEventForMonthView
                          key={index}
                          event={event}
                          eventCellStyle={eventCellStyle}
                          onPressEvent={onPressEvent}
                          renderEvent={renderEvent}
                          date={date}
                          dayOfTheWeek={ii}
                          calendarWidth={calendarWidth}
                          isRTL={theme.isRTL}
                          eventMinHeightForMonthView={eventMinHeightForMonthView}
                          showAdjacentMonths={showAdjacentMonths}
                        />
                      ),
                    ],
                    [] as (null | JSX.Element)[],
                  )}
              </TouchableOpacity>
            ))}
        </View>
      ))}
    </View>
  )
}

export const CalendarBodyForMonthView = typedMemo(_CalendarBodyForMonthView)
