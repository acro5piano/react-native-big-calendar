import React, { useRef, useState } from 'react'
import { Animated, PanResponder, PanResponderGestureState } from 'react-native'

import {
  CalendarChangedInformation,
  CalendarEventGestureCallback,
  ICalendarEventBase,
} from '../interfaces'
import { calculatePrecision, typedMemo } from '../utils'
import { widthContext } from './CalendarBody'

interface CalendarDraggableProps<T extends ICalendarEventBase> {
  event: T
  moveCallback: CalendarEventGestureCallback
  dragEndCallback: CalendarEventGestureCallback
  isMovingCallback: (isMoving: boolean) => void
  touchableOpacityProps?: any
  customEventStyles?: any
  children: JSX.Element
  disableDrag?: boolean
  dragPrecision: 'low' | 'medium' | 'high'
  cellHeight: number
}

function _CalendarDraggable<T extends ICalendarEventBase>({
  event,
  moveCallback,
  dragEndCallback,
  isMovingCallback,
  customEventStyles,
  touchableOpacityProps,
  dragPrecision,
  children,
  cellHeight,
}: CalendarDraggableProps<T>) {
  const cellWidth = React.useContext(widthContext)

  const { precision, squareUnits } = calculatePrecision(dragPrecision)

  const [opacity, setOpacity] = useState<number>(1)

  const previousChangeKey = useRef<string>(`0-0-${event.title}`)

  const getChangedInformation = (
    gestureState: PanResponderGestureState,
  ): CalendarChangedInformation<ICalendarEventBase> => {
    const xUnit = cellWidth / 3
    const xDif = gestureState.moveX - gestureState.x0
    const xUnits = Math.floor(xDif / xUnit + 0.5)

    const yUnit = cellHeight
    const yDif = gestureState.moveY - gestureState.y0
    var yUnits = Math.round((yDif / (yUnit * precision)) * 2) / squareUnits
    return { day: xUnits, hour: yUnits, event }
  }

  const panResponder = useRef(
    PanResponder.create({
      onPanResponderGrant: () => {
        isMovingCallback(true)
      },
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_e, gestureState) => {
        setOpacity(0.25)
        const change = getChangedInformation(gestureState)
        if (previousChangeKey.current === `${change.day}-${change.hour}-${event}`) return
        previousChangeKey.current = `${change.day}-${change.hour}-${event}`
        moveCallback(change)
      },
      onPanResponderRelease: (_e, gestureState) => {
        setOpacity(1)
        const change = getChangedInformation(gestureState)
        moveCallback(change)
        dragEndCallback(change)
        isMovingCallback(false)
      },
    }),
  ).current

  return (
    <Animated.View
      style={[
        (touchableOpacityProps && touchableOpacityProps?.style) || customEventStyles,
        {
          opacity: event?.moving ? 0.25 : opacity,
        },
      ]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  )
}

export const Draggable = typedMemo(_CalendarDraggable)
