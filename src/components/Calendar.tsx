import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import React from 'react'

import type { ICalendarEventBase } from '../interfaces'
import { ThemeContext } from '../theme/ThemeContext'
import type { ThemeInterface } from '../theme/ThemeInterface'
import { defaultTheme } from '../theme/defaultTheme'
import { deepMerge } from '../utils/object'
import { typedMemo } from '../utils/react'
import type { DeepPartial } from '../utils/utility-types'
import { CalendarContainer, type CalendarContainerProps } from './CalendarContainer'

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
  const _theme = deepMerge(defaultTheme, theme) as ThemeInterface
  // TODO: Old prop support. This should be included in custom theme itself.
  if (isRTL !== undefined) {
    _theme.isRTL = isRTL
  }
  return (
    <ThemeContext.Provider value={_theme}>
      <CalendarContainer {...props} />
    </ThemeContext.Provider>
  )
}

export const Calendar = typedMemo(_Calendar)
