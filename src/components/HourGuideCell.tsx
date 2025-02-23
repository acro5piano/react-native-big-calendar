import type dayjs from 'dayjs'
import * as React from 'react'
import { type AccessibilityProps, TouchableWithoutFeedback, View } from 'react-native'

import { u } from '../commonStyles'
import type { CalendarCellStyle } from '../interfaces'
import { useTheme } from '../theme/ThemeContext'

interface HourGuideCellProps {
  cellHeight: number
  onLongPress: (d: dayjs.Dayjs) => void
  onPress: (d: dayjs.Dayjs) => void
  date: dayjs.Dayjs
  hour: number
  index: number
  calendarCellStyle?: CalendarCellStyle
  calendarCellAccessibilityProps?: AccessibilityProps
  timeslots: number
}

const _HourGuideCell = ({
  cellHeight,
  onLongPress,
  onPress,
  date,
  hour,
  index,
  calendarCellStyle,
  calendarCellAccessibilityProps,
  timeslots,
}: HourGuideCellProps) => {
  const theme = useTheme()

  const getCalendarCellStyle = React.useMemo(
    () => (typeof calendarCellStyle === 'function' ? calendarCellStyle : () => calendarCellStyle),
    [calendarCellStyle],
  )

  return (
    <TouchableWithoutFeedback
      onLongPress={() => onLongPress(date.hour(hour).minute(0))}
      onPress={() => onPress(date.hour(hour).minute(0))}
      {...calendarCellAccessibilityProps}
    >
      <View
        style={[
          u['border-l'],
          u['border-b'],
          {
            borderColor: theme.palette.gray['200'],
            height: cellHeight,
            justifyContent: 'space-evenly',
          },
          { ...getCalendarCellStyle(date.toDate(), index) },
        ]}
      >
        {Array.from({ length: timeslots }, (_, index) => (
          <View
            key={`${index}-${date.toDate()}`}
            style={[
              u['border-l'],
              u['border-b'],
              {
                borderColor: theme.palette.gray['100'],
                height: 1,
              },
            ]}
          />
        ))}
      </View>
    </TouchableWithoutFeedback>
  )
}

export const HourGuideCell = React.memo(_HourGuideCell)
