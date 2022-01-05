import { ViewStyle } from 'react-native';
import { CalendarTouchableOpacityProps, EventCellStyle, ICalendarEventBase } from '../interfaces';
interface UseCalendarTouchableOpacityPropsProps<T extends ICalendarEventBase> {
    event: T;
    eventCellStyle?: EventCellStyle<T>;
    onPressEvent?: (event: T) => void;
    injectedStyles?: ViewStyle[];
}
export declare function useCalendarTouchableOpacityProps<T extends ICalendarEventBase>({ event, eventCellStyle, injectedStyles, onPressEvent, }: UseCalendarTouchableOpacityPropsProps<T>): CalendarTouchableOpacityProps;
export {};
