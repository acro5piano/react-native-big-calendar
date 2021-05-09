import dayjs from 'dayjs'
import * as React from 'react'
import { commonStyles, OVERLAP_OFFSET } from './commonStyles'
import { DefaultCalendarEventRenderer } from './DefaultCalendarEventRenderer'
import {
  CalendarTouchableOpacityProps,
  EventCellStyle,
  EventRenderer,
  ICalendarEvent,
} from './interfaces'
import { DAY_MINUTES, getRelativeTopInDay, getStyleForOverlappingEvent, typedMemo } from './utils'

const getEventCellPositionStyle = (start: Date, end: Date) => {
  const relativeHeight = 100 * (1 / DAY_MINUTES) * dayjs(end).diff(start, 'minute')
  const relativeTop = getRelativeTopInDay(dayjs(start))
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
  eventCount = 1,
  eventOrder = 0,
  overlapOffset = OVERLAP_OFFSET,
  renderEvent,
}: CalendarEventProps<T>) {
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
    style: [
      commonStyles.eventCell,
      getEventCellPositionStyle(event.start, event.end),
      getStyleForOverlappingEvent(eventCount, eventOrder, overlapOffset),
      getEventStyle(plainJsEvent),
    ],
    onPress: _onPress,
    disabled: !onPressEvent,
  }

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
