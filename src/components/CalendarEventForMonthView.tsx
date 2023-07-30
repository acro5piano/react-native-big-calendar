import dayjs from 'dayjs'
import * as React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { u } from '../commonStyles'
import { useCalendarTouchableOpacityProps } from '../hooks/useCalendarTouchableOpacityProps'
import { EventCellStyle, EventRenderer, ICalendarEventBase } from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import { getEventSpanningInfo } from '../utils/datetime'
import { typedMemo } from '../utils/react'

interface CalendarEventProps<T extends ICalendarEventBase> {
  event: T
  onPressEvent?: (event: T) => void
  eventCellStyle?: EventCellStyle<T>
  renderEvent?: EventRenderer<T>
  date: dayjs.Dayjs
  dayOfTheWeek: number
  calendarWidth: number
  isRTL: boolean
  eventMinHeightForMonthView: number
  showAdjacentMonths: boolean
}

function _CalendarEventForMonthView<T extends ICalendarEventBase>({
  event,
  onPressEvent,
  eventCellStyle,
  renderEvent,
  date,
  dayOfTheWeek,
  calendarWidth,
  isRTL,
  eventMinHeightForMonthView,
  showAdjacentMonths,
}: CalendarEventProps<T>) {
  const theme = useTheme()

  const { eventWidth, isMultipleDays, isMultipleDaysStart, eventWeekDuration } = React.useMemo(
    () => getEventSpanningInfo(event, date, dayOfTheWeek, calendarWidth, showAdjacentMonths),
    [date, dayOfTheWeek, event, calendarWidth, showAdjacentMonths],
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

  return (
    <TouchableOpacity
      style={{ minHeight: eventMinHeightForMonthView }}
      onPress={() => onPressEvent?.(event)}
    >
      {(!isMultipleDays && date.isSame(event.start, 'day')) ||
      (isMultipleDays && isMultipleDaysStart) ? (
        renderEvent ? (
          renderEvent(event, touchableOpacityProps)
        ) : (
          <View {...touchableOpacityProps}>
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
          </View>
        )
      ) : null}
    </TouchableOpacity>
  )
}

export const CalendarEventForMonthView = typedMemo(_CalendarEventForMonthView)
