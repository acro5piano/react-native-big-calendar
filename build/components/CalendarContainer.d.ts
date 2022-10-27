import React from 'react'
import { TextStyle, ViewStyle } from 'react-native'

import {
  CalendarCellStyle,
  CalendarCellTextStyle,
  DateRangeHandler,
  EventCellStyle,
  EventRenderer,
  HeaderRenderer,
  ICalendarEventBase,
  Mode,
  MonthHeaderRenderer,
  WeekNum,
} from '../interfaces'

export interface CalendarContainerProps<T extends ICalendarEventBase> {
  /**
   * To remove Hours Column from week View.
   */
  hideHours?: Boolean
  /**
   * Events to be rendered. This is a required prop.
   */
  events: T[]
  /**
   * The height of calendar component. This is a required prop.
   */
  height: number
  /**
   * The height of each hour row.
   */
  hourRowHeight?: number
  /**
   * Adjusts the indentation of events that occur during the same time period. Defaults to 20 on web and 8 on mobile.
   */
  overlapOffset?: number
  eventCellStyle?: EventCellStyle<T>
  calendarCellStyle?: CalendarCellStyle
  calendarCellTextStyle?: CalendarCellTextStyle
  calendarContainerStyle?: ViewStyle
  headerContainerStyle?: ViewStyle
  headerContentStyle?: ViewStyle
  dayHeaderStyle?: ViewStyle
  dayHeaderHighlightColor?: string
  weekDayHeaderHighlightColor?: string
  bodyContainerStyle?: ViewStyle
  renderEvent?: EventRenderer<T>
  renderHeader?: HeaderRenderer<T>
  renderHeaderForMonthView?: MonthHeaderRenderer
  ampm?: boolean
  date?: Date
  locale?: string
  hideNowIndicator?: boolean
  showAdjacentMonths?: boolean
  mode?: Mode
  scrollOffsetMinutes?: number
  showTime?: boolean
  swipeEnabled?: boolean
  weekStartsOn?: WeekNum
  onChangeDate?: DateRangeHandler
  onPressCell?: (date: Date) => void
  onPressDateHeader?: (date: Date) => void
  onPressEvent?: (event: T) => void
  weekEndsOn?: WeekNum
  maxVisibleEventCount?: number
  eventMinHeightForMonthView?: number
  activeDate?: Date
  headerComponent?: React.ReactElement | null
  headerComponentStyle?: ViewStyle
  hourStyle?: TextStyle
  showAllDayEventCell?: boolean
  sortedMonthView?: boolean
  moreLabel?: string
}
declare function _CalendarContainer<T extends ICalendarEventBase>({
  events,
  height,
  hourRowHeight,
  ampm,
  date,
  eventCellStyle,
  calendarCellStyle,
  calendarCellTextStyle,
  locale,
  hideNowIndicator,
  mode,
  overlapOffset,
  scrollOffsetMinutes,
  showTime,
  headerContainerStyle,
  headerContentStyle,
  dayHeaderStyle,
  dayHeaderHighlightColor,
  weekDayHeaderHighlightColor,
  bodyContainerStyle,
  swipeEnabled,
  weekStartsOn,
  onChangeDate,
  onPressCell,
  onPressDateHeader,
  onPressEvent,
  renderEvent,
  renderHeader: HeaderComponent,
  renderHeaderForMonthView: HeaderComponentForMonthView,
  weekEndsOn,
  maxVisibleEventCount,
  eventMinHeightForMonthView,
  activeDate,
  headerComponent,
  headerComponentStyle,
  hourStyle,
  showAllDayEventCell,
  moreLabel,
  showAdjacentMonths,
  sortedMonthView,
  hideHours,
}: CalendarContainerProps<T>): JSX.Element
export declare const CalendarContainer: typeof _CalendarContainer
export {}
