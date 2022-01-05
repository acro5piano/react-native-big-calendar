import dayjs from 'dayjs';
import * as React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { EventCellStyle, EventRenderer, HorizontalDirection, ICalendarEventBase } from '../interfaces';
interface CalendarBodyProps<T extends ICalendarEventBase> {
    cellHeight: number;
    containerHeight: number;
    dateRange: dayjs.Dayjs[];
    events: T[];
    scrollOffsetMinutes: number;
    ampm: boolean;
    showTime: boolean;
    style: ViewStyle;
    eventCellStyle?: EventCellStyle<T>;
    hideNowIndicator?: boolean;
    overlapOffset?: number;
    onPressCell?: (date: Date) => void;
    onPressEvent?: (event: T) => void;
    onSwipeHorizontal?: (d: HorizontalDirection) => void;
    renderEvent?: EventRenderer<T>;
    headerComponent?: React.ReactElement | null;
    headerComponentStyle?: ViewStyle;
    hourStyle?: TextStyle;
}
declare function _CalendarBody<T extends ICalendarEventBase>({ containerHeight, cellHeight, dateRange, style, onPressCell, events, onPressEvent, eventCellStyle, ampm, showTime, scrollOffsetMinutes, onSwipeHorizontal, hideNowIndicator, overlapOffset, renderEvent, headerComponent, headerComponentStyle, hourStyle, }: CalendarBodyProps<T>): JSX.Element;
export declare const CalendarBody: typeof _CalendarBody;
export {};
