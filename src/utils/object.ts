import { TextStyle, ViewStyle } from 'react-native'

export function objHasContent(obj: ViewStyle | TextStyle): boolean {
  return !!Object.keys(obj).length
}

export function stringHasContent(string: string): boolean {
  return !!string.length
}
