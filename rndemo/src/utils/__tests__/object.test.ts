import { deepMerge } from '../object'

test('deepMerge', () => {
  let obj1 = {
    a: 1,
    b: {
      c: 2,
      d: 3,
      e: 4,
    },
    array: [1, 2, 3],
  }
  let obj2 = {
    a: 2,
    b: {
      c: 2,
      d: 3,
    },
    array: [4, 5],
  }
  expect(deepMerge(obj1, obj2)).toEqual({
    a: 2,
    b: {
      c: 2,
      d: 3,
      e: 4,
    },
    array: [4, 5],
  })
})
