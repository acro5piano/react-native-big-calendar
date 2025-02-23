import type { TextStyle, ViewStyle } from 'react-native'

import type { DeepPartial } from './utility-types'

export function objHasContent(obj: ViewStyle | TextStyle): boolean {
  return !!Object.keys(obj).length
}

export function stringHasContent(string: string): boolean {
  return !!string.length
}

// biome-ignore lint/suspicious/noExplicitAny: expected
function isObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item)
}

function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

export function deepMerge<T extends object>(target: T, source: DeepPartial<T>): T {
  const output: T = Object.assign({}, target)
  if (isObject(target) && isObject(source)) {
    for (const key of keys(source)) {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] })
        // @ts-ignore
        else output[key] = deepMerge(target[key], source[key])
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    }
  }
  return output
}
