import * as React from 'react'
import dayjs from 'dayjs'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { commonStyles, PRIMARY_COLOR } from './commonStyles'
import { isToday } from './utils'

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
        {dateRange.map(date => {
          const _isToday = isToday(date)
          return (
            <View key={date.toString()} style={{ flex: 1, paddingTop: 2 }}>
              <View style={{ height: cellHeight, justifyContent: 'space-between' }}>
                <Text style={[commonStyles.guideText, _isToday && { color: PRIMARY_COLOR }]}>
                  {date.format('ddd')}
                </Text>
                <View style={_isToday && styles.todayWrap}>
                  <Text style={[styles.dateText, _isToday && { color: '#fff' }]}>
                    {date.format('D')}
                  </Text>
                </View>
              </View>
              <View style={[commonStyles.dateCell, { height: cellHeight }]}></View>
            </View>
          )
        })}
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
    marginTop: 6,
  },
  todayWrap: {
    backgroundColor: PRIMARY_COLOR,
    width: 36,
    height: 36,
    borderRadius: 50,
    marginTop: 6,
    paddingBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  hourGuideSpacer: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
})
