import type dayjs from 'dayjs'
import * as React from 'react'
import type { AccessibilityProps } from 'react-native'
import { Text, TouchableOpacity, View } from 'react-native'
import { u } from '../commonStyles'
import { useCalendarTouchableOpacityProps } from '../hooks/useCalendarTouchableOpacityProps'
import type { EventCellStyle, EventRenderer, ICalendarEventBase } from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import { getEventSpanningInfo } from '../utils/datetime'
import { typedMemo } from '../utils/react'

interface CalendarEventProps<T extends ICalendarEventBase> {
  event: T
  onPressEvent?: (event: T) => void
  eventCellStyle?: EventCellStyle<T>
  eventCellAccessibilityProps?: AccessibilityProps
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
  eventCellAccessibilityProps = {},
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
    eventCellAccessibilityProps,
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
    ],
  })

  const handlePress = React.useCallback(() => {
    if (!event.disabled && onPressEvent) {
      onPressEvent(event)
    }
  }, [event, onPressEvent])

  return (
    <TouchableOpacity
      style={[{ minHeight: eventMinHeightForMonthView }, u['mt-2']]}
      onPress={handlePress}
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
                u.truncate,
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
