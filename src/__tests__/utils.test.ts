import * as utils from '../utils'

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

describe('quartenizeHour', () => {
  test('case1', () => {
    const actual = utils.quartenizeHour(3.6)
    expect(actual).toEqual([3, 30])
  })

  test('case2', () => {
    const actual = utils.quartenizeHour(3.9)
    expect(actual).toEqual([3, 45])
  })

  test('case3', () => {
    const actual = utils.quartenizeHour(17)
    expect(actual).toEqual([17, 0])
  })
})
