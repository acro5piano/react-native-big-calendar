import { isPlainObject, isSymbol } from 'is-what'

import { concatArrays } from './extensions.js'
import type { Assign } from './typeUtils/Assign.js'
import type { Pop } from './typeUtils/List.js'
import type { PrettyPrint } from './typeUtils/PrettyPrint.js'

/**
 * The return type of `merge()`. It reflects the type that is returned by JavaScript.
 *
 * This TS Utility can be used as standalone as well
 */
export type Merge<T, Ts extends unknown[]> = T extends Record<string | number | symbol, unknown>
  ? Ts extends Record<string | number | symbol, unknown>[]
    ? PrettyPrint<Assign<T, Ts>>
    : Pop<Ts>
  : Pop<Ts>

function assignProp(
  carry: Record<string | number | symbol, unknown>,
  key: string,
  newVal: any,
  originalObject: Record<string | number | symbol, unknown>,
): void {
  const propType = {}.propertyIsEnumerable.call(originalObject, key)
    ? 'enumerable'
    : 'nonenumerable'
  if (propType === 'enumerable') carry[key] = newVal
  if (propType === 'nonenumerable') {
    Object.defineProperty(carry, key, {
      value: newVal,
      enumerable: false,
      writable: true,
      configurable: true,
    })
  }
}

function mergeRecursively<
  T1 extends Record<string | number | symbol, unknown> | any,
  T2 extends Record<string | number | symbol, unknown> | any,
>(
  origin: T1,
  newComer: T2,
  compareFn?: (prop1: any, prop2: any, propName: string) => any,
): (T1 & T2) | T2 {
  // always return newComer if its not an object
  if (!isPlainObject(newComer)) return newComer
  // define newObject to merge all values upon
  let newObject = {} as (T1 & T2) | T2
  if (isPlainObject(origin)) {
    const props = Object.getOwnPropertyNames(origin)
    const symbols = Object.getOwnPropertySymbols(origin)
    newObject = [...props, ...symbols].reduce((carry, key) => {
      const targetVal = origin[key as string]
      if (
        (!isSymbol(key) && !Object.getOwnPropertyNames(newComer).includes(key)) ||
        (isSymbol(key) && !Object.getOwnPropertySymbols(newComer).includes(key))
      ) {
        assignProp(
          carry as Record<string | number | symbol, unknown>,
          key as string,
          targetVal,
          origin,
        )
      }
      return carry
    }, {} as (T1 & T2) | T2)
  }
  // newObject has all properties that newComer hasn't
  const props = Object.getOwnPropertyNames(newComer)
  const symbols = Object.getOwnPropertySymbols(newComer)
  const result = [...props, ...symbols].reduce((carry, key) => {
    // re-define the origin and newComer as targetVal and newVal
    let newVal = newComer[key as string]
    const targetVal = isPlainObject(origin) ? origin[key as string] : undefined
    // When newVal is an object do the merge recursively
    if (targetVal !== undefined && isPlainObject(newVal)) {
      newVal = mergeRecursively(targetVal, newVal, compareFn)
    }
    const propToAssign = compareFn ? compareFn(targetVal, newVal, key as string) : newVal
    assignProp(
      carry as Record<string | number | symbol, unknown>,
      key as string,
      propToAssign,
      newComer,
    )
    return carry
  }, newObject)
  return result
}

/**
 * Merge anything recursively.
 * Objects get merged, special objects (classes etc.) are re-assigned "as is".
 * Basic types overwrite objects or other basic types.
 */
export function merge<T, Tn extends unknown[]>(object: T, ...otherObjects: Tn): Merge<T, Tn> {
  return otherObjects.reduce((result, newComer) => {
    return mergeRecursively(result, newComer)
  }, object) as any
}

export function mergeAndCompare<T, Tn extends unknown[]>(
  compareFn: (prop1: any, prop2: any, propName: string | symbol) => any,
  object: T,
  ...otherObjects: Tn
): Merge<T, Tn> {
  return otherObjects.reduce((result, newComer) => {
    return mergeRecursively(result, newComer, compareFn)
  }, object) as any
}

export function mergeAndConcat<T, Tn extends unknown[]>(
  object: T,
  ...otherObjects: Tn
): Merge<T, Tn> {
  return otherObjects.reduce((result, newComer) => {
    return mergeRecursively(result, newComer, concatArrays)
  }, object) as any
}

// import { Timestamp } from '../test/Timestamp'
// type T1 = { date: Timestamp }
// type T2 = [{ b: string[] }, { b: number[] }, { date: Timestamp }]
// type TestT = Merge<T1, T2>

// type A1 = { arr: string[] }
// type A2 = { arr: number[] }
// type A3 = { arr: boolean[] }
// type TestA = Merge<A1, [A2, A3]>

// interface I1 {
//   date: Timestamp
// }
// interface I2 {
//   date: Timestamp
// }
// const _a: I2 = { date: '' } as unknown as I2
// type TestI = Merge<I1, [I2]>

// // ReturnType<(typeof merge)<I1, I2>>
// const a = merge(_a, [_a])

// interface Arguments extends Record<string | number | symbol, unknown> {
//     key: string;
// }

// const aa1: Arguments = { key: "value1" }
// const aa2: Arguments = { key: "value2" }
// const aa = merge(a1, a2);

// interface Barguments {
//   key: string
// }
// const ba1: Barguments = { key: 'value1' }
// const ba2: Barguments = { key: 'value2' }
// const ba = merge(ba1, ba2)

// interface Carguments {
//   key: string
// }
// const ca = merge<Carguments, Carguments[]>({ key: 'value1' }, { key: 'value2' })
// type P = Pop<Carguments[]>
