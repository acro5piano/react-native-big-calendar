import dayjs from 'dayjs'
import * as React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { u } from './commonStyles'
import {
  CalendarTouchableOpacityProps,
  EventCellStyle,
  EventRenderer,
  ICalendarEvent,
} from './interfaces'
import { typedMemo } from './utils'

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
    style: [
      u['bg-primary'],
      u['rounded'],
      u['px-6'],
      u['py-2'],
      u['mt-4'],
      getEventStyle(plainJsEvent),
    ],
    onPress: _onPress,
    disabled: !onPressEvent,
  }

  if (renderEvent) {
    return renderEvent(event, touchableOpacityProps)
  }

  return (
    <TouchableOpacity {...touchableOpacityProps}>
      <Text style={[u['text-white'], u['text-xs']]}>{event.title}</Text>
    </TouchableOpacity>
  )
}

export const CalendarEventForMonthView = typedMemo(_CalendarEventForMonthView)
