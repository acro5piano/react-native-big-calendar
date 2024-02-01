import dayjs from 'dayjs'
import React from 'react'
import { FlatList, Platform, Text, TextStyle, View, ViewStyle } from 'react-native'

import { u } from '../commonStyles'
import {
  CalendarCellStyle,
  EventCellStyle,
  EventRenderer,
  HorizontalDirection,
  ICalendarEventBase,
} from '../interfaces'
import { useTheme } from '../theme/ThemeContext'
import {
  SIMPLE_DATE_FORMAT,
  getCountOfEventsAtEvent,
  getOrderOfEvent,
  isToday,
} from '../utils/datetime'
import { stringHasContent } from '../utils/object'
import { typedMemo } from '../utils/react'
import { CalendarEvent } from './CalendarEvent'

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
  activeDate?: Date
  weekDayHeaderHighlightColor?: string
  dayHeaderHighlightColor?: string
  itemSeparatorComponent?: React.ComponentType<any> | null | undefined
}

function _Schedule<T extends ICalendarEventBase>({
  events,
  ampm,
  onPressEvent,
  eventCellStyle,
  showTime,
  isEventOrderingEnabled,
  overlapOffset,
  renderEvent,
  containerHeight,
  style,
  activeDate,
  weekDayHeaderHighlightColor = '',
  dayHeaderHighlightColor = '',
  itemSeparatorComponent,
}: ScheduleProps<T>) {
  const theme = useTheme()

  /**
   * Bind default style for eventCellStyle.
   */
  const eventStyles = React.useCallback(
    (event: T) => {
      // This default style  need for Schedule view
      const defaultEventStyle = {
        ...u['flex-column'],
        ...u['h-50'],
      }

      if (Array.isArray(eventCellStyle)) {
        return [...[defaultEventStyle], ...eventCellStyle]
      }
      if (typeof eventCellStyle === 'object') {
        return { ...defaultEventStyle, ...eventCellStyle }
      }
      if (typeof eventCellStyle === 'function') {
        const output = eventCellStyle(event)
        if (Array.isArray(output)) {
          return [...[defaultEventStyle], ...output]
        }
        if (typeof output === 'object') {
          return { ...defaultEventStyle, ...output }
        }
      }
      return defaultEventStyle
    },
    [eventCellStyle],
  )

  /**
   * Group by events by start date.
   */
  const getItem = React.useMemo(() => {
    const groupedData = events.reduce((result: any, item: T): any => {
      const startDate = dayjs(item.start).format(SIMPLE_DATE_FORMAT)
      if (!result[startDate]) {
        result[startDate] = []
      }
      result[startDate].push(item)
      return result
    }, {})

    return Object.values(groupedData)
  }, [events])

  const renderFlatListItem = (eventGroup: T[]): JSX.Element => {
    const date = dayjs(eventGroup[0].start)
    const shouldHighlight = activeDate ? date.isSame(activeDate, 'date') : isToday(date)

    return (
      <View style={[u['flex'], { padding: 2 }]}>
        <View style={[u['flex'], u['justify-center'], { width: '20%' }]}>
          <View
            style={[
              { width: 60, height: 60, borderRadius: 30 },
              u['flex'],
              u['justify-center'],
              u['items-center'],
              u['flex-column-reverse'],
            ]}
          >
            <Text
              style={[
                {
                  color: shouldHighlight
                    ? stringHasContent(dayHeaderHighlightColor)
                      ? dayHeaderHighlightColor
                      : theme.palette.primary.main
                    : theme.palette.gray['800'],
                },

                theme.typography.xl,
                u['text-center'],
                Platform.OS === 'web' &&
                  shouldHighlight &&
                  !stringHasContent(dayHeaderHighlightColor) &&
                  u['mt-6'],
              ]}
            >
              {date.format('D')}
            </Text>
            <Text
              style={[
                theme.typography.xs,
                {
                  color: shouldHighlight
                    ? stringHasContent(weekDayHeaderHighlightColor)
                      ? weekDayHeaderHighlightColor
                      : theme.palette.primary.main
                    : theme.palette.gray['500'],
                },
              ]}
            >
              {date.format('ddd')}
            </Text>
          </View>
        </View>
        <View style={[u['flex'], u['flex-column'], { width: '75%' }]}>
          {eventGroup.map((event: T, index) => {
            return (
              <View
                style={[u['flex-1'], u['overflow-hidden'], { marginTop: 2, marginBottom: 2 }]}
                key={index}
              >
                <CalendarEvent
                  key={`${index}${event.start}${event.title}${event.end}`}
                  event={event}
                  onPressEvent={onPressEvent}
                  eventCellStyle={eventStyles}
                  showTime={showTime}
                  eventCount={
                    isEventOrderingEnabled ? getCountOfEventsAtEvent(event, events) : undefined
                  }
                  eventOrder={isEventOrderingEnabled ? getOrderOfEvent(event, events) : undefined}
                  overlapOffset={overlapOffset}
                  renderEvent={renderEvent}
                  ampm={ampm}
                  mode="schedule"
                />
              </View>
            )
          })}
        </View>
      </View>
    )
  }

  return (
    <View style={{ ...style, height: containerHeight }}>
      <FlatList
        data={getItem}
        renderItem={({ item }: { item: any }) => renderFlatListItem(item)}
        ItemSeparatorComponent={itemSeparatorComponent}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  )
}

export const Schedule = typedMemo(_Schedule)
