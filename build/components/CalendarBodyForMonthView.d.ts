import dayjs from 'dayjs';
import { ViewStyle } from 'react-native';
import { EventCellStyle, EventRenderer, HorizontalDirection, ICalendarEventBase, WeekNum } from '../interfaces';
interface CalendarBodyForMonthViewProps<T extends ICalendarEventBase> {
    containerHeight: number;
    targetDate: dayjs.Dayjs;
    events: T[];
    style: ViewStyle;
    eventCellStyle?: EventCellStyle<T>;
    hideNowIndicator?: boolean;
    onPressCell?: (date: Date) => void;
    onPressEvent?: (event: T) => void;
    onSwipeHorizontal?: (d: HorizontalDirection) => void;
    renderEvent?: EventRenderer<T>;
    maxVisibleEventCount: number;
    weekStartsOn: WeekNum;
    eventMinHeightForMonthView: number;
}
declare function _CalendarBodyForMonthView<T extends ICalendarEventBase>({ containerHeight, targetDate, style, onPressCell, events, onPressEvent, eventCellStyle, onSwipeHorizontal, hideNowIndicator, renderEvent, maxVisibleEventCount, weekStartsOn, eventMinHeightForMonthView, }: CalendarBodyForMonthViewProps<T>): JSX.Element;
export declare const CalendarBodyForMonthView: typeof _CalendarBodyForMonthView;
export {};
