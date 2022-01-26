import calendarize from 'calendarize'
import dayjs from 'dayjs'
import * as React from 'react'
import { Platform, Text, TouchableOpacity, View, ViewStyle } from 'react-native'

import { u } from '../commonStyles'
import { useNow } from '../hooks/useNow'
import { usePanResponder } from '../hooks/usePanResponder'
import {
  EventCellStyle,
  EventRenderer,
  HorizontalDirection,
  ICalendarEventBase,
  WeekNum,
} from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import { typedMemo } from '../utils'
import { CalendarEventForMonthView } from './CalendarEventForMonthView'

interface CalendarBodyForMonthViewProps<T extends ICalendarEventBase> {
  containerHeight: number
  targetDate: dayjs.Dayjs
  events: T[]
  style: ViewStyle
  eventCellStyle?: EventCellStyle<T>
  hideNowIndicator?: boolean
  onPressCell?: (date: Date) => void
  onPressEvent?: (event: T) => void
  onSwipeHorizontal?: (d: HorizontalDirection) => void
  renderEvent?: EventRenderer<T>
  maxVisibleEventCount: number
  weekStartsOn: WeekNum
  eventMinHeightForMonthView: number
}

function _CalendarBodyForMonthView<T extends ICalendarEventBase>({
  containerHeight,
  targetDate,
  style,
  onPressCell,
  events,
  onPressEvent,
  eventCellStyle,
  onSwipeHorizontal,
  hideNowIndicator,
  renderEvent,
  maxVisibleEventCount,
  weekStartsOn,
  eventMinHeightForMonthView,
}: CalendarBodyForMonthViewProps<T>) {
  const { now } = useNow(!hideNowIndicator)
  const [calendarWidth, setCalendarWidth] = React.useState<number>(0)

  const panResponder = usePanResponder({
    onSwipeHorizontal,
  })

  const weeks = calendarize(targetDate.toDate(), weekStartsOn)

  const minCellHeight = containerHeight / 5 - 30
  const theme = useTheme()

  return (
    <View
      style={[
        {
          height: containerHeight,
        },
        u['flex-column'],
        u['flex-1'],
        u['border-b'],
        u['border-l'],
        u['border-r'],
        u['rounded'],
        { borderColor: theme.palette.gray['200'] },
        style,
      ]}
      onLayout={({ nativeEvent: { layout } }) => setCalendarWidth(layout.width)}
      {...panResponder.panHandlers}
    >
      {weeks.map((week, i) => (
        <View
          key={i}
          style={[
            u['flex-1'],
            theme.isRTL ? u['flex-row-reverse'] : u['flex-row'],
            Platform.OS === 'android' && style, // TODO: in Android, backgroundColor is not applied to child components
            {
              minHeight: minCellHeight,
            },
          ]}
        >
          {week
            .map((d) => (d > 0 ? targetDate.date(d) : null))
            .map((date, ii) => (
              <TouchableOpacity
                onPress={() => date && onPressCell && onPressCell(date.toDate())}
                style={[
                  i > 0 && u['border-t'],
                  theme.isRTL && ii > 0 && u['border-r'],
                  !theme.isRTL && ii > 0 && u['border-l'],
                  { borderColor: theme.palette.gray['200'] },
                  u['p-2'],
                  u['flex-1'],
                  u['flex-column'],
                  {
                    minHeight: minCellHeight,
                  },
                ]}
                key={ii}
              >
                <View style={[ {...(date?.format('YYYY-MM-DD') === now.format('YYYY-MM-DD')) ? { textAlign: 'center', backgroundColor: theme.palette.primary.main, width: 22, height: 18, borderRadius: 16, marginLeft: 15, justifyContent: 'center', alignItems: 'center' } : { textAlign: 'center', alignSelf: 'center'}}]}>
                  <Text
                    style={[
                      { textAlign: 'center' },
                      theme.typography.sm,
                      {
                        color:
                          date?.format('YYYY-MM-DD') === now.format('YYYY-MM-DD')
                            ? '#fff'
                            : theme.palette.gray['800'],
                      },
                    ]}
                  >
                    {date && date.format('D')}
                  </Text>
                </View>
                {date &&
                  events
                    .sort((a, b) => {
                      if (dayjs(a.start).isSame(b.start, 'day')) {
                        const aDuration = dayjs.duration(dayjs(a.end).diff(dayjs(a.start))).days()
                        const bDuration = dayjs.duration(dayjs(b.end).diff(dayjs(b.start))).days()
                        return bDuration - aDuration
                      }
                      return a.start.getTime() - b.start.getTime()
                    })
                    .filter(({ start, end }) =>
                      date.isBetween(
                        dayjs(start).startOf('day'),
                        dayjs(end).endOf('day'),
                        null,
                        '[)',
                      ),
                    )
                    .reduce(
                      (elements, event, index) => [
                        ...elements,
                        index > maxVisibleEventCount ? null : index === maxVisibleEventCount ? (
                          <Text
                            key={index}
                            style={{ fontSize: 11, marginTop: 2, fontWeight: 'bold', alignSelf: 'center', textAlign: 'center' }}
                          >
                            ...
                          </Text>
                        ) : (
                          <CalendarEventForMonthView
                            key={index}
                            event={event}
                            eventCellStyle={eventCellStyle}
                            onPressEvent={onPressEvent}
                            renderEvent={renderEvent}
                            date={date}
                            dayOfTheWeek={ii}
                            calendarWidth={calendarWidth}
                            isRTL={theme.isRTL}
                            eventMinHeightForMonthView={eventMinHeightForMonthView}
                          />
                        ),
                      ],
                      [] as (null | JSX.Element)[],
                    )}
              </TouchableOpacity>
            ))}
        </View>
      ))}
    </View>
  )
}

export const CalendarBodyForMonthView = typedMemo(_CalendarBodyForMonthView)
