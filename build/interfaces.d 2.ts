import { ReactElement } from 'react';
import { RecursiveArray, ViewStyle } from 'react-native';
import { CalendarHeaderProps } from './components/CalendarHeader';
import { CalendarHeaderForMonthViewProps } from './components/CalendarHeaderForMonthView';
export interface ICalendarEventBase {
    start: Date;
    end: Date;
    title: string;
    children?: ReactElement | null;
}
/**
 * @deprecated Prefer ICalendarEventBase & T instead for simplicity.
 */
export declare type ICalendarEvent<T = {}> = ICalendarEventBase & T;
export declare type CalendarTouchableOpacityProps = {
    delayPressIn: number;
    key: string;
    style: RecursiveArray<ViewStyle | undefined> | ViewStyle;
    onPress: () => void;
    disabled: boolean;
};
export declare type Mode = '3days' | 'week' | 'day' | 'custom' | 'month';
export declare type EventCellStyle<T extends ICalendarEventBase> = ViewStyle | ((event: T) => ViewStyle);
export declare type WeekNum = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export declare type HasDateRange = [Date, Date];
export declare type DateRangeHandler = ([start, end]: HasDateRange) => void;
export declare type HorizontalDirection = 'RIGHT' | 'LEFT';
export declare type EventRenderer<T extends ICalendarEventBase> = (event: T, touchableOpacityProps: CalendarTouchableOpacityProps) => JSX.Element;
export declare type HeaderRenderer<T extends ICalendarEventBase> = React.ComponentType<CalendarHeaderProps<T> & {
    mode: Mode;
}>;
export declare type MonthHeaderRenderer = React.ComponentType<CalendarHeaderForMonthViewProps>;
/**
 * @deprecated Prefer interface ICalendarEventBase instead.
 */
export declare type DayJSConvertedEvent<T = any> = ICalendarEventBase & T;
/**
 * @deprecated Prefer interface ICalendarEventBase instead.
 */
export declare type Event<T = any> = ICalendarEventBase & T;
