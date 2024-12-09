import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import Mockdate from 'mockdate'
import * as R from 'remeda'

import { ICalendarEventBase } from '../../interfaces'
import * as utils from '../datetime'
import { SIMPLE_DATE_FORMAT, enrichEvents } from '../datetime'

Mockdate.set('2021-09-17T04:00:00.000Z')

dayjs.extend(isBetween)
dayjs.extend(duration)

const events: ICalendarEventBase[] = [
  {
    title: 'Meeting',
    start: dayjs().set('hour', 10).set('minute', 0),
    end: dayjs().set('hour', 10).set('minute', 30),
  },
  {
    title: 'Break',
    start: dayjs().set('hour', 10).set('minute', 30),
    end: dayjs().set('hour', 10).set('minute', 45),
  },
  {
    title: 'Coffee break',
    start: dayjs().set('hour', 14).set('minute', 30),
    end: dayjs().set('hour', 15).set('minute', 30),
  },
  {
    title: "Doctor's appointment",
    start: dayjs().set('hour', 13).set('minute', 0),
    end: dayjs().set('hour', 14).set('minute', 15),
  },
  {
    title: 'Repair my car',
    start: dayjs().add(1, 'day').set('hour', 7).set('minute', 45),
    end: dayjs().add(1, 'day').set('hour', 13).set('minute', 30),
  },
  {
    title: 'Meet Realtor',
    start: dayjs().add(1, 'day').set('hour', 8).set('minute', 25),
    end: dayjs().add(1, 'day').set('hour', 9).set('minute', 55),
  },
  {
    title: 'Laundry',
    start: dayjs().add(1, 'day').set('hour', 8).set('minute', 25),
    end: dayjs().add(1, 'day').set('hour', 11).set('minute', 0),
  },
  {
    title: 'Vacation',
    start: dayjs().add(1, 'week').set('day', 3).set('hour', 8).set('minute', 25),
    end: dayjs().add(2, 'week').set('hour', 11).set('minute', 0),
  },
].map((e) => ({
  ...e,
  start: e.start.toDate(),
  end: e.end.toDate(),
}))

const getEvents = (eventsHours: { startHour: number; endHour: number }[]): ICalendarEventBase[] =>
  eventsHours.map(({ startHour, endHour }) => ({
    title: `Meeting from ${startHour} to ${endHour}`,
    start: dayjs().set('hour', startHour).set('minute', 0).toDate(),
    end: dayjs().set('hour', endHour).set('minute', 0).toDate(),
  }))

function assertDateRange(expected: any[], actual: any[]) {
  const formatToIso = (a: any) => a.toISOString()
  expect(actual.map(formatToIso)).toEqual(expected.map(formatToIso))
}

describe('getDatesInMonth', () => {
  const expected = R.range(1, 32).map((date) => new Date(2021, 4, date))

  test('may 2021', () => {
    const actual = utils.getDatesInMonth(new Date(2021, 4, 9))
    assertDateRange(expected, actual)
  })
})

describe('getDatesInWeek', () => {
  const expected = [
    new Date(2020, 1, 9),
    new Date(2020, 1, 10),
    new Date(2020, 1, 11),
    new Date(2020, 1, 12),
    new Date(2020, 1, 13),
    new Date(2020, 1, 14),
    new Date(2020, 1, 15),
  ]

  test('sunday', () => {
    const actual = utils.getDatesInWeek(new Date(2020, 1, 9))
    assertDateRange(expected, actual)
  })

  test('monday', () => {
    const actual = utils.getDatesInWeek(new Date(2020, 1, 10))
    assertDateRange(expected, actual)
  })

  test('saturday', () => {
    const actual = utils.getDatesInWeek(new Date(2020, 1, 15))
    assertDateRange(expected, actual)
  })
})

describe('getDatesInNextThreeDays', () => {
  const expected = [new Date(2020, 1, 9), new Date(2020, 1, 10), new Date(2020, 1, 11)]

  test('sunday', () => {
    const actual = utils.getDatesInNextThreeDays(new Date(2020, 1, 9))
    assertDateRange(expected, actual)
  })
})

describe('getCountOfEventsAtEvent', () => {
  test('single event', () => {
    const event = events[0]
    const singleCount = utils.getCountOfEventsAtEvent(event, events)
    expect(singleCount).toEqual(1)
  })

  test('3 events start', () => {
    const event = events[4]
    const threeCount = utils.getCountOfEventsAtEvent(event, events)
    expect(threeCount).toEqual(3)
  })

  test('3 events middle', () => {
    const event = events[6]
    const threeCount = utils.getCountOfEventsAtEvent(event, events)
    expect(threeCount).toEqual(3)
  })
})

describe('getOrderOfEvent', () => {
  test('single event', () => {
    const event = events[0]
    const index = utils.getOrderOfEvent(event, events)
    expect(index).toEqual(0)
  })

  test('3 events start', () => {
    const event = events[4]
    const index = utils.getOrderOfEvent(event, events)
    expect(index).toEqual(0)
  })

  test('3 events middle', () => {
    const event = events[6]
    const index = utils.getOrderOfEvent(event, events)
    expect(index).toEqual(1)
  })

  test('3 events end', () => {
    const event = events[5]
    const index = utils.getOrderOfEvent(event, events)
    expect(index).toEqual(2)
  })
})

describe('modeToNum', () => {
  test('3days', () => {
    const mode = '3days'
    const num = utils.modeToNum(mode)
    expect(num).toEqual(3)
  })

  test('week', () => {
    const mode = 'week'
    const num = utils.modeToNum(mode)
    expect(num).toEqual(7)
  })

  test('day', () => {
    const mode = 'day'
    const num = utils.modeToNum(mode)
    expect(num).toEqual(1)
  })

  test('custom', () => {
    const mode = 'custom'
    const num = utils.modeToNum(mode)
    expect(num).toEqual(7)
  })
})

describe('spanning events', () => {
  test('first day', () => {
    const date = dayjs().add(1, 'week').set('day', 3)
    const { isMultipleDays, isMultipleDaysStart, eventWeekDuration } = utils.getEventSpanningInfo(
      events[7],
      date,
      date.day(),
      0,
      true,
    )

    expect(isMultipleDays).toBe(true)
    expect(isMultipleDaysStart).toBe(true)
    expect(eventWeekDuration).toBe(4)
  })
  test('second day', () => {
    const date = dayjs().add(1, 'week').set('day', 4)
    const { isMultipleDays, isMultipleDaysStart, eventWeekDuration } = utils.getEventSpanningInfo(
      events[7],
      date,
      date.day(),
      0,
      true,
    )

    expect(isMultipleDays).toBe(true)
    expect(isMultipleDaysStart).toBe(false)
    expect(eventWeekDuration).toBe(3)
  })
  test('first day of second week', () => {
    const date = dayjs().add(2, 'week').set('day', 0)

    const { isMultipleDays, isMultipleDaysStart, eventWeekDuration } = utils.getEventSpanningInfo(
      events[7],
      date,
      date.day(),
      0,
      true,
    )

    expect(isMultipleDays).toBe(true)
    expect(isMultipleDaysStart).toBe(true)
    expect(eventWeekDuration).toBe(6)
  })
})

describe('enrichEvents', () => {
  test('should return empty when gets empty', () => {
    const events: ICalendarEventBase[] = []
    const groups = enrichEvents(events)
    expect(groups).toEqual({})
  })
  test('should add positions and overlap counts to sorted events when ends with a single group', () => {
    const eventsWithOverlaps = getEvents([
      { startHour: 1, endHour: 3 },
      { startHour: 1, endHour: 5 },
      { startHour: 2, endHour: 4 },
      { startHour: 4, endHour: 6 },
      { startHour: 6, endHour: 8 },
      { startHour: 7, endHour: 8 },
      { startHour: 8, endHour: 9 },
    ])

    const groups = enrichEvents(eventsWithOverlaps, true)

    expect(groups).toEqual({
      [dayjs().format(SIMPLE_DATE_FORMAT)]: [
        {
          ...eventsWithOverlaps[0],
          overlapPosition: 0,
          overlapCount: 4,
        },
        {
          ...eventsWithOverlaps[1],
          overlapPosition: 1,
          overlapCount: 4,
        },
        {
          ...eventsWithOverlaps[2],
          overlapPosition: 2,
          overlapCount: 4,
        },
        {
          ...eventsWithOverlaps[3],
          overlapPosition: 3,
          overlapCount: 4,
        },
        {
          ...eventsWithOverlaps[4],
          overlapPosition: 0,
          overlapCount: 2,
        },
        {
          ...eventsWithOverlaps[5],
          overlapPosition: 1,
          overlapCount: 2,
        },
        {
          ...eventsWithOverlaps[6],
          overlapPosition: 0,
          overlapCount: 1,
        },
      ],
    })
  })
  test('should add positions and overlap counts to sorted events when ends with a overlapping group', () => {
    const eventsWithOverlaps = getEvents([
      { startHour: 1, endHour: 3 },
      { startHour: 1, endHour: 5 },
      { startHour: 2, endHour: 4 },
      { startHour: 4, endHour: 6 },
      { startHour: 6, endHour: 8 },
      { startHour: 7, endHour: 8 },
      { startHour: 7, endHour: 9 },
    ])

    const groups = enrichEvents(eventsWithOverlaps, true)

    expect(groups).toEqual({
      [dayjs().format(SIMPLE_DATE_FORMAT)]: [
        {
          ...eventsWithOverlaps[0],
          overlapPosition: 0,
          overlapCount: 4,
        },
        {
          ...eventsWithOverlaps[1],
          overlapPosition: 1,
          overlapCount: 4,
        },
        {
          ...eventsWithOverlaps[2],
          overlapPosition: 2,
          overlapCount: 4,
        },
        {
          ...eventsWithOverlaps[3],
          overlapPosition: 3,
          overlapCount: 4,
        },
        {
          ...eventsWithOverlaps[4],
          overlapPosition: 0,
          overlapCount: 3,
        },
        {
          ...eventsWithOverlaps[5],
          overlapPosition: 1,
          overlapCount: 3,
        },
        {
          ...eventsWithOverlaps[6],
          overlapPosition: 2,
          overlapCount: 3,
        },
      ],
    })
  })
  test('should add positions to non-sorted events', () => {
    const eventsWithOverlaps = getEvents([
      { startHour: 1, endHour: 3 },
      { startHour: 6, endHour: 8 },
      { startHour: 2, endHour: 4 },
      { startHour: 4, endHour: 6 },
      { startHour: 8, endHour: 9 },
      { startHour: 1, endHour: 5 },
      { startHour: 7, endHour: 8 },
    ])

    const groups = enrichEvents(eventsWithOverlaps)

    expect(groups).toEqual({
      [dayjs().format(SIMPLE_DATE_FORMAT)]: [
        {
          ...eventsWithOverlaps[0],
          overlapPosition: 0,
          overlapCount: 4,
        },
        {
          ...eventsWithOverlaps[1],
          overlapPosition: 1,
          overlapCount: 4,
        },
        {
          ...eventsWithOverlaps[2],
          overlapPosition: 2,
          overlapCount: 4,
        },
        {
          ...eventsWithOverlaps[3],
          overlapPosition: 3,
          overlapCount: 4,
        },
        {
          ...eventsWithOverlaps[4],
          overlapPosition: 0,
          overlapCount: 2,
        },
        {
          ...eventsWithOverlaps[5],
          overlapPosition: 1,
          overlapCount: 2,
        },
        {
          ...eventsWithOverlaps[6],
          overlapPosition: 0,
          overlapCount: 1,
        },
      ],
    })
  })
})
