import dayjs from 'dayjs'
import * as React from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

import { u } from '../commonStyles'
import { useNow } from '../hooks/useNow'
import { usePanResponder } from '../hooks/usePanResponder'
import {
  CalendarCellStyle,
  CalendarEventGestureCallback,
  EventCellStyle,
  EventRenderer,
  HorizontalDirection,
  HourNum,
  ICalendarEventBase,
} from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import {
  getCountOfEventsAtEvent,
  getOrderOfEvent,
  getRelativeTopInDay,
  hours,
  typedMemo,
} from '../utils'
import { CalendarEvent } from './CalendarEvent'
import { HourGuideCell } from './HourGuideCell'
import { HourGuideColumn } from './HourGuideColumn'

const styles = StyleSheet.create({
  nowIndicator: {
    position: 'absolute',
    zIndex: 10000,
    height: 2,
    width: '100%',
  },
})

export const widthContext = React.createContext(400)

interface CalendarBodyProps<T extends ICalendarEventBase> {
  cellHeight: number
  containerHeight: number
  dateRange: dayjs.Dayjs[]
  events: T[]
  scrollOffsetMinutes: number
  ampm: boolean
  showTime: boolean
  style: ViewStyle
  eventCellStyle?: EventCellStyle<T>
  calendarCellStyle?: CalendarCellStyle
  hideNowIndicator?: boolean
  overlapOffset?: number
  onPressCell?: (date: Date) => void
  onPressEvent?: (event: T) => void
  onSwipeHorizontal?: (d: HorizontalDirection) => void
  renderEvent?: EventRenderer<T>
  headerComponent?: React.ReactElement | null
  headerComponentStyle?: ViewStyle
  hourStyle?: TextStyle
  dragEndCallback: CalendarEventGestureCallback
  disableDrag?: boolean
  /** The default value is 'low'. **/
  dragPrecision: 'low' | 'medium' | 'high'
  minHour?: HourNum
  /** The maxHour prop will only be applied if maxHour - minHour is greater or equal to 6 otherwise the default value will be 24 that is qual to midnight (00:00) */
  maxHour?: HourNum
}

function _CalendarBody<T extends ICalendarEventBase>({
  containerHeight,
  cellHeight,
  dateRange,
  style,
  onPressCell,
  events: _events,
  onPressEvent,
  eventCellStyle,
  calendarCellStyle,
  ampm,
  showTime,
  scrollOffsetMinutes: _scrollOffsetMinutes,
  onSwipeHorizontal,
  hideNowIndicator,
  overlapOffset,
  renderEvent,
  headerComponent = null,
  headerComponentStyle = {},
  hourStyle = {},
  dragEndCallback,
  disableDrag,
  dragPrecision,
  minHour = 0,
  maxHour: _maxHour = 23.5,
}: CalendarBodyProps<T>) {
  const scrollView = React.useRef<ScrollView>(null)
  const { now } = useNow(!hideNowIndicator)
  const layoutProps = React.useRef({ x: 0, y: 0, width: 500, height: 1000 })
  const [calculatedWidth, setCalculatedWidth] = React.useState(400)
  const [isMoving, setIsMoving] = React.useState<boolean>(false)
  const [movingEvent, setMovingEvent] = React.useState<any>()

  const maxHour: number = _maxHour - minHour >= 6 ? _maxHour : 24

  var events = movingEvent && isMoving ? [..._events, movingEvent] : _events
  events = events.filter(
    ({ start, end }: { start: Date; end: Date }) =>
      start.getHours() >= minHour && end.getHours() <= maxHour,
  )

  const scrollOffsetMinutes = minHour ? minHour * 2 * 60 : _scrollOffsetMinutes

  React.useEffect(() => {
    if (scrollView.current && scrollOffsetMinutes && Platform.OS !== 'ios') {
      // We add delay here to work correct on React Native
      // see: https://stackoverflow.com/questions/33208477/react-native-android-scrollview-scrollto-not-working
      setTimeout(
        () => {
          if (scrollView && scrollView.current) {
            scrollView.current.scrollTo({
              y: (cellHeight * scrollOffsetMinutes) / 60,
              animated: false,
            })
          }
        },
        Platform.OS === 'web' ? 0 : 10,
      )
    }
  }, [scrollView, scrollOffsetMinutes, cellHeight])

  const panResponder = usePanResponder({
    onSwipeHorizontal,
  })

  const _onPressCell = React.useCallback(
    (date: dayjs.Dayjs) => {
      onPressCell && onPressCell(date.toDate())
    },
    [onPressCell],
  )

  const setViewOffset = (x: number, y: number, width: number, height: number) => {
    layoutProps.current = { x, y, width, height }
  }

  const _renderMappedEvent = (event: any) => (
    <CalendarEvent
      key={`${event?.moving}${event.start}${event.title}${event.end}`}
      event={event}
      cellHeight={cellHeight}
      disableDrag={disableDrag}
      onPressEvent={onPressEvent}
      eventCellStyle={eventCellStyle}
      showTime={showTime}
      eventCount={getCountOfEventsAtEvent(event, events)}
      eventOrder={getOrderOfEvent(event, events)}
      overlapOffset={overlapOffset}
      renderEvent={renderEvent}
      ampm={ampm}
      moveCallback={(data: any) => {
        if (data.day !== 0 || data.hour !== 0) {
          const hoursValueOf = data.hour * 3.6e6
          var start = new Date(data.event.start.toISOString())
          start.setDate(start.getDate() + data.day)
          start = new Date(start.valueOf() + hoursValueOf)
          var end = new Date(data.event.end.toISOString())
          end.setDate(end.getDate() + data.day)
          end = new Date(end.valueOf() + hoursValueOf)
          setMovingEvent({ ...data.event, start, end, moving: true })
        } else {
          setMovingEvent(null)
        }
      }}
      isMovingCallback={(isMoving: boolean) => setIsMoving(isMoving)}
      dragEndCallback={dragEndCallback}
      dragPrecision={dragPrecision}
    />
  )

  const onScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const maxScrollOffset = cellHeight * (maxHour - minHour + 1) * 2
      const minScrollOffset = cellHeight * minHour * 2
      if (e.nativeEvent.contentOffset.y > maxScrollOffset) {
        scrollView?.current?.scrollTo({
          y: maxScrollOffset,
          animated: false,
        })
      } else if (e.nativeEvent.contentOffset.y < minScrollOffset) {
        scrollView?.current?.scrollTo({
          y: minScrollOffset,
          animated: false,
        })
      }
    },
    [cellHeight, minHour, maxHour],
  )

  const theme = useTheme()

  return (
    <widthContext.Provider value={calculatedWidth}>
      {headerComponent != null ? <View style={headerComponentStyle}>{headerComponent}</View> : null}
      <ScrollView
        onLayout={(event) => {
          var { x, y, width, height } = event.nativeEvent.layout
          setViewOffset(x, y, width, height)
          setCalculatedWidth(width)
        }}
        style={[
          {
            height: containerHeight - cellHeight * 3,
          },
          style,
        ]}
        ref={scrollView}
        scrollEventThrottle={10}
        {...(Platform.OS !== 'web' ? (disableDrag ? panResponder.panHandlers : {}) : {})}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={!isMoving}
        scrollEnabled={!isMoving}
        alwaysBounceVertical={false}
        bounces={false}
        decelerationRate={'fast'}
        onScroll={onScroll}
        contentOffset={Platform.OS === 'ios' ? { x: 0, y: scrollOffsetMinutes } : { x: 0, y: 0 }}
      >
        <View
          style={[u['flex-1'], theme.isRTL ? u['flex-row-reverse'] : u['flex-row']]}
          {...(Platform.OS === 'web' ? (disableDrag ? panResponder.panHandlers : {}) : {})}
        >
          <View style={[u['z-20'], u['w-50']]}>
            {hours.map((hour) => (
              <HourGuideColumn
                key={hour}
                cellHeight={cellHeight}
                hour={hour}
                ampm={ampm}
                hourStyle={hourStyle}
              />
            ))}
          </View>
          {!hideNowIndicator && (
            <View
              style={[
                styles.nowIndicator,
                { backgroundColor: theme.palette.nowIndicator },
                { top: `${getRelativeTopInDay(now)}%` },
              ]}
            />
          )}
          {dateRange.map((date) => (
            <View style={[u['flex-1'], u['overflow-hidden']]} key={date.toString()}>
              {hours.map((hour, index) => (
                <HourGuideCell
                  key={hour}
                  cellHeight={cellHeight}
                  date={date}
                  hour={hour}
                  onPress={_onPressCell}
                  index={index}
                  calendarCellStyle={calendarCellStyle}
                />
              ))}

              {/* Render events of this date */}
              {/* M  T  (W)  T  F  S  S */}
              {/*       S-E             */}
              {events
                .filter(({ start }) =>
                  dayjs(start).isBetween(date.startOf('day'), date.endOf('day'), null, '[)'),
                )
                .map(_renderMappedEvent)}

              {/* Render events which starts before this date and ends on this date */}
              {/* M  T  (W)  T  F  S  S */}
              {/* S------E              */}
              {events
                .filter(
                  ({ start, end }) =>
                    dayjs(start).isBefore(date.startOf('day')) &&
                    dayjs(end).isBetween(date.startOf('day'), date.endOf('day'), null, '[)'),
                )
                .map((event) => ({
                  ...event,
                  start: dayjs(event.end).startOf('day'),
                }))
                .map(_renderMappedEvent)}

              {/* Render events which starts before this date and ends after this date */}
              {/* M  T  (W)  T  F  S  S */}
              {/*    S-------E          */}
              {events
                .filter(
                  ({ start, end }) =>
                    dayjs(start).isBefore(date.startOf('day')) &&
                    dayjs(end).isAfter(date.endOf('day')),
                )
                .map((event) => ({
                  ...event,
                  start: dayjs(event.end).startOf('day'),
                  end: dayjs(event.end).endOf('day'),
                }))
                .map(_renderMappedEvent)}
            </View>
          ))}
        </View>
      </ScrollView>
    </widthContext.Provider>
  )
}

export const CalendarBody = typedMemo(_CalendarBody)
