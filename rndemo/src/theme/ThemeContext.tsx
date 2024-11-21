import { createContext, useContext } from 'react'

import { defaultTheme } from './defaultTheme'

export const ThemeContext = createContext(defaultTheme)

export const useTheme = () => {
  const customTheme = useContext(ThemeContext)
  if (!customTheme) {
    return defaultTheme
  }
  return customTheme
}
