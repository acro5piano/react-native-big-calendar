import dayjs from 'dayjs'
import * as React from 'react'
import { Text, TouchableOpacity } from 'react-native'

import { CalendarTouchableOpacityProps, ICalendarEvent } from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import { formatStartEnd } from '../utils'

interface DefaultCalendarEventRendererProps<T> {
  touchableOpacityProps: CalendarTouchableOpacityProps
  event: ICalendarEvent<T>
  showTime?: boolean
  textColor: string
}

export function DefaultCalendarEventRenderer<T>({
  touchableOpacityProps,
  event,
  showTime = true,
  textColor,
}: DefaultCalendarEventRendererProps<T>) {
  const theme = useTheme()
  const eventTimeStyle = { fontSize: theme.typography.xs.fontSize, color: textColor }
  const eventTitleStyle = { fontSize: theme.typography.sm.fontSize, color: textColor }

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
