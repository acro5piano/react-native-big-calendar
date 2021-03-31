import dayjs from 'dayjs'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { commonStyles, OVERLAP_OFFSET } from './commonStyles'
import { CalendarTouchableOpacityProps, EventCellStyle, ICalendarEvent } from './interfaces'
import { typedMemo } from './typedMemo.helper'
import { DAY_MINUTES, formatStartEnd, getRelativeTopInDay, getStyleForOverlappingEvent } from './utils'

const getEventCellPositionStyle = (start: Date, end: Date) => {
  const relativeHeight = 100 * (1 / DAY_MINUTES) * dayjs(end).diff(start, 'minute')
  const relativeTop = getRelativeTopInDay(dayjs(start))
  return {
    height: `${relativeHeight}%`,
    top: `${relativeTop}%`,
  }
}

const styles = StyleSheet.create({
  eventTime: {
    color: '#fff',
    fontSize: 10,
  },
})
interface CalendarEventProps<T> {
  event: ICalendarEvent<T>
  onPressEvent?: (event: ICalendarEvent<T>) => void
  eventCellStyle?: EventCellStyle<T>
  showTime: boolean
  eventCount?: number
  eventOrder?: number
  overlapOffset?: number
}

function _CalendarEvent<T>({
  event,
  onPressEvent,
  eventCellStyle,
  showTime,
  eventCount = 1,
  eventOrder = 0,
  overlapOffset = OVERLAP_OFFSET,
}: CalendarEventProps<T>) {
  const getEventStyle = React.useMemo(
    () => (typeof eventCellStyle === 'function' ? eventCellStyle : () => eventCellStyle),
    [eventCellStyle],
  )

  const plainJsEvent = React.useMemo(
    () => ({
      ...event,
      start: dayjs(event.start).toDate(),
      end: dayjs(event.end).toDate(),
    }),
    [event],
  )

  const _onPress = React.useCallback(() => {
    onPressEvent && onPressEvent(plainJsEvent)
  }, [onPressEvent, plainJsEvent])

  const touchableOpacityProps: CalendarTouchableOpacityProps = {
    delayPressIn: 20,
    key: event.start.toString(),
    style: [
      commonStyles.eventCell,
      getEventCellPositionStyle(event.start, event.end),
      getStyleForOverlappingEvent(eventCount, eventOrder, overlapOffset),
      getEventStyle(plainJsEvent),
    ],
    onPress: _onPress,
    disabled: !onPressEvent,
  }

  if (event.eventRenderer) {
    return event.eventRenderer(event, touchableOpacityProps)
  }

  return (
    <TouchableOpacity {...touchableOpacityProps}>
      {dayjs(event.end).diff(event.start, 'minute') < 32 && showTime ? (
        <Text style={commonStyles.eventTitle}>
          {event.title},<Text style={styles.eventTime}>{dayjs(event.start).format('HH:mm')}</Text>
        </Text>
      ) : (
        <>
          <Text style={commonStyles.eventTitle}>{event.title}</Text>
          {showTime && <Text style={styles.eventTime}>{formatStartEnd(event.start, event.end)}</Text>}
          {event.children && event.children}
        </>
      )}
    </TouchableOpacity>
  )
}

export const CalendarEvent = typedMemo(_CalendarEvent)
