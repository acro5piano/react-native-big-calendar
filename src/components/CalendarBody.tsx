import dayjs from "dayjs";
import * as React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { u } from "../commonStyles";
import { useNow } from "../hooks/useNow";
import { usePanResponder } from "../hooks/usePanResponder";
import {
  EventCellStyle,
  EventRenderer,
  HorizontalDirection,
  ICalendarEvent,
} from "../interfaces";
import { useTheme } from "../theme/ThemeContext";
import {
  getCountOfEventsAtEvent,
  getOrderOfEvent,
  getRelativeTopInDay,
  hours,
  isToday,
} from "../utils";
import { CalendarEvent } from "./CalendarEvent";
import { HourGuideCell } from "./HourGuideCell";
import { HourGuideColumn } from "./HourGuideColumn";

import isEqual from "../fastCompare";

const styles = StyleSheet.create({
  nowIndicator: {
    position: "absolute",
    zIndex: 9999,
    height: 2,
    width: "100%",
  },
});

const EventPositioned = React.memo(
  ({type, events = [], renderMappedEvent = () => {}, countRenderEvent = 20, timeoutCountRender = 500 }: any) => {
    if (events?.length <= 0) return <View />;

    const [eventComponents, setEventComponents] = React.useState([]);
    const preEvents = React.useRef([]);

    const setPagingData = (start, end) => {
      setEventComponents((preEvents: any[]) => {
        // console.log("pushItem", {start, end});
        const itemsNextPage = events.slice(start, end);
        const nextData = [...preEvents, ...itemsNextPage];
        // console.log("eventCalendarOffline paging",type, events.length <= nextData.length, events.length, nextData.length, itemsNextPage);
        return nextData;
      });
    };

    React.useEffect(() => {
      console.log("useEffect isEqual", isEqual(preEvents.current, events));
      if (isEqual(preEvents.current, events)) {
        preEvents.current = events;
        return;
      }
      // console.log("useEffect start paging");

      const pushItem = (page: number) => {
        const start = page * countRenderEvent;
        const end = start + countRenderEvent;
        
        if (start >= events.length) {
          return;
        }

        if (start == 0) {
          setPagingData(start, end);
          pushItem(++page);
        } else {
          setTimeout(() => {
            if (!isEqual(preEvents.current, events)) {
              return;
            }
            setPagingData(start, end);
            pushItem(++page);
          }, timeoutCountRender);
        }
      };

      setEventComponents([]);
      pushItem(0);
      preEvents.current = events;
    }, [events, countRenderEvent]);

    return eventComponents.map(renderMappedEvent);
  },
  (preProps, nextProps) => {
    // debug
    const typeEq = preProps.type == nextProps.type;
    const eventsEq = isEqual(preProps.events, nextProps.events);
    const renderMappedEventEq = preProps.renderMappedEvent == nextProps.renderMappedEvent;
    const countRenderEventEq = preProps.countRenderEvent == nextProps.countRenderEvent;
    const timeoutCountRenderEq = preProps.timeoutCountRender == nextProps.timeoutCountRender;
    console.log("isRender",isEqual(preProps, nextProps), {typeEq, eventsEq, renderMappedEventEq, countRenderEventEq, timeoutCountRenderEq});
    
    return isEqual(preProps, nextProps);
  }
);

interface CalendarBodyProps<T> {
  cellHeight: number;
  containerHeight: number;
  dateRange: dayjs.Dayjs[];
  events: ICalendarEvent<T>[];
  scrollOffsetMinutes: number;
  delayScrollOffsetMinutes?: number;
  animationScrollTo: boolean;
  ampm: boolean;
  showTime: boolean;
  style: ViewStyle;
  eventCellStyle?: EventCellStyle<T>;
  hideNowIndicator?: boolean;
  overlapOffset?: number;
  onPressCell?: (date: Date) => void;
  onPressEvent?: (event: ICalendarEvent<T>) => void;
  onSwipeHorizontal?: (d: HorizontalDirection) => void;
  renderEvent?: EventRenderer<T>;
  todayHighlight?: boolean;
  onlyDuringDay: boolean;
  slotDuration: number;
  countRenderEvent: number;
  timeoutCountRender: number;
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
  slotDuration,
  countRenderEvent,
  timeoutCountRender,
}: CalendarBodyProps<T>) {
  const scrollView = React.useRef<ScrollView>(null);
  const { now } = useNow(!hideNowIndicator);

  const [cellWidth, setCellWidth] = React.useState(0);

  const eventsRef = React.useRef(events)

  React.useEffect(() => {
    let timeout: any;
    if (scrollView.current && scrollOffsetMinutes) {
      //  && Platform.OS !== 'ios' is IOS use contentOffset below but not animation
      // We add delay here to work correct on React Native
      // see: https://stackoverflow.com/questions/33208477/react-native-android-scrollview-scrollto-not-working
      timeout = setTimeout(
        () => {
          if (scrollView && scrollView.current) {
            scrollView.current.scrollTo({
              x: 0,
              y: (cellHeight * scrollOffsetMinutes) / 60,
              animated: animationScrollTo,
            });
          }
        },
        Platform.OS === "web" ? 0 : delayScrollOffsetMinutes ?? 500,
      );
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [scrollView, scrollOffsetMinutes, cellHeight]);

  const panResponder = usePanResponder({
    onSwipeHorizontal,
  });

  const _onPressCell = React.useCallback(
    (date: dayjs.Dayjs) => {
      onPressCell && onPressCell(date.toDate());
    },
    [onPressCell],
  );

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
    ));
    return cells;
  };

  const _renderHourGuideColumn = () => {
    const columns = hours.map((hour) => (
      <HourGuideColumn
        key={hour}
        cellHeight={cellHeight}
        hour={hour}
        ampm={ampm}
      />
    ));

    return <View style={[u["z-20"], u["w-50"]]}>{columns}</View>;
  };

  React.useEffect(() => {
    eventsRef.current = events
  }, [events])

  const _renderMappedEvent = React.useCallback((event: ICalendarEvent<T>) => {
    return (
      <CalendarEvent
        key={event.key}
        event={event}
        onPressEvent={onPressEvent}
        eventCellStyle={eventCellStyle}
        showTime={showTime}
        eventCount={getCountOfEventsAtEvent(event, eventsRef.current)}
        eventOrder={getOrderOfEvent(event, eventsRef.current)}
        overlapOffset={overlapOffset}
        cellWidth={cellWidth - 6} // 6 is padding left + right
        renderEvent={renderEvent}
        ampm={ampm}
      />
    );
  }, [onPressEvent, cellWidth, eventCellStyle, showTime, ampm, overlapOffset])
  
  // conditions
  const _isStartInCurrentDate = (start, date) =>
    dayjs(start).isBetween(date.startOf("day"), date.endOf("day"), null, "[)");
  const _isBeforeCurrentDate = (start, end, date) =>
    dayjs(start).isBefore(date.startOf("day")) &&
    dayjs(end).isBetween(date.startOf("day"), date.endOf("day"), null, "[)");
  const _isAfterCurrentDate = (start, end, date) =>
    dayjs(start).isBefore(date.startOf("day")) &&
    dayjs(end).isAfter(date.endOf("day"));

  const _getEventsOfThisDate = (date) => {
      const result = events.filter(({ start }) =>
        _isStartInCurrentDate(start, date),
      );
      return result;
    };

  const _getEventsBeforeThisDate = (date) => {
    let result = events.filter(({ start, end }) =>
      _isBeforeCurrentDate(start, end, date),
    );
    // reformat
    result = result.map((event) => ({
      ...event,
      start: dayjs(event.end).startOf("day"),
    }));
    return result;
  };

  const _getEventsAfterThisDate = (date) => {
    let result = events.filter(({ start, end }) =>
      _isAfterCurrentDate(start, end, date),
    );
    // reformat
    result = result.map((event) => ({
      ...event,
      start: dayjs(event.end).startOf("day"),
      end: dayjs(event.end).endOf("day"),
    }));
    return result;
  };

  const _onLayoutViewDay = (i) => (e) => {
    const _cellWidth = e.nativeEvent.layout.width;
    if (_cellWidth !== cellWidth && i === 0)
      setCellWidth(_cellWidth);
  }

  const theme = useTheme();
  console.log("cellWidth", cellWidth);
  
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
      {...(Platform.OS !== "web" ? panResponder.panHandlers : {})}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      // contentOffset={Platform.OS === 'ios' ? { x: 0, y: scrollOffsetMinutes } : { x: 0, y: 0 }}
    >
      <View
        style={[
          u["flex-1"],
          theme.isRTL ? u["flex-row-reverse"] : u["flex-row"],
        ]}
        {...(Platform.OS === "web" ? panResponder.panHandlers : {})}
      >
        {_renderHourGuideColumn()}
        {dateRange.map((date, i) => (
          <React.Fragment key={date}>
            <View
              activeOpacity={1}
              style={[u["flex-1"], u["overflow-hidden"]]}
              key={date.toString()}
              onLayout={_onLayoutViewDay(i)}
            >
              {_renderHourGuideCell(date)}

              {/* Render events of this date */}
              {/* M  T  (W)  T  F  S  S */}
              {/*       S-E             */}
              <EventPositioned
                events={_getEventsOfThisDate(date)}
                renderMappedEvent={_renderMappedEvent}
                countRenderEvent={countRenderEvent}
                timeoutCountRender={timeoutCountRender}
              />

              {/* Render events which starts before this date and ends on this date */}
              {/* M  T  (W)  T  F  S  S */}
              {/* S------E              */}
              {!onlyDuringDay && (
                <EventPositioned
                  events={_getEventsBeforeThisDate(date)}
                  renderMappedEvent={_renderMappedEvent}
                  countRenderEvent={countRenderEvent}
                  timeoutCountRender={timeoutCountRender}
                />
              )}

              {/* Render events which starts before this date and ends after this date */}
              {/* M  T  (W)  T  F  S  S */}
              {/*    S-------E          */}
              {!onlyDuringDay && (
                <EventPositioned
                  events={_getEventsAfterThisDate(date)}
                  renderMappedEvent={_renderMappedEvent}
                  countRenderEvent={countRenderEvent}
                  timeoutCountRender={timeoutCountRender}
                />
              )}
            </View>
            {isToday(date) && !hideNowIndicator && (
              <View
                style={[
                  styles.nowIndicator,
                  { backgroundColor: theme.palette.nowIndicator },
                  { top: `${getRelativeTopInDay(now)}%`, opacity: 0.5, width: cellWidth, left: (i * cellWidth) + 50 }, // 50 is hour col
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

export const CalendarBody = React.memo(_CalendarBody, isEqual);
