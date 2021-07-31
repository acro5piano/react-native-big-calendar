// We don't use Material UI, but this theme structure is inspired by the theme.
//
// https://material-ui.com/customization/default-theme/#default-theme

export interface Palette {
  main: string
  contrastText: string
}

export type Direction = 'rtl' | 'ltr'

export interface Typography {
  fontFamily?: string
  fontWeight?: string
  fontSize: number
  lineHeight?: number
  letterSpacing?: number
}

export interface ThemeInterface {
  palette: {
    primary: Palette
    gray: {
      50: string
      100: string
      200: string
      300: string
      400: string
      500: string
      600: string
      700: string
      800: string
      900: string
    }
  }
  direction: Direction
  isRTL: boolean
  typography: {
    fontFamily?: string
    xs: Typography
    sm: Typography
    // md: Typography
    // lg: Typography
    xl: Typography
  }
  eventCellOverlappings: Palette[]
}
