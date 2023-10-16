import React, { useMemo } from 'react'
import dayjs from 'dayjs'
import { FlatList, TextStyle, View, ViewStyle } from 'react-native'
import { typedMemo } from '../utils/react'
import {
  CalendarCellStyle,
  EventCellStyle,
  EventRenderer,
  HorizontalDirection,
  ICalendarEventBase,
} from '../interfaces'

interface ScheduleProps<T extends ICalendarEventBase> {
  events: T[]
  cellHeight: number
  containerHeight: number
  dateRange: dayjs.Dayjs[]
  scrollOffsetMinutes: number
  ampm: boolean
  showTime: boolean
  style: ViewStyle
  eventCellStyle?: EventCellStyle<T>
  calendarCellStyle?: CalendarCellStyle
  hideNowIndicator?: boolean
  overlapOffset?: number
  onLongPressCell?: (date: Date) => void
  onPressCell?: (date: Date) => void
  onPressEvent?: (event: T) => void
  onSwipeHorizontal?: (d: HorizontalDirection) => void
  renderEvent?: EventRenderer<T>
  headerComponent?: React.ReactElement | null
  headerComponentStyle?: ViewStyle
  hourStyle?: TextStyle
  hideHours?: Boolean
  isEventOrderingEnabled?: boolean
  showVerticalScrollIndicator?: boolean
}

function _Schedule<T extends ICalendarEventBase>({ events }: ScheduleProps<T>) {
  const renderFlatListItem = (item: T[]) => {
    console.log(item)
    return <></>
  }

  const getItem = useMemo(() => {
    const groupedData = events.reduce((result: any, item: T): any => {
      const startDate = dayjs(item.start).format('YYYY-MM-DD')
      if (!result[startDate]) {
        result[startDate] = []
      }
      result[startDate].push(item)
      return result
    }, {})

    return Object.values(groupedData)
  }, [events])

  return (
    <View>
      <FlatList data={getItem} renderItem={({ item }: { item: any }) => renderFlatListItem(item)} />
    </View>
  )
}

export const Schedule = typedMemo(_Schedule)
