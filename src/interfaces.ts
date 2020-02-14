import dayjs from 'dayjs'
import { ViewStyle } from 'react-native'

export interface BaseEvent {
  start: Date
  end: Date
  title: string
}

export interface DayJSConvertedEvent {
  start: dayjs.Dayjs
  end: dayjs.Dayjs
  title: string
}

export type Event<T = {}> = BaseEvent & T

export type Mode = '3days' | 'week' | 'day'

export type EventCellStyle<T> = ViewStyle | ((event: Event<T>) => ViewStyle)

export type WeekNum = 0 | 1 | 2 | 3 | 4 | 5 | 6
