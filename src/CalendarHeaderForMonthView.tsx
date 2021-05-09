import dayjs from 'dayjs'
import * as React from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { commonStyles } from './commonStyles'
import { WeekNum } from './interfaces'
import { Color } from './theme'
import { getDatesInWeek, typedMemo } from './utils'

interface CalendarHeaderProps {
  weekStartsOn: WeekNum
  isRTL: boolean
  locale: string
  style?: ViewStyle
}

// TODO: extract to common styles
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
  hourGuideSpacer: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
})

function _CalendarHeaderForMonthView({
  locale,
  isRTL,
  weekStartsOn,
  style = {},
}: CalendarHeaderProps) {
  const dates = getDatesInWeek(new Date(), weekStartsOn, locale)
  const todayWeekNum = dayjs().day()

  return (
    <View style={[isRTL ? styles.containerRTL : styles.container, style]}>
      {dates.map((date) => (
        <View style={{ flex: 1, paddingTop: 2 }}>
          <View style={{ height: 30 }}>
            <Text
              style={[
                commonStyles.guideText,
                todayWeekNum === date.day() && { color: Color.primary },
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
