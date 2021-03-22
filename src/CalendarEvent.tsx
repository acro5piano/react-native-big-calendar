import dayjs from 'dayjs'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { commonStyles, OVERLAP_OFFSET } from './commonStyles'
import { DayJSConvertedEvent, Event, EventCellStyle } from './interfaces'
import {
  DAY_MINUTES,
  formatStartEnd,
  getRelativeTopInDay,
  getStyleForOverlappingEvent,
} from './utils'

function getEventCellPositionStyle({ end, start }: { end: dayjs.Dayjs; start: dayjs.Dayjs }) {
  const relativeHeight = 100 * (1 / DAY_MINUTES) * end.diff(start, 'minute')
  const relativeTop = getRelativeTopInDay(start)
  return {
    height: `${relativeHeight}%`,
    top: `${relativeTop}%`,
  }
}

interface CalendarBodyProps<T> {
  event: DayJSConvertedEvent
  onPressEvent?: (event: Event<T>) => void
  eventCellStyle?: EventCellStyle<T>
  showTime: boolean
  eventCount?: number
  eventOrder?: number
  overlapOffset?: number
}

export const CalendarEvent = React.memo(_CalendarEvent)

export function _CalendarEvent({
  event,
  onPressEvent,
  eventCellStyle,
  showTime,
  eventCount = 1,
  eventOrder = 0,
  overlapOffset = OVERLAP_OFFSET,
}: CalendarBodyProps<{}>) {
  const getEventStyle = React.useMemo(
    () => (typeof eventCellStyle === 'function' ? eventCellStyle : (_: any) => eventCellStyle),
    [eventCellStyle],
  )

  const plainJsEvent = React.useMemo(
    () => ({
      ...event,
      start: event.start.toDate(),
      end: event.end.toDate(),
    }),
    [event],
  )

  const _onPress = React.useCallback(() => {
    onPressEvent && onPressEvent(plainJsEvent)
  }, [onPressEvent, plainJsEvent])


const touchableOpacityProps = {
  delayPressIn:20,
      key:event.start.toString(),
      style:[
        commonStyles.eventCell,
        getEventCellPositionStyle(event),
        getStyleForOverlappingEvent(eventCount, eventOrder, overlapOffset),
        getEventStyle(plainJsEvent),
      ],
      onPress:_onPress,
      disabled:!onPressEvent,
}

  if(event.eventRenderer){
    return event.eventRenderer(event, touchableOpacityProps)
  }

  return (
    <TouchableOpacity {...touchableOpacityProps}>
      {event.end.diff(event.start, 'minute') < 32 && showTime ? (
        <Text style={commonStyles.eventTitle}>
          {event.title},<Text style={styles.eventTime}>{event.start.format('HH:mm')}</Text>
        </Text>
      ) : (
        <>
          <Text style={commonStyles.eventTitle}>{event.title}</Text>
          {showTime && <Text style={styles.eventTime}>{formatStartEnd(event)}</Text>}
          {event.children && event.children}
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  eventTime: {
    color: '#fff',
    fontSize: 10,
  },
})
