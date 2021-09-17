import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'

import { Calendar } from './components/Calendar'

dayjs.extend(duration)
dayjs.extend(isBetween)

export * from './components/Calendar'
export * from './components/CalendarBody'
export * from './components/CalendarBodyForMonthView'
export * from './components/CalendarEvent'
export * from './components/CalendarEventForMonthView'
export * from './components/CalendarHeader'
export * from './components/CalendarHeaderForMonthView'
export * from './components/DefaultCalendarEventRenderer'

export * from './commonStyles'
export * from './interfaces'
export * from './theme/ThemeContext'
export * from './theme/ThemeInterface'
export * from './theme/defaultTheme'
export * from './utils'

export * from './interfaces'

/* eslint-disable */
export default Calendar
