import dayjs from 'dayjs'
import * as React from 'react'

import { OVERLAP_OFFSET, u } from '../commonStyles'
import { useCalendarTouchableOpacityProps } from '../hooks/useCalendarTouchableOpacityProps'
import { EventCellStyle, EventRenderer, ICalendarEventBase } from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import {
  diffInMinutes,
  getRelativeTopInDay,
  getStyleForOverlappingEvent,
  typedMemo,
} from '../utils'
import { DefaultCalendarEventRenderer } from './DefaultCalendarEventRenderer'

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
  minTime: string
  maxTime: string
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
  minTime = '00:00',
  maxTime = '23:00',
}: CalendarEventProps<T>) {
  const theme = useTheme()

  const palettes = React.useMemo(
    () => [theme.palette.primary, ...theme.eventCellOverlappings],
    [theme],
  )

  const getEventCellPositionStyle = (start: Date, end: Date) => {
    const relativeHeight =
      100 * (1 / diffInMinutes(minTime, maxTime)) * dayjs(end).diff(start, 'minute')
    const relativeTop = getRelativeTopInDay(dayjs(start), minTime, maxTime)

    return {
      height: `${relativeHeight}%`,
      top: `${relativeTop}%`,
    }
  }

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
    return renderEvent(event, touchableOpacityProps)
  }

  return (
    <DefaultCalendarEventRenderer
      event={event}
      showTime={showTime}
      ampm={ampm}
      touchableOpacityProps={touchableOpacityProps}
      textColor={textColor}
    />
  )
}

export const CalendarEvent = typedMemo(_CalendarEvent)
