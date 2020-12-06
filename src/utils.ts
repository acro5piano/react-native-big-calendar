import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { OVERLAP_PADDING } from '../src/commonStyles'
import { DayJSConvertedEvent, Mode, WeekNum } from './interfaces'
import { Color } from './theme'

export const DAY_MINUTES = 1440

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

export function formatHour(hour: number, ampm = false) {
  if (ampm) {
    if (hour === 0) {
      return ''
    }
    if (hour === 12) {
      return `12 PM`
    }
    if (hour > 12) {
      return `${hour - 12} PM`
    }
    return `${hour} AM`
  }
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
    case 'day':
      return 1
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
  dayjs.extend(isBetween)
  return eventList.filter(
    (e) =>
      event.start.isBetween(e.start, e.end, 'minute', '[)') ||
      e.start.isBetween(event.start, event.end, 'minute', '[)'),
  ).length
}

export function getOrderOfEvent(event: DayJSConvertedEvent, eventList: DayJSConvertedEvent[]) {
  dayjs.extend(isBetween)
  const events = eventList
    .filter(
      (e) =>
        event.start.isBetween(e.start, e.end, 'minute', '[)') ||
        e.start.isBetween(event.start, event.end, 'minute', '[)'),
    )
    .sort((a, b) => {
      if (a.start.isSame(b.start)) {
        return a.start.diff(a.end) < b.start.diff(b.end) ? -1 : 1
      } else {
        return a.start.isBefore(b.start) ? -1 : 1
      }
    })
  return events.indexOf(event)
}

function getColorForEventPosition(eventPosition: number) {
  switch (eventPosition % 5) {
    case 0:
      return Color.primary
    case 1:
      return Color.orange
    case 2:
      return Color.green
    case 3:
      return Color.red
    case 4:
      return Color.pink
    default:
      return Color.primary
  }
}

export function getStyleForOverlappingEvent(
  eventCount: number,
  eventPosition: number,
  overlapOffset: number,
) {
  let overlapStyle = {}
  if (eventCount > 1) {
    const offset = overlapOffset
    const start = eventPosition * offset
    const zIndex = 100 + eventPosition
    overlapStyle = {
      start: start + OVERLAP_PADDING,
      end: OVERLAP_PADDING,
      backgroundColor: getColorForEventPosition(eventPosition),
      zIndex,
    }
  }
  return overlapStyle
}
