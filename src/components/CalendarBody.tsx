import dayjs from 'dayjs'
import * as React from 'react'
import { Platform, ScrollView, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'

import { u } from '../commonStyles'
import { useNow } from '../hooks/useNow'
import { usePanResponder } from '../hooks/usePanResponder'
import {
  CalendarCellStyle,
  EventCellStyle,
  EventRenderer,
  HorizontalDirection,
  ICalendarEventBase,
} from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import {
  enrichEvents,
  getCountOfEventsAtEvent,
  getOrderOfEvent,
  getRelativeTopInDay,
  hours,
  isToday,
  SIMPLE_DATE_FORMAT,
  getMaxCountOfEventsAtEvent,
  getWidthOfEventsAtEvent,
} from '../utils/datetime'
import { typedMemo } from '../utils/react'
import { CalendarEvent } from './CalendarEvent'
import { HourGuideCell } from './HourGuideCell'
import { HourGuideColumn } from './HourGuideColumn'
import { useMemo } from 'react'

const styles = StyleSheet.create({
  nowIndicator: {
    position: 'absolute',
    zIndex: 10000,
    height: 2,
    width: '100%',
  },
})

interface CalendarBodyProps<T extends ICalendarEventBase> {
  cellHeight: number
  current?: Date
  containerHeight: number
  dateRange: dayjs.Dayjs[]
  events: T[]
  scrollOffsetMinutes: number
  ampm: boolean
  showTime: boolean
  style: ViewStyle
  eventCellStyle?: EventCellStyle<T>
  calendarCellStyle?: CalendarCellStyle
  hideNowIndicator?: boolean
  overlapOffset?: number
  onLongPressCell?: (date: Date) => void
  onPressCell?: (date: Date) => void
  onPressEvent?: (event: T) => void
  onSwipeHorizontal?: (d: HorizontalDirection) => void
  renderEvent?: EventRenderer<T>
  headerComponent?: React.ReactElement | null
  headerComponentStyle?: ViewStyle
  hourStyle?: TextStyle
  hideHours?: Boolean
  isEventOrderingEnabled?: boolean
  showVerticalScrollIndicator?: boolean
  enrichedEventsByDate?: Record<string, T[]>
  enableEnrichedEvents?: boolean
  eventsAreSorted?: boolean
}

function _CalendarBody<T extends ICalendarEventBase>({
  containerHeight,
  current,
  cellHeight,
  dateRange,
  style,
  onLongPressCell,
  onPressCell,
  events,
  onPressEvent,
  eventCellStyle,
  calendarCellStyle,
  ampm,
  showTime,
  scrollOffsetMinutes,
  onSwipeHorizontal,
  hideNowIndicator,
  overlapOffset,
  renderEvent,
  headerComponent = null,
  headerComponentStyle = {},
  hourStyle = {},
  hideHours = false,
  isEventOrderingEnabled = true,
  showVerticalScrollIndicator = false,
  enrichedEventsByDate,
  enableEnrichedEvents = false,
  eventsAreSorted = false,
}: CalendarBodyProps<T>) {
  const scrollView = React.useRef<ScrollView>(null)
  const { now } = useNow(!hideNowIndicator, current)

  React.useEffect(() => {
    let timeout: NodeJS.Timeout
    if (scrollView.current && scrollOffsetMinutes && Platform.OS !== 'ios') {
      // We add delay here to work correct on React Native
      // see: https://stackoverflow.com/questions/33208477/react-native-android-scrollview-scrollto-not-working
      timeout = setTimeout(
        () => {
          if (scrollView && scrollView.current) {
            scrollView.current.scrollTo({
              y: (cellHeight * scrollOffsetMinutes) / 60,
              animated: false,
            })
          }
        },
        Platform.OS === 'web' ? 0 : 10,
      )
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [scrollView, scrollOffsetMinutes, cellHeight])

  const panResponder = usePanResponder({
    onSwipeHorizontal,
  })

  const _onPressCell = React.useCallback(
    (date: dayjs.Dayjs) => {
      onPressCell && onPressCell(date.toDate())
    },
    [onPressCell],
  )

  const _onLongPressCell = React.useCallback(
    (date: dayjs.Dayjs) => {
      onLongPressCell && onLongPressCell(date.toDate())
    },
    [onLongPressCell],
  )

  const internalEnrichedEventsByDate = useMemo(() => {
    if (enableEnrichedEvents) {
      return enrichedEventsByDate || enrichEvents(events, eventsAreSorted)
    }
    return {}
  }, [enableEnrichedEvents, enrichedEventsByDate, events, eventsAreSorted])

  const enrichedEvents = useMemo(() => {
    if (enableEnrichedEvents) return []

    if (isEventOrderingEnabled) {
      const eventsByDate: any = {}
      events.forEach((event) => {
        const startDate = new Date(event.start)
        const endDate = new Date(event.end)

        // Check if event spans multiple days
        while (startDate.toDateString() !== endDate.toDateString()) {
          const nextDayEndTime = new Date(startDate)
          nextDayEndTime.setHours(23, 59, 59, 999) // Set to end of day

          // Create event for current day
          const currentDayEvent = {
            ...event,
            end: nextDayEndTime,
          }

          // Extract date from start time
          const currentDate = startDate.toLocaleDateString()

          // Check if entry exists for date, if not, create one
          if (!eventsByDate[currentDate]) {
            eventsByDate[currentDate] = []
          }

          // Append event to array for that date
          eventsByDate[currentDate].push(currentDayEvent)

          // Move startDate to next day
          startDate.setDate(startDate.getDate() + 1)
          startDate.setHours(0, 0, 0, 0) // Set to start of day
          event.start = startDate
        }

        // Extract date from start time
        const date = startDate.toLocaleDateString()

        // Check if entry exists for date, if not, create one
        if (!eventsByDate[date]) {
          eventsByDate[date] = []
        }

        // Append event to array for that date
        eventsByDate[date].push(event)
      })

      // Get date wise events
      for (let date in eventsByDate) {
        let sortedEvents = eventsByDate[date].sort((a: any, b: any) => {
          if (dayjs(a.start).isSame(b.start)) {
            return dayjs(a.start).diff(a.end) < dayjs(b.start).diff(b.end) ? -1 : 1
          } else {
            return dayjs(a.start).isBefore(b.start) ? -1 : 1
          }
        })

        const nonOverLappingLanes: any = []
        while (sortedEvents.length > 0) {
          const nonOverlappedEvents = [sortedEvents[0]]
          let maxStartTime = sortedEvents[0].start
          let maxEndTime = sortedEvents[0].end
          if (sortedEvents.length > 1) {
            for (let i = 1; i < sortedEvents.length; i++) {
              if (
                !dayjs(sortedEvents[0].start).isBetween(
                  sortedEvents[i].start,
                  sortedEvents[i].end,
                  'second',
                  '[)',
                ) &&
                !dayjs(sortedEvents[i].start).isBetween(
                  sortedEvents[0].start,
                  sortedEvents[0].end,
                  'second',
                  '[)',
                ) &&
                !dayjs(sortedEvents[i].start).isBetween(maxStartTime, maxEndTime, 'second', '[)') &&
                !dayjs(sortedEvents[i].end).isBetween(maxStartTime, maxEndTime, 'second', '[)')
              ) {
                nonOverlappedEvents.push(sortedEvents[i])
                if (dayjs(sortedEvents[i].start).isBefore(maxStartTime, 'second')) {
                  maxStartTime = sortedEvents[i].start
                }

                if (dayjs(sortedEvents[i].end).isAfter(maxEndTime, 'second')) {
                  maxEndTime = sortedEvents[i].end
                }
              }
            }
          }

          nonOverLappingLanes.push(nonOverlappedEvents)
          sortedEvents = sortedEvents.filter((item: any) => !nonOverlappedEvents.includes(item))
        }

        eventsByDate[date].forEach((event: { position: {} }) => {
          for (let i = 0; i < nonOverLappingLanes.length; i++) {
            if (nonOverLappingLanes[i].includes(event)) {
              const width = 100.0 / nonOverLappingLanes.length
              const start = i * width
              event.position = { start: start, end: 100.0 - start - width }
              break
            }
          }
        })
      }
      return events.map((event) => ({
        ...event,
        // overlapPosition: getOrderOfEvent(event, events),
        // overlapCount: getCountOfEventsAtEvent(event, events),
        // maxOverlapCount: getMaxCountOfEventsAtEvent(event, events),
        // position: getWidthOfEventsAtEvent(event, events)
      }))
    }

    console.log(
      getCountOfEventsAtEvent,
      getOrderOfEvent,
      getMaxCountOfEventsAtEvent,
      getWidthOfEventsAtEvent,
    )

    return events
  }, [enableEnrichedEvents, events, isEventOrderingEnabled])

  const _renderMappedEvent = React.useCallback(
    (event: T, index: number) => {
      return (
        <CalendarEvent
          key={`${index}${event.start}${event.title}${event.end}`}
          event={event}
          onPressEvent={onPressEvent}
          eventCellStyle={eventCellStyle}
          showTime={showTime}
          eventCount={event.overlapCount}
          eventOrder={event.overlapPosition}
          overlapOffset={overlapOffset}
          renderEvent={renderEvent}
          ampm={ampm}
        />
      )
    },
    [ampm, eventCellStyle, onPressEvent, overlapOffset, renderEvent, showTime],
  )

  const _renderEvents = React.useCallback(
    (date) => {
      if (enableEnrichedEvents) {
        return (internalEnrichedEventsByDate[date.format(SIMPLE_DATE_FORMAT)] || []).map(
          _renderMappedEvent,
        )
      } else {
        return (
          <>
            {/* Render events of this date */}
            {/* M  T  (W)  T  F  S  S */}
            {/*       S-E             */}
            {(enrichedEvents as T[])
              .filter(({ start }) =>
                dayjs(start).isBetween(date.startOf('day'), date.endOf('day'), null, '[)'),
              )
              .map(_renderMappedEvent)}

            {/* Render events which starts before this date and ends on this date */}
            {/* M  T  (W)  T  F  S  S */}
            {/* S------E              */}
            {(enrichedEvents as T[])
              .filter(
                ({ start, end }) =>
                  dayjs(start).isBefore(date.startOf('day')) &&
                  dayjs(end).isBetween(date.startOf('day'), date.endOf('day'), null, '[)'),
              )
              .map((event) => ({
                ...event,
                start: dayjs(event.end).startOf('day'),
              }))
              .map(_renderMappedEvent)}

            {/* Render events which starts before this date and ends after this date */}
            {/* M  T  (W)  T  F  S  S */}
            {/*    S-------E          */}
            {(enrichedEvents as T[])
              .filter(
                ({ start, end }) =>
                  dayjs(start).isBefore(date.startOf('day')) &&
                  dayjs(end).isAfter(date.endOf('day')),
              )
              .map((event) => ({
                ...event,
                start: dayjs(event.end).startOf('day'),
                end: dayjs(event.end).endOf('day'),
              }))
              .map(_renderMappedEvent)}
          </>
        )
      }
    },
    [_renderMappedEvent, enableEnrichedEvents, enrichedEvents, internalEnrichedEventsByDate],
  )

  const theme = useTheme()

  return (
    <React.Fragment>
      {headerComponent != null ? <View style={headerComponentStyle}>{headerComponent}</View> : null}
      <ScrollView
        style={[
          {
            height: containerHeight - cellHeight * 3,
          },
          style,
        ]}
        ref={scrollView}
        scrollEventThrottle={32}
        {...(Platform.OS !== 'web' ? panResponder.panHandlers : {})}
        showsVerticalScrollIndicator={showVerticalScrollIndicator}
        nestedScrollEnabled
        contentOffset={Platform.OS === 'ios' ? { x: 0, y: scrollOffsetMinutes } : { x: 0, y: 0 }}
      >
        <View
          style={[u['flex-1'], theme.isRTL ? u['flex-row-reverse'] : u['flex-row']]}
          {...(Platform.OS === 'web' ? panResponder.panHandlers : {})}
        >
          {!hideHours && (
            <View style={[u['z-20'], u['w-50']]}>
              {hours.map((hour) => (
                <HourGuideColumn
                  key={hour}
                  cellHeight={cellHeight}
                  hour={hour}
                  ampm={ampm}
                  hourStyle={hourStyle}
                />
              ))}
            </View>
          )}

          {dateRange.map((date) => (
            <View style={[u['flex-1'], u['overflow-hidden']]} key={date.toString()}>
              {hours.map((hour, index) => (
                <HourGuideCell
                  key={hour}
                  cellHeight={cellHeight}
                  date={date}
                  hour={hour}
                  onLongPress={_onLongPressCell}
                  onPress={_onPressCell}
                  index={index}
                  calendarCellStyle={calendarCellStyle}
                />
              ))}
              {_renderEvents(date)}
              {isToday(date, current) && !hideNowIndicator && (
                <View
                  style={[
                    styles.nowIndicator,
                    { backgroundColor: theme.palette.nowIndicator },
                    { top: `${getRelativeTopInDay(now)}%` },
                  ]}
                />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </React.Fragment>
  )
}

export const CalendarBody = typedMemo(_CalendarBody)
