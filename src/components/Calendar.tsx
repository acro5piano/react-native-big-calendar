import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import React from 'react'

import { ICalendarEventBase } from '../interfaces'
import { defaultTheme } from '../theme/defaultTheme'
import { ThemeContext } from '../theme/ThemeContext'
import { ThemeInterface } from '../theme/ThemeInterface'
import { deepMerge } from '../utils/object'
import { typedMemo } from '../utils/react'
import { DeepPartial } from '../utils/utility-types'
import { CalendarContainer, CalendarContainerProps } from './CalendarContainer'

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
  // TODO: Old prop support. This should be included in custom theme itself.
  if (isRTL !== undefined) {
    theme.isRTL = isRTL
  }
  const _theme = deepMerge(defaultTheme, theme) as ThemeInterface
  return (
    <ThemeContext.Provider value={_theme}>
      <CalendarContainer {...props} />
    </ThemeContext.Provider>
  )
}

export const Calendar = typedMemo(_Calendar)
