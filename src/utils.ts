import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import React from 'react'

import { OVERLAP_PADDING } from './commonStyles'
import { HourNum, ICalendarEvent, Mode, WeekNum } from './interfaces'
import { Color } from './theme'

export const typedMemo: <T>(c: T) => T = React.memo

export const DAY_MINUTES = 24 * 60

export function getDatesInMonth(date: Date | dayjs.Dayjs = new Date(), locale = 'en') {
  const subject = dayjs(date)
  const days = Array(subject.daysInMonth() - 1)
    .fill(0)
    .map((_, i) => {
      return subject.date(i + 1).locale(locale)
    })
  return days
}

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
      return subject
        .add(i - (subjectDOW < weekStartsOn ? 7 + subjectDOW : subjectDOW) + weekStartsOn, 'day')
        .locale(locale)
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

export const hours = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
]

export function getHours(dayStarts: HourNum, dayEnds: HourNum): HourNum[] {
  const rangeArray = Array.apply(null, Array(dayEnds - dayStarts + 1)).map(function (_, i) {
    return i + dayStarts
  }) as HourNum[]

  return rangeArray
}

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

export function getRelativeTopInDay(date: dayjs.Dayjs, dayStartsOn: HourNum, dayEndsOn: HourNum) {
  const dayMinutes = (dayEndsOn - dayStartsOn + 1) * 60

  return (100 * ((date.hour() - dayStartsOn) * 60 + date.minute())) / dayMinutes
}

export function todayInMinutes() {
  const today = dayjs()
  return today.diff(dayjs().startOf('day'), 'minute')
}

export function modeToNum(mode: Mode, current?: dayjs.Dayjs): number {
  if (mode === 'month') {
    if (!current) {
      throw new Error('You must specify current date if mode is month')
    }
    return current.daysInMonth() - current.date() + 1
  }
  switch (mode) {
    case '3days':
      return 3
    case 'week':
      return 7
    case 'day':
      return 1
    case 'custom':
      return 7
    default:
      throw new Error('undefined mode')
  }
}

export function formatStartEnd(start: Date, end: Date) {
  return `${dayjs(start).format('HH:mm')} - ${dayjs(end).format('HH:mm')}`
}

export function isAllDayEvent(start: Date, end: Date) {
  const _start = dayjs(start)
  const _end = dayjs(end)

  return _start.hour() === 0 && _start.minute() === 0 && _end.hour() === 0 && _end.minute() === 0
}

export function getCountOfEventsAtEvent(
  event: ICalendarEvent<any>,
  eventList: ICalendarEvent<any>[],
) {
  dayjs.extend(isBetween)
  return eventList.filter(
    (e) =>
      dayjs(event.start).isBetween(e.start, e.end, 'minute', '[)') ||
      dayjs(e.start).isBetween(event.start, event.end, 'minute', '[)'),
  ).length
}

export function getOrderOfEvent(event: ICalendarEvent<any>, eventList: ICalendarEvent<any>[]) {
  dayjs.extend(isBetween)
  const events = eventList
    .filter(
      (e) =>
        dayjs(event.start).isBetween(e.start, e.end, 'minute', '[)') ||
        dayjs(e.start).isBetween(event.start, event.end, 'minute', '[)'),
    )
    .sort((a, b) => {
      if (dayjs(a.start).isSame(b.start)) {
        return dayjs(a.start).diff(a.end) < dayjs(b.start).diff(b.end) ? -1 : 1
      } else {
        return dayjs(a.start).isBefore(b.start) ? -1 : 1
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

export function getDatesInNextCustomDays(
  date: Date | dayjs.Dayjs = new Date(),
  weekStartsOn: WeekNum = 0,
  weekEndsOn: WeekNum = 6,
  locale = 'en',
) {
  const subject = dayjs(date)
  const subjectDOW = subject.day()
  const days = Array(weekDaysCount(weekStartsOn, weekEndsOn))
    .fill(0)
    .map((_, i) => {
      return subject.add(i - subjectDOW + weekStartsOn, 'day').locale(locale)
    })
  return days
}

// TODO: This method should be unit-tested
function weekDaysCount(weekStartsOn: WeekNum, weekEndsOn: WeekNum) {
  // handle reverse week
  if (weekEndsOn < weekStartsOn) {
    let daysCount = 1
    let i = weekStartsOn
    while (i !== weekEndsOn) {
      ++i
      ++daysCount
      if (i > 6) {
        i = 0
      }
      // fallback for infinite
      if (daysCount > 7) {
        break
      }
    }
    return daysCount
  }
  // normal week
  if (weekEndsOn > weekStartsOn) {
    return weekEndsOn - weekStartsOn + 1
  }
  // default
  return 1
}
