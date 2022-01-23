import dayjs from 'dayjs'
import * as React from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'
import { CalendarCellStyle } from 'src'

import { u } from '../commonStyles'
import { useTheme } from '../theme/ThemeContext'

interface HourGuideCellProps {
  cellHeight: number
  onPress: (d: dayjs.Dayjs) => void
  date: dayjs.Dayjs
  hour: string
  index: number
  calendarCellStyle?: CalendarCellStyle
}

export const HourGuideCell = ({
  cellHeight,
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
  const numberHour = hour.split(':')[0]
  const numberMinute = hour.split(':')[1]
  return (
    <TouchableWithoutFeedback
      onPress={() => onPress(date.hour(Number(numberHour)).minute(Number(numberMinute)))}
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
