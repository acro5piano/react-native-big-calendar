import dayjs from 'dayjs'
import * as React from 'react'
import {
  Dimensions,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native'
import { CalendarEvent } from './CalendarEvent'
import { commonStyles, HOUR_GUIDE_WIDTH } from './commonStyles'
import {
  DateRangeHandler,
  DayJSConvertedEvent,
  Event,
  EventCellStyle,
  HorizontalDirection,
} from './interfaces'
import { formatHour, getRelativeTopInDay, hours, isToday } from './utils'

const SWIPE_THRESHOLD = 50

interface CalendarBodyProps<T> {
  containerHeight: number
  cellHeight: number
  dateRange: dayjs.Dayjs[]
  dayJsConvertedEvents: DayJSConvertedEvent[]
  style: ViewStyle
  onPressEvent?: (event: Event<T>) => void
  onSelectSlot?: DateRangeHandler
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

const HourCell = React.memo(
  ({ cellHeight }: WithCellHeight) => (
    <View style={[commonStyles.dateCell, { height: cellHeight }]} />
  ),
  () => true,
)

interface SelectingSlotProps extends WithCellHeight {
  marginTop: number
  marginLeft: number
  width: number
}

const SelectingSlot = React.memo(
  ({ cellHeight, marginTop, marginLeft, width }: WithCellHeight & SelectingSlotProps) => (
    <View
      style={[
        commonStyles.eventCell,
        { left: 0, height: cellHeight, marginTop, marginLeft, width },
      ]}
    />
  ),
)

export const CalendarBody = React.memo(
  ({
    containerHeight,
    cellHeight,
    dateRange,
    style = {},
    onSelectSlot,
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
    const [showSelectingSlot, setShowSelectingSlot] = React.useState(false)
    const [scrollHeight, setScrollHeight] = React.useState(0)
    const [y0, setY0] = React.useState(0)
    const [x0, setX0] = React.useState(0)
    const [moveY, setMoveY] = React.useState(0)
    const [calendarWidth, setCalendarWidth] = React.useState(0)

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

    // const _onSelectSlot = React.useCallback(
    //   ([start, end]: dayjs.Dayjs[]) => {
    //     console.log([start, end])
    //   },
    //   [onSelectSlot],
    // )

    const onScroll = React.useCallback((e: any) => {
      setScrollHeight(e.nativeEvent.contentOffset.y)
    }, [])

    const panResponder = React.useMemo(
      () =>
        PanResponder.create({
          // see https://stackoverflow.com/questions/47568850/touchableopacity-with-parent-panresponder
          onMoveShouldSetPanResponder: (_, { dx, dy }) => {
            return dx > 2 || dx < -2 || dy > 2 || dy < -2
          },
          onPanResponderMove: (_, { dy, dx, y0, x0, moveY }) => {
            if (onSelectSlot) {
              if (dy > 10 && Dimensions.get('window').width > 768) {
                setShowSelectingSlot(true)
                setY0(y0)
                setX0(x0)
                setMoveY(moveY)
              }
            }
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
            setShowSelectingSlot(false)
          },
        }),
      [panHandled, onSwipeHorizontal],
    )

    console.log(x0 - HOUR_GUIDE_WIDTH)
    return (
      <ScrollView
        style={[{ height: containerHeight - cellHeight * 3 }, style]}
        ref={scrollView}
        onScroll={onScroll}
        {...(Platform.OS !== 'web' ? panResponder.panHandlers : {})}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={(_, x) => setCalendarWidth(x)}
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
                <HourCell key={hour} cellHeight={cellHeight} />
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
        {showSelectingSlot && (
          <SelectingSlot
            cellHeight={Math.abs(moveY - y0)}
            marginTop={scrollHeight + y0 - cellHeight * 2}
            marginLeft={x0 - HOUR_GUIDE_WIDTH}
            width={(calendarWidth - HOUR_GUIDE_WIDTH * 2) / dateRange.length}
          />
        )}
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
