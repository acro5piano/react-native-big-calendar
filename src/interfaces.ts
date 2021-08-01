import { ReactElement } from 'react'
import { RecursiveArray, ViewStyle } from 'react-native'

import { CalendarHeaderProps } from './components/CalendarHeader'
import { CalendarHeaderForMonthViewProps } from './components/CalendarHeaderForMonthView'

export interface ICalendarEventBase {
  start: Date
  end: Date
  title: string
  children?: ReactElement | null
}

export type CalendarTouchableOpacityProps = {
  delayPressIn: number
  key: string
  style: RecursiveArray<ViewStyle | undefined> | ViewStyle
  onPress: () => void
  disabled: boolean
}

export type ICalendarEvent<T = {}> = ICalendarEventBase & T

export type Mode = '3days' | 'week' | 'day' | 'custom' | 'month'

export type EventCellStyle<T> = ViewStyle | ((event: ICalendarEvent<T>) => ViewStyle)

export type WeekNum = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type HasDateRange = [Date, Date]

export type DateRangeHandler = ([start, end]: HasDateRange) => void

export type HorizontalDirection = 'RIGHT' | 'LEFT'

export type EventRenderer<T> = (
  event: ICalendarEvent<T>,
  touchableOpacityProps: CalendarTouchableOpacityProps,
) => JSX.Element

export type HeaderRenderer<T> = React.ComponentType<CalendarHeaderProps<T> & { mode: Mode }>
export type MonthHeaderRenderer = React.ComponentType<CalendarHeaderForMonthViewProps>

/**
 * @deprecated Prefer interface ICalendarEvent instead.
 */
export type DayJSConvertedEvent<T = any> = ICalendarEvent<T>

/**
 * @deprecated Prefer interface ICalendarEvent instead.
 */
export type Event<T = any> = ICalendarEvent<T>
