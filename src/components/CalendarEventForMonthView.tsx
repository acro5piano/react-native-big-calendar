import dayjs from 'dayjs'
import * as React from 'react'
import { Dimensions, Text, TouchableOpacity, View } from 'react-native'

import { u } from '../commonStyles'
import { useCalendarTouchableOpacityProps } from '../hooks/useCalendarTouchableOpacityProps'
import { EventCellStyle, EventRenderer, ICalendarEvent } from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import { typedMemo } from '../utils'

interface CalendarEventProps<T> {
  event: ICalendarEvent<T>
  onPressEvent?: (event: ICalendarEvent<T>) => void
  eventCellStyle?: EventCellStyle<T>
  renderEvent?: EventRenderer<T>
  date: dayjs.Dayjs
  dayOfTheWeek: number
}

function _CalendarEventForMonthView<T>({
  event,
  onPressEvent,
  eventCellStyle,
  renderEvent,
  date,
  dayOfTheWeek,
}: CalendarEventProps<T>) {
  const theme = useTheme()
  const { width } = Dimensions.get('window')
  const dayWidth = width / 7

  // adding + 1 because durations start at 0
  const eventDuration = dayjs.duration(dayjs(event.end).diff(dayjs(event.start))).days() + 1
  const eventDaysLeft = dayjs.duration(dayjs(event.end).diff(date)).days() + 1
  const weekDaysLeft = 7 - dayOfTheWeek
  const isMultipleDays = eventDuration > 1
  // This is to determine how many days from the event to show during a week
  const eventWeekDuration =
    eventDuration > weekDaysLeft
      ? weekDaysLeft
      : dayOfTheWeek === 0 && eventDaysLeft < eventDuration
      ? eventDaysLeft
      : eventDuration
  const isMultipleDaysStart =
    isMultipleDays &&
    (date.isSame(event.start, 'day') || (dayOfTheWeek === 0 && date.isAfter(event.start)))
  // - 6 to take in account the padding
  const eventWidth = dayWidth * eventWeekDuration - 6

  const touchableOpacityProps = useCalendarTouchableOpacityProps({
    event,
    eventCellStyle,
    onPressEvent,
    injectedStyles: [
      { backgroundColor: theme.palette.primary.main },
      isMultipleDaysStart ? { position: 'absolute', width: eventWidth, zIndex: 100000 } : {},
      u['mt-2'],
    ],
  })

  if (renderEvent) {
    return renderEvent(event, touchableOpacityProps)
  }

  return (
    <View style={{ minHeight: 22 }}>
      {((!isMultipleDays && date.isSame(event.start, 'day')) ||
        (isMultipleDays && isMultipleDaysStart)) && (
        <TouchableOpacity {...touchableOpacityProps}>
          <Text
            style={[
              { color: theme.palette.primary.contrastText },
              theme.typography.xs,
              u['truncate'],
            ]}
            numberOfLines={1}
          >
            {event.title}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export const CalendarEventForMonthView = typedMemo(_CalendarEventForMonthView)
