import dayjs from 'dayjs'
import * as React from 'react'
import { Platform, Text, TouchableOpacity, View, ViewStyle } from 'react-native'

import { eventCellCss, u } from '../commonStyles'
import { ICalendarEvent } from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import { isToday, typedMemo } from '../utils'

export interface CalendarHeaderProps<T> {
  dateRange: dayjs.Dayjs[]
  cellHeight: number
  style: ViewStyle
  allDayEvents: ICalendarEvent<T>[]
  onPressDateHeader?: (date: Date) => void
}

function _CalendarHeader<T>({
  dateRange,
  cellHeight,
  style,
  allDayEvents,
  onPressDateHeader,
}: CalendarHeaderProps<T>) {
  const _onPress = React.useCallback(
    (date: Date) => {
      onPressDateHeader && onPressDateHeader(date)
    },
    [onPressDateHeader],
  )

  const theme = useTheme()

  const borderColor = { borderColor: theme.palette.gray['200'] }
  const primaryBg = { backgroundColor: theme.palette.primary.main }

  return (
    <View
      style={[
        u['border-b-2'],
        borderColor,
        theme.isRTL ? u['flex-row-reverse'] : u['flex-row'],
        style,
      ]}
    >
      <View style={[u['z-10'], u['w-50'], borderColor]} />
      {dateRange.map((date) => {
        const _isToday = isToday(date)
        return (
          <TouchableOpacity
            style={[u['flex-1'], u['pt-2']]}
            onPress={() => _onPress(date.toDate())}
            disabled={onPressDateHeader === undefined}
            key={date.toString()}
          >
            <View style={[u['justify-between'], { height: cellHeight }]}>
              <Text
                style={[
                  theme.typography.xs,
                  u['text-center'],
                  { color: _isToday ? theme.palette.primary.main : theme.palette.gray['500'] },
                ]}
              >
                {date.format('ddd')}
              </Text>
              <View
                style={
                  _isToday
                    ? [
                        primaryBg,
                        u['h-36'],
                        u['w-36'],
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
                    {
                      color: _isToday
                        ? theme.palette.primary.contrastText
                        : theme.palette.gray['800'],
                    },
                    theme.typography.xl,
                    u['text-center'],
                    Platform.OS === 'web' && _isToday && u['mt-6'],
                  ]}
                >
                  {date.format('D')}
                </Text>
              </View>
            </View>
            <View
              style={[
                u['border-l'],
                { borderColor: theme.palette.gray['200'] },
                { height: cellHeight },
              ]}
            >
              {allDayEvents.map((event) => {
                if (!dayjs(date).isBetween(event.start, event.end, 'day', '[]')) {
                  return null
                }
                return (
                  <View
                    style={[eventCellCss.style, primaryBg]}
                    key={`${event.start}${event.title}`}
                  >
                    <Text
                      style={{
                        fontSize: theme.typography.sm.fontSize,
                        color: theme.palette.primary.contrastText,
                      }}
                    >
                      {event.title}
                    </Text>
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
