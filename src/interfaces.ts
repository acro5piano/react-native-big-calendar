import { ReactElement } from 'react'
import { RecursiveArray, ViewStyle } from 'react-native'

interface ICalendarEventBase<T> {
  start: Date
  end: Date
  isAllDayEvent: boolean
  title: string
  children?: ReactElement | null
  eventRenderer?: (
    event: ICalendarEvent<T>,
    touchableOpacityProps: CalendarTouchableOpacityProps,
  ) => ReactElement | null
  /**
   * a unique key must be provided if the consumer lib wants to re-order events
   */
  uniqueKey?: string;
}

export type CalendarTouchableOpacityProps = {
  delayPressIn: number
  key: string
  style: RecursiveArray<ViewStyle | undefined> | ViewStyle
  onPress: () => void
  disabled: boolean
}

export type ICalendarEvent<T = any> = ICalendarEventBase<T> & T

export type Mode = '3days' | 'week' | 'day' | 'custom' | 'month'

export type EventCellStyle<T> = ViewStyle | ((event: ICalendarEvent<T>) => ViewStyle)

export type WeekNum = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type HourNum =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23

export type HasDateRange = [Date, Date]

export type DateRangeHandler = ([start, end]: HasDateRange) => void

export type HorizontalDirection = 'RIGHT' | 'LEFT'

export type EventRenderer<T> = (
  event: ICalendarEvent<T>,
  touchableOpacityProps: CalendarTouchableOpacityProps,
) => JSX.Element

/**
 * @deprecated Prefer interface ICalendarEvent instead.
 */
export type DayJSConvertedEvent<T = any> = ICalendarEvent<T>
/**
 * @deprecated Prefer interface ICalendarEvent instead.
 */
export type Event<T = any> = ICalendarEvent<T>
