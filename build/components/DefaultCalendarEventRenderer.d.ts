import { CalendarTouchableOpacityProps, ICalendarEventBase } from '../interfaces';
interface DefaultCalendarEventRendererProps<T extends ICalendarEventBase> {
    touchableOpacityProps: CalendarTouchableOpacityProps;
    event: T;
    showTime?: boolean;
    textColor: string;
    ampm: boolean;
}
export declare function DefaultCalendarEventRenderer<T extends ICalendarEventBase>({ touchableOpacityProps, event, showTime, textColor, ampm, }: DefaultCalendarEventRendererProps<T>): JSX.Element;
export {};
