import dayjs from 'dayjs'
import { DayJSConvertedEvent, Mode, WeekNum } from './interfaces'

export const DAY_MINUTES = 1440

export function getDatesInWeek(date: Date | dayjs.Dayjs = new Date(), weekStartsOn: WeekNum = 0) {
  const subject = dayjs(date)
  const subjectDOW = subject.day()
  const days = Array(7)
    .fill(0)
    .map((_, i) => {
      return subject.add(i - subjectDOW + weekStartsOn, 'day')
    })

  return days
}

export function getDatesInNextThreeDays(date: Date | dayjs.Dayjs = new Date()) {
  const subject = dayjs(date)
  const days = Array(3)
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
