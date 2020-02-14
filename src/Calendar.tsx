import dayjs from 'dayjs'
import * as React from 'react'
import { PanResponder, View, ViewStyle } from 'react-native'
import { getDatesInWeek, getDatesInNextThreeDays, modeToNum } from './utils'
import { CalendarHeader } from './CalendarHeader'
import { CalendarBody } from './CalendarBody'
import { MIN_HEIGHT } from './commonStyles'
import { Event, EventCellStyle, Mode, WeekNum } from './interfaces'

interface CalendarProps<T = {}> {
  events: Event<T>[]
  onPressEvent?: (event: Event<T>) => void
  height: number
  mode: Mode
  style?: ViewStyle
  eventCellStyle?: EventCellStyle<T>
  scrollOffsetMinutes?: number
  date?: Date
  swipeEnabled?: boolean
  weekStartsOn: WeekNum
}

const SWIPE_THRESHOLD = 50

export function Calendar({
  events,
  style = {},
  height,
  mode = '3days',
  onPressEvent,
  eventCellStyle,
  scrollOffsetMinutes,
  date,
  swipeEnabled = true,
  weekStartsOn = 0,
}: CalendarProps) {
  const [targetDate, setTargetDate] = React.useState(dayjs(date))

  React.useEffect(() => {
    setTargetDate(dayjs(date))
  }, [date])

  const dayJsConvertedEvents = React.useMemo(
    () => events.map(e => ({ ...e, start: dayjs(e.start), end: dayjs(e.end) })),
    [events],
  )

  const dateRange = React.useMemo(() => {
    switch (mode) {
      case '3days':
        return getDatesInNextThreeDays(targetDate)
      case 'week':
        return getDatesInWeek(targetDate, weekStartsOn)
      default:
        throw new Error('undefined mode')
    }
  }, [mode, targetDate])

  const cellHeight = React.useMemo(() => Math.max(height - 30, MIN_HEIGHT) / 24, [height])

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, { dy, dx }) => {
          if (dy < -1 * SWIPE_THRESHOLD || SWIPE_THRESHOLD < dy) {
            return
          }
          if (dx < -1 * SWIPE_THRESHOLD) {
            setTargetDate(targetDate.add(modeToNum(mode), 'day'))
          }
          if (dx > SWIPE_THRESHOLD) {
            setTargetDate(targetDate.add(modeToNum(mode) * -1, 'day'))
          }
        },
      }),
    [targetDate],
  )

  const commonProps = {
    cellHeight,
    dateRange,
    style,
  }

  return (
    <View {...(swipeEnabled ? panResponder.panHandlers : {})}>
      <CalendarHeader {...commonProps} />
      <CalendarBody
        {...commonProps}
        dayJsConvertedEvents={dayJsConvertedEvents}
        containerHeight={height}
        onPressEvent={onPressEvent}
        eventCellStyle={eventCellStyle}
        scrollOffsetMinutes={scrollOffsetMinutes}
      />
    </View>
  )
}
