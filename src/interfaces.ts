import React from 'react'
import { RecursiveArray, ViewStyle } from 'react-native'

interface BaseEvent<T> {
  start: Date
  end: Date
  title: string
  children?: React.ReactElement | null
  eventRenderer?: (event: Event<T>, touchableOpacityProps: any) => React.ReactElement | null
}

export type CalendarTouchableOpacityProps = {
  delayPressIn: number;
  key: string;
  style: RecursiveArray<ViewStyle | undefined> | ViewStyle
  onPress: () => void;
  disabled: boolean;
}

export type Event<T = any> = BaseEvent<T> & T

export type Mode = '3days' | 'week' | 'day'

export type EventCellStyle<T> = ViewStyle | ((event: Event<T>) => ViewStyle)

export type WeekNum = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type HasDateRange = [Date, Date]

export type DateRangeHandler = ([start, end]: HasDateRange) => void

export type HorizontalDirection = 'RIGHT' | 'LEFT'


/**
 * @deprecated Prefer type Event<T = any> instead.
 */
export type DayJSConvertedEvent<T = any> = Event<T>
