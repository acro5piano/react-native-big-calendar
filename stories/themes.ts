import { PartialTheme } from '../src'

export const themes: Record<string, PartialTheme> = {
  default: {},
  dark: {
    palette: {
      primary: {
        main: '#6185d0',
        contrastText: '#000',
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
      },
    },
    eventCellOverlappings: [
      {
        main: '#17651a',
        contrastText: '#fff',
      },
      {
        main: '#08540b',
        contrastText: '#fff',
      },
    ],
  },
} as const
