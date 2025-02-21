import * as React from 'react'
import { type AccessibilityProps, Text, type TextStyle, View } from 'react-native'

import { u } from '../commonStyles'
import type { HourRenderer } from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import { formatHour } from '../utils/datetime'
import { objHasContent } from '../utils/object'

interface HourGuideColumnProps {
  cellHeight: number
  hour: number
  ampm: boolean
  hourStyle: TextStyle
  calendarCellAccessibilityProps?: AccessibilityProps
  hourComponent?: HourRenderer
}

const _HourGuideColumn = ({
  cellHeight,
  hour,
  ampm,
  hourStyle = {},
  calendarCellAccessibilityProps = {},
  hourComponent: HourComponent,
}: HourGuideColumnProps) => {
  const theme = useTheme()
  const textStyle = React.useMemo(
    () => ({ color: theme.palette.gray[500], fontSize: theme.typography.xs.fontSize }),
    [theme],
  )

  return (
    <View style={{ height: cellHeight }} {...calendarCellAccessibilityProps}>
      {HourComponent ? (
        <HourComponent hour={hour} ampm={ampm} />
      ) : (
        <Text style={[objHasContent(hourStyle) ? hourStyle : textStyle, u['text-center']]}>
          {formatHour(hour, ampm)}
        </Text>
      )}
    </View>
  )
}

export const HourGuideColumn = React.memo(_HourGuideColumn, () => true)
