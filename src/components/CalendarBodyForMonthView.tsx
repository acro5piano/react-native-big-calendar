import { Calendar } from 'calendar-base'
import calendarize from 'calendarize'
import dayjs from 'dayjs'
import dayjsPluginUTC from 'dayjs-plugin-utc'
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
import { typedMemo } from '../utils'
import { CalendarEventForMonthView } from './CalendarEventForMonthView'
import { getWeeksWithAdjacentMonths } from '..'

dayjs.extend(dayjsPluginUTC)

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
  sortedMonthView: boolean
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
  sortedMonthView,
}: CalendarBodyForMonthViewProps<T>) {
  const { now } = useNow(!hideNowIndicator)
  const [calendarWidth, setCalendarWidth] = React.useState<number>(0)
  const calendar = React.useRef(new Calendar({ siblingMonths: true })).current

  const nProps = React.useMemo(() => {
    return {
      month: targetDate.utc().month() + 1,
      year: targetDate.utc().year(),
    }
  }, [targetDate])

  const panResponder = usePanResponder({
    onSwipeHorizontal,
  })

  const weeks = showAdjacentMonths
    ? getWeeksWithAdjacentMonths(targetDate, weekStartsOn)
    : calendarize(targetDate.utc().toDate(), weekStartsOn)

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
      return sortedMonthView
        ? events
            .filter(({ start, end }) =>
              day
                .utc()
                .isBetween(
                  dayjs(start).utc().startOf('day'),
                  dayjs(end).utc().endOf('day'),
                  null,
                  '[)',
                ),
            )
            .sort((a, b) => {
              if (dayjs(a.start).utc().isSame(b.start, 'day')) {
                const aDuration = dayjs
                  .duration(dayjs(a.end).utc().diff(dayjs(a.start).utc()))
                  .days()
                const bDuration = dayjs
                  .duration(dayjs(b.end).utc().diff(dayjs(b.start).utc()))
                  .days()
                return bDuration - aDuration
              }
              return a.start.utc().getTime() - b.start.utc().getTime()
            })
        : events.filter(({ start, end }) =>
            day
              .utc()
              .isBetween(
                dayjs(start).utc().startOf('day'),
                dayjs(end).utc().endOf('day'),
                null,
                '[)',
              ),
          )
    },
    [events, sortedMonthView],
  )
  //new code()
  const getCalendarDays = React.useCallback(() => {
    //
    return calendar.getCalendar(nProps.year, nProps.month).map((day) => {
      let _day = { ...day, eventSlots: Array(maxVisibleEventCount - 1).fill(false) }
      return _day
    })
  }, [calendar, maxVisibleEventCount, nProps.month, nProps.year])

  const getEventMeta = React.useCallback(
    (days, eventStart, eventEnd) => {
      //
      const eventStartInView = calendar.isDateSelected(eventStart)
      const eventEndInView = calendar.isDateSelected(eventEnd)
      const firstDayOfMonth = days[0]
      const lastDayOfMonth = days[days.length - 1]

      const eventMeta = {
        // Asserts Event is visible in this month view
        isVisibleInView: false,
        visibleEventLength: days.length,
        // Returns the index (interval from first visible day) of [...days] of event's first "visible" day
        firstVisibleDayIndex: eventStartInView
          ? Calendar.interval(firstDayOfMonth, eventStart) - 1
          : 0,
      }
      // console.log('eventMeta-----------start', eventMeta)

      // Asserts Event is visible in this month view
      if (eventStartInView || eventEndInView) {
        // Asserts event's first or last day is visible in this month view
        eventMeta.isVisibleInView = true
      } else if (eventStart.month < nProps.month && eventEnd.month > nProps.month) {
        // Asserts at least part of month is
        eventMeta.isVisibleInView = true
      }

      // Determine the visible length of the event during the month
      if (eventStartInView && eventEndInView) {
        eventMeta.visibleEventLength = Calendar.interval(eventStart, eventEnd)
      } else if (!eventStartInView && eventEndInView) {
        eventMeta.visibleEventLength = Calendar.interval(firstDayOfMonth, eventEnd)
      } else if (eventStartInView && !eventEndInView) {
        eventMeta.visibleEventLength = Calendar.interval(eventStart, lastDayOfMonth)
      }

      return eventMeta
    },
    [calendar, nProps.month],
  )

  const getDaysWithEvents = React.useCallback(() => {
    // Get all the days in this months calendar view
    // Sibling Months included
    const days = getCalendarDays()

    if (!days) {
      return
    }

    // Set Range Limits on calendar
    calendar.setStartDate(days[0])
    calendar.setEndDate(days[days.length - 1])

    // Iterate over each of the supplied events
    events.forEach((eventItem) => {
      const eventStart = getCalendarDayObject(eventItem.start)
      const eventEnd = getCalendarDayObject(eventItem.end)
      const eventMeta = getEventMeta(days, eventStart, eventEnd)

      // console.log('eventStart-----', eventMeta, eventStart, eventEnd)

      if (eventMeta.isVisibleInView) {
        const eventLength = eventMeta.visibleEventLength
        const eventSlotIndex = days[eventMeta.firstVisibleDayIndex]?.eventSlots.indexOf(false)
        let dayIndex = 0

        // For each day in the event
        while (dayIndex < eventLength) {
          // Clone the event object so we acn add day specfic data
          const eventData = Object.assign({}, eventItem)

          if (dayIndex === 0) {
            // Flag first day of event
            eventData.isFirstDay = true
          }

          if (dayIndex === eventLength - 1) {
            // Flag last day of event
            eventData.isLastDay = true
          }

          if (!eventData.isFirstDay || !eventData.isLastDay) {
            // Flag between day of event
            eventData.isBetweenDay = true
          }

          // Apply Event dayEvents to the correct slot for that day
          if (days[eventMeta.firstVisibleDayIndex + dayIndex]) {
            days[eventMeta.firstVisibleDayIndex + dayIndex].eventSlots[eventSlotIndex] = eventData
          }
          // Move to next day of event
          dayIndex++
        }
      }
    })

    return days
  }, [calendar, events, getCalendarDays, getEventMeta])

  const getCalendarDayObject = (date) => {
    //
    const dateArray = dayjs(date).format('YYYY-MM-DD').split('-')

    console.log('dateArray', date, dateArray)
    return {
      year: dateArray[0],
      // Subtract 1 from month to allow for human declared months
      month: dateArray[1],
      day: dateArray[2],
    }
  }

  const dayEvents = React.useMemo(() => getDaysWithEvents(), [getDaysWithEvents])

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
                        ...getCalendarCellTextStyle(date?.toDate(), i),
                      },
                    ]}
                  >
                    {date && date.format('D')}
                  </Text>
                </TouchableOpacity>
                {date &&
                  sortedEvents(date).reduce((elements, _, index, events) => {
                    const eventSorted = dayEvents?.find(
                      (item) => item.day === Number(date.utc().format('DD')),
                    )?.eventSlots
                    // console.log('eveent day----', Number(date.utc().format('DD')), eventSorted, events)
                    const slot = eventSorted?.filter((it) => it).length
                    const elementViews = [
                      ...elements,
                      index > maxVisibleEventCount ? null : !eventSorted[index] ? null : (
                        <CalendarEventForMonthView
                          key={index}
                          event={eventSorted[index]}
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
                    ]

                    if (slot && index === events.length - 1 && slot < events.length) {
                      elementViews?.push(
                        <Text
                          key={index}
                          style={[
                            theme.typography.moreLabel,
                            { marginTop: 2, color: theme.palette.moreLabel },
                          ]}
                        >
                          {moreLabel.replace('{moreCount}', `${events.length - slot}`)}
                        </Text>,
                      )
                    }
                    return elementViews
                  }, [] as (null | JSX.Element)[])}
              </TouchableOpacity>
            ))}
        </View>
      ))}
    </View>
  )
}

export const CalendarBodyForMonthView = typedMemo(_CalendarBodyForMonthView)
