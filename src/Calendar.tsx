import dayjs from 'dayjs'
import * as React from 'react'
import { PanResponder, View, ViewStyle } from 'react-native'
import { getDatesInWeek, getDatesInNextThreeDays } from './utils'
import { CalendarHeader } from './CalendarHeader'
import { CalendarBody } from './CalendarBody'
import { MIN_HEIGHT } from './commonStyles'
import { Event, EventCellStyle, Mode } from './interfaces'

interface CalendarProps<T = {}> {
  events: Event<T>[]
  onPressEvent?: (event: Event<T>) => void
  height: number
  mode: Mode
  style?: ViewStyle
  eventCellStyle?: EventCellStyle<T>
}

const SWIPE_THRESHOLD = 50

export function Calendar({
  events,
  style = {},
  height,
  mode = '3days',
  onPressEvent,
  eventCellStyle,
}: CalendarProps) {
  const [date, setDate] = React.useState(dayjs())

  const dayJsConvertedEvents = React.useMemo(
    () => events.map(e => ({ ...e, start: dayjs(e.start), end: dayjs(e.end) })),
    [events],
  )

  const dateRange = React.useMemo(() => {
    switch (mode) {
      case '3days':
        return getDatesInNextThreeDays(date)
      case 'week':
        return getDatesInWeek(date)
      default:
        throw new Error('undefined mode')
    }
  }, [mode, date])

  const cellHeight = React.useMemo(() => Math.max(height - 30, MIN_HEIGHT) / 24, [height])

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, { dy, dx }) => {
          if (dy < -1 * SWIPE_THRESHOLD || SWIPE_THRESHOLD < dy) {
            return
          }
          if (dx < -1 * SWIPE_THRESHOLD) {
            setDate(date.add(3, 'day'))
          }
          if (dx > SWIPE_THRESHOLD) {
            setDate(date.add(-3, 'day'))
          }
        },
      }),
    [date],
  )

  return (
    <View {...panResponder.panHandlers}>
      <CalendarHeader cellHeight={cellHeight} dateRange={dateRange} style={style} />
      <CalendarBody
        dayJsConvertedEvents={dayJsConvertedEvents}
        containerHeight={height}
        cellHeight={cellHeight}
        style={style}
        dateRange={dateRange}
        onPressEvent={onPressEvent}
        eventCellStyle={eventCellStyle}
      />
    </View>
  )
}
