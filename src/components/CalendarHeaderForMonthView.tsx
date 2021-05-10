import dayjs from 'dayjs'
import * as React from 'react'
import { Text, View, ViewStyle } from 'react-native'

import { guideTextStyle, u } from '../commonStyles'
import { WeekNum } from '../interfaces'
import { getDatesInWeek, typedMemo } from '../utils'

interface CalendarHeaderProps {
  weekStartsOn: WeekNum
  isRTL: boolean
  locale: string
  style?: ViewStyle
}

function _CalendarHeaderForMonthView({
  locale,
  isRTL,
  weekStartsOn,
  style = {},
}: CalendarHeaderProps) {
  const dates = getDatesInWeek(new Date(), weekStartsOn, locale)
  const todayWeekNum = dayjs().day()

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
      {dates.map((date) => (
        <View style={{ flex: 1, paddingTop: 2 }} key={date.toISOString()}>
          <View style={{ height: 30 }}>
            <Text style={[guideTextStyle, todayWeekNum === date.day() && u['text-primary']]}>
              {date.format('ddd')}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}

export const CalendarHeaderForMonthView = typedMemo(_CalendarHeaderForMonthView)
