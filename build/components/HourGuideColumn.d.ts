import * as React from 'react'
import { TextStyle } from 'react-native'

interface HourGuideColumnProps {
  cellHeight: number
  hour: number
  ampm: boolean
  hourStyle: TextStyle
}
export declare const HourGuideColumn: React.MemoExoticComponent<
  ({ cellHeight, hour, ampm, hourStyle }: HourGuideColumnProps) => JSX.Element
>
export {}
