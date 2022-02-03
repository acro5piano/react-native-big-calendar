import dayjs from 'dayjs'
import * as React from 'react'
import { Text, TouchableOpacity } from 'react-native'

import {
  CalendarEventGestureCallback,
  CalendarTouchableOpacityProps,
  ICalendarEventBase,
} from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import { Draggable } from './CalendarDraggable'

interface DefaultCalendarEventRendererProps<T extends ICalendarEventBase> {
  touchableOpacityProps: CalendarTouchableOpacityProps
  event: T
  showTime?: boolean
  textColor: string
  ampm: boolean
  moveCallback: CalendarEventGestureCallback
  isMovingCallback: (isMoving: boolean) => void
  dragEndCallback: CalendarEventGestureCallback
  disableDrag: any
  dragPrecision: 'low' | 'medium' | 'high'
  cellHeight: number
}

export function DefaultCalendarEventRenderer<T extends ICalendarEventBase>({
  touchableOpacityProps,
  event,
  showTime = true,
  textColor,
  moveCallback,
  isMovingCallback,
  dragEndCallback,
  disableDrag,
  dragPrecision,
  cellHeight,
}: DefaultCalendarEventRendererProps<T>) {
  const theme = useTheme()
  const eventTitleStyle = { fontSize: theme.typography.sm.fontSize, color: textColor }

  return (
    <Draggable
      touchableOpacityProps={touchableOpacityProps}
      disableDrag={disableDrag}
      moveCallback={moveCallback}
      isMovingCallback={isMovingCallback}
      dragEndCallback={dragEndCallback}
      event={event}
      dragPrecision={dragPrecision}
      cellHeight={cellHeight}
    >
      <TouchableOpacity
        onPress={touchableOpacityProps.onPress}
        style={{ width: '100%', height: '100%' }}
      >
        {dayjs(event.end).diff(event.start, 'minute') < 32 && showTime ? (
          <Text style={eventTitleStyle}>{event.title}</Text>
        ) : (
          <>
            <Text style={eventTitleStyle}>{event.title}</Text>
            {event.children && event.children}
          </>
        )}
      </TouchableOpacity>
    </Draggable>
  )
}
