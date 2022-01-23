import dayjs from 'dayjs'
import React from 'react'
import { TextStyle, ViewStyle } from 'react-native'

import { OVERLAP_PADDING } from './commonStyles'
import { ICalendarEventBase, Mode, WeekNum } from './interfaces'
import { Palette } from './theme/ThemeInterface'

export const typedMemo: <T>(c: T) => T = React.memo

export const DAY_MINUTES = 1440

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

export function parseStartEndHour(time: String) {
  const timeArray = time.split(':').map((x) => +x)
  let now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...timeArray)
}

export function generateHoursArray(startTime: Date, endTime: Date, step: number) {
  let res = []
  while (startTime < endTime) {
    let minutes = startTime.getMinutes() < 10 ? '00' : startTime.getMinutes()
    res.push(startTime.getHours() + ':' + minutes)
    startTime.setMinutes(startTime.getMinutes() + step)
  }
  return res
}

export function formatHour(time: string, ampm = false) {
  if (ampm) {
    let hours = Number(time.split(':')[0])
    let minutes = Number(time.split(':')[0])
    let newformat = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12

    // To display "0" as "12"
    let newHours = hours ? hours : 12
    let newMinutes = minutes < 10 ? '0' + minutes : minutes
    return `${newHours}:${newMinutes} ${newformat}`
  }

  return `${time}`
}

export function isToday(date: dayjs.Dayjs) {
  const today = dayjs()
  return today.isSame(date, 'day')
}

export function normalize(
  val: number,
  minVal: number,
  maxVal: number,
  newMin: number,
  newMax: number,
) {
  return newMin + ((val - minVal) * (newMax - newMin)) / (maxVal - minVal)
}

export function getRelativeTopInDay(date: dayjs.Dayjs, minTime: string, maxTime: string) {
  let minRange = Number(minTime.split(':')[0]) * 60 + Number(minTime.split(':')[1])
  let maxRange = Number(maxTime.split(':')[0]) * 60 + Number(maxTime.split(':')[1])

  let res = normalize(date.hour() * 60 + date.minute(), minRange, maxRange, 0, 100)

  return res
}

export function todayInMinutes() {
  const today = dayjs()
  return today.diff(dayjs().startOf('day'), 'minute')
}

export function modeToNum(mode: Mode, current?: dayjs.Dayjs | Date): number {
  if (mode === 'month') {
    if (!current) {
      throw new Error('You must specify current date if mode is month')
    }
    if (current instanceof Date) {
      current = dayjs(current)
    }
    return current.daysInMonth() - current.date() + 1
  }
  switch (mode) {
    case 'day':
      return 1
    case '3days':
      return 3
    case 'week':
    case 'custom':
      return 7
    default:
      throw new Error('undefined mode')
  }
}

export function formatStartEnd(start: Date, end: Date, format: string) {
  return `${dayjs(start).format(format)} - ${dayjs(end).format(format)}`
}

export function isAllDayEvent(start: Date, end: Date) {
  const _start = dayjs(start)
  const _end = dayjs(end)

  return _start.hour() === 0 && _start.minute() === 0 && _end.hour() === 0 && _end.minute() === 0
}

export function getCountOfEventsAtEvent(
  event: ICalendarEventBase,
  eventList: ICalendarEventBase[],
) {
  return eventList.filter(
    (e) =>
      dayjs(event.start).isBetween(e.start, e.end, 'minute', '[)') ||
      dayjs(e.start).isBetween(event.start, event.end, 'minute', '[)'),
  ).length
}

export function getOrderOfEvent(event: ICalendarEventBase, eventList: ICalendarEventBase[]) {
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
  const index = events.indexOf(event)
  return index === -1 ? 0 : index
}

export function getStyleForOverlappingEvent(
  eventPosition: number,
  overlapOffset: number,
  palettes: Palette[],
) {
  let overlapStyle = {}
  const offset = overlapOffset
  const start = eventPosition * offset
  const zIndex = 100 + eventPosition
  const bgColors = palettes.map((p) => p.main)
  overlapStyle = {
    start: start + OVERLAP_PADDING,
    end: OVERLAP_PADDING,
    backgroundColor: bgColors[eventPosition % bgColors.length] || bgColors[0],
    zIndex,
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

export function getEventSpanningInfo(
  event: ICalendarEventBase,
  date: dayjs.Dayjs,
  dayOfTheWeek: number,
  calendarWidth: number,
) {
  const dayWidth = calendarWidth / 7

  // adding + 1 because durations start at 0
  const eventDuration = dayjs.duration(dayjs(event.end).diff(dayjs(event.start))).days() + 1
  const eventDaysLeft = dayjs.duration(dayjs(event.end).diff(date)).days() + 1
  const weekDaysLeft = 7 - dayOfTheWeek
  const isMultipleDays = eventDuration > 1
  // This is to determine how many days from the event to show during a week
  const eventWeekDuration =
    eventDuration > weekDaysLeft
      ? weekDaysLeft
      : dayOfTheWeek === 0 && eventDaysLeft < eventDuration
      ? eventDaysLeft
      : eventDuration
  const isMultipleDaysStart =
    isMultipleDays &&
    (date.isSame(event.start, 'day') ||
      (dayOfTheWeek === 0 && date.isAfter(event.start)) ||
      date.get('date') === 1)
  // - 6 to take in account the padding
  const eventWidth = dayWidth * eventWeekDuration - 6

  return { eventWidth, isMultipleDays, isMultipleDaysStart, eventWeekDuration }
}

export function objHasContent(obj: ViewStyle | TextStyle): boolean {
  return !!Object.keys(obj).length
}

export function stringHasContent(string: string): boolean {
  return !!string.length
}

export function diffInMinutes(start: string, end: string) {
  let startArr = start.split(':')
  var endArr = end.split(':')
  var startDate = new Date(0, 0, 0, Number(startArr[0]), Number(startArr[1]), 0)
  var endDate = new Date(0, 0, 0, Number(endArr[0]), Number(endArr[1]), 0)
  var diff = endDate.getTime() - startDate.getTime()

  var minutes = Math.floor(diff / 1000 / 60)
  return minutes
}
