import { PartialTheme } from '../src'

export const themes: Record<string, PartialTheme> = {
  default: {},
  dark: {
    palette: {
      primary: {
        main: '#6185d0',
        contrastText: '#000',
        evenCellBg: '#000',
        oddCellBg: '#000',
      },
      gray: {
        '100': '#333',
        '200': '#666',
        '300': '#888',
        '500': '#aaa',
        '800': '#ccc',
      },
    },
  },
  green: {
    palette: {
      primary: {
        main: '#4caf50',
        contrastText: '#fff',
        evenCellBg: '#fff',
        oddCellBg: '#fff',
      },
    },
    eventCellOverlappings: [
      {
        main: '#17651a',
        contrastText: '#fff',
        evenCellBg: '#fff',
        oddCellBg: '#fff',
      },
      {
        main: '#08540b',
        contrastText: '#fff',
        evenCellBg: '#fff',
        oddCellBg: '#fff',
      },
    ],
  },
  green_bg: {
    palette: {
      primary: {
        main: '#4caf50',
        contrastText: '#fff',
        evenCellBg: '#f1f1f1',
        oddCellBg: '#fff',
      },
    },
    eventCellOverlappings: [
      {
        main: '#17651a',
        contrastText: '#fff',
        evenCellBg: '#fff',
        oddCellBg: '#fff',
      },
      {
        main: '#08540b',
        contrastText: '#fff',
        evenCellBg: '#fff',
        oddCellBg: '#fff',
      },
    ],
  },
} as const
