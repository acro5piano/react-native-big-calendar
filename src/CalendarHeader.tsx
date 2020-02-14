import * as React from 'react'
import dayjs from 'dayjs'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { commonStyles } from './commonStyles'

interface CalendarHeaderProps {
  dateRange: dayjs.Dayjs[]
  cellHeight: number
  style: ViewStyle
}

export const CalendarHeader = React.memo(
  ({ dateRange, cellHeight, style = {} }: CalendarHeaderProps) => {
    return (
      <View style={[styles.container, style]}>
        <View style={[commonStyles.hourGuide, styles.hourGuideSpacer]} />
        {dateRange.map(date => (
          <View key={date.toString()} style={{ flex: 1 }}>
            <View style={{ height: cellHeight, justifyContent: 'center' }}>
              <Text style={commonStyles.guideText}>{date.format('ddd')}</Text>
              <Text style={styles.dateText}>{date.format('D')}</Text>
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
  dateText: {
    color: '#444',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 4,
  },
  hourGuideSpacer: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
})
