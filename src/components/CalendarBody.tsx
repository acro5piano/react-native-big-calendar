import dayjs from 'dayjs'
import * as React from 'react'
import { Platform, ScrollView, StyleSheet, View, ViewStyle } from 'react-native'

import { u } from '../commonStyles'
import { useNow } from '../hooks/useNow'
import { usePanResponder } from '../hooks/usePanResponder'
import { EventCellStyle, EventRenderer, HorizontalDirection, ICalendarEvent } from '../interfaces'
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

const EventPositioned = React.memo(({ events = [], renderMappedEvent = () => {} }) => {
  if (events?.length <= 0) return <View />;
  return events.map(renderMappedEvent);
});

interface CalendarBodyProps<T> {
  cellHeight: number
  containerHeight: number
  dateRange: dayjs.Dayjs[]
  events: ICalendarEvent<T>[]
  scrollOffsetMinutes: number
  delayScrollOffsetMinutes?: number
  animationScrollTo: boolean
  ampm: boolean
  showTime: boolean
  style: ViewStyle
  eventCellStyle?: EventCellStyle<T>
  hideNowIndicator?: boolean
  overlapOffset?: number
  onPressCell?: (date: Date) => void
  onPressEvent?: (event: ICalendarEvent<T>) => void
  onSwipeHorizontal?: (d: HorizontalDirection) => void
  renderEvent?: EventRenderer<T>
  todayHighlight?: boolean
  onlyDuringDay: boolean
  slotDuration: number
}

function _CalendarBody<T>({
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
  delayScrollOffsetMinutes,
  animationScrollTo,
  onSwipeHorizontal,
  hideNowIndicator,
  overlapOffset,
  renderEvent,
  todayHighlight,
  onlyDuringDay = true,
  slotDuration
}: CalendarBodyProps<T>) {
  const scrollView = React.useRef<ScrollView>(null)
  const { now } = useNow(!hideNowIndicator)

  const [cellWidth, setCellWidth] = React.useState(0);

  React.useEffect(() => {
    let timeout: any;
    if (scrollView.current && scrollOffsetMinutes) { //  && Platform.OS !== 'ios' is IOS use contentOffset below but not animation
      // We add delay here to work correct on React Native
      // see: https://stackoverflow.com/questions/33208477/react-native-android-scrollview-scrollto-not-working
      timeout =  setTimeout(
        () => {
          if (scrollView && scrollView.current) {
            scrollView.current.scrollTo({
              x: 0,
              y: (cellHeight * scrollOffsetMinutes) / 60,
              animated: animationScrollTo,
            })
          }
        },
        Platform.OS === 'web' ? 0 : delayScrollOffsetMinutes ?? 500,
      )
    }

    return () => {
      clearTimeout(timeout);
    }
  }, [scrollView, scrollOffsetMinutes, cellHeight, dateRange])


  const panResponder = usePanResponder({
    onSwipeHorizontal,
  })

  const _onPressCell = React.useCallback(
    (date: dayjs.Dayjs) => {
      onPressCell && onPressCell(date.toDate())
    },
    [onPressCell],
  )

  const _renderHourGuideCell = (date) => {
    const cells = hours.map((hour) => (
      <HourGuideCell
        key={hour}
        cellHeight={cellHeight}
        date={date}
        hour={hour}
        onPress={_onPressCell}
        todayHighlight={todayHighlight}
        slotDuration={slotDuration}
      />
    ))
    return cells;
  }

  const _renderHourGuideColumn = () => {
    const columns = hours.map((hour) => (
      <HourGuideColumn key={hour} cellHeight={cellHeight} hour={hour} ampm={ampm} />
    ));
    
    return (<View style={[u['z-20'], u['w-50']]}>
    {columns}
  </View>)
  }

  const _renderMappedEvent = (event: ICalendarEvent<T>) => (
    <CalendarEvent
      key={`${event.start}${event.title}${event.end}`}
      event={event}
      onPressEvent={onPressEvent}
      eventCellStyle={eventCellStyle}
      showTime={showTime}
      eventCount={getCountOfEventsAtEvent(event, events)}
      eventOrder={getOrderOfEvent(event, events)}
      overlapOffset={overlapOffset}
      cellWidth={cellWidth-6} // 6 is padding left + right
      renderEvent={renderEvent}
      ampm={ampm}
    />
  )
  // conditions
  const _isStartInCurrentDate = (start, date) => dayjs(start).isBetween(date.startOf('day'), date.endOf('day'), null, '[)');
  const _isBeforeCurrentDate = (start, end, date) => dayjs(start).isBefore(date.startOf('day')) &&
    dayjs(end).isBetween(date.startOf('day'), date.endOf('day'), null, '[)');
  const _isAfterCurrentDate = (start, end, date) => dayjs(start).isBefore(date.startOf('day')) &&
    dayjs(end).isAfter(date.endOf('day'))

  const _getEventsOfThisDate = (date) => {
    const result = events.filter(({ start }) => _isStartInCurrentDate(start, date));
    return result;
  }

  const _getEventsBeforeThisDate = (date) => {
    let result = events.filter(({ start, end }) => _isBeforeCurrentDate(start, end, date));
    // reformat
    result = result.map((event) => ({ ...event, start: dayjs(event.end).startOf('day') }));
    return result;
  }

  const _getEventsAfterThisDate = (date) => {
    let result = events.filter(({ start, end }) => _isAfterCurrentDate(start, end, date));
    // reformat
    result = result.map((event) => ({
      ...event,
      start: dayjs(event.end).startOf('day'),
      end: dayjs(event.end).endOf('day'),
    }));
    return result;
  }


  const theme = useTheme()

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
      // contentOffset={Platform.OS === 'ios' ? { x: 0, y: scrollOffsetMinutes } : { x: 0, y: 0 }}
    >
      <View
        style={[u['flex-1'], theme.isRTL ? u['flex-row-reverse'] : u['flex-row']]}
        {...(Platform.OS === 'web' ? panResponder.panHandlers : {})}
      >
        {_renderHourGuideColumn()}
        {dateRange.map((date, i) => (
          <View
            style={[u['flex-1'], u['overflow-hidden']]}
            key={date.toString()}
            onLayout={e => {
              const _cellWidth = e.nativeEvent.layout.width;;
              if (_cellWidth !== cellWidth && i === 0) setCellWidth(_cellWidth);
            }}
          >
            {_renderHourGuideCell(date)}

            {/* Render events of this date */}
            {/* M  T  (W)  T  F  S  S */}
            {/*       S-E             */}
            <EventPositioned
              events={_getEventsOfThisDate(date)}
              renderMappedEvent={_renderMappedEvent}
            />

            {/* Render events which starts before this date and ends on this date */}
            {/* M  T  (W)  T  F  S  S */}
            {/* S------E              */}
            {!onlyDuringDay &&<EventPositioned
              events={_getEventsBeforeThisDate(date)}
              renderMappedEvent={_renderMappedEvent}
            />}

            {/* Render events which starts before this date and ends after this date */}
            {/* M  T  (W)  T  F  S  S */}
            {/*    S-------E          */}
            {!onlyDuringDay && <EventPositioned
              events={_getEventsAfterThisDate(date)}
              renderMappedEvent={_renderMappedEvent}
            />}

            {isToday(date) && !hideNowIndicator && (
              <View
                style={[
                  styles.nowIndicator,
                  { backgroundColor: theme.palette.nowIndicator },
                  { top: `${getRelativeTopInDay(now)}%`, opacity: 0.5 },
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
