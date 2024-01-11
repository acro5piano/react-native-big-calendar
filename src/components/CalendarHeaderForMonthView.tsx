import dayjs from 'dayjs'
import * as React from 'react'
import { Text, View, ViewStyle } from 'react-native'

import { u } from '../commonStyles'
import { WeekNum } from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import { getDatesInWeek } from '../utils/datetime'
import { typedMemo } from '../utils/react'

export interface CalendarHeaderForMonthViewProps {
  weekStartsOn: WeekNum
  locale: string
  style: ViewStyle
  showWeekNumber?: boolean
  weekNumberPrefix?: string
}

function _CalendarHeaderForMonthView({
  locale,
  weekStartsOn,
  style,
  showWeekNumber = false,
  weekNumberPrefix = '',
}: CalendarHeaderForMonthViewProps) {
  const dates = getDatesInWeek(new Date(), weekStartsOn, locale)
  const todayWeekNum = dayjs().day()

  const theme = useTheme()

  return (
    <View
      style={[
        u['border-b'],
        { borderColor: theme.palette.gray['100'] },
        theme.isRTL ? u['flex-row-reverse'] : u['flex-row'],
        style,
      ]}
    >
      {showWeekNumber ? (
        <View style={[u['w-20'], { paddingTop: 2 }]} key={'weekNumber'}>
          <View style={{ flex: 1, height: 30 }}>
            <Text
              style={[
                u['text-center'],
                {
                  color: theme.palette.gray['800'],
                },
              ]}
            >
              {weekNumberPrefix != undefined ? weekNumberPrefix : ''}
            </Text>
          </View>
        </View>
      ) : null}
      {dates.map((date) => (
        <View style={{ flex: 1, paddingTop: 2 }} key={date.toISOString()}>
          <View style={{ height: 30 }}>
            <Text
              style={[
                u['text-center'],
                {
                  color:
                    todayWeekNum === date.day()
                      ? theme.palette.primary.main
                      : theme.palette.gray['800'],
                },
              ]}
            >
              {date.format('ddd')}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}

export const CalendarHeaderForMonthView = typedMemo(_CalendarHeaderForMonthView)
