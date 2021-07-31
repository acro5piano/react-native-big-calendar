import { merge } from 'merge-anything'
import * as React from 'react'
import { createContext, useContext } from 'react'

import { defaultTheme } from './defaultTheme'
import { ThemeInterface } from './ThemeInterface'

interface _DeepPartialArray<T> extends Array<DeepPartial<T>> {}
/** @private */
type _DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> }

export type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? _DeepPartialArray<U>
  : T extends object
  ? _DeepPartialObject<T>
  : T | undefined

export const ThemeContext = createContext(defaultTheme)

export const ThemeProvider: React.FC<{ value: DeepPartial<ThemeInterface> }> = ({
  children,
  value,
}) => {
  const theme = merge(defaultTheme, value, { isRTL: value.direction === 'rtl' }) as ThemeInterface
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const customTheme = useContext(ThemeContext)
  if (!customTheme) {
    return defaultTheme
  }
  return customTheme
}
