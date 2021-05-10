import dayjs from 'dayjs'
import * as React from 'react'
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import { commonStyles, dateCellStyle, eventTitleStyle, guideTextStyle, u } from './commonStyles'
import { ICalendarEvent } from './interfaces'
import { isToday, typedMemo } from './utils'

interface CalendarHeaderProps<T> {
  dateRange: dayjs.Dayjs[]
  cellHeight: number
  style: ViewStyle
  allDayEvents: ICalendarEvent<T>[]
  isRTL: boolean
  onPressDateHeader?: (date: Date) => void
}

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
    <View
      style={[
        u['flex-1'],
        u['border-b'],
        u['border-gray-100'],
        isRTL ? u['flex-row-reverse'] : u['flex-row'],
        style,
      ]}
    >
      <View style={[u['bg-white'], u['z-20'], u['w-50'], u['border-b'], u['border-gray-100']]} />
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
              <Text style={[guideTextStyle, _isToday && u['text-primary']]}>
                {date.format('ddd')}
              </Text>
              <View
                style={
                  _isToday && [
                    u['h-36'],
                    u['w-36'],
                    u['mt-6'],
                    u['bg-primary'],
                    u['pb-6'],
                    u['rounded-full'],
                    u['items-center'],
                    u['justify-center'],
                  ]
                }
              >
                <Text
                  style={[
                    u['mt-6'],
                    u['text-gray-800'],
                    u['text-2xl'],
                    u['text-center'],
                    _isToday && u['text-white'],
                  ]}
                >
                  {date.format('D')}
                </Text>
              </View>
            </View>
            <View style={[dateCellStyle, { height: cellHeight }]}>
              {allDayEvents.map((event) => {
                if (!dayjs(event.start).isSame(date, 'day')) {
                  return null
                }
                return (
                  <View style={commonStyles.eventCell} key={`${event.start}${event.title}`}>
                    <Text style={eventTitleStyle}>{event.title}</Text>
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
