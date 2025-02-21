import dayjs from 'dayjs'
import React from 'react'
import type { AccessibilityProps, ViewStyle } from 'react-native'

import { eventCellCss } from '../commonStyles'
import type {
  CalendarTouchableOpacityProps,
  EventCellStyle,
  ICalendarEventBase,
} from '../interfaces'

interface UseCalendarTouchableOpacityPropsProps<T extends ICalendarEventBase> {
  event: T
  eventCellStyle?: EventCellStyle<T>
  eventCellAccessibilityProps?: AccessibilityProps
  onPressEvent?: (event: T) => void
  injectedStyles?: ViewStyle[]
}

export function useCalendarTouchableOpacityProps<T extends ICalendarEventBase>({
  event,
  eventCellStyle,
  eventCellAccessibilityProps: eventCellAccessiblityProps = {},
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
    onPressEvent?.(plainJsEvent)
  }, [onPressEvent, plainJsEvent])

  const touchableOpacityProps: CalendarTouchableOpacityProps = {
    delayPressIn: 20,
    key: `${event.start.toISOString()}_${event.title}`,
    style: [eventCellCss.style, ...injectedStyles, getEventStyle(plainJsEvent)],
    onPress: _onPress,
    disabled: !onPressEvent || !!event.disabled,
    ...eventCellAccessiblityProps,
  }

  return touchableOpacityProps
}
