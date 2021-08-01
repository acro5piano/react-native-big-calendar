import dayjs from 'dayjs'
import React from 'react'
import { ViewStyle } from 'react-native'

import { eventCellCss } from '../commonStyles'
import { CalendarTouchableOpacityProps, EventCellStyle, ICalendarEvent } from '../interfaces'

interface UseCalendarTouchableOpacityPropsProps<T> {
  event: ICalendarEvent<T>
  eventCellStyle?: EventCellStyle<T>
  onPressEvent?: (e: ICalendarEvent<T>) => void
  injectedStyles?: ViewStyle[]
}

export function useCalendarTouchableOpacityProps<T>({
  event,
  eventCellStyle,
  injectedStyles = [],
  onPressEvent,
}: UseCalendarTouchableOpacityPropsProps<T>) {
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
    style: [eventCellCss.style, ...injectedStyles, getEventStyle(plainJsEvent)],
    onPress: _onPress,
    disabled: !onPressEvent,
  }

  return touchableOpacityProps
}
