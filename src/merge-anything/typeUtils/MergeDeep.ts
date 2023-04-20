/**
 * Get the keys of `O` that are optional
 * @param O
 * @returns [[Key]]
 * @example
 * ```ts
 * ```
 */
type OptionalKeys<O extends object> = O extends unknown
  ? {
      [K in keyof O]-?: {} extends Pick<O, K> ? K : never
    }[keyof O]
  : never

/**
 * Get the keys of `O` that are required
 * @param O
 * @returns [[Key]]
 * @example
 * ```ts
 * ```
 */
type RequiredKeys<O extends object> = O extends unknown
  ? {
      [K in keyof O]-?: {} extends Pick<O, K> ? never : K
    }[keyof O]
  : never

type MergeObjectDeeply<
  O extends Record<string | number | symbol, unknown>,
  O1 extends Record<string | number | symbol, unknown>,
> = {
  [K in keyof (O & O1)]: K extends RequiredKeys<O1> // second prop is non-optional
    ? MergeObjectsOrReturnFallback<O[K], O1[K], O1[K]> // return second prop
    : K extends OptionalKeys<O1> // second prop is optional
    ? K extends OptionalKeys<O> // first prop is optional (second prop also)
      ? MergeObjectsOrReturnFallback<
          Exclude<O[K], undefined>,
          Exclude<O1[K], undefined>,
          Exclude<O[K], undefined> | Exclude<O1[K], undefined>
        > // return union
      : K extends RequiredKeys<O> // first prop required (second prop optional)
      ? Exclude<O1[K], undefined> extends O[K] // (optional) second prop has the same type as the (required) first prop
        ? O[K] // return only the first one
        : MergeObjectsOrReturnFallback<
            O[K],
            Exclude<O1[K], undefined>,
            O[K] | Exclude<O1[K], undefined>
          > // (optional) second prop has a different type as the (required) first prop, so return union without `undefined` in the second
      : O1[K] // first prop inexistent, so return second prop
    : O[K] // second prop inexistent, so return first prop
}

type MergeObjectsOrReturnFallback<O, O1, Fallback> = O extends Record<
  string | number | symbol,
  unknown
>
  ? O1 extends Record<string | number | symbol, unknown>
    ? MergeObjectDeeply<O, O1>
    : Fallback
  : Fallback

/**
 * Accurately merge the fields of `O` with the ones of `O1`. It is
 * equivalent to the spread operator in JavaScript. [[Union]]s and [[Optional]]
 * fields will be handled gracefully.
 *
 * (⚠️ needs `--strictNullChecks` enabled)
 * @param O to complete
 * @param O1 to copy from
 * @returns [[Object]]
 * @example
 * ```ts
 * import { PrettyPrint } from './PrettyPrint'
 *
 * type A1 = { a: number; b?: number;            d?: number; e?: number; x: string;             y?: number; z: string;  } // prettier-ignore
 * type A2 = { a?: number;           c?: number; d?: number; e: number;  x: number | undefined; y?: string; z?: number; } // prettier-ignore
 *
 * type Result = PrettyPrint<MergeDeep<A1, A2>>
 * {
 *    a: number;
 *    b?: number | undefined;
 *    c?: number | undefined;
 *    d?: number | undefined;
 *    e: number;
 *    x: number | undefined;
 *    y?: string | number | undefined;
 *    z: string | number;
 * }
 * ```
 */
export type MergeDeep<
  O extends Record<string | number | symbol, unknown>,
  O1 extends Record<string | number | symbol, unknown>,
> = O extends unknown ? (O1 extends unknown ? MergeObjectDeeply<O, O1> : never) : never

// import { PrettyPrint } from './PrettyPrint'
// type A1 = { arr: string[]; barr?: { b: number } }
// type A2 = { arr?: number[]; barr?: { b: number } }
// type TestA = PrettyPrint<MergeDeep<A1, A2>>

// type B1 = { a: number; b?: number;            d?: number; e?: number; x: string;             y?: number; z: string;  } // prettier-ignore
// type B2 = { a?: number;           c?: number; d?: number; e: number;  x: number | undefined; y?: string; z?: number; } // prettier-ignore
// type TestB = PrettyPrint<MergeDeep<B1, B2>>

// type C1 = { info: { time: string; newDate: Date; very: { deep: { prop: boolean } } } }
// type C2 = { info: { date: string; very: { deep: { prop: boolean } } } }
// type TestC = PrettyPrint<MergeDeep<C1, C2>>

// type D1 = { [key in string]?: { cool: boolean } | null }
// type D2 = { [key in string]?: { notCool: boolean } | null }
// type TestD = PrettyPrint<MergeDeep<D1, D2>>

// import { Timestamp } from '../../test/Timestamp'
// type T1 = { date: Timestamp }
// type T2 = { date: Timestamp }
// type TestT = MergeDeep<T1, T2>

// interface I1 { date: Timestamp }
// interface I2 { date: Timestamp }
// type TestI = MergeDeep<I1, I2>
