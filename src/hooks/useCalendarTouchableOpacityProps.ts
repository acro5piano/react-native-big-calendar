import dayjs from 'dayjs'
import React from 'react'
import { ViewStyle } from 'react-native'
import { commonStyles } from '../commonStyles'
import { CalendarTouchableOpacityProps, EventCellStyle, ICalendarEvent } from '../interfaces'

interface UseCalendarTouchableOpacityPropsProps<T> {
  event: ICalendarEvent<T>
  eventCellStyle?: EventCellStyle<T>
  onPressEvent?: (e: ICalendarEvent<T>) => void
  injectedStyle?: ViewStyle
}

export function useCalendarTouchableOpacityProps<T>({
  event,
  eventCellStyle,
  injectedStyle,
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
    style: [commonStyles.eventCell, injectedStyle, getEventStyle(plainJsEvent)],
    onPress: _onPress,
    disabled: !onPressEvent,
  }

  return touchableOpacityProps
}
