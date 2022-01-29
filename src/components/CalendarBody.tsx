import dayjs from 'dayjs'
import * as React from 'react'
import {
  Animated,
  LayoutRectangle,
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
  EventCellStyle,
  EventRenderer,
  HorizontalDirection,
  ICalendarEventBase,
  LayoutRectangleExtended,
} from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import {
  getCountOfEventsAtEvent,
  getOrderOfEvent,
  getRelativeTopInDay,
  hours,
  isToday,
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

interface CalendarBodyProps<T extends ICalendarEventBase> {
  cellHeight: number
  containerHeight: number
  dateRange: dayjs.Dayjs[][]
  events: T[]
  scrollOffsetMinutes: number
  ampm: boolean
  showTime: boolean
  style: ViewStyle
  eventCellStyle?: EventCellStyle<T>
  hideNowIndicator?: boolean
  overlapOffset?: number
  onPressCell?: (date: Date) => void
  onPressEvent?: (event: T) => void
  onSwipeHorizontal?: (d: HorizontalDirection) => void
  renderEvent?: EventRenderer<T>
  headerComponent?: React.ReactElement | null
  headerComponentStyle?: ViewStyle
  hourStyle?: TextStyle
  cellsBorderStyle?: ViewStyle
  fullBodyStyle?: ViewStyle
  increaseFirstRowHeight?: number
  animatePan?: boolean
  fadeAnim: Animated.Value
  presentFadeAnim: Animated.Value
  presentLeftValue: Animated.Value
  handleLeftValue: (layout: LayoutRectangleExtended) => void
}

function _CalendarBody<T extends ICalendarEventBase>({
  containerHeight,
  cellHeight,
  dateRange,
  style,
  onPressCell,
  events,
  onPressEvent,
  eventCellStyle,
  ampm,
  showTime,
  scrollOffsetMinutes,
  onSwipeHorizontal,
  hideNowIndicator,
  overlapOffset,
  renderEvent,
  headerComponent = null,
  headerComponentStyle = {},
  hourStyle = {},
  cellsBorderStyle = {},
  fullBodyStyle = {},
  increaseFirstRowHeight = 1,
  animatePan = false,
  fadeAnim,
  presentFadeAnim,
  presentLeftValue,
  handleLeftValue,
}: CalendarBodyProps<T>) {
  const scrollView = React.useRef<ScrollView>(null)
  const { now } = useNow(!hideNowIndicator)
  const leftValue = React.useRef<LayoutRectangleExtended | LayoutRectangle>()
  const currentPresentLeftVal = React.useRef<number>(0)

  React.useEffect(() => {
    const idpres = presentLeftValue.addListener((value) => {
      currentPresentLeftVal.current = value.value
    })
    return () => {
      presentLeftValue.removeListener(idpres)
    }
  }, [presentLeftValue])

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

  const _renderMappedEvent = (event: T) => (
    <CalendarEvent
      key={`${event.start}${event.title}${event.end}`}
      event={event}
      onPressEvent={onPressEvent}
      eventCellStyle={eventCellStyle}
      showTime={showTime}
      eventCount={getCountOfEventsAtEvent(event, events)}
      eventOrder={getOrderOfEvent(event, events)}
      overlapOffset={overlapOffset}
      renderEvent={renderEvent}
      ampm={ampm}
      newCellHeight={
        increaseFirstRowHeight !== 1
          ? ((cellHeight * increaseFirstRowHeight) /
              (cellHeight * 24 + cellHeight * increaseFirstRowHeight)) *
            100
          : 0
      }
    />
  )

  const theme = useTheme()

  return (
    <Animated.View
      style={[
        fullBodyStyle,
        animatePan === true
          ? {
              // Bind opacity to animated value
              opacity: fadeAnim,
            }
          : {},
      ]}
    >
      {headerComponent != null ? <View style={headerComponentStyle}>{headerComponent}</View> : null}
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
        nestedScrollEnabled
        contentOffset={Platform.OS === 'ios' ? { x: 0, y: scrollOffsetMinutes } : { x: 0, y: 0 }}
      >
        <View
          style={[u['flex-1'], theme.isRTL ? u['flex-row-reverse'] : u['flex-row']]}
          {...(Platform.OS === 'web' ? panResponder.panHandlers : {})}
        >
          <View style={[u['z-20'], u['w-50']]}>
            {increaseFirstRowHeight !== 1 ? (
              <HourGuideColumn
                key={'guide-col-1'}
                cellHeight={cellHeight * increaseFirstRowHeight}
                hour={-1}
                ampm={ampm}
                index={-1}
                hourStyle={hourStyle}
              />
            ) : null}
            {hours.map((hour, index) => (
              <HourGuideColumn
                key={hour}
                cellHeight={cellHeight}
                hour={hour}
                ampm={ampm}
                index={index}
                hourStyle={hourStyle}
              />
            ))}
          </View>
          <View
            style={[u['flex-1'], u['flex-row'], { position: 'relative' }]}
            onLayout={(event) => {
              const layout: LayoutRectangleExtended = { ...event.nativeEvent.layout }
              handleLeftValue(layout)
              leftValue.current = layout
            }}
          >
            {dateRange[1].map((date) => (
              <Animated.View
                style={[
                  u['flex-1'],
                  u['overflow-hidden'],
                  animatePan === true
                    ? {
                        transform: [{ translateX: presentLeftValue }],
                        opacity: presentFadeAnim,
                      }
                    : {},
                ]}
                key={date.toString()}
              >
                {increaseFirstRowHeight !== 1 ? (
                  <HourGuideCell
                    key={'guide-cel-1'}
                    cellHeight={cellHeight * increaseFirstRowHeight}
                    date={date}
                    hour={-1}
                    onPress={_onPressCell}
                    index={-1}
                    cellsBorderStyle={cellsBorderStyle}
                  />
                ) : null}
                {hours.map((hour, index) => (
                  <HourGuideCell
                    key={hour}
                    cellHeight={cellHeight}
                    date={date}
                    hour={hour}
                    onPress={_onPressCell}
                    index={index}
                    cellsBorderStyle={cellsBorderStyle}
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

                {isToday(date) && !hideNowIndicator && (
                  <View
                    style={[
                      styles.nowIndicator,
                      { backgroundColor: theme.palette.nowIndicator },
                      { top: `${getRelativeTopInDay(now)}%` },
                    ]}
                  />
                )}
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  )
}

export const CalendarBody = typedMemo(_CalendarBody)
