import dayjs from 'dayjs'
import React from 'react'
import { ViewStyle } from 'react-native'

import { eventCellCss } from '../commonStyles'
import { CalendarTouchableOpacityProps, EventCellStyle, ICalendarEventBase } from '../interfaces'

interface UseCalendarTouchableOpacityPropsProps<T extends ICalendarEventBase> {
  event: T
  eventCellStyle?: EventCellStyle<T>
  onPressEvent?: (event: T) => void
  injectedStyles?: ViewStyle[]
}

export function useCalendarTouchableOpacityProps<T extends ICalendarEventBase>({
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
    key: `${event.start.toISOString()}_${event.title}`,
    style: [eventCellCss.style, ...injectedStyles, getEventStyle(plainJsEvent)],
    onPress: _onPress,
    disabled: !onPressEvent,
  }

  return touchableOpacityProps
}
