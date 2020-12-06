import dayjs from 'dayjs'
import { DayJSConvertedEvent } from '../interfaces'
import * as utils from '../utils'

const events: DayJSConvertedEvent[] = [
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
]

function assertDateRange(expected: any[], actual: any[]) {
  const formatToIso = (a: any) => a.toISOString()
  expect(actual.map(formatToIso)).toEqual(expected.map(formatToIso))
}

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
})
