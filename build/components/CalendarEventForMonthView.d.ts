import dayjs from 'dayjs'

import { EventCellStyle, EventRenderer, ICalendarEventBase } from '../interfaces'

interface CalendarEventProps<T extends ICalendarEventBase> {
  event: T
  onPressEvent?: (event: T) => void
  eventCellStyle?: EventCellStyle<T>
  renderEvent?: EventRenderer<T>
  date: dayjs.Dayjs
  dayOfTheWeek: number
  calendarWidth: number
  isRTL: boolean
  eventMinHeightForMonthView: number
  showAdjacentMonths: boolean
}
declare function _CalendarEventForMonthView<T extends ICalendarEventBase>({
  event,
  onPressEvent,
  eventCellStyle,
  renderEvent,
  date,
  dayOfTheWeek,
  calendarWidth,
  isRTL,
  eventMinHeightForMonthView,
  showAdjacentMonths,
}: CalendarEventProps<T>): JSX.Element
export declare const CalendarEventForMonthView: typeof _CalendarEventForMonthView
export {}
