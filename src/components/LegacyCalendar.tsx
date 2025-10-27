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
import { CalendarContainerCore, type CalendarContainerCoreProps } from './CalendarContainerCore'

export interface LegacyCalendarProps<T extends ICalendarEventBase>
  extends CalendarContainerCoreProps<T> {
  theme?: DeepPartial<ThemeInterface>
  isRTL?: boolean
}

dayjs.extend(isBetween)

function _LegacyCalendar<T extends ICalendarEventBase>({
  theme = defaultTheme,
  isRTL,
  ...props
}: LegacyCalendarProps<T>) {
  const _theme = deepMerge(defaultTheme, theme) as ThemeInterface
  // TODO: Old prop support. This should be included in custom theme itself.
  if (isRTL !== undefined) {
    _theme.isRTL = isRTL
  }
  return (
    <ThemeContext.Provider value={_theme}>
      <CalendarContainerCore {...props} />
    </ThemeContext.Provider>
  )
}

export const LegacyCalendar = typedMemo(_LegacyCalendar)
