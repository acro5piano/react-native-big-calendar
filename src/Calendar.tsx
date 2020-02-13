import * as React from 'react'
import dayjs from 'dayjs'
import { StyleSheet, Text, View } from 'react-native'
import { getDatesInWeek, getDatesInNextThreeDays } from './utils'

interface BaseEvent {
  start: Date
  end: Date
  title: string
}

type Event<T = {}> = BaseEvent & T

type Mode = '3days' | 'week' | 'day'

interface CalendarProps<T = {}> {
  events: Event<T>[]
  height: number
  mode: Mode
  style: any
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#fff',
  },
  dateCell: {
    borderWidth: 1,
    borderColor: '#eee',
  },
  hourGuide: {
    width: '5%',
  },
  guideText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  eventTitle: {
    color: '#fff',
    fontSize: 14,
  },
})

const hours = Array(24)
  .fill(0)
  .map((_, i) => i)

function formatHour(hour: number) {
  return `${hour}:00`
}

const DAY_MINUTES = 1440

function getEventCellPositionStyle({ end, start }: { end: dayjs.Dayjs; start: dayjs.Dayjs }) {
  const relativeHeight = 100 * (1 / DAY_MINUTES) * end.diff(start, 'minute')
  const relativeTop = (100 * (start.hour() * 60 + start.minute())) / DAY_MINUTES
  return {
    position: 'absolute' as const,
    height: `${relativeHeight}%`,
    top: `${relativeTop}%`,
    backgroundColor: 'blue',
    zIndex: 100,
    width: '96%',
    alignSelf: 'center' as const,
    borderRadius: 3,
    padding: 4,
    color: '#fff',
  }
}

export function Calendar({ events, style, height, mode = '3days' }: CalendarProps) {
  const cellHeight = React.useMemo(() => (height - 30) / 24, [height])
  const cellWidth = React.useMemo(() => {
    switch (mode) {
      case '3days':
        return `${95 / 3}%`
      case 'week':
        return `${95 / 7}%`
      default:
        throw new Error('undefined mode')
    }
  }, [mode])
  const dayJsConvertedEvents = React.useMemo(
    () => events.map(e => ({ ...e, start: dayjs(e.start), end: dayjs(e.end) })),
    [events],
  )

  const dateRange = React.useMemo(() => {
    switch (mode) {
      case '3days':
        return getDatesInNextThreeDays()
      case 'week':
        return getDatesInWeek()
      default:
        throw new Error('undefined mode')
    }
  }, [mode])

  return (
    <View style={[styles.container, { height }, style]}>
      <View style={[styles.hourGuide, { paddingTop: cellHeight * 2 }]}>
        {hours.map(hour => (
          <View key={hour} style={{ height: cellHeight }}>
            <Text style={styles.guideText}>{formatHour(hour)}</Text>
          </View>
        ))}
      </View>
      {dateRange.map(date => (
        <View style={[{ height, width: cellWidth }]} key={date.toString()}>
          <View style={{ height: cellHeight }}>
            <Text style={styles.guideText}>{date.format('D(ddd)')}</Text>
          </View>
          <View style={[styles.dateCell, { height: cellHeight }]}></View>
          <View>
            {hours.map(hour => (
              <View key={hour} style={[styles.dateCell, { height: cellHeight }]}></View>
            ))}
            {dayJsConvertedEvents
              .filter(
                ({ start, end }) =>
                  start.isAfter(date.startOf('day')) && end.isBefore(date.endOf('day')),
              )

              .map(event => (
                <View key={event.start.toString()} style={getEventCellPositionStyle(event)}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                </View>
              ))}
          </View>
        </View>
      ))}
    </View>
  )
}
