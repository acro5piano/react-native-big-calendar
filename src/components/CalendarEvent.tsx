import dayjs from 'dayjs'
import * as React from 'react'

import { OVERLAP_OFFSET, u } from '../commonStyles'
import { useCalendarTouchableOpacityProps } from '../hooks/useCalendarTouchableOpacityProps'
import { EventCellStyle, EventRenderer, HourNum, ICalendarEvent } from '../interfaces'
import { getRelativeTopInDay, getStyleForOverlappingEvent, typedMemo } from '../utils'
import { DefaultCalendarEventRenderer } from './DefaultCalendarEventRenderer'

const getEventCellPositionStyle = (
  start: Date,
  end: Date,
  dayStartsOn: HourNum,
  dayEndsOn: HourNum,
) => {
  const dayMinutes = (dayEndsOn - dayStartsOn + 1) * 60
  const relativeHeight = 100 * (1 / dayMinutes) * dayjs(end).diff(start, 'minute')
  const relativeTop = getRelativeTopInDay(dayjs(start), dayStartsOn, dayEndsOn)

  return {
    height: `${relativeHeight}%`,
    top: `${relativeTop}%`,
  }
}

interface CalendarEventProps<T> {
  event: ICalendarEvent<T>
  onPressEvent?: (event: ICalendarEvent<T>) => void
  eventCellStyle?: EventCellStyle<T>
  showTime: boolean
  dayStartsOn: HourNum
  dayEndsOn: HourNum
  eventCount?: number
  eventOrder?: number
  overlapOffset?: number
  renderEvent?: EventRenderer<T>
}

function _CalendarEvent<T>({
  event,
  onPressEvent,
  eventCellStyle,
  showTime,
  dayStartsOn,
  dayEndsOn,
  eventCount = 1,
  eventOrder = 0,
  overlapOffset = OVERLAP_OFFSET,
  renderEvent,
}: CalendarEventProps<T>) {
  const touchableOpacityProps = useCalendarTouchableOpacityProps({
    event,
    eventCellStyle,
    onPressEvent,
    injectedStyles: [
      getEventCellPositionStyle(event.start, event.end, dayStartsOn, dayEndsOn),
      getStyleForOverlappingEvent(eventCount, eventOrder, overlapOffset),
      u['absolute'],
    ],
  })

  if (renderEvent) {
    return renderEvent(event, touchableOpacityProps)
  }

  return (
    <DefaultCalendarEventRenderer
      event={event}
      showTime={showTime}
      touchableOpacityProps={touchableOpacityProps}
    />
  )
}

export const CalendarEvent = typedMemo(_CalendarEvent)
