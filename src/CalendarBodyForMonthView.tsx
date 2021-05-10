import calendarize from 'calendarize'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import * as React from 'react'
import { PanResponder, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import { CalendarEventForMonthView } from './CalendarEventForMonthView'
import { u } from './commonStyles'
import {
  EventCellStyle,
  EventRenderer,
  HorizontalDirection,
  ICalendarEvent,
  WeekNum,
} from './interfaces'
import { Color } from './theme'
import { typedMemo } from './utils'

dayjs.extend(isBetween)
const SWIPE_THRESHOLD = 50

interface CalendarBodyForMonthViewProps<T> {
  containerHeight: number
  targetDate: dayjs.Dayjs
  events: ICalendarEvent<T>[]
  style: ViewStyle
  eventCellStyle?: EventCellStyle<T>
  hideNowIndicator?: boolean
  isRTL: boolean
  onPressCell?: (date: Date) => void
  onPressEvent?: (event: ICalendarEvent<T>) => void
  onSwipeHorizontal?: (d: HorizontalDirection) => void
  renderEvent?: EventRenderer<T>
  maxVisibleEventCount: number
  weekStartsOn: WeekNum
}

function _CalendarBodyForMonthView<T>({
  containerHeight,
  targetDate,
  style = {},
  onPressCell,
  events,
  onPressEvent,
  eventCellStyle,
  onSwipeHorizontal,
  hideNowIndicator,
  isRTL,
  renderEvent,
  maxVisibleEventCount,
  weekStartsOn,
}: CalendarBodyForMonthViewProps<T>) {
  const [now, setNow] = React.useState(dayjs())
  const [panHandled, setPanHandled] = React.useState(false)

  // TODO: add `useNow` hook
  React.useEffect(() => {
    if (hideNowIndicator) {
      return () => {}
    }
    const pid = setInterval(() => setNow(dayjs()), 2 * 60 * 1000)
    return () => clearInterval(pid)
  }, [])

  // TODO: add custom hook for this
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
            onSwipeHorizontal && onSwipeHorizontal('LEFT')
            setPanHandled(true)
            return
          }
          if (dx > SWIPE_THRESHOLD) {
            onSwipeHorizontal && onSwipeHorizontal('RIGHT')
            setPanHandled(true)
            return
          }
        },
        onPanResponderEnd: () => {
          setPanHandled(false)
        },
      }),
    [panHandled, onSwipeHorizontal],
  )

  const weeks = calendarize(now.toDate(), weekStartsOn)

  const cellHeight = containerHeight / 6 - 30

  return (
    <View
      style={[
        {
          height: containerHeight,
        },
        u['flex-column'],
        u['flex-1'],
        style,
      ]}
      {...panResponder.panHandlers}
    >
      {weeks.map((week, i) => (
        <View
          key={i}
          style={[
            u['flex-1'],
            isRTL ? u['flex-row-reverse'] : u['flex-row'],
            { height: cellHeight },
          ]}
        >
          {week
            .map((d) => (d > 0 ? targetDate.date(d) : null))
            .map((date, ii) => (
              <TouchableOpacity
                onPress={() => date && onPressCell && onPressCell(date.toDate())}
                style={[
                  i > 0 && u['border-t'],
                  isRTL && ii > 0 && u['border-r'],
                  !isRTL && ii > 0 && u['border-l'],
                  u['border-gray-200'],
                  u['p-8'],
                  u['flex-1'],
                  { height: cellHeight },
                ]}
                key={ii}
              >
                <Text
                  style={[
                    { textAlign: 'center' },
                    date &&
                      date.format('YYYY-MM-DD') === targetDate.format('YYYY-MM-DD') && {
                        color: Color.primary,
                      },
                  ]}
                >
                  {date && date.format('D')}
                </Text>
                {date &&
                  events
                    .filter(({ start }) =>
                      dayjs(start).isBetween(date.startOf('day'), date.endOf('day'), null, '[)'),
                    )
                    .reduce(
                      (elements, event, index, events) => [
                        ...elements,
                        index > maxVisibleEventCount - 1 ? (
                          <Text style={{ fontSize: 11, marginTop: 2, fontWeight: 'bold' }}>
                            {events.length - 3} More
                          </Text>
                        ) : (
                          <CalendarEventForMonthView
                            event={event}
                            eventCellStyle={eventCellStyle}
                            onPressEvent={onPressEvent}
                            renderEvent={renderEvent}
                          />
                        ),
                      ],
                      [] as JSX.Element[],
                    )}
              </TouchableOpacity>
            ))}
        </View>
      ))}
    </View>
  )
}

export const CalendarBodyForMonthView = typedMemo(_CalendarBodyForMonthView)
