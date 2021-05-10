import dayjs from 'dayjs'
import * as React from 'react'
import { Platform, Text, TouchableOpacity, View, ViewStyle } from 'react-native'

import { commonStyles, dateCellStyle, eventTitleStyle, guideTextStyle, u } from '../commonStyles'
import { ICalendarEvent } from '../interfaces'
import { isToday, typedMemo } from '../utils'

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
        u['border-b'],
        u['border-gray-100'],
        u['bg-white'],
        isRTL ? u['flex-row-reverse'] : u['flex-row'],
        style,
      ]}
    >
      <View style={[u['bg-white'], u['z-10'], u['w-50'], u['border-b'], u['border-gray-100']]} />
      {dateRange.map((date) => {
        const _isToday = isToday(date)
        return (
          <TouchableOpacity
            style={[u['bg-white'], u['flex-1'], u['pt-2']]}
            onPress={() => _onPress(date.toDate())}
            disabled={onPressDateHeader === undefined}
            key={date.toString()}
          >
            <View style={[u['justify-between'], { height: cellHeight }]}>
              <Text style={[guideTextStyle, _isToday && u['text-primary']]}>
                {date.format('ddd')}
              </Text>
              <View
                style={
                  _isToday
                    ? [
                        u['h-36'],
                        u['w-36'],
                        u['bg-primary'],
                        u['pb-6'],
                        u['rounded-full'],
                        u['items-center'],
                        u['justify-center'],
                        u['self-center'],
                        u['z-20'],
                      ]
                    : [u['mb-6']]
                }
              >
                <Text
                  style={[
                    u['text-gray-800'],
                    u['text-2xl'],
                    u['text-center'],
                    _isToday && u['text-white'],
                    Platform.OS === 'web' && _isToday && u['mt-6'],
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
