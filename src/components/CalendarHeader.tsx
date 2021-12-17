import dayjs from 'dayjs'
import * as React from 'react'
import { Platform, Text, TouchableOpacity, View, ViewStyle } from 'react-native'

import { eventCellCss, u } from '../commonStyles'
import { ICalendarEvent } from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import { isToday, objHasContent, stringHasContent, typedMemo } from '../utils'

export interface CalendarHeaderProps<T> {
  dateRange: dayjs.Dayjs[]
  cellHeight: number
  style: ViewStyle
  allDayEvents: ICalendarEvent<T>[]
  onPressDateHeader?: (date: Date) => void
  activeDate?: Date
  headerContentStyle?: ViewStyle
  dayHeaderStyle?: ViewStyle
  dayHeaderHighlightColor?: string
  weekDayHeaderHighlightColor?: string
  showAllDayEventCell?: boolean
}

function _CalendarHeader<T>({
  dateRange,
  cellHeight,
  style,
  allDayEvents,
  onPressDateHeader,
  activeDate,
  headerContentStyle = {},
  dayHeaderStyle = {},
  dayHeaderHighlightColor = '',
  weekDayHeaderHighlightColor = '',
  showAllDayEventCell = true,
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
        showAllDayEventCell ? u['border-b-2'] : {},
        showAllDayEventCell ? borderColor : {},
        theme.isRTL ? u['flex-row-reverse'] : u['flex-row'],
        style,
      ]}
    >
      <View style={[u['z-10'], u['w-50'], borderColor]} />
      {dateRange.map((date) => {
        const shouldHighlight = activeDate ? date.isSame(activeDate, 'date') : isToday(date)

        return (
          <TouchableOpacity
            style={[u['flex-1'], u['pt-2']]}
            onPress={() => _onPress(date.toDate())}
            disabled={onPressDateHeader === undefined}
            key={date.toString()}
          >
            <View
              style={[
                { height: cellHeight },
                objHasContent(headerContentStyle) ? headerContentStyle : u['justify-between'],
              ]}
            >
              <Text
                style={[
                  theme.typography.xs,
                  u['text-center'],
                  {
                    color: shouldHighlight
                      ? stringHasContent(weekDayHeaderHighlightColor)
                        ? weekDayHeaderHighlightColor
                        : theme.palette.primary.main
                      : theme.palette.gray['500'],
                  },
                ]}
              >
                {date.format('ddd')}
              </Text>
              <View
                style={
                  objHasContent(dayHeaderStyle)
                    ? dayHeaderStyle
                    : shouldHighlight
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
                      color: shouldHighlight
                        ? stringHasContent(dayHeaderHighlightColor)
                          ? dayHeaderHighlightColor
                          : theme.palette.primary.contrastText
                        : theme.palette.gray['800'],
                    },
                    theme.typography.xl,
                    u['text-center'],
                    Platform.OS === 'web' &&
                      shouldHighlight &&
                      !stringHasContent(dayHeaderHighlightColor) &&
                      u['mt-6'],
                  ]}
                >
                  {date.format('D')}
                </Text>
              </View>
            </View>
            <View
              style={
                showAllDayEventCell
                  ? [
                      u['border-l'],
                      { borderColor: theme.palette.gray['200'] },
                      { height: cellHeight },
                    ]
                  : []
              }
            >
              {showAllDayEventCell
                ? allDayEvents.map((event) => {
                    if (!dayjs(date).isBetween(event.start, event.end, 'day', '[]')) {
                      return null
                    }
                    return (
                      <View
                        style={[eventCellCss.style, primaryBg, u['mt-2']]}
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
                  })
                : null}
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export const CalendarHeader = typedMemo(_CalendarHeader)
