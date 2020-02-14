import dayjs from 'dayjs'
import * as React from 'react'
import { PanResponder, View } from 'react-native'
import { getDatesInWeek, getDatesInNextThreeDays } from './utils'
import { CalendarHeader } from './CalendarHeader'
import { CalendarBody } from './CalendarBody'
import { MIN_HEIGHT } from './commonStyles'

interface BaseEvent {
  start: Date
  end: Date
  title: string
}

type Event<T = {}> = BaseEvent & T

type Mode = '3days' | 'week' | 'day'

interface CalendarProps<T = {}> {
  events: Event<T>[]
  height: number
  mode: Mode
  style: any
}

const SWIPE_THRESHOLD = 50

export function Calendar({ events, style = {}, height, mode = '3days' }: CalendarProps) {
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
      />
    </View>
  )
}
