import dayjs from 'dayjs'
import * as React from 'react'
import { TouchableWithoutFeedback, View, ViewStyle } from 'react-native'

import { u } from '../commonStyles'
import { useTheme } from '../theme/ThemeContext'
import { isPair, objHasContent } from '../utils'

interface HourGuideCellProps {
  cellHeight: number
  onPress: (d: dayjs.Dayjs) => void
  date: dayjs.Dayjs
  hour: number
  index: number
  cellsBorderStyle?: ViewStyle
}

export const HourGuideCell = ({
  cellHeight,
  onPress,
  date,
  hour,
  index,
  cellsBorderStyle = {},
}: HourGuideCellProps) => {
  const theme = useTheme()

  const evenCellBg = theme.palette.evenCellBg
  const oddCellBg = theme.palette.oddCellBg

  return (
    <TouchableWithoutFeedback onPress={() => onPress(date.hour(hour).minute(0))}>
      <View
        style={[
          objHasContent(cellsBorderStyle)
            ? cellsBorderStyle
            : [u['border-l'], u['border-b'], { borderColor: theme.palette.gray['200'] }],
          { height: cellHeight },
          { backgroundColor: isPair(index) ? evenCellBg : oddCellBg },
        ]}
      />
    </TouchableWithoutFeedback>
  )
}
