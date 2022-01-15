import dayjs from 'dayjs';
interface HourGuideCellProps {
    cellHeight: number;
    onPress: (d: dayjs.Dayjs) => void;
    date: dayjs.Dayjs;
    hour: number;
    index: number;
}
export declare const HourGuideCell: ({ cellHeight, onPress, date, hour, index }: HourGuideCellProps) => JSX.Element;
export {};
