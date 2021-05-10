import dayjs from 'dayjs'
import * as React from 'react'
import { Text, TouchableOpacity } from 'react-native'

import { eventTitleStyle, u } from '../commonStyles'
import { CalendarTouchableOpacityProps, ICalendarEvent } from '../interfaces'
import { formatStartEnd } from '../utils'

interface DefaultCalendarEventRendererProps<T> {
  touchableOpacityProps: CalendarTouchableOpacityProps
  event: ICalendarEvent<T>
  showTime?: boolean
}

const eventTimeStyle = [u['text-white'], u['text-xs']]

export function DefaultCalendarEventRenderer<T>({
  touchableOpacityProps,
  event,
  showTime = true,
}: DefaultCalendarEventRendererProps<T>) {
  return (
    <TouchableOpacity {...touchableOpacityProps}>
      {dayjs(event.end).diff(event.start, 'minute') < 32 && showTime ? (
        <Text style={eventTitleStyle}>
          {event.title},<Text style={eventTimeStyle}>{dayjs(event.start).format('HH:mm')}</Text>
        </Text>
      ) : (
        <>
          <Text style={eventTitleStyle}>{event.title}</Text>
          {showTime && <Text style={eventTimeStyle}>{formatStartEnd(event.start, event.end)}</Text>}
          {event.children && event.children}
        </>
      )}
    </TouchableOpacity>
  )
}
