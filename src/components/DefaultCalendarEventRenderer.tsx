import dayjs from 'dayjs'
import * as React from 'react'
import { Text, TouchableOpacity } from 'react-native'

import { CalendarTouchableOpacityProps, ICalendarEventBase } from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import { formatStartEnd } from '../utils/datetime'

interface DefaultCalendarEventRendererProps<T extends ICalendarEventBase> {
  touchableOpacityProps: CalendarTouchableOpacityProps
  event: T
  showTime?: boolean
  textColor: string
  ampm: boolean
}

export function DefaultCalendarEventRenderer<T extends ICalendarEventBase>({
  touchableOpacityProps,
  event,
  showTime = true,
  textColor,
  ampm,
}: DefaultCalendarEventRendererProps<T>) {
  const theme = useTheme()
  const eventTimeStyle = { fontSize: theme.typography.xs.fontSize, color: textColor }
  const eventTitleStyle = { fontSize: theme.typography.sm.fontSize, color: textColor }

  return (
    <TouchableOpacity {...touchableOpacityProps}>
      {dayjs(event.end).diff(event.start, 'minute') < 32 && showTime ? (
        <Text style={eventTitleStyle}>
          {event.title},
          <Text style={eventTimeStyle}>
            {dayjs(event.start).format(ampm ? 'hh:mm a' : 'HH:mm')}
          </Text>
        </Text>
      ) : (
        <>
          <Text style={eventTitleStyle}>{event.title}</Text>
          {showTime && (
            <Text style={eventTimeStyle}>
              {formatStartEnd(event.start, event.end, ampm ? 'h:mm a' : 'HH:mm')}
            </Text>
          )}
          {event.children && event.children}
        </>
      )}
    </TouchableOpacity>
  )
}
