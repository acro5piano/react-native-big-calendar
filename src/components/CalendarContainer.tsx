import dayjs from 'dayjs'
import React from 'react'
import { AccessibilityProps, TextStyle, ViewStyle } from 'react-native'

import { MIN_HEIGHT } from '../commonStyles'
import {
  AllDayEventCellStyle,
  CalendarCellStyle,
  CalendarCellTextStyle,
  DateRangeHandler,
  EventCellStyle,
  EventRenderer,
  HeaderRenderer,
  HorizontalDirection,
  HourRenderer,
  ICalendarEventBase,
  Mode,
  MonthHeaderRenderer,
  WeekNum,
} from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import {
  getDatesInMonth,
  getDatesInNextCustomDays,
  getDatesInNextOneDay,
  getDatesInNextThreeDays,
  getDatesInWeek,
  isAllDayEvent,
  modeToNum,
} from '../utils/datetime'
import { typedMemo } from '../utils/react'
import { CalendarBody } from './CalendarBody'
import { CalendarBodyForMonthView } from './CalendarBodyForMonthView'
import { CalendarHeader } from './CalendarHeader'
import { CalendarHeaderForMonthView } from './CalendarHeaderForMonthView'
import { Schedule } from './Schedule'

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

  /**
   * Custom style. It accepts styles or an array of styles, or a function that returns styles or an array of styles.
   */
  eventCellStyle?: EventCellStyle<T>
  eventCellTextColor?: string
  eventCellAccessibilityProps?: AccessibilityProps
  allDayEventCellStyle?: AllDayEventCellStyle<T>
  allDayEventCellTextColor?: string
  allDayEventCellAccessibilityProps?: AccessibilityProps
  calendarCellStyle?: CalendarCellStyle
  calendarCellTextStyle?: CalendarCellTextStyle
  calendarCellAccessibilityProps?: AccessibilityProps
  calendarCellAccessibilityPropsForMonthView?: AccessibilityProps
  calendarContainerStyle?: ViewStyle
  headerContainerStyle?: ViewStyle
  headerContainerAccessibilityProps?: AccessibilityProps
  headerContentStyle?: ViewStyle
  headerCellAccessibilityProps?: AccessibilityProps
  dayHeaderStyle?: ViewStyle
  dayHeaderHighlightColor?: string
  weekDayHeaderHighlightColor?: string
  bodyContainerStyle?: ViewStyle

  // Custom renderer
  renderEvent?: EventRenderer<T>
  renderHeader?: HeaderRenderer<T>
  renderHeaderForMonthView?: MonthHeaderRenderer
  renderCustomDateForMonth?: (date: Date) => React.ReactElement | null

  ampm?: boolean
  date?: Date
  locale?: string
  hideNowIndicator?: boolean
  showAdjacentMonths?: boolean
  mode?: Mode
  scrollOffsetMinutes?: number
  showTime?: boolean
  minHour?: number
  maxHour?: number
  swipeEnabled?: boolean
  weekStartsOn?: WeekNum
  onChangeDate?: DateRangeHandler
  onLongPressCell?: (date: Date) => void
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
  isEventOrderingEnabled?: boolean
  excludeSunday?: boolean
  //Week Number
  showWeekNumber?: boolean
  weekNumberPrefix?: string
  onPressMoreLabel?: (event: T[]) => void
  disableMonthEventCellPress?: boolean
  showVerticalScrollIndicator?: boolean
  itemSeparatorComponent?: React.ComponentType<any> | null | undefined
  /**
   * Callback when the user swipes horizontally.
   * Note: Memoize this callback to avoid un-necessary re-renders.
   * @param date The date where the user swiped to.
   */
  onSwipeEnd?: (date: Date) => void
  /**
   * If provided, we will skip the internal process of building the enriched events by date dictionary.
   */
  enrichedEventsByDate?: Record<string, T[]>
  /**
   * If true, the events will be enriched with the following properties:
   * - `overlapPosition`: position of the event in the stack of overlapping events
   * Default value is `false`.
   */
  enableEnrichedEvents?: boolean
  /**
   * If true, skip the sorting of events improving the performance.
   * This parameter is ignored if `enableEnrichedEvents` is `false`.
   * Default value is `false`.
   */
  eventsAreSorted?: boolean
  timeslots?: number
  hourComponent?: HourRenderer
  eventOverlapping?: boolean
}

function _CalendarContainer<T extends ICalendarEventBase>({
  events,
  height,
  hourRowHeight,
  ampm = false,
  date,
  allDayEventCellStyle = {},
  allDayEventCellTextColor = '',
  allDayEventCellAccessibilityProps = {},
  eventCellStyle,
  eventCellTextColor = '',
  eventCellAccessibilityProps = {},
  calendarCellAccessibilityPropsForMonthView = {},
  calendarCellStyle,
  calendarCellTextStyle,
  calendarCellAccessibilityProps = {},
  locale = 'en',
  hideNowIndicator = false,
  mode = 'week',
  overlapOffset,
  scrollOffsetMinutes = 0,
  showTime = true,
  headerContainerStyle = {},
  headerContainerAccessibilityProps = {},
  headerContentStyle = {},
  headerCellAccessibilityProps = {},
  dayHeaderStyle = {},
  dayHeaderHighlightColor = '',
  weekDayHeaderHighlightColor = '',
  bodyContainerStyle = {},
  swipeEnabled = true,
  weekStartsOn = 0,
  onChangeDate,
  onLongPressCell,
  onPressCell,
  onPressDateHeader,
  onPressEvent,
  renderEvent,
  renderHeader: HeaderComponent = CalendarHeader,
  renderHeaderForMonthView: HeaderComponentForMonthView = CalendarHeaderForMonthView,
  weekEndsOn = 6,
  maxVisibleEventCount = 3,
  eventMinHeightForMonthView = 22,
  activeDate,
  headerComponent = null,
  headerComponentStyle = {},
  hourStyle = {},
  showAllDayEventCell = true,
  moreLabel = '{moreCount} More',
  showAdjacentMonths = true,
  sortedMonthView = true,
  hideHours = false,
  minHour = 0,
  maxHour = 23,
  isEventOrderingEnabled,
  showWeekNumber = false,
  weekNumberPrefix = '',
  onPressMoreLabel,
  renderCustomDateForMonth,
  disableMonthEventCellPress = false,
  showVerticalScrollIndicator = false,
  itemSeparatorComponent = null,
  enrichedEventsByDate,
  enableEnrichedEvents = false,
  eventsAreSorted = false,
  excludeSunday = false,
  onSwipeEnd,
  timeslots = 0,
  hourComponent,
  eventOverlapping = false,
}: CalendarContainerProps<T>) {
  // To ensure we have proper effect callback, use string to date comparision.
  const dateString = date?.toString()

  const [targetDate, setTargetDate] = React.useState(() => dayjs(date))

  React.useEffect(() => {
    if (dateString) {
      setTargetDate(dayjs(dateString))
    }
  }, [dateString]) // if setting `[date]`, it will triggered twice

  const allDayEvents = React.useMemo(
    () => events.filter((event) => isAllDayEvent(event.start, event.end)),
    [events],
  )

  const daytimeEvents = React.useMemo(
    () => events.filter((event) => !isAllDayEvent(event.start, event.end)),
    [events],
  )

  const getDateRange = React.useCallback(
    (date: string | dayjs.Dayjs) => {
      switch (mode) {
        case 'month':
          return getDatesInMonth(date, locale)
        case 'week':
          return getDatesInWeek(date, weekStartsOn, locale, excludeSunday)
        case '3days':
          return getDatesInNextThreeDays(date, locale)
        case 'day':
          return getDatesInNextOneDay(date, locale)
        case 'custom':
          return getDatesInNextCustomDays(date, weekStartsOn, weekEndsOn, locale)
        case 'schedule': // TODO: this will update
          return getDatesInMonth(date, locale)
        default:
          throw new Error(
            `[react-native-big-calendar] The mode which you specified "${mode}" is not supported.`,
          )
      }
    },
    [mode, locale, weekEndsOn, weekStartsOn, excludeSunday],
  )

  if (minHour < 0) {
    throw new Error('minHour should be 0 or greater')
  }
  if (maxHour > 23) {
    throw new Error('maxHour should be less that 24')
  }
  if (minHour >= maxHour) {
    throw new Error('minHour should be less than maxHour')
  }

  const cellHeight = React.useMemo(
    () => hourRowHeight || Math.max(height - 30, MIN_HEIGHT) / 24,
    [height, hourRowHeight],
  )

  const theme = useTheme()

  const onSwipeHorizontal = React.useCallback(
    (direction: HorizontalDirection) => {
      if (!swipeEnabled) {
        return
      }
      let nextTargetDate: dayjs.Dayjs
      if ((direction === 'LEFT' && !theme.isRTL) || (direction === 'RIGHT' && theme.isRTL)) {
        nextTargetDate = targetDate.add(modeToNum(mode, targetDate), 'day')
      } else {
        if (mode === 'month') {
          nextTargetDate = targetDate.add(targetDate.date() * -1, 'day')
        } else {
          nextTargetDate = targetDate.add(modeToNum(mode, targetDate) * -1, 'day')
        }
      }
      setTargetDate(nextTargetDate)
      onSwipeEnd?.(nextTargetDate.toDate())
    },
    [swipeEnabled, theme.isRTL, onSwipeEnd, targetDate, mode],
  )

  React.useEffect(() => {
    if (dateString && onChangeDate) {
      const dateRange = getDateRange(dateString)
      onChangeDate([dateRange[0].toDate(), dateRange[dateRange.length - 1].toDate()])
    }
  }, [dateString, onChangeDate, getDateRange])

  const commonProps = {
    cellHeight,
    dateRange: getDateRange(targetDate),
    mode,
    onPressEvent,
    hideHours,
    showWeekNumber,
  }

  if (mode === 'month') {
    const headerProps = {
      style: headerContainerStyle,
      headerContainerAccessibilityProps: headerContainerAccessibilityProps,
      locale: locale,
      weekStartsOn: weekStartsOn,
      headerContentStyle: headerContentStyle,
      headerCellAccessibilityProps: headerCellAccessibilityProps,
      dayHeaderStyle: dayHeaderStyle,
      dayHeaderHighlightColor: dayHeaderHighlightColor,
      weekDayHeaderHighlightColor: weekDayHeaderHighlightColor,
      showAllDayEventCell: showAllDayEventCell,
      showWeekNumber: showWeekNumber,
      weekNumberPrefix: weekNumberPrefix,
      excludeSunday: excludeSunday,
    }
    return (
      <React.Fragment>
        <HeaderComponentForMonthView {...headerProps} />
        <CalendarBodyForMonthView<T>
          {...commonProps}
          style={bodyContainerStyle}
          containerHeight={height}
          events={[...daytimeEvents, ...allDayEvents]}
          eventCellStyle={eventCellStyle}
          eventCellAccessibilityProps={eventCellAccessibilityProps}
          calendarCellStyle={calendarCellStyle}
          calendarCellAccessibilityProps={calendarCellAccessibilityProps}
          calendarCellAccessibilityPropsForMonthView={calendarCellAccessibilityPropsForMonthView}
          calendarCellTextStyle={calendarCellTextStyle}
          weekStartsOn={weekStartsOn}
          hideNowIndicator={hideNowIndicator}
          showAdjacentMonths={showAdjacentMonths}
          onLongPressCell={onLongPressCell}
          onPressCell={onPressCell}
          onPressDateHeader={onPressDateHeader}
          onPressEvent={onPressEvent}
          onSwipeHorizontal={onSwipeHorizontal}
          renderEvent={renderEvent}
          targetDate={targetDate}
          maxVisibleEventCount={maxVisibleEventCount}
          eventMinHeightForMonthView={eventMinHeightForMonthView}
          sortedMonthView={sortedMonthView}
          moreLabel={moreLabel}
          onPressMoreLabel={onPressMoreLabel}
          renderCustomDateForMonth={renderCustomDateForMonth}
          disableMonthEventCellPress={disableMonthEventCellPress}
          excludeSunday={excludeSunday}
        />
      </React.Fragment>
    )
  }

  const headerProps = {
    ...commonProps,
    style: headerContainerStyle,
    headerContainerAccessibilityProps: headerContainerAccessibilityProps,
    locale,
    allDayEventCellStyle,
    allDayEventCellTextColor,
    allDayEvents: allDayEvents,
    allDayEventCellAccessibilityProps: allDayEventCellAccessibilityProps,
    onPressDateHeader: onPressDateHeader,
    activeDate,
    headerContentStyle: headerContentStyle,
    headerCellAccessibilityProps: headerCellAccessibilityProps,
    dayHeaderStyle: dayHeaderStyle,
    dayHeaderHighlightColor: dayHeaderHighlightColor,
    weekDayHeaderHighlightColor: weekDayHeaderHighlightColor,
    showAllDayEventCell: showAllDayEventCell,
    weekNumberPrefix: weekNumberPrefix,
    excludeSunday: excludeSunday,
  }

  if (mode === 'schedule') {
    return (
      <Schedule
        events={[...daytimeEvents, ...allDayEvents]}
        {...headerProps}
        style={bodyContainerStyle}
        containerHeight={height}
        eventCellStyle={eventCellStyle}
        calendarCellStyle={calendarCellStyle}
        calendarCellAccessibilityProps={calendarCellAccessibilityProps}
        hideNowIndicator={hideNowIndicator}
        overlapOffset={overlapOffset}
        scrollOffsetMinutes={scrollOffsetMinutes}
        ampm={ampm}
        showTime={showTime}
        onLongPressCell={onLongPressCell}
        onPressCell={onPressCell}
        onPressEvent={onPressEvent}
        onSwipeHorizontal={onSwipeHorizontal}
        renderEvent={renderEvent}
        headerComponent={headerComponent}
        headerComponentStyle={headerComponentStyle}
        hourStyle={hourStyle}
        isEventOrderingEnabled={isEventOrderingEnabled}
        showVerticalScrollIndicator={showVerticalScrollIndicator}
        itemSeparatorComponent={itemSeparatorComponent}
      />
    )
  }

  return (
    <React.Fragment>
      <HeaderComponent {...headerProps} />
      <CalendarBody
        {...commonProps}
        style={bodyContainerStyle}
        containerHeight={height}
        events={daytimeEvents}
        eventCellStyle={eventCellStyle}
        eventCellAccessibilityProps={eventCellAccessibilityProps}
        eventCellTextColor={eventCellTextColor}
        calendarCellStyle={calendarCellStyle}
        calendarCellAccessibilityProps={calendarCellAccessibilityProps}
        hideNowIndicator={hideNowIndicator}
        overlapOffset={overlapOffset}
        scrollOffsetMinutes={scrollOffsetMinutes}
        ampm={ampm}
        minHour={minHour}
        maxHour={maxHour}
        showTime={showTime}
        onLongPressCell={onLongPressCell}
        onPressCell={onPressCell}
        onPressEvent={onPressEvent}
        onSwipeHorizontal={onSwipeHorizontal}
        renderEvent={renderEvent}
        headerComponent={headerComponent}
        headerComponentStyle={headerComponentStyle}
        hourStyle={hourStyle}
        isEventOrderingEnabled={isEventOrderingEnabled}
        showVerticalScrollIndicator={showVerticalScrollIndicator}
        enrichedEventsByDate={enrichedEventsByDate}
        enableEnrichedEvents={enableEnrichedEvents}
        eventsAreSorted={eventsAreSorted}
        timeslots={timeslots}
        hourComponent={hourComponent}
        eventOverlapping={eventOverlapping}
        mode={mode}
      />
    </React.Fragment>
  )
}

export const CalendarContainer = typedMemo(_CalendarContainer)
