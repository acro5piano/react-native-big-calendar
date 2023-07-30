import { TextStyle, ViewStyle } from 'react-native'

import { DeepPartial } from './utility-types'

export function objHasContent(obj: ViewStyle | TextStyle): boolean {
  return !!Object.keys(obj).length
}

export function stringHasContent(string: string): boolean {
  return !!string.length
}

function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

function keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as any
}

export function deepMerge<T extends object>(target: T, source: DeepPartial<T>): T {
  const output: T = Object.assign({}, target)
  if (isObject(target) && isObject(source)) {
    keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] })
        // @ts-ignore
        else output[key] = deepMerge(target[key], source[key])
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  return output
}
