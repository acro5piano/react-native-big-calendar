import { ViewStyle } from 'react-native'

export interface BaseEvent {
  start: Date
  end: Date
  title: string
}

export type Event<T = {}> = BaseEvent & T

export type Mode = '3days' | 'week' | 'day'

export type EventCellStyle<T> = ViewStyle | ((event: Event<T>) => ViewStyle)
