import dayjs from 'dayjs'
import * as React from 'react'
import { ViewStyle } from 'react-native'
import { CalendarBody } from './CalendarBody'
import { CalendarHeader } from './CalendarHeader'
import { MIN_HEIGHT } from './commonStyles'
import {
  DateRangeHandler,
  Event,
  EventCellStyle,
  HorizontalDirection,
  Mode,
  WeekNum,
} from './interfaces'
import {
  getDatesInNextOneDay,
  getDatesInNextThreeDays,
  getDatesInWeek,
  isAllDayEvent,
  modeToNum,
} from './utils'

interface CalendarProps<T = {}> {
  events: Event<T>[]
  height: number
  mode?: Mode
  style?: ViewStyle
  eventCellStyle?: EventCellStyle<T>
  scrollOffsetMinutes?: number
  date?: Date
  swipeEnabled?: boolean
  showTime?: boolean
  weekStartsOn?: WeekNum
  locale?: string
  onChangeDate?: DateRangeHandler
  onPressEvent?: (event: Event<T>) => void
  onPressDateHeader?: (date: Date) => void
  onPressCell?: (date: Date) => void
}

export const Calendar = React.memo(
  ({
    events,
    style = {},
    height,
    mode = 'week',
    locale = 'en',
    eventCellStyle,
    date,
    scrollOffsetMinutes = 0,
    swipeEnabled = true,
    weekStartsOn = 0,
    showTime = true,
    onPressEvent,
    onPressDateHeader,
    onChangeDate,
    onPressCell,
  }: CalendarProps) => {
    const [targetDate, setTargetDate] = React.useState(dayjs(date))

    React.useEffect(() => {
      if (date) {
        setTargetDate(dayjs(date))
      }
    }, [date])

    const dayJsConvertedEvents = React.useMemo(
      () => events.map((e) => ({ ...e, start: dayjs(e.start), end: dayjs(e.end) })),
      [events],
    )

    const allDayEvents = React.useMemo(() => dayJsConvertedEvents.filter(isAllDayEvent), [
      dayJsConvertedEvents,
    ])

    const daytimeEvents = React.useMemo(
      () => dayJsConvertedEvents.filter((x) => !isAllDayEvent(x)),
      [dayJsConvertedEvents],
    )

    const dateRange = React.useMemo(() => {
      switch (mode) {
        case '3days':
          return getDatesInNextThreeDays(targetDate, locale)
        case 'week':
          return getDatesInWeek(targetDate, weekStartsOn, locale)
        case 'day':
          return getDatesInNextOneDay(targetDate, locale)
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
        if (direction === 'LEFT') {
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
    }

    return (
      <>
        <CalendarHeader
          {...commonProps}
          allDayEvents={allDayEvents}
          onPressDateHeader={onPressDateHeader}
        />
        <CalendarBody
          {...commonProps}
          dayJsConvertedEvents={daytimeEvents}
          containerHeight={height}
          onPressEvent={onPressEvent}
          onPressCell={onPressCell}
          eventCellStyle={eventCellStyle}
          scrollOffsetMinutes={scrollOffsetMinutes}
          showTime={showTime}
          onSwipeHorizontal={onSwipeHorizontal}
        />
      </>
    )
  },
)
