import dayjs from 'dayjs'
import * as React from 'react'
import {
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native'
import { CalendarEvent } from './CalendarEvent'
import { commonStyles } from './commonStyles'
import { DayJSConvertedEvent, Event, EventCellStyle, HorizontalDirection } from './interfaces'
import { formatHour, getRelativeTopInDay, hours, isToday } from './utils'

const SWIPE_THRESHOLD = 50

interface CalendarBodyProps<T> {
  containerHeight: number
  cellHeight: number
  dateRange: dayjs.Dayjs[]
  dayJsConvertedEvents: DayJSConvertedEvent[]
  style: ViewStyle
  onPressEvent?: (event: Event<T>) => void
  onPressCell?: (date: Date) => void
  eventCellStyle?: EventCellStyle<T>
  scrollOffsetMinutes: number
  showTime: boolean
  onSwipeHorizontal?: (d: HorizontalDirection) => void
}

interface WithCellHeight {
  cellHeight: number
}

const HourGuideColumn = React.memo(
  ({ cellHeight, hour }: WithCellHeight & { hour: number }) => (
    <View style={{ height: cellHeight }}>
      <Text style={commonStyles.guideText}>{formatHour(hour)}</Text>
    </View>
  ),
  () => true,
)

interface HourCellProps extends WithCellHeight {
  onPress: (d: dayjs.Dayjs) => void
  date: dayjs.Dayjs
  hour: number
}

const HourCell = React.memo(
  ({ cellHeight, onPress, date, hour }: HourCellProps) => (
    <TouchableWithoutFeedback onPress={() => onPress(date.hour(hour).minute(0))}>
      <View style={[commonStyles.dateCell, { height: cellHeight }]} />
    </TouchableWithoutFeedback>
  ),
  () => true,
)

export const CalendarBody = React.memo(
  ({
    containerHeight,
    cellHeight,
    dateRange,
    style = {},
    onPressCell,
    dayJsConvertedEvents,
    onPressEvent,
    eventCellStyle,
    showTime,
    scrollOffsetMinutes,
    onSwipeHorizontal,
  }: CalendarBodyProps<any>) => {
    const scrollView = React.useRef<ScrollView>(null)
    const [now, setNow] = React.useState(dayjs())
    const [panHandled, setPanHandled] = React.useState(false)

    React.useEffect(() => {
      if (scrollView.current && scrollOffsetMinutes) {
        // We add delay here to work correct on React Native
        // see: https://stackoverflow.com/questions/33208477/react-native-android-scrollview-scrollto-not-working
        setTimeout(
          () => {
            scrollView.current!.scrollTo({
              y: (cellHeight * scrollOffsetMinutes) / 60,
              animated: false,
            })
          },
          Platform.OS === 'web' ? 0 : 10,
        )
      }
    }, [scrollView.current])

    React.useEffect(() => {
      const pid = setInterval(() => setNow(dayjs()), 2 * 60 * 1000)
      return () => clearInterval(pid)
    }, [])

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

    const _onPressCell = React.useCallback(
      (date: dayjs.Dayjs) => {
        onPressCell && onPressCell(date.toDate())
      },
      [onPressCell],
    )

    return (
      <ScrollView
        style={[
          {
            height: containerHeight - cellHeight * 3,
          },
          style,
        ]}
        ref={scrollView}
        scrollEventThrottle={32}
        {...(Platform.OS !== 'web' ? panResponder.panHandlers : {})}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.body]} {...(Platform.OS === 'web' ? panResponder.panHandlers : {})}>
          <View style={[commonStyles.hourGuide]}>
            {hours.map((hour) => (
              <HourGuideColumn key={hour} cellHeight={cellHeight} hour={hour} />
            ))}
          </View>
          {dateRange.map((date) => (
            <View style={[{ flex: 1 }]} key={date.toString()}>
              {hours.map((hour) => (
                <HourCell
                  key={hour}
                  cellHeight={cellHeight}
                  date={date}
                  hour={hour}
                  onPress={_onPressCell}
                />
              ))}
              {dayJsConvertedEvents
                .filter(
                  ({ start, end }) =>
                    start.isAfter(date.startOf('day')) && end.isBefore(date.endOf('day')),
                )
                .map((event) => (
                  <CalendarEvent
                    key={event.start.toString()}
                    event={event}
                    onPressEvent={onPressEvent}
                    eventCellStyle={eventCellStyle}
                    showTime={showTime}
                  />
                ))}
              {isToday(date) && (
                <View style={[styles.nowIndicator, { top: `${getRelativeTopInDay(now)}%` }]} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    )
  },
)

const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
    flex: 1,
  },
  nowIndicator: {
    position: 'absolute',
    zIndex: 10000,
    backgroundColor: 'red',
    height: 2,
    width: '100%',
  },
})
