import * as React from 'react'
import { Text, View } from 'react-native'

import { u } from '../commonStyles'
import { useTheme } from '../theme/ThemeContext'
import { formatHour } from '../utils'

interface HourGuideColumnProps {
  cellHeight: number
  hour: number
  ampm: boolean
  index: number
}

const _HourGuideColumn = ({ cellHeight, hour, ampm, index }: HourGuideColumnProps) => {
  const theme = useTheme()
  const textStyle = React.useMemo(
    () => ({ color: theme.palette.gray[500], fontSize: theme.typography.xs.fontSize }),
    [theme],
  )
  const is_pair = (i) => i % 2
  const pairCellBg = { backgroundColor: theme.palette.primary.pairCellBg }
  const oddCellBg = { backgroundColor: theme.palette.primary.oddCellBg }

  return (
    <View style={{ height: cellHeight, backgroundColor: is_pair(index) ? pairCellBg : oddCellBg }}>
      <Text style={[textStyle, u['text-center']]}>{formatHour(hour, ampm)}</Text>
    </View>
  )
}

export const HourGuideColumn = React.memo(_HourGuideColumn, () => true)
