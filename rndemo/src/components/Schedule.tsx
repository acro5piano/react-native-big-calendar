import dayjs from 'dayjs'
import React, { useState } from 'react'
import {
  AccessibilityProps,
  Platform,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'

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
  eventCellAccessibilityProps?: AccessibilityProps
  calendarCellStyle?: CalendarCellStyle
  calendarCellAccessibilityProps?: AccessibilityProps
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
  locale: string
  scheduleMonthSeparatorStyle?: TextStyle
}

function _Schedule<T extends ICalendarEventBase>({
  events,
  ampm,
  onPressEvent,
  eventCellStyle,
  eventCellAccessibilityProps = {},
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
  locale,
  calendarCellAccessibilityProps = {},
  scheduleMonthSeparatorStyle,
}: ScheduleProps<T>) {
  const theme = useTheme()

  const eventStyles = React.useCallback(
    (event: T) => {
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

  const renderMonthSeparator = (date: dayjs.Dayjs): JSX.Element => (
    <View style={{ width: '100%' }}>
      <Text
        style={[
          { color: theme.palette.primary.main, textAlign: 'center', paddingVertical: 6 },
          scheduleMonthSeparatorStyle,
        ]}
      >
        {date.format('MMMM YYYY')}
      </Text>
    </View>
  )

  const renderFlatListItem = (eventGroup: T[], index: number): JSX.Element => {
    const date = dayjs(eventGroup[0].start).locale(locale)
    const shouldHighlight = activeDate ? date.isSame(activeDate, 'date') : isToday(date)
    const isNewMonth =
      index === 0 || !dayjs(eventGroup[0].start).isSame(events[index - 1].start, 'month')

    return (
      <ScaleDecorator>
        <View style={[u['flex'], { padding: 2, flexWrap: 'wrap' }]}>
          {isNewMonth && renderMonthSeparator(date)}
          <View style={[u['flex'], u['justify-center'], { width: '20%' }]}>
            <View
              style={[
                { width: 60, height: 60, borderRadius: 30 },
                u['flex'],
                u['justify-center'],
                u['items-center'],
                u['flex-column-reverse'],
              ]}
              {...calendarCellAccessibilityProps}
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
                    eventCellAccessibilityProps={eventCellAccessibilityProps}
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
      </ScaleDecorator>
    )
  }

  const [data, setData] = useState<any>(getItem)
  const onDragEnd = ({ data: newData }: { data: any }) => {
    // Update the data state with the new ordering
    setData(newData)

    // Flatten the nested array and map to extract titles
    const updatedTitles = newData.flat().map((item: { title: any }) => item.title)

    // Log the updated titles for debugging
    console.log('Updated Titles:', updatedTitles)
  }

  return (
    <View style={{ ...style, height: containerHeight }}>
      <DraggableFlatList
        data={data}
        onDragEnd={onDragEnd}
        ItemSeparatorComponent={itemSeparatorComponent}
        keyExtractor={(_, index) => index.toString()}
        // keyExtractor={(index: { toString: () => any }) => index.toString()}
        renderItem={({ item, drag, isActive }: { item: any; drag: any; isActive: any }) => (
          <TouchableOpacity
            onLongPress={drag}
            disabled={isActive}
            style={{
              padding: 20,
              backgroundColor: isActive ? '#f0f0f0' : '#ffffff',
              borderWidth: 1,
              borderColor: '#cccccc',
            }}
          >
            {renderFlatListItem(item, getItem.indexOf(item))}
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

export const Schedule = typedMemo(_Schedule)
