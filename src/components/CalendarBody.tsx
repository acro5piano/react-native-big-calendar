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
  onlyDuringDay = true
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

  {/* Render events of this date */}
  {/* M  T  (W)  T  F  S  S */}
  {/*       S-E             */}
  const _renderEventOfThisDate = (date) => {
    const _events = events.filter(({ start }) => _isStartInCurrentDate(start, date))
    const _mapToComponents = _events.map(_renderMappedEvent);
    return _mapToComponents;
  }

  {/* Render events which starts before this date and ends on this date */}
  {/* M  T  (W)  T  F  S  S */}
  {/* S------E              */}
  const _renderEventBeforeThisDate = (date) => {
    if(onlyDuringDay) return null;
    const _events = events.filter(({ start, end }) => _isBeforeCurrentDate(start, end, date));
    const _reformat = _events.map((event) => ({ ...event, start: dayjs(event.end).startOf('day') }));
    const _mapToComponents = _reformat.map(_renderMappedEvent);
    return _mapToComponents;
  }

  {/* Render events which starts before this date and ends after this date */}
  {/* M  T  (W)  T  F  S  S */}
  {/*    S-------E          */}
  const _renderEventAfterthisDate = (date) => {
    if(onlyDuringDay) return null;
    const _events = events.filter(({ start, end }) => _isAfterCurrentDate(start, end, date));
    const _reformat = _events.map((event) => ({
      ...event,
      start: dayjs(event.end).startOf('day'),
      end: dayjs(event.end).endOf('day'),
    }));
    const _mapToComponents = _reformat.map(_renderMappedEvent);
    return _mapToComponents;
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
            {/* {events
              .filter(({ start }) =>
                dayjs(start).isBetween(date.startOf('day'), date.endOf('day'), null, '[)'),
              )
              .map(_renderMappedEvent)} */}
            {_renderEventOfThisDate(date)}

            {/* Render events which starts before this date and ends on this date */}
            {/* M  T  (W)  T  F  S  S */}
            {/* S------E              */}
            {/* {events
              .filter(
                ({ start, end }) =>
                  dayjs(start).isBefore(date.startOf('day')) &&
                  dayjs(end).isBetween(date.startOf('day'), date.endOf('day'), null, '[)'),
              )
              .map((event) => ({
                ...event,
                start: dayjs(event.end).startOf('day'),
              }))
              .map(_renderMappedEvent)} */}
            {_renderEventBeforeThisDate(date)}

            {/* Render events which starts before this date and ends after this date */}
            {/* M  T  (W)  T  F  S  S */}
            {/*    S-------E          */}
            {/* {events
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
              .map(_renderMappedEvent)} */}
            {_renderEventAfterthisDate(date)}

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
