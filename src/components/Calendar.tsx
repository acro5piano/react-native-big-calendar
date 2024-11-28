import 'dayjs/locale/de'
import 'dayjs/locale/es'
import 'dayjs/locale/fr'
import 'dayjs/locale/pt'

import dayjs from 'dayjs'
import React from 'react'
import { ViewStyle } from 'react-native'

import {
  DateRangeHandler,
  EventCellStyle,
  EventRenderer,
  HorizontalDirection,
  HourNum,
  ICalendarEvent,
  Mode,
  WeekNum,
} from '../interfaces'
import { getDateRangeFromDate, isAllDayEvent, modeToNum, typedMemo } from '../utils'
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
  dayStartsOn?: HourNum
  dayEndsOn?: HourNum
  extendDaysTimeWithEvents?: boolean
  isRTL?: boolean
  onChangeDate?: DateRangeHandler
  onSwipeChangeDate?: DateRangeHandler
  onPressCell?: (date: Date) => void
  onLongPressCell?: (date: Date) => void
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
  dayStartsOn = 0,
  dayEndsOn = 23,
  extendDaysTimeWithEvents = false,
  isRTL = false,
  onChangeDate,
  onSwipeChangeDate,
  onPressCell,
  onLongPressCell,
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
    () => events.filter((event) => event.isAllDayEvent || isAllDayEvent(event.start, event.end)),
    [events],
  )

  const daytimeEvents = React.useMemo(
    () => events.filter((event) => !isAllDayEvent(event.start, event.end)),
    [events],
  )

  const dateRange = React.useMemo(() => {
    return getDateRangeFromDate(mode, targetDate, locale, weekEndsOn, weekStartsOn)
  }, [mode, targetDate, locale, weekEndsOn, weekStartsOn])

  React.useEffect(() => {
    if (onChangeDate) {
      onChangeDate([dateRange[0].toDate(), dateRange.slice(-1)[0].toDate()])
    }
  }, [dateRange, onChangeDate])

  const hoursRange = dayEndsOn - dayStartsOn + 1
  const viewHeight = hoursRange * 50

  const cellHeight = React.useMemo(
    () => Math.max(height - 30, viewHeight) / hoursRange,
    [height, hoursRange, viewHeight],
  )

  const onSwipeHorizontal = React.useCallback(
    (direction: HorizontalDirection) => {
      if (!swipeEnabled) {
        return
      }

      let newTargetDate

      if ((direction === 'LEFT' && !isRTL) || (direction === 'RIGHT' && isRTL)) {
        newTargetDate = targetDate.add(modeToNum(mode, targetDate), 'day')
      } else {
        newTargetDate = targetDate.add(modeToNum(mode, targetDate) * -1, 'day')
      }

      setTargetDate(newTargetDate)

      if (onSwipeChangeDate) {
        const dateRange = getDateRangeFromDate(
          mode,
          newTargetDate,
          locale,
          weekEndsOn,
          weekStartsOn,
        )
        onSwipeChangeDate([dateRange[0].toDate(), dateRange.slice(-1)[0].toDate()])
      }
    },
    [swipeEnabled, targetDate, mode, isRTL, locale, weekEndsOn, weekStartsOn, onSwipeChangeDate],
  )

  const commonProps = {
    cellHeight,
    dateRange,
    dayStartsOn,
    dayEndsOn,
    extendDaysTimeWithEvents,
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
          onLongPressCell={onLongPressCell}
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
        onLongPressCell={onLongPressCell}
        onPressEvent={onPressEvent}
        onSwipeHorizontal={onSwipeHorizontal}
        renderEvent={renderEvent}
      />
    </React.Fragment>
  )
}

export const Calendar = typedMemo(_Calendar)
