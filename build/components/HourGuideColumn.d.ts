import * as React from 'react';
import { TextStyle } from 'react-native';
interface HourGuideColumnProps {
    cellHeight: number;
    hour: number;
    ampm: boolean;
    index: number;
    hourStyle: TextStyle;
}
export declare const HourGuideColumn: React.MemoExoticComponent<({ cellHeight, hour, ampm, index, hourStyle, }: HourGuideColumnProps) => JSX.Element>;
export {};
