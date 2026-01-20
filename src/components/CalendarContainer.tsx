import dayjs from 'dayjs'
import React, { useRef } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import InfinitePager, { type InfinitePagerImperativeApi } from 'react-native-infinite-pager'

import type { ICalendarEventBase } from '../interfaces'
import { modeToNum } from '../utils/datetime'
import { typedMemo } from '../utils/react'
import { CalendarContainerCore, type CalendarContainerCoreProps } from './CalendarContainerCore'

export interface CalendarContainerProps<T extends ICalendarEventBase>
  extends CalendarContainerCoreProps<T> {
  /**
   * Enable/disable swipe paging. When false, native dependencies are not required.
   * Default: true
   */
  usePaging?: boolean
  swipeEnabled?: boolean
  resetPageOnPressCell?: boolean
  onSwipeEnd?: (date: Date) => void
}

function _CalendarContainer<T extends ICalendarEventBase>({
  usePaging = true,
  swipeEnabled = true,
  resetPageOnPressCell = false,
  onSwipeEnd,
  mode = 'week',
  date,
  onPressCell,
  ...coreProps
}: CalendarContainerProps<T>) {
  const calendarRef = useRef<InfinitePagerImperativeApi>(null)

  // To ensure we have proper effect callback, use string to date comparision.
  const dateString = date?.toString()
  const [targetDate, setTargetDate] = React.useState(() => dayjs(date))

  React.useEffect(() => {
    if (dateString) {
      setTargetDate(dayjs(dateString))
    }
  }, [dateString])

  React.useEffect(() => {
    if (usePaging) {
      calendarRef.current?.setPage(0, { animated: false })
    }
  }, [usePaging])

  const getCurrentDate = React.useCallback(
    (page: number) => {
      return targetDate.add(modeToNum(mode, targetDate, page), 'day')
    },
    [mode, targetDate],
  )

  // Handle cell press with page reset
  const handlePressCell = React.useCallback(
    (date: Date) => {
      onPressCell?.(date)
      if (resetPageOnPressCell && usePaging) {
        calendarRef.current?.setPage(0, { animated: true })
      }
    },
    [onPressCell, resetPageOnPressCell, usePaging],
  )

  // Non-paging mode
  if (!usePaging) {
    return (
      <CalendarContainerCore {...coreProps} mode={mode} date={date} onPressCell={handlePressCell} />
    )
  }

  // Paging mode for month view
  if (mode === 'month') {
    return (
      <InfinitePager
        ref={calendarRef}
        style={{ flex: 1 }}
        pageWrapperStyle={{ flex: 1 }}
        renderPage={({ index }) => (
          <CalendarContainerCore
            {...coreProps}
            mode={mode}
            date={getCurrentDate(index).toDate()}
            onPressCell={handlePressCell}
            ScrollViewComponent={ScrollView}
          />
        )}
        onPageChange={(page) => onSwipeEnd?.(getCurrentDate(page).toDate())}
        pageBuffer={2}
      />
    )
  }

  // Paging mode for week/day/other views
  return (
    <InfinitePager
      ref={calendarRef}
      renderPage={({ index }) => (
        <CalendarContainerCore
          {...coreProps}
          mode={mode}
          date={getCurrentDate(index).toDate()}
          onPressCell={handlePressCell}
          ScrollViewComponent={ScrollView}
        />
      )}
      onPageChange={(page) => onSwipeEnd?.(getCurrentDate(page).toDate())}
      pageBuffer={2}
    />
  )
}

export const CalendarContainer = typedMemo(_CalendarContainer)
