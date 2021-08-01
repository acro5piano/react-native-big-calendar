import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { merge } from 'merge-anything'
import React from 'react'

import { defaultTheme } from '../theme/defaultTheme'
import { ThemeContext } from '../theme/ThemeContext'
import { ThemeInterface } from '../theme/ThemeInterface'
import { DeepPartial } from '../utility-types'
import { typedMemo } from '../utils'
import { CalendarContainer, CalendarContainerProps } from './CalendarContainer'

export interface CalendarProps<T> extends CalendarContainerProps<T> {
  theme?: DeepPartial<ThemeInterface>
  isRTL?: boolean
}

dayjs.extend(isBetween)

function _Calendar<T>({ theme = defaultTheme, isRTL, ...props }: CalendarProps<T>) {
  const _theme = merge(defaultTheme, theme, { isRTL }) as ThemeInterface
  return (
    <ThemeContext.Provider value={_theme}>
      <CalendarContainer {...props} />
    </ThemeContext.Provider>
  )
}

export const Calendar = typedMemo(_Calendar)
