import { ReactElement } from 'react'
import { RecursiveArray, TextStyle, ViewStyle } from 'react-native'

import { CalendarHeaderProps } from './components/CalendarHeader'
import { CalendarHeaderForMonthViewProps } from './components/CalendarHeaderForMonthView'

export interface ICalendarEventBase {
  start: Date
  end: Date
  title: string
  children?: ReactElement | null
  moving?: boolean
}

export type CalendarTouchableOpacityProps = {
  delayPressIn: number
  key: string
  style: RecursiveArray<ViewStyle | undefined> | ViewStyle
  onPress: () => void
  disabled: boolean
}

export interface CalendarChangedInformation<T extends ICalendarEventBase> {
  day: number
  hour: number
  event: T
}

export type Mode = '3days' | 'week' | 'day' | 'custom' | 'month'

export type EventCellStyle<T extends ICalendarEventBase> = ViewStyle | ((event: T) => ViewStyle)

export type CalendarCellStyle = ViewStyle | ((date?: Date, hourRowIndex?: number) => ViewStyle)

export type CalendarCellTextStyle = TextStyle | ((date?: Date, hourRowIndex?: number) => TextStyle)

export type WeekNum = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type HourNum =
  | 0
  | 0.5
  | 1
  | 1.5
  | 2
  | 2.5
  | 3
  | 3.5
  | 4
  | 4.5
  | 5
  | 5.5
  | 6
  | 6.5
  | 7
  | 7.5
  | 8
  | 8.5
  | 9
  | 9.5
  | 10
  | 10.5
  | 11
  | 11.5
  | 12
  | 12.5
  | 13
  | 13.5
  | 14
  | 14.5
  | 15
  | 15.5
  | 16
  | 16.5
  | 17
  | 17.5
  | 18
  | 18.5
  | 19
  | 19.5
  | 20
  | 20.5
  | 21
  | 21.5
  | 22
  | 22.5
  | 23
  | 23.5

export type HasDateRange = [Date, Date]

export type DateRangeHandler = ([start, end]: HasDateRange) => void

export type HorizontalDirection = 'RIGHT' | 'LEFT'

export type EventRenderer<T extends ICalendarEventBase> = (event: T, anyProps: any) => JSX.Element

export type CalendarEventGestureCallback = (
  data: CalendarChangedInformation<ICalendarEventBase>,
) => void

export type HeaderRenderer<T extends ICalendarEventBase> = React.ComponentType<
  CalendarHeaderProps<T> & { mode: Mode }
>
export type MonthHeaderRenderer = React.ComponentType<CalendarHeaderForMonthViewProps>
