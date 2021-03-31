import dayjs from 'dayjs'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import { commonStyles } from './commonStyles'
import { ICalendarEvent } from './interfaces'
import { Color } from './theme'
import { typedMemo } from './typedMemo.helper'
import { isToday } from './utils'

interface CalendarHeaderProps<T> {
  dateRange: dayjs.Dayjs[]
  cellHeight: number
  style: ViewStyle
  allDayEvents: ICalendarEvent<T>[]
  isRTL: boolean
  onPressDateHeader?: (date: Date) => void
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  containerRTL: {
    flexDirection: 'row-reverse',
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
    backgroundColor: Color.primary,
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

function _CalendarHeader<T>({
  dateRange,
  cellHeight,
  style = {},
  allDayEvents,
  isRTL,
  onPressDateHeader,
}: CalendarHeaderProps<T>) {
  const _onPress = React.useCallback(
    (date: Date) => {
      onPressDateHeader && onPressDateHeader(date)
    },
    [onPressDateHeader],
  )

  return (
    <View style={[isRTL ? styles.containerRTL : styles.container, style]}>
      <View style={[commonStyles.hourGuide, styles.hourGuideSpacer]} />
      {dateRange.map((date) => {
        const _isToday = isToday(date)
        return (
          <TouchableOpacity
            style={{ flex: 1, paddingTop: 2 }}
            onPress={() => _onPress(date.toDate())}
            disabled={onPressDateHeader === undefined}
            key={date.toString()}
          >
            <View style={{ height: cellHeight, justifyContent: 'space-between' }}>
              <Text style={[commonStyles.guideText, _isToday && { color: Color.primary }]}>{date.format('ddd')}</Text>
              <View style={_isToday && styles.todayWrap}>
                <Text style={[styles.dateText, _isToday && { color: '#fff' }]}>{date.format('D')}</Text>
              </View>
            </View>
            <View style={[commonStyles.dateCell, { height: cellHeight }]}>
              {allDayEvents.map((event) => {
                if (!dayjs(event.start).isSame(date, 'day')) {
                  return null
                }
                return (
                  <View style={commonStyles.eventCell} key={`${event.start}${event.title}`}>
                    <Text style={commonStyles.eventTitle}>{event.title}</Text>
                  </View>
                )
              })}
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export const CalendarHeader = typedMemo(_CalendarHeader)
