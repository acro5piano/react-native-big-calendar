// We don't use Material UI, but this theme structure is inspired by the theme.
//
// https://material-ui.com/customization/default-theme/#default-theme
import { TextStyle } from 'react-native'

import { DeepPartial } from '../utils/utility-types'

export interface Palette {
  main: string
  contrastText: string
}

export type Typography = Pick<
  TextStyle,
  'fontFamily' | 'fontWeight' | 'fontSize' | 'lineHeight' | 'letterSpacing'
>

export interface ThemeInterface {
  palette: {
    primary: Palette
    nowIndicator: string
    gray: {
      // 50: string
      100: string
      200: string
      300: string
      // 400: string
      500: string
      // 600: string
      // 700: string
      800: string
      // 900: string
    }
    moreLabel: string
  }
  isRTL: boolean
  typography: {
    fontFamily?: string
    xs: Typography
    sm: Typography
    // md: Typography
    // lg: Typography
    xl: Typography
    moreLabel: Typography
  }
  eventCellOverlappings: readonly Palette[]
}

export type PartialTheme = DeepPartial<ThemeInterface>
