import dayjs from 'dayjs'
import * as React from 'react'

import { OVERLAP_OFFSET, u } from '../commonStyles'
import { useCalendarTouchableOpacityProps } from '../hooks/useCalendarTouchableOpacityProps'
import {
  CalendarEventGestureCallback,
  EventCellStyle,
  EventRenderer,
  ICalendarEventBase,
} from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import {
  DAY_MINUTES,
  hours as _hours,
  getRelativeTopInDay,
  getStyleForOverlappingEvent,
  typedMemo,
} from '../utils'
import { Draggable } from './CalendarDraggable'
import { DefaultCalendarEventRenderer } from './DefaultCalendarEventRenderer'

const getEventCellPositionStyle = (start: Date, end: Date) => {
  const relativeHeight = 100 * (1 / DAY_MINUTES) * dayjs(end).diff(start, 'minute')
  const relativeTop = getRelativeTopInDay(dayjs(start))
  return {
    height: `${relativeHeight}%`,
    top: `${relativeTop}%`,
  }
}

interface CalendarEventProps<T extends ICalendarEventBase> {
  event: T
  onPressEvent?: (event: T) => void
  eventCellStyle?: EventCellStyle<T>
  showTime: boolean
  eventCount?: number
  eventOrder?: number
  overlapOffset?: number
  renderEvent?: EventRenderer<T>
  ampm: boolean
  moveCallback: CalendarEventGestureCallback
  isMovingCallback: (isMoving: boolean) => void
  dragEndCallback: CalendarEventGestureCallback
  disableDrag?: boolean
  dragPrecision: 'low' | 'medium' | 'high'
  cellHeight: number
}

function _CalendarEvent<T extends ICalendarEventBase>({
  event,
  onPressEvent,
  eventCellStyle,
  showTime,
  eventCount = 1,
  eventOrder = 0,
  overlapOffset = OVERLAP_OFFSET,
  renderEvent,
  ampm,
  moveCallback,
  isMovingCallback,
  dragEndCallback,
  disableDrag,
  dragPrecision,
  cellHeight,
}: CalendarEventProps<T>) {
  const theme = useTheme()

  const palettes = React.useMemo(
    () => [theme.palette.primary, ...theme.eventCellOverlappings],
    [theme],
  )

  const touchableOpacityProps = useCalendarTouchableOpacityProps({
    event,
    eventCellStyle,
    onPressEvent,
    injectedStyles: [
      getEventCellPositionStyle(event.start, event.end),
      getStyleForOverlappingEvent(eventOrder, overlapOffset, palettes),
      u['absolute'],
      u['mt-2'],
      u['mx-3'],
    ],
  })

  const textColor = React.useMemo(() => {
    const fgColors = palettes.map((p) => p.contrastText)
    return fgColors[eventCount % fgColors.length] || fgColors[0]
  }, [eventCount, palettes])

  if (renderEvent) {
    return (
      <Draggable
        customEventStyles={[
          getEventCellPositionStyle(event.start, event.end),
          getStyleForOverlappingEvent(eventOrder, overlapOffset, palettes, true),
          u['absolute'],
        ]}
        disableDrag={disableDrag}
        moveCallback={moveCallback}
        isMovingCallback={isMovingCallback}
        dragEndCallback={dragEndCallback}
        event={event}
        dragPrecision={dragPrecision}
        cellHeight={cellHeight}
      >
        {renderEvent(event, {
          onPress: touchableOpacityProps.onPress,
          style: { width: '100%', height: '100%' },
        })}
      </Draggable>
    )
  }

  return (
    <DefaultCalendarEventRenderer
      event={event}
      showTime={showTime}
      ampm={ampm}
      touchableOpacityProps={touchableOpacityProps}
      textColor={textColor}
      moveCallback={moveCallback}
      isMovingCallback={isMovingCallback}
      disableDrag={disableDrag}
      dragEndCallback={dragEndCallback}
      dragPrecision={dragPrecision}
      cellHeight={cellHeight}
    />
  )
}

export const CalendarEvent = typedMemo(_CalendarEvent)
