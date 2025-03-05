import calendarize from 'calendarize'
import dayjs from 'dayjs'
import * as React from 'react'
import {
  type AccessibilityProps,
  Animated,
  Platform,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native'

import { u } from '../commonStyles'
import { useNow } from '../hooks/useNow'
import type {
  CalendarCellStyle,
  CalendarCellTextStyle,
  EventCellStyle,
  EventRenderer,
  HorizontalDirection,
  ICalendarEventBase,
  WeekNum,
} from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import { SIMPLE_DATE_FORMAT, getWeeksWithAdjacentMonths } from '../utils/datetime'
import { typedMemo } from '../utils/react'
import { CalendarEventForMonthView } from './CalendarEventForMonthView'

interface CalendarBodyForMonthViewProps<T extends ICalendarEventBase> {
  containerHeight: number
  targetDate: dayjs.Dayjs
  events: T[]
  style: ViewStyle
  eventCellStyle?: EventCellStyle<T>
  eventCellAccessibilityProps?: AccessibilityProps
  calendarCellStyle?: CalendarCellStyle
  calendarCellAccessibilityPropsForMonthView?: AccessibilityProps
  calendarCellAccessibilityProps?: AccessibilityProps
  calendarCellTextStyle?: CalendarCellTextStyle
  hideNowIndicator?: boolean
  showAdjacentMonths: boolean
  onLongPressCell?: (date: Date) => void
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
  showWeekNumber?: boolean
  renderCustomDateForMonth?: (date: Date) => React.ReactElement | null
  disableMonthEventCellPress?: boolean
}

function _CalendarBodyForMonthView<T extends ICalendarEventBase>({
  containerHeight,
  targetDate,
  style,
  onLongPressCell,
  onPressCell,
  onPressDateHeader,
  events,
  onPressEvent,
  eventCellStyle,
  eventCellAccessibilityProps = {},
  calendarCellStyle,
  calendarCellAccessibilityPropsForMonthView = {},
  calendarCellAccessibilityProps = {},
  calendarCellTextStyle,
  hideNowIndicator,
  showAdjacentMonths,
  renderEvent,
  maxVisibleEventCount,
  weekStartsOn,
  eventMinHeightForMonthView,
  moreLabel,
  onPressMoreLabel,
  sortedMonthView,
  showWeekNumber = false,
  renderCustomDateForMonth,
  disableMonthEventCellPress,
}: CalendarBodyForMonthViewProps<T>) {
  const { now } = useNow(!hideNowIndicator)
  const [calendarWidth, setCalendarWidth] = React.useState<number>(0)
  const [calendarCellHeight, setCalendarCellHeight] = React.useState<number>(0)

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
      }

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
      let min = day.startOf('day')
      const max = day.endOf('day')

      //filter all events that starts from the current week until the current day, and sort them by reverse starting time
      let filteredEvents = events
        .filter(
          ({ start, end }) => dayjs(end).isAfter(day.startOf('week')) && dayjs(start).isBefore(max),
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
      for (const { start, end } of filteredEvents) {
        if (dayjs(end).isAfter(min) && dayjs(start).isBefore(min)) {
          min = dayjs(start).startOf('day')
        }
      }

      filteredEvents = filteredEvents
        .filter(
          ({ start, end }) => dayjs(end).endOf('day').isAfter(min) && dayjs(start).isBefore(max),
        )
        .reverse()
      /**
       * We move eligible event to the top
       * For example, when rendering for 03/01, Event 3 should be moved to the top, since there is a gap left by Event 1
       */
      const finalEvents: T[] = []
      let tmpDay: dayjs.Dayjs = day.startOf('week')
      //re-sort events from the start of week until the calendar cell date
      //optimize sorting of event nodes and make sure that no empty gaps are left on top of calendar cell
      while (!tmpDay.isAfter(day)) {
        for (const event of filteredEvents) {
          if (dayjs(event.end).isBefore(tmpDay.startOf('day'))) {
            const eventToMoveUp = filteredEvents.find((e) =>
              dayjs(e.start).startOf('day').isSame(tmpDay.startOf('day')),
            )
            if (eventToMoveUp !== undefined) {
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
          } else if (finalEvents.indexOf(event) === -1) {
            finalEvents.push(event)
          }
        }

        tmpDay = tmpDay.add(1, 'day')
      }

      return finalEvents
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
              date?.format(SIMPLE_DATE_FORMAT) === now.format(SIMPLE_DATE_FORMAT)
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
        {date?.format('D')}
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
        u.rounded,
        { borderColor: theme.palette.gray['200'] },
        style,
      ]}
      onLayout={({ nativeEvent: { layout } }) => {
        setCalendarWidth(layout.width)
      }}
    >
      {weeks.map((week, i) => (
        <View
          key={`${i}-${week.join('-')}`}
          style={[
            u['flex-1'],
            theme.isRTL ? u['flex-row-reverse'] : u['flex-row'],
            Platform.OS === 'android' && style, // TODO: in Android, backgroundColor is not applied to child components
            {
              minHeight: minCellHeight,
            },
          ]}
        >
          {showWeekNumber ? (
            <View
              style={[
                i > 0 && u['border-t'],
                { borderColor: theme.palette.gray['200'] },
                u['p-2'],
                u['w-20'],
                u['flex-column'],
                {
                  minHeight: minCellHeight,
                },
              ]}
              key={'weekNumber'}
              {...calendarCellAccessibilityProps}
            >
              <Text
                style={[
                  { textAlign: 'center' },
                  theme.typography.sm,
                  {
                    color: theme.palette.gray['800'],
                  },
                ]}
              >
                {week.length > 0
                  ? targetDate.date(week[0]).startOf('week').add(4, 'days').isoWeek()
                  : ''}
              </Text>
            </View>
          ) : null}
          {week
            .map((d) =>
              showAdjacentMonths ? targetDate.date(d) : d > 0 ? targetDate.date(d) : null,
            )
            .map((date, ii) => (
              <TouchableOpacity
                onLongPress={() => date && onLongPressCell && onLongPressCell(date.toDate())}
                onPress={() => date && onPressCell && onPressCell(date.toDate())}
                style={[
                  i > 0 && u['border-t'],
                  theme.isRTL && (ii > 0 || showWeekNumber) && u['border-r'],
                  !theme.isRTL && (ii > 0 || showWeekNumber) && u['border-l'],
                  { borderColor: theme.palette.gray['200'] },
                  u['p-2'],
                  u['flex-1'],
                  u['flex-column'],
                  {
                    minHeight: minCellHeight,
                    zIndex: ii * -1,
                  },
                  {
                    ...getCalendarCellStyle(date?.toDate(), i),
                  },
                ]}
                key={`${ii}-${date?.toDate()}`}
                onLayout={({ nativeEvent: { layout } }) =>
                  // Only set calendarCellHeight once because they are all same
                  // Only set calendarCellHeight if disableMonthEventCellPress is true, since calendarCellHeihgt is only used when disableMonthEventCellPress is true
                  i === 0 &&
                  ii === 0 &&
                  disableMonthEventCellPress &&
                  setCalendarCellHeight(layout.height)
                }
                {...calendarCellAccessibilityPropsForMonthView}
              >
                <TouchableOpacity
                  onPress={() =>
                    date &&
                    (onPressDateHeader
                      ? onPressDateHeader(date.toDate())
                      : onPressCell?.(date.toDate()))
                  }
                  onLongPress={() =>
                    date &&
                    (onPressDateHeader
                      ? onPressDateHeader(date.toDate())
                      : onLongPressCell?.(date.toDate()))
                  }
                  {...calendarCellAccessibilityProps}
                >
                  {renderDateCell(date, i)}
                </TouchableOpacity>
                {
                  //Calendar body will re-render after calendarWidth/calendarCellHeight is set from layout event, prevent expensive operation during first render
                  calendarWidth > 0 &&
                    (!disableMonthEventCellPress || calendarCellHeight > 0) &&
                    date &&
                    sortedEvents(date).reduce(
                      (elements, event, index, events) => [
                        // biome-ignore lint/performance/noAccumulatingSpread: Acceptable to use spread operator here
                        ...elements,
                        index > maxVisibleEventCount ? null : index === maxVisibleEventCount ? (
                          <Text
                            key={`${index}-${event.start}-${event.title}-${event.end}`}
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
                            key={`${index}-${event.start}-${event.title}-${event.end}`}
                            event={event}
                            eventCellStyle={eventCellStyle}
                            eventCellAccessibilityProps={eventCellAccessibilityProps}
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
                    )
                }
                {disableMonthEventCellPress &&
                  calendarCellHeight > 0 && ( //if calendarCellHeight has not been set from layout event, then don't render the element since it will be 0 height
                    /* In this case, we render `TouchableGradually` on the date cell to prevent event cell's touch events from being called. */
                    <TouchableGradually
                      style={{
                        height: calendarCellHeight,
                        width: Math.floor(calendarWidth / 7),
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                      onLongPress={() => date && onLongPressCell && onLongPressCell(date.toDate())}
                      onPress={() => date && onPressCell && onPressCell(date.toDate())}
                      {...calendarCellAccessibilityProps}
                    />
                  )}
              </TouchableOpacity>
            ))}
        </View>
      ))}
    </View>
  )
}

export const CalendarBodyForMonthView = typedMemo(_CalendarBodyForMonthView)

/**
 * A utility component which prevents event cells from being pressed in Month View.
 */
function TouchableGradually({
  onLongPress,
  onPress,
  style,
}: {
  style?: ViewStyle
  onLongPress: () => void
  onPress: () => void
}) {
  const backgroundColor = React.useRef(new Animated.Value(0)).current

  const handlePressIn = () => {
    Animated.timing(backgroundColor, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }

  const handlePressOut = () => {
    Animated.timing(backgroundColor, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }

  return (
    <TouchableHighlight
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      underlayColor="transparent"
      style={style}
    >
      <Animated.View
        style={[
          {
            backgroundColor: backgroundColor.interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.2)'],
            }),
          },
          style,
        ]}
      />
    </TouchableHighlight>
  )
}
