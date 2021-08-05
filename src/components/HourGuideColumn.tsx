import * as React from 'react'
import { Text, View } from 'react-native'

import { u } from '../commonStyles'
import { useTheme } from '../theme/ThemeContext'
import { formatHour } from '../utils'

interface HourGuideColumnProps {
  cellHeight: number
  hour: number
  ampm: boolean
}

const _HourGuideColumn = ({ cellHeight, hour, ampm }: HourGuideColumnProps) => {
  const theme = useTheme()
  const textStyle = React.useMemo(
    () => ({ color: '#7a83a6', fontSize: 13, fontWeight: '300', lineHeight: 14 }),
    [theme],
  )

  return (
    <View style={{ height: cellHeight }}>
      <Text style={[textStyle, u['text-center']]}>{formatHour(hour, ampm)}</Text>
    </View>
  )
}

export const HourGuideColumn = React.memo(_HourGuideColumn, () => true)
