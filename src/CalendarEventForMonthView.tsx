import dayjs from 'dayjs'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { commonStyles } from './commonStyles'
import {
  CalendarTouchableOpacityProps,
  EventCellStyle,
  EventRenderer,
  ICalendarEvent,
} from './interfaces'
import { Color } from './theme'
import { typedMemo } from './utils'

const styles = StyleSheet.create({
  eventTitleContainer: {
    marginTop: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    backgroundColor: Color.primary,
    color: '#fff',
  },
  eventTitle: {
    backgroundColor: Color.primary,
    color: '#fff',
    fontSize: 11,
  },
})

interface CalendarEventProps<T> {
  event: ICalendarEvent<T>
  onPressEvent?: (event: ICalendarEvent<T>) => void
  eventCellStyle?: EventCellStyle<T>
  renderEvent?: EventRenderer<T>
}

function _CalendarEventForMonthView<T>({
  event,
  onPressEvent,
  eventCellStyle,
  renderEvent,
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
    key: `${event.start}${event.title}`,
    style: [styles.eventTitleContainer, getEventStyle(plainJsEvent)],
    onPress: _onPress,
    disabled: !onPressEvent,
  }

  if (renderEvent) {
    return renderEvent(event, touchableOpacityProps)
  }

  return (
    <TouchableOpacity {...touchableOpacityProps}>
      <Text style={styles.eventTitle}>{event.title}</Text>
    </TouchableOpacity>
  )
}

export const CalendarEventForMonthView = typedMemo(_CalendarEventForMonthView)
