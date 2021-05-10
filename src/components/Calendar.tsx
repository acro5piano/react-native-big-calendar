import dayjs from 'dayjs'
import React from 'react'
import { ViewStyle } from 'react-native'

import { MIN_HEIGHT } from '../commonStyles'
import {
  DateRangeHandler,
  EventCellStyle,
  EventRenderer,
  HorizontalDirection,
  ICalendarEvent,
  Mode,
  WeekNum,
} from '../interfaces'
import {
  getDatesInMonth,
  getDatesInNextCustomDays,
  getDatesInNextOneDay,
  getDatesInNextThreeDays,
  getDatesInWeek,
  isAllDayEvent,
  modeToNum,
  typedMemo,
} from '../utils'
import { CalendarBody } from './CalendarBody'
import { CalendarBodyForMonthView } from './CalendarBodyForMonthView'
import { CalendarHeader } from './CalendarHeader'
import { CalendarHeaderForMonthView } from './CalendarHeaderForMonthView'

export interface CalendarProps<T> {
  events: ICalendarEvent<T>[]
  height: number
  overlapOffset?: number
  ampm?: boolean
  date?: Date
  eventCellStyle?: EventCellStyle<T>
  locale?: string
  hideNowIndicator?: boolean
  mode?: Mode
  scrollOffsetMinutes?: number
  showTime?: boolean
  style?: ViewStyle
  swipeEnabled?: boolean
  weekStartsOn?: WeekNum
  isRTL?: boolean
  onChangeDate?: DateRangeHandler
  onPressCell?: (date: Date) => void
  onPressDateHeader?: (date: Date) => void
  onPressEvent?: (event: ICalendarEvent<T>) => void
  renderEvent?: EventRenderer<T>
  weekEndsOn?: WeekNum
  maxVisibleEventCount?: number
}

function _Calendar<T>({
  events,
  height,
  ampm = false,
  date,
  eventCellStyle,
  locale = 'en',
  hideNowIndicator = false,
  mode = 'week',
  overlapOffset,
  scrollOffsetMinutes = 0,
  showTime = true,
  style = {},
  swipeEnabled = true,
  weekStartsOn = 0,
  isRTL = false,
  onChangeDate,
  onPressCell,
  onPressDateHeader,
  onPressEvent,
  renderEvent,
  weekEndsOn = 6,
  maxVisibleEventCount = 3,
}: CalendarProps<T>) {
  const [targetDate, setTargetDate] = React.useState(dayjs(date))

  React.useEffect(() => {
    if (date) {
      setTargetDate(dayjs(date))
    }
  }, [date])

  const allDayEvents = React.useMemo(
    () => events.filter((event) => isAllDayEvent(event.start, event.end)),
    [events],
  )

  const daytimeEvents = React.useMemo(
    () => events.filter((event) => !isAllDayEvent(event.start, event.end)),
    [events],
  )

  const dateRange = React.useMemo(() => {
    switch (mode) {
      case 'month':
        return getDatesInMonth(targetDate, locale)
      case 'week':
        return getDatesInWeek(targetDate, weekStartsOn, locale)
      case '3days':
        return getDatesInNextThreeDays(targetDate, locale)
      case 'day':
        return getDatesInNextOneDay(targetDate, locale)
      case 'custom':
        return getDatesInNextCustomDays(targetDate, weekStartsOn, weekEndsOn, locale)
      default:
        throw new Error('undefined mode')
    }
  }, [mode, targetDate, locale, weekEndsOn, weekStartsOn])

  React.useEffect(() => {
    if (onChangeDate) {
      onChangeDate([dateRange[0].toDate(), dateRange.slice(-1)[0].toDate()])
    }
  }, [dateRange, onChangeDate])

  const cellHeight = React.useMemo(() => Math.max(height - 30, MIN_HEIGHT) / 24, [height])

  const onSwipeHorizontal = React.useCallback(
    (direction: HorizontalDirection) => {
      if (!swipeEnabled) {
        return
      }
      if ((direction === 'LEFT' && !isRTL) || (direction === 'RIGHT' && isRTL)) {
        setTargetDate(targetDate.add(modeToNum(mode, targetDate), 'day'))
      } else {
        setTargetDate(targetDate.add(modeToNum(mode, targetDate) * -1, 'day'))
      }
    },
    [swipeEnabled, targetDate, mode, isRTL],
  )

  const commonProps = {
    cellHeight,
    dateRange,
    style,
    isRTL,
    mode,
  }

  if (mode === 'month') {
    return (
      <React.Fragment>
        <CalendarHeaderForMonthView locale={locale} isRTL={isRTL} weekStartsOn={weekStartsOn} />
        <CalendarBodyForMonthView<T>
          {...commonProps}
          containerHeight={height}
          events={daytimeEvents}
          eventCellStyle={eventCellStyle}
          weekStartsOn={weekStartsOn}
          hideNowIndicator={hideNowIndicator}
          onPressCell={onPressCell}
          onPressEvent={onPressEvent}
          onSwipeHorizontal={onSwipeHorizontal}
          renderEvent={renderEvent}
          targetDate={targetDate}
          maxVisibleEventCount={maxVisibleEventCount}
        />
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <CalendarHeader
        {...commonProps}
        allDayEvents={allDayEvents}
        onPressDateHeader={onPressDateHeader}
      />
      <CalendarBody
        {...commonProps}
        containerHeight={height}
        events={daytimeEvents}
        eventCellStyle={eventCellStyle}
        hideNowIndicator={hideNowIndicator}
        overlapOffset={overlapOffset}
        scrollOffsetMinutes={scrollOffsetMinutes}
        ampm={ampm}
        showTime={showTime}
        onPressCell={onPressCell}
        onPressEvent={onPressEvent}
        onSwipeHorizontal={onSwipeHorizontal}
        renderEvent={renderEvent}
      />
    </React.Fragment>
  )
}

export const Calendar = typedMemo(_Calendar)
