import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { merge } from 'merge-anything'
import React from 'react'

import { defaultTheme } from '../theme/defaultTheme'
import { ThemeContext } from '../theme/ThemeContext'
import { ThemeInterface } from '../theme/ThemeInterface'
import { DeepPartial } from '../utility-types'
// import { typedMemo } from '../utils'
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

// export const Calendar = typedMemo(_Calendar)
export const Calendar = React.memo(_Calendar, (pre, nxt) => {
  return pre.events === nxt.events &&
    pre.date === nxt.date &&
    pre.mode === nxt.mode &&
    pre.ampm === nxt.ampm &&
    pre.hideNowIndicator === nxt.hideNowIndicator &&
    pre.locale === nxt.locale &&
    pre.overlapOffset === nxt.overlapOffset &&
    pre.scrollOffsetMinutes === nxt.scrollOffsetMinutes &&
    pre.delayScrollOffsetMinutes === nxt.delayScrollOffsetMinutes &&
    pre.animationScrollTo === nxt.animationScrollTo &&
    pre.showTime === nxt.showTime &&
    pre.swipeEnabled === nxt.swipeEnabled &&
    pre.weekStartsOn === nxt.weekStartsOn &&
    pre.weekEndsOn === nxt.weekEndsOn &&
    pre.maxVisibleEventCount === nxt.maxVisibleEventCount &&
    pre.todayHighlight === nxt.todayHighlight &&
    pre.onlyDuringDay === nxt.onlyDuringDay &&
    pre.slotDuration === nxt.slotDuration &&
    pre.cellHeightInHour === nxt.cellHeightInHour &&
    pre.countRenderEvent === nxt.countRenderEvent &&
  pre.timeoutCountRender === nxt.timeoutCountRender
})
