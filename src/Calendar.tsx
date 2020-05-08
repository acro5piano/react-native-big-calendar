import dayjs from 'dayjs'
import * as React from 'react'
import { PanResponder, ViewStyle } from 'react-native'
import { CalendarBody } from './CalendarBody'
import { CalendarHeader } from './CalendarHeader'
import { MIN_HEIGHT } from './commonStyles'
import { Event, EventCellStyle, Mode, WeekNum } from './interfaces'
import { getDatesInNextThreeDays, getDatesInWeek, isAllDayEvent, modeToNum } from './utils'

interface CalendarProps<T = {}> {
  events: Event<T>[]
  height: number
  onPressEvent?: (event: Event<T>) => void
  onChangeDate?: ([start, end]: [Date, Date]) => void
  mode?: Mode
  style?: ViewStyle
  eventCellStyle?: EventCellStyle<T>
  scrollOffsetMinutes?: number
  date?: Date
  swipeEnabled?: boolean
  showTime?: boolean
  weekStartsOn?: WeekNum
  locale?: string
}

const SWIPE_THRESHOLD = 50

export const Calendar = React.memo(
  ({
    events,
    style = {},
    height,
    mode = 'week',
    locale = 'en',
    onPressEvent,
    onChangeDate,
    eventCellStyle,
    date,
    scrollOffsetMinutes = 0,
    swipeEnabled = true,
    weekStartsOn = 0,
    showTime = true,
  }: CalendarProps) => {
    const [targetDate, setTargetDate] = React.useState(dayjs(date))
    const [panHandled, setPanHandled] = React.useState(false)

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

    const panResponder = React.useMemo(
      () =>
        PanResponder.create({
          // see https://stackoverflow.com/questions/47568850/touchableopacity-with-parent-panresponder
          onMoveShouldSetPanResponder: (_, { dx, dy }) => {
            return dx > 2 || dx < -2 || dy > 2 || dy < -2
          },
          onPanResponderMove: (_, { dy, dx }) => {
            if (dy < -1 * SWIPE_THRESHOLD || SWIPE_THRESHOLD < dy || panHandled) {
              return
            }
            if (dx < -1 * SWIPE_THRESHOLD) {
              setTargetDate(targetDate.add(modeToNum(mode), 'day'))
              setPanHandled(true)
            }
            if (dx > SWIPE_THRESHOLD) {
              setTargetDate(targetDate.add(modeToNum(mode) * -1, 'day'))
              setPanHandled(true)
            }
          },
          onPanResponderEnd: () => {
            setPanHandled(false)
          },
        }),
      [targetDate, panHandled],
    )

    const commonProps = {
      cellHeight,
      dateRange,
      style,
    }

    return (
      <>
        <CalendarHeader {...commonProps} allDayEvents={allDayEvents} />
        <CalendarBody
          {...commonProps}
          dayJsConvertedEvents={daytimeEvents}
          containerHeight={height}
          onPressEvent={onPressEvent}
          eventCellStyle={eventCellStyle}
          scrollOffsetMinutes={scrollOffsetMinutes}
          showTime={showTime}
          panHandlers={swipeEnabled ? panResponder.panHandlers : undefined}
        />
      </>
    )
  },
)
