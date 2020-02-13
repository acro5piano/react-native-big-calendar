import dayjs from 'dayjs'
import * as React from 'react'
import { Animated, PanResponder } from 'react-native'
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

const DURATION = 200

export function Calendar({ events, style = {}, height, mode = '3days' }: CalendarProps) {
  const [date, setDate] = React.useState(dayjs())
  const [marginRight] = React.useState(new Animated.Value(0))
  const [marginLeft] = React.useState(new Animated.Value(0))

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
        onPanResponderMove: (_, { dx }) => {
          Animated.parallel([
            Animated.timing(marginRight, {
              toValue: -dx,
              duration: 0,
            }),
            Animated.timing(marginLeft, {
              toValue: dx,
              duration: 0,
            }),
          ]).start()
          if (dx < -200) {
            setDate(date.add(3, 'day'))
          }
          // if (dx > 200) {
          //   setDate(date.add(-3, 'day'))
          // }
        },
        onPanResponderEnd: () => {
          Animated.parallel([
            Animated.timing(marginRight, {
              toValue: 0,
              duration: DURATION,
            }),
            Animated.timing(marginLeft, {
              toValue: 0,
              duration: DURATION,
            }),
          ]).start()
        },
      }),
    [mode, date, events, marginLeft, marginRight],
  )

  return (
    <Animated.View style={{ marginRight, marginLeft }} {...panResponder.panHandlers}>
      <CalendarHeader cellHeight={cellHeight} dateRange={dateRange} style={style} />
      <CalendarBody
        dayJsConvertedEvents={dayJsConvertedEvents}
        containerHeight={height}
        cellHeight={cellHeight}
        style={style}
        dateRange={dateRange}
      />
    </Animated.View>
  )
}
