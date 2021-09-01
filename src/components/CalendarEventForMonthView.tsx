import dayjs from 'dayjs'
import * as React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { u } from '../commonStyles'
import { useCalendarTouchableOpacityProps } from '../hooks/useCalendarTouchableOpacityProps'
import { EventCellStyle, EventRenderer, ICalendarEvent } from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import { getEventSpanningInfo, typedMemo } from '../utils'

interface CalendarEventProps<T> {
  event: ICalendarEvent<T>
  onPressEvent?: (event: ICalendarEvent<T>) => void
  eventCellStyle?: EventCellStyle<T>
  renderEvent?: EventRenderer<T>
  date: dayjs.Dayjs
  dayOfTheWeek: number
  calendarWidth: number
  isRTL: boolean
}

function _CalendarEventForMonthView<T>({
  event,
  onPressEvent,
  eventCellStyle,
  renderEvent,
  date,
  dayOfTheWeek,
  calendarWidth,
  isRTL,
}: CalendarEventProps<T>) {
  const theme = useTheme()

  const { eventWidth, isMultipleDays, isMultipleDaysStart, eventWeekDuration } = React.useMemo(
    () => getEventSpanningInfo(event, date, dayOfTheWeek, calendarWidth),
    [date, dayOfTheWeek, event, calendarWidth],
  )

  const touchableOpacityProps = useCalendarTouchableOpacityProps({
    event,
    eventCellStyle,
    onPressEvent,
    injectedStyles: [
      { backgroundColor: theme.palette.primary.main },
      isMultipleDaysStart && eventWeekDuration > 1
        ? {
            position: 'absolute',
            width: eventWidth,
            zIndex: 10000,
          }
        : {},
      isRTL ? { right: 0 } : { left: 0 },
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
              isRTL && { textAlign: 'right' },
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
