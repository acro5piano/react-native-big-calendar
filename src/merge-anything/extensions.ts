import { isArray } from 'is-what'

export function concatArrays(originVal: any, newVal: any): any | any[] {
  if (isArray(originVal) && isArray(newVal)) {
    // concat logic
    return originVal.concat(newVal)
  }
  return newVal // always return newVal as fallback!!
}
