import * as React from 'react'
import { Text, TextStyle, View } from 'react-native'

import { u } from '../commonStyles'
import { useTheme } from '../theme/ThemeContext'
import { formatHour } from '../utils'
import { isPair, objHasContent } from '../utils'

interface HourGuideColumnProps {
  cellHeight: number
  hour: number
  ampm: boolean
  index: number
  hourStyle: TextStyle
}

const _HourGuideColumn = ({
  cellHeight,
  hour,
  ampm,
  index,
  hourStyle = {},
}: HourGuideColumnProps) => {
  const theme = useTheme()
  const textStyle = React.useMemo(
    () => ({ color: theme.palette.gray[500], fontSize: theme.typography.xs.fontSize }),
    [theme],
  )
  const evenCellBg = theme.palette.evenCellBg
  const oddCellBg = theme.palette.oddCellBg

  return (
    <View style={{ height: cellHeight, backgroundColor: isPair(index) ? evenCellBg : oddCellBg }}>
      <Text style={[objHasContent(hourStyle) ? hourStyle : textStyle, u['text-center']]}>
        {index === -1 ? '' : formatHour(hour, ampm)}
      </Text>
    </View>
  )
}

export const HourGuideColumn = React.memo(_HourGuideColumn, () => true)
