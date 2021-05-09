import dayjs from 'dayjs'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { commonStyles } from './commonStyles'
import { CalendarTouchableOpacityProps, ICalendarEvent } from './interfaces'
import { formatStartEnd } from './utils'

interface DefaultCalendarEventRendererProps<T> {
  touchableOpacityProps: CalendarTouchableOpacityProps
  event: ICalendarEvent<T>
  showTime?: boolean
}

export function DefaultCalendarEventRenderer<T>({
  touchableOpacityProps,
  event,
  showTime = true,
}: DefaultCalendarEventRendererProps<T>) {
  return (
    <TouchableOpacity {...touchableOpacityProps}>
      {dayjs(event.end).diff(event.start, 'minute') < 32 && showTime ? (
        <Text style={commonStyles.eventTitle}>
          {event.title},<Text style={styles.eventTime}>{dayjs(event.start).format('HH:mm')}</Text>
        </Text>
      ) : (
        <>
          <Text style={commonStyles.eventTitle}>{event.title}</Text>
          {showTime && (
            <Text style={styles.eventTime}>{formatStartEnd(event.start, event.end)}</Text>
          )}
          {event.children && event.children}
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  eventTime: {
    color: '#fff',
    fontSize: 10,
  },
})
