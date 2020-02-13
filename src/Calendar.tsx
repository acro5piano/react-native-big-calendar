import * as React from 'react'
import dayjs from 'dayjs'
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

export function Calendar({ events, style = {}, height, mode = '3days' }: CalendarProps) {
  const dayJsConvertedEvents = React.useMemo(
    () => events.map(e => ({ ...e, start: dayjs(e.start), end: dayjs(e.end) })),
    [events],
  )

  const dateRange = React.useMemo(() => {
    switch (mode) {
      case '3days':
        return getDatesInNextThreeDays()
      case 'week':
        return getDatesInWeek()
      default:
        throw new Error('undefined mode')
    }
  }, [mode])

  const cellHeight = React.useMemo(() => Math.max(height - 30, MIN_HEIGHT) / 24, [height])

  return (
    <>
      <CalendarHeader cellHeight={cellHeight} dateRange={dateRange} style={style} />
      <CalendarBody
        dayJsConvertedEvents={dayJsConvertedEvents}
        containerHeight={height}
        cellHeight={cellHeight}
        style={style}
        dateRange={dateRange}
      />
    </>
  )
}
