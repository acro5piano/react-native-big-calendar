import calendarize, { Week } from 'calendarize'
import dayjs from 'dayjs'

import { OVERLAP_PADDING } from '../commonStyles'
import { ICalendarEventBase, Mode, WeekNum } from '../interfaces'
import { Palette } from '../theme/ThemeInterface'

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

export const hours = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
]

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

export function getRelativeTopInDay(date: dayjs.Dayjs) {
  return (100 * (date.hour() * 60 + date.minute())) / DAY_MINUTES
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
  let overlapCountingPointers: number[] = []

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
    !showAdjacentMonths && monthDaysLeft < 7 && monthDaysLeft < eventDuration
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

export function getWeeksWithAdjacentMonths(targetDate: dayjs.Dayjs, weekStartsOn: WeekNum) {
  let weeks = calendarize(targetDate.toDate(), weekStartsOn)
  const firstDayIndex = weeks[0].findIndex((d) => d === 1)
  const lastDay = targetDate.endOf('month').date()
  const lastDayIndex = weeks[weeks.length - 1].findIndex((d) => d === lastDay)

  weeks = weeks.map((week, iw) => {
    return week.map((d, id) => {
      if (d !== 0) {
        return d
      } else if (iw === 0) {
        return d - (firstDayIndex - id - 1)
      } else {
        return lastDay + (id - lastDayIndex)
      }
    }) as Week
  })

  return weeks
}
