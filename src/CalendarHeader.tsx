import * as React from 'react'
import dayjs from 'dayjs'
import { StyleSheet, Text, View } from 'react-native'
import { commonStyles } from './commonStyles'

interface CalendarHeaderProps {
  dateRange: dayjs.Dayjs[]
  cellHeight: number
  style: any
}

export const CalendarHeader = React.memo(
  ({ dateRange, cellHeight, style = {} }: CalendarHeaderProps) => {
    return (
      <View style={[styles.container, style]}>
        <View style={[commonStyles.hourGuide, styles.hourGuideSpacer]} />
        {dateRange.map(date => (
          <View style={{ flex: 1 }}>
            <View style={{ height: cellHeight, justifyContent: 'center' }}>
              <Text style={commonStyles.guideText}>{date.format('D(ddd)')}</Text>
            </View>
            <View style={[commonStyles.dateCell, { height: cellHeight }]}></View>
          </View>
        ))}
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  hourGuideSpacer: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
})
