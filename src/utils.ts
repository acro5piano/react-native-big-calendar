import dayjs from 'dayjs'
import { DayJSConvertedEvent, Mode, WeekNum } from './interfaces'
import { Color } from './theme'

export const DAY_MINUTES = 1440
const OVERLAP_OFFSET = 20
const OVERLAP_PADDING = 4

export function getDatesInWeek(
  date: Date | dayjs.Dayjs = new Date(),
  weekStartsOn: WeekNum = 0,
  locale = 'en',
) {
  const subject = dayjs(date)
  const subjectDOW = subject.day()
  const days = Array(7)
    .fill(0)
    .map((_, i) => {
      return subject.add(i - subjectDOW + weekStartsOn, 'day').locale(locale)
    })

  return days
}

export function getDatesInNextThreeDays(date: Date | dayjs.Dayjs = new Date(), locale = 'en') {
  const subject = dayjs(date).locale(locale)
  const days = Array(3)
    .fill(0)
    .map((_, i) => {
      return subject.add(i, 'day')
    })

  return days
}

export function getDatesInNextOneDay(date: Date | dayjs.Dayjs = new Date(), locale = 'en') {
  const subject = dayjs(date).locale(locale)
  const days = Array(1)
    .fill(0)
    .map((_, i) => {
      return subject.add(i, 'day')
    })

  return days
}

export const hours = Array(24)
  .fill(0)
  .map((_, i) => i)

export function formatHour(hour: number) {
  return `${hour}:00`
}

export function isToday(date: dayjs.Dayjs) {
  const today = dayjs()
  return today.isSame(date, 'day')
}

export function getRelativeTopInDay(date = dayjs()) {
  return (100 * (date.hour() * 60 + date.minute())) / DAY_MINUTES
}

export function todayInMinutes() {
  const today = dayjs()
  return today.diff(dayjs().startOf('day'), 'minute')
}

export function modeToNum(mode: Mode) {
  switch (mode) {
    case '3days':
      return 3
    case 'week':
      return 7
    default:
      throw new Error('undefined mode')
  }
}

export function formatStartEnd(event: DayJSConvertedEvent) {
  return `${event.start.format('HH:mm')} - ${event.end.format('HH:mm')}`
}

export function isAllDayEvent(event: DayJSConvertedEvent) {
  return (
    event.start.hour() === 0 &&
    event.start.minute() === 0 &&
    event.end.hour() === 0 &&
    event.end.minute() === 0
  )
}

export function getCountOfEventsAtEvent(
  event: DayJSConvertedEvent,
  eventList: DayJSConvertedEvent[],
) {
  return eventList.filter((e) => e.start.isSame(event.start, 'minute')).length
}

export function getOrderOfEvent(event: DayJSConvertedEvent, eventList: DayJSConvertedEvent[]) {
  const events = eventList
    .filter((e) => e.start.isSame(event.start, 'minute'))
    .sort((a, b) => (a.start.diff(a.end) < b.start.diff(b.end) ? -1 : 1))
  return events.indexOf(event)
}

export function getStyleForOverlappingEvent(eventCount: number, eventPosition: number) {
  let overlapStyle = {}
  if (eventCount > 1) {
    const normalizedPosition = eventPosition + 1
    const start = eventPosition * OVERLAP_OFFSET
    const end =
      eventCount === normalizedPosition ? 0 : (eventCount - normalizedPosition) * OVERLAP_OFFSET
    const color =
      eventPosition === 0 ? Color.blue : eventPosition === 1 ? Color.orange : Color.green
    overlapStyle = {
      start: start + OVERLAP_PADDING,
      end: end + OVERLAP_PADDING,
      backgroundColor: color,
      zIndex: 100 + normalizedPosition,
    }
  }
  return overlapStyle
}
