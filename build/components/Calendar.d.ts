import { ICalendarEventBase } from '../interfaces';
import { ThemeInterface } from '../theme/ThemeInterface';
import { DeepPartial } from '../utility-types';
import { CalendarContainerProps } from './CalendarContainer';
export interface CalendarProps<T extends ICalendarEventBase> extends CalendarContainerProps<T> {
    theme?: DeepPartial<ThemeInterface>;
    isRTL?: boolean;
}
declare function _Calendar<T extends ICalendarEventBase>({ theme, isRTL, ...props }: CalendarProps<T>): JSX.Element;
export declare const Calendar: typeof _Calendar;
export {};
