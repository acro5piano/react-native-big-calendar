import dayjs from 'dayjs'
import * as React from 'react'
import { CalendarCellStyle } from 'src'

interface HourGuideCellProps {
  cellHeight: number
  onPress: (d: dayjs.Dayjs) => void
  date: dayjs.Dayjs
  hour: number
  index: number
  calendarCellStyle?: CalendarCellStyle
}
export declare const HourGuideCell: React.MemoExoticComponent<
  ({ cellHeight, onPress, date, hour, index, calendarCellStyle }: HourGuideCellProps) => JSX.Element
>
export {}
