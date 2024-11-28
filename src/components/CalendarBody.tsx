import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import * as React from 'react'
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native'

import { dateCellStyle, guideTextStyle, u } from '../commonStyles'
import { useNow } from '../hooks/useNow'
import { usePanResponder } from '../hooks/usePanResponder'
import {
  EventCellStyle,
  EventRenderer,
  HorizontalDirection,
  HourNum,
  ICalendarEvent,
} from '../interfaces'
import {
  formatHour,
  getCountOfEventsAtEvent,
  getHours,
  getOrderOfEvent,
  getRelativeTopInDay,
  isToday,
  typedMemo,
} from '../utils'
import { CalendarEvent } from './CalendarEvent'

dayjs.extend(isBetween)

const styles = StyleSheet.create({
  nowIndicator: {
    position: 'absolute',
    zIndex: 10000,
    backgroundColor: 'red',
    height: 2,
    width: '100%',
  },
})

interface CalendarBodyProps<T> {
  cellHeight: number
  containerHeight: number
  dateRange: dayjs.Dayjs[]
  events: ICalendarEvent<T>[]
  scrollOffsetMinutes: number
  ampm: boolean
  showTime: boolean
  style: ViewStyle
  eventCellStyle?: EventCellStyle<T>
  hideNowIndicator?: boolean
  overlapOffset?: number
  isRTL: boolean
  dayStartsOn: HourNum
  dayEndsOn: HourNum
  extendDaysTimeWithEvents?: boolean
  onPressCell?: (date: Date) => void
  onLongPressCell?: (date: Date) => void
  onPressEvent?: (event: ICalendarEvent<T>) => void
  onSwipeHorizontal?: (d: HorizontalDirection) => void
  renderEvent?: EventRenderer<T>
}

interface WithCellHeight {
  cellHeight: number
}

const _HourGuideColumn = ({
  cellHeight,
  hour,
  ampm,
}: WithCellHeight & { hour: number; ampm: boolean }) => (
  <View testID="View Body 1" style={{ height: cellHeight }}>
    <Text testID="Text Body 1" style={guideTextStyle}>
      {formatHour(hour, ampm)}
    </Text>
  </View>
)

const HourGuideColumn = React.memo(_HourGuideColumn, () => true)

interface HourCellProps extends WithCellHeight {
  onPress: (d: dayjs.Dayjs) => void
  onLongPress: (d: dayjs.Dayjs) => void
  date: dayjs.Dayjs
  hour: number
}

const HourCell = ({ cellHeight, onPress, date, hour, onLongPress }: HourCellProps) => {
  return (
    <Pressable
      testID="Touchable Body 1"
      onPress={() => onPress(date.hour(hour).minute(0))}
      onLongPress={() => onLongPress(date.hour(hour).minute(0))}
    >
      <View testID="View Body 1" style={[dateCellStyle, { height: cellHeight }]} />
    </Pressable>
  )
}

function _CalendarBody<T>({
  containerHeight,
  cellHeight,
  dateRange,
  style = {},
  onPressCell,
  onLongPressCell,
  events,
  onPressEvent,
  eventCellStyle,
  ampm,
  showTime,
  scrollOffsetMinutes,
  onSwipeHorizontal,
  hideNowIndicator,
  overlapOffset,
  isRTL,
  dayStartsOn,
  dayEndsOn,
  renderEvent,
}: CalendarBodyProps<T>) {
  const scrollView = React.useRef<ScrollView>(null)
  const { now } = useNow(!hideNowIndicator)

  // const dayEnds = extendDaysTimeWithEvents ? buildLastHourFromEvents(dayEndsOn, extendDaysTimeWithEvents) : dayEndsOn;
  const hours = getHours(dayStartsOn, dayEndsOn)

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

  const _onLongPressCell = React.useCallback(
    (date: dayjs.Dayjs) => {
      onLongPressCell && onLongPressCell(date.toDate())
    },
    [onLongPressCell],
  )

  const _renderMappedEvent = (event: ICalendarEvent<T>) => (
    <CalendarEvent
      key={`${event.start}${event.title}`}
      event={event}
      dayStartsOn={dayStartsOn}
      dayEndsOn={dayEndsOn}
      onPressEvent={onPressEvent}
      eventCellStyle={eventCellStyle}
      showTime={showTime}
      eventCount={getCountOfEventsAtEvent(event, events)}
      eventOrder={getOrderOfEvent(event, events)}
      overlapOffset={overlapOffset}
      renderEvent={renderEvent}
    />
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
      nestedScrollEnabled
      contentOffset={Platform.OS === 'ios' ? { x: 0, y: scrollOffsetMinutes } : { x: 0, y: 0 }}
    >
      <View
        style={[u['flex-1'], isRTL ? u['flex-row-reverse'] : u['flex-row']]}
        {...(Platform.OS === 'web' ? panResponder.panHandlers : {})}
      >
        <View style={[u['bg-white'], u['z-20'], u['w-50']]}>
          {hours.map((hour) => (
            <HourGuideColumn key={hour} cellHeight={cellHeight} hour={hour} ampm={ampm} />
          ))}
        </View>
        {dateRange.map((date) => (
          <View style={[u['flex-1'], u['overflow-hidden']]} key={date.toString()}>
            {hours.map((hour) => (
              <HourCell
                key={hour}
                cellHeight={cellHeight}
                date={date}
                hour={hour}
                onPress={_onPressCell}
                onLongPress={_onLongPressCell}
              />
            ))}
            {events
              .filter(({ start }) =>
                dayjs(start).isBetween(date.startOf('day'), date.endOf('day'), null, '[)'),
              )
              .map(_renderMappedEvent)}
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
                  {
                    top: `${getRelativeTopInDay(now, dayStartsOn, dayEndsOn)}%`,
                  },
                ]}
              />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export const CalendarBody = typedMemo(_CalendarBody)
