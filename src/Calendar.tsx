import dayjs from 'dayjs'
import React from 'react'
import { ViewStyle } from 'react-native'
import { CalendarBody } from './CalendarBody'
import { CalendarHeader } from './CalendarHeader'
import { MIN_HEIGHT } from './commonStyles'
import {
  DateRangeHandler,
  EventCellStyle,
  EventRenderer,
  HorizontalDirection,
  ICalendarEvent,
  Mode,
  WeekNum,
} from './interfaces'
import {
  getDatesInNextCustomDays,
  getDatesInNextOneDay,
  getDatesInNextThreeDays,
  getDatesInWeek,
  isAllDayEvent,
  modeToNum,
} from './utils'

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
      case '3days':
        return getDatesInNextThreeDays(targetDate, locale)
      case 'week':
        return getDatesInWeek(targetDate, weekStartsOn, locale)
      case 'day':
        return getDatesInNextOneDay(targetDate, locale)
      case 'custom':
        return getDatesInNextCustomDays(targetDate, weekStartsOn, weekEndsOn, locale)
      default:
        throw new Error('undefined mode')
    }
  }, [mode, targetDate])

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
        setTargetDate(targetDate.add(modeToNum(mode), 'day'))
      } else {
        setTargetDate(targetDate.add(modeToNum(mode) * -1, 'day'))
      }
    },
    [swipeEnabled, targetDate],
  )

  const commonProps = {
    cellHeight,
    dateRange,
    style,
    isRTL,
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

export const Calendar = React.memo(_Calendar)
