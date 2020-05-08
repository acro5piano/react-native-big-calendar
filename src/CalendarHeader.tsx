import dayjs from 'dayjs'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import { commonStyles, PRIMARY_COLOR } from './commonStyles'
import { Event } from './interfaces'
import { isToday } from './utils'

interface CalendarHeaderProps<T> {
  dateRange: dayjs.Dayjs[]
  cellHeight: number
  style: ViewStyle
  allDayEvents: Event<T>[]
  onPressDateHeader?: (date: string) => void
}

export const CalendarHeader = React.memo(
  ({
    dateRange,
    cellHeight,
    style = {},
    allDayEvents,
    onPressDateHeader,
  }: CalendarHeaderProps<any>) => {
    const _onPress = React.useCallback(
      (date: string) => {
        onPressDateHeader && onPressDateHeader(date)
      },
      [event],
    )

    return (
      <View style={[styles.container, style]}>
        <View style={[commonStyles.hourGuide, styles.hourGuideSpacer]} />
        {dateRange.map((date) => {
          const _isToday = isToday(date)
          return (
            <TouchableOpacity
              style={{ flex: 1, paddingTop: 2 }}
              onPress={() => _onPress(date.toString())}
            >
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
                <View style={[commonStyles.dateCell, { height: cellHeight }]}>
                  {allDayEvents.map((event) => {
                    if (!event.start.isSame(date, 'day')) {
                      return null
                    }
                    return (
                      <View style={commonStyles.eventCell}>
                        <Text style={commonStyles.eventTitle}>{event.title}</Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            </TouchableOpacity>
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
