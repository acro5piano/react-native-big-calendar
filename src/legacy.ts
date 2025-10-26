import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.extend(isoWeek)

// Export LegacyCalendar (wrapper that disables native dependencies)
export * from './components/LegacyCalendar'

// Export shared components that don't depend on native libraries
export * from './components/CalendarBodyForMonthView'
export * from './components/CalendarEvent'
export * from './components/CalendarEventForMonthView'
export * from './components/CalendarHeader'
export * from './components/CalendarHeaderForMonthView'
export * from './components/DefaultCalendarEventRenderer'
export * from './components/Schedule'

// Export utilities and interfaces
export * from './commonStyles'
export * from './interfaces'
export * from './theme/ThemeContext'
export * from './theme/ThemeInterface'
export * from './theme/defaultTheme'
export * from './utils/datetime'
export * from './utils/object'
export * from './utils/react'
