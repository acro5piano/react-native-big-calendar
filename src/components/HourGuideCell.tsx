import dayjs from 'dayjs'
import * as React from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'

import { u } from '../commonStyles'
import { CalendarCellStyle } from '../interfaces'
import { useTheme } from '../theme/ThemeContext'

interface HourGuideCellProps {
  cellHeight: number
  onLongPress: (d: dayjs.Dayjs) => void
  onPress: (d: dayjs.Dayjs) => void
  date: dayjs.Dayjs
  hour: number
  index: number
  calendarCellStyle?: CalendarCellStyle
}

const _HourGuideCell = ({
  cellHeight,
  onLongPress,
  onPress,
  date,
  hour,
  index,
  calendarCellStyle,
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
    >
      <View
        style={[
          u['border-l'],
          u['border-b'],
          { borderColor: theme.palette.gray['200'] },
          { height: cellHeight },
          { ...getCalendarCellStyle(date.toDate(), index) },
        ]}
      />
    </TouchableWithoutFeedback>
  )
}

export const HourGuideCell = React.memo(_HourGuideCell)
