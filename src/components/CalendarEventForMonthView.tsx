import * as React from 'react'
import { Text, TouchableOpacity } from 'react-native'

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
}

function _CalendarEventForMonthView<T>({
  event,
  onPressEvent,
  eventCellStyle,
  renderEvent,
}: CalendarEventProps<T>) {
  const theme = useTheme()

  const touchableOpacityProps = useCalendarTouchableOpacityProps({
    event,
    eventCellStyle,
    onPressEvent,
    injectedStyles: [{ backgroundColor: theme.palette.primary.main }, u['mt-2']],
  })

  if (renderEvent) {
    return renderEvent(event, touchableOpacityProps)
  }

  return (
    <TouchableOpacity {...touchableOpacityProps}>
      <Text
        style={[{ color: theme.palette.primary.contrastText }, theme.typography.xs, u['truncate']]}
        numberOfLines={1}
      >
        {event.title}
      </Text>
    </TouchableOpacity>
  )
}

export const CalendarEventForMonthView = typedMemo(_CalendarEventForMonthView)
