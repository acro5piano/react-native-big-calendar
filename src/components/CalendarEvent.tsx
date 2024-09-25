import dayjs from 'dayjs'
import * as React from 'react'

import { OVERLAP_OFFSET, u } from '../commonStyles'
import { useCalendarTouchableOpacityProps } from '../hooks/useCalendarTouchableOpacityProps'
import { EventCellStyle, EventRenderer, ICalendarEventBase, Mode } from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import { DAY_MINUTES, getRelativeTopInDay, getStyleForOverlappingEvent } from '../utils/datetime'
import { typedMemo } from '../utils/react'
import { DefaultCalendarEventRenderer } from './DefaultCalendarEventRenderer'
import { AccessibilityProps } from 'react-native'

const getEventCellPositionStyle = (
  start: Date,
  end: Date,
  minHour: number,
  hours: number,
  eventCount: number,
  eventOrder: number,
  eventOverlapping: boolean,
) => {
  const totalMinutesInRange = (DAY_MINUTES / 24) * hours
  const durationInMinutes = dayjs(end).diff(start, 'minute')
  const relativeHeight = 100 * (1 / totalMinutesInRange) * durationInMinutes
  const relativeTop = getRelativeTopInDay(dayjs(start), minHour, hours)
  const relativeTopOffset = (minHour * 60) / DAY_MINUTES

  const width = 100 / eventCount // Divide the width equally among overlapping events
  const left = width * eventOrder

  if (eventOverlapping === true) {
    return {
      height: `${relativeHeight}%`,
      top: `${relativeTop - relativeTopOffset}%`,
      width: `${width}%`, // Set the width based on event count
      left: `${left}%`,
    }
  }

  return {
    height: `${relativeHeight}%`,
    top: `${relativeTop - relativeTopOffset}%`,
  }
}

interface CalendarEventProps<T extends ICalendarEventBase> {
  event: T
  onPressEvent?: (event: T) => void
  eventCellStyle?: EventCellStyle<T>
  eventCellTextColor?: string
  eventCellAccessibilityProps?: AccessibilityProps
  showTime: boolean
  eventCount?: number
  eventOrder?: number
  overlapOffset?: number
  renderEvent?: EventRenderer<T>
  ampm: boolean
  mode?: Mode
  maxHour?: number
  minHour?: number
  hours?: number
  eventOverlapping?: boolean
}

function _CalendarEvent<T extends ICalendarEventBase>({
  event,
  onPressEvent,
  eventCellStyle,
  eventCellAccessibilityProps = {},
  eventCellTextColor,
  showTime,
  eventCount = 1,
  eventOrder = 0,
  overlapOffset = OVERLAP_OFFSET,
  renderEvent,
  ampm,
  mode,
  minHour = 0,
  hours = 24,
  eventOverlapping = false,
}: CalendarEventProps<T>) {
  const theme = useTheme()

  const palettes = React.useMemo(
    () => [theme.palette.primary, ...theme.eventCellOverlappings],
    [theme],
  )

  const touchableOpacityProps = useCalendarTouchableOpacityProps({
    event,
    eventCellStyle,
    eventCellAccessibilityProps,
    onPressEvent,
    injectedStyles:
      mode === 'schedule'
        ? [getStyleForOverlappingEvent(eventOrder, overlapOffset, palettes)]
        : [
            getEventCellPositionStyle(
              event.start,
              event.end,
              minHour,
              hours,
              eventCount,
              eventOrder,
              eventOverlapping,
            ),
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
    return renderEvent(event, touchableOpacityProps)
  }

  return (
    <DefaultCalendarEventRenderer
      event={event}
      showTime={showTime}
      ampm={ampm}
      touchableOpacityProps={touchableOpacityProps}
      textColor={eventCellTextColor || textColor}
    />
  )
}

export const CalendarEvent = typedMemo(_CalendarEvent)
