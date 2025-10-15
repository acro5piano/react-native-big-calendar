import calendarize, { type Week } from 'calendarize'
import dayjs from 'dayjs'

import { OVERLAP_PADDING } from '../commonStyles'
import type { ICalendarEventBase, Mode, WeekNum } from '../interfaces'
import type { Palette } from '../theme/ThemeInterface'

export const DAY_MINUTES = 1440
export const SIMPLE_DATE_FORMAT = 'YYYY-MM-DD'

export function getDatesInMonth(date: string | Date | dayjs.Dayjs = new Date(), locale = 'en') {
  const subject = dayjs(date)
  const days = Array(subject.daysInMonth())
    .fill(0)
    .map((_, i) => {
      return subject.date(i + 1).locale(locale)
    })
  return days
}

export function getDatesInWeek(
  date: string | Date | dayjs.Dayjs = new Date(),
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

export function getDatesInNextThreeDays(
  date: string | Date | dayjs.Dayjs = new Date(),
  locale = 'en',
) {
  const subject = dayjs(date).locale(locale)
  const days = Array(3)
    .fill(0)
    .map((_, i) => {
      return subject.add(i, 'day')
    })
  return days
}

export function getDatesInNextOneDay(
  date: string | Date | dayjs.Dayjs = new Date(),
  locale = 'en',
) {
  const subject = dayjs(date).locale(locale)
  const days = Array(1)
    .fill(0)
    .map((_, i) => {
      return subject.add(i, 'day')
    })
  return days
}

export function formatHour(hour: number, ampm = false) {
  if (ampm) {
    if (hour === 0) {
      return ''
    }
    if (hour === 12) {
      return '12 PM'
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

export function getRelativeTopInDay(date: dayjs.Dayjs, minHour = 0, hours = 24) {
  const totalMinutesInRange = (DAY_MINUTES / 24) * hours
  return (100 * ((date.hour() - minHour) * 60 + date.minute())) / totalMinutesInRange
}

export function todayInMinutes() {
  const today = dayjs()
  return today.diff(dayjs().startOf('day'), 'minute')
}

export function modeToNum(mode: Mode, current?: dayjs.Dayjs | Date, amount = 1): number {
  if (mode === 'month') {
    if (!current) {
      throw new Error('You must specify current date if mode is month')
    }
    const currentDate = current instanceof Date ? dayjs(current) : current

    return currentDate.add(amount, 'month').diff(currentDate, 'day')
  }
  switch (mode) {
    case 'day':
      return 1 * amount
    case '3days':
      return 3 * amount
    case 'week':
    case 'custom':
      return 7 * amount
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
  sortedEventList: ICalendarEventBase[],
) {
  let count = 0

  // Since the list is sorted, we can stop iterating once the start time exceeds the event's end time
  for (const e of sortedEventList) {
    // If the current event starts after the end of the event we're checking, no need to proceed further
    if (e.start >= event.end) {
      break
    }

    // Check for overlap
    if (e.end > event.start && e.start < event.end) {
      count++
    }
  }

  return count
}

export function getOrderOfEvent(
  event: ICalendarEventBase,
  sortedEventList: ICalendarEventBase[],
): number {
  const eventStart = new Date(event.start).getTime()
  const eventEnd = new Date(event.end).getTime()

  // Helper functions to get start and end times
  const getStartTime = (e: ICalendarEventBase) => new Date(e.start).getTime()
  const getEndTime = (e: ICalendarEventBase) => new Date(e.end).getTime()

  // Binary search to find the first potentially overlapping event
  let left = 0
  let right = sortedEventList.length - 1
  let firstOverlapIndex = sortedEventList.length

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const midEventEnd = getEndTime(sortedEventList[mid])

    if (midEventEnd <= eventStart) {
      left = mid + 1
    } else {
      firstOverlapIndex = mid
      right = mid - 1
    }
  }

  // Collect overlapping events starting from the firstOverlapIndex
  const overlappingEvents = []
  for (let i = firstOverlapIndex; i < sortedEventList.length; i++) {
    const currentEvent = sortedEventList[i]
    const start = getStartTime(currentEvent)
    const end = getEndTime(currentEvent)

    if (start >= eventEnd) {
      break // No further events will overlap
    }

    if ((eventStart >= start && eventStart < end) || (start >= eventStart && start < eventEnd)) {
      overlappingEvents.push({ event: currentEvent, start, end })
    }
  }

  // Sort overlapping events by start time and duration
  overlappingEvents.sort((a, b) => {
    if (a.start === b.start) {
      return a.end - a.start - (b.end - b.start)
    }

    return a.start - b.start
  })

  // Find the index of the given event in the sorted overlapping events
  const index = overlappingEvents.findIndex(({ event: e }) => e === event)
  return index === -1 ? 0 : index
}

/**
 * Iterate over a sorted list of events and add the following properties:
 * - overlapPosition: position of the event in the stack of overlapping events
 * - overlapsCount: number of events that overlap with this event
 * @param events Sorted list of events by start time
 * @param eventsAreSorted indicates if the events are already sorted
 */
export function enrichEvents<T extends ICalendarEventBase>(
  events: T[],
  eventsAreSorted?: boolean,
): Record<string, T[]> {
  if (!events.length) return {}

  let groupEndTime = events[0].end
  let overlapPosition = 0
  let overlapCounting = 0
  const overlapCountingPointers: number[] = []

  // If events are not sorted, sort them by start time
  const baseEvents = eventsAreSorted
    ? events
    : events.sort((a, b) => a.start.getTime() - b.start.getTime())

  const eventsWithOverlaps = baseEvents.map((event, index) => {
    // If the event starts before the group end time, it overlaps
    if (event.start < groupEndTime) {
      // Update the group end time if this overlapping event ends after the current group end time
      if (event.end > groupEndTime) {
        groupEndTime = event.end
      }
      overlapCounting++
      // If this is the last event, we need to add the overlap counting to the overlap counting pointers
      if (index === baseEvents.length - 1) {
        overlapCountingPointers.push(...Array(overlapCounting).fill(overlapCounting))
      }
      //  Otherwise, it doesn't overlap and we reset the pointers
    } else {
      groupEndTime = event.end
      overlapCountingPointers.push(...Array(overlapCounting).fill(overlapCounting))
      // If this is the last event, we need to add a "group" of 1 into the overlap counting pointers
      if (index === baseEvents.length - 1) {
        overlapCountingPointers.push(1)
      }
      overlapPosition = 0
      overlapCounting = 1
    }

    return {
      ...event,
      // Add the overlap position to the event and increment by 1 for the next event
      overlapPosition: overlapPosition++,
    }
  })

  const eventsByDate: Record<string, T[]> = {}
  eventsWithOverlaps.forEach((event, index) => {
    // Add overlap count to the event
    const enrichedEvent = {
      ...event,
      overlapCount: overlapCountingPointers[index],
    }

    const startDate = dayjs(enrichedEvent.start).format(SIMPLE_DATE_FORMAT)
    const endDate = dayjs(enrichedEvent.end).format(SIMPLE_DATE_FORMAT)

    if (!eventsByDate[startDate]) {
      eventsByDate[startDate] = []
    }

    if (!eventsByDate[endDate]) {
      eventsByDate[endDate] = []
    }

    if (startDate === endDate) {
      eventsByDate[startDate].push(enrichedEvent)
    } else {
      /**
       * In case of multi-day events, we need to create an event for each day setting the start
       * and end dates of the middle days to the start and end of the day.
       */

      // Add the event to the bucket of the start date
      eventsByDate[startDate].push({
        ...enrichedEvent,
        end: dayjs(enrichedEvent.start).endOf('day').toDate(),
      })

      // Add events in the bucket of the middle dates
      const amountOfDaysBetweenDates = dayjs(enrichedEvent.start).diff(enrichedEvent.end, 'day')
      for (let i = 1; i <= amountOfDaysBetweenDates; i++) {
        const intermediateDate = dayjs(enrichedEvent.start).add(1, 'day')
        if (!eventsByDate[intermediateDate.format(SIMPLE_DATE_FORMAT)]) {
          eventsByDate[intermediateDate.format(SIMPLE_DATE_FORMAT)] = []
        }
        eventsByDate[intermediateDate.format(SIMPLE_DATE_FORMAT)].push({
          ...enrichedEvent,
          start: intermediateDate.startOf('day').toDate(),
        })
      }

      // Add the event to the bucket of the end date
      eventsByDate[endDate].push({
        ...enrichedEvent,
        start: dayjs(enrichedEvent.end).startOf('day').toDate(),
      })
    }
  })

  return eventsByDate
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
  date: string | Date | dayjs.Dayjs = new Date(),
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
  showAdjacentMonths: boolean,
) {
  const dayWidth = calendarWidth / 7

  // adding + 1 because durations start at 0
  const eventDuration =
    Math.floor(dayjs.duration(dayjs(event.end).endOf('day').diff(dayjs(event.start))).asDays()) + 1
  const eventDaysLeft =
    Math.floor(dayjs.duration(dayjs(event.end).endOf('day').diff(date)).asDays()) + 1
  const weekDaysLeft = 7 - dayOfTheWeek
  const monthDaysLeft = date.endOf('month').date() - date.date()
  const isMultipleDays = eventDuration > 1
  // This is to determine how many days from the event to show during a week
  const eventWeekDuration =
    !showAdjacentMonths && monthDaysLeft < 7 && monthDaysLeft < eventDaysLeft
      ? monthDaysLeft + 1
      : eventDaysLeft > weekDaysLeft
        ? weekDaysLeft
        : eventDaysLeft < eventDuration
          ? eventDaysLeft
          : eventDuration
  const isMultipleDaysStart =
    isMultipleDays &&
    (date.isSame(event.start, 'day') ||
      (dayOfTheWeek === 0 && date.isAfter(event.start)) ||
      (!showAdjacentMonths && date.get('date') === 1))
  // - 6 to take in account the padding
  const eventWidth = dayWidth * eventWeekDuration - 6

  return { eventWidth, isMultipleDays, isMultipleDaysStart, eventWeekDuration }
}

export function getWeeksWithAdjacentMonths(
  targetDate: dayjs.Dayjs,
  weekStartsOn: WeekNum,
  showSixWeeks: boolean,
) {
  let weeks = calendarize(targetDate.toDate(), weekStartsOn)

  const firstDayIndex = weeks[0].findIndex((d) => d === 1)
  const lastDay = targetDate.endOf('month').date()
  const lastDayIndex = weeks[weeks.length - 1].findIndex((d) => d === lastDay)
  const lastWeekIndex = weeks.length - 1

  while (showSixWeeks && weeks.length < 6) {
    weeks.push([0, 0, 0, 0, 0, 0, 0])
  }

  weeks = weeks.map((week, iw) => {
    return week.map((d, id) => {
      if (d !== 0) {
        return d
      }

      if (iw === 0) {
        return d - (firstDayIndex - id - 1)
      }

      return lastDay + (id - lastDayIndex) + (iw - lastWeekIndex) * 7
    }) as Week
  })

  return weeks
}
