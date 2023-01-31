import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import type { merge as TMerge } from 'merge-anything'
import React from 'react'

import { ICalendarEventBase } from '../interfaces'
import { defaultTheme } from '../theme/defaultTheme'
import { ThemeContext } from '../theme/ThemeContext'
import { ThemeInterface } from '../theme/ThemeInterface'
import { DeepPartial } from '../utility-types'
import { typedMemo } from '../utils'
import { CalendarContainer, CalendarContainerProps } from './CalendarContainer'

// Since Metro Bundler does not load .cjs and .es.js files, we should require it like this.
// It is still possible to use .cjs by changing Metro config, but it forces library users to take an additional step.
// So this workaround is better.
const merge = require('merge-anything/dist/index.es').merge as typeof TMerge

export interface CalendarProps<T extends ICalendarEventBase> extends CalendarContainerProps<T> {
  theme?: DeepPartial<ThemeInterface>
  isRTL?: boolean
}

dayjs.extend(isBetween)

function _Calendar<T extends ICalendarEventBase>({
  theme = defaultTheme,
  isRTL,
  ...props
}: CalendarProps<T>) {
  const _theme = merge(defaultTheme, theme, { isRTL }) as ThemeInterface
  return (
    <ThemeContext.Provider value={_theme}>
      <CalendarContainer {...props} />
    </ThemeContext.Provider>
  )
}

export const Calendar = typedMemo(_Calendar)
