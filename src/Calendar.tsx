import * as React from 'react'
import dayjs from 'dayjs'
import { StyleSheet, Text, View } from 'react-native'
import { getDatesInWeek, getDatesInNextThreeDays } from './utils'
import { commonStyles } from './commonStyles'
import { CalendarHeader } from './CalendarHeader'

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

const hours = Array(24)
  .fill(0)
  .map((_, i) => i)

function formatHour(hour: number) {
  return `${hour}:00`
}

const DAY_MINUTES = 1440
const MIN_HEIGHT = 1200

function getEventCellPositionStyle({ end, start }: { end: dayjs.Dayjs; start: dayjs.Dayjs }) {
  const relativeHeight = 100 * (1 / DAY_MINUTES) * end.diff(start, 'minute')
  const relativeTop = (100 * (start.hour() * 60 + start.minute())) / DAY_MINUTES
  return {
    height: `${relativeHeight}%`,
    top: `${relativeTop}%`,
  }
}

export function Calendar({ events, style = {}, height, mode = '3days' }: CalendarProps) {
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

  const cellHeight = React.useMemo(() => Math.max(height - 30, MIN_HEIGHT) / 24, [height])

  return (
    <>
      <CalendarHeader cellHeight={cellHeight} dateRange={dateRange} style={style} />
      <View style={[styles.container, { height: height - cellHeight * 2 }, style]}>
        <View style={styles.inner}>
          <View style={[styles.body]}>
            <View style={[commonStyles.hourGuide]}>
              {hours.map(hour => (
                <View key={hour} style={{ height: cellHeight }}>
                  <Text style={commonStyles.guideText}>{formatHour(hour)}</Text>
                </View>
              ))}
            </View>
            {dateRange.map(date => (
              <View style={[{ flex: 1 }]} key={date.toString()}>
                {hours.map(hour => (
                  <View key={hour} style={[commonStyles.dateCell, { height: cellHeight }]}></View>
                ))}
                {dayJsConvertedEvents
                  .filter(
                    ({ start, end }) =>
                      start.isAfter(date.startOf('day')) && end.isBefore(date.endOf('day')),
                  )
                  .map(event => (
                    <View
                      key={event.start.toString()}
                      style={[styles.eventCell, getEventCellPositionStyle(event)]}
                    >
                      <Text style={styles.eventTitle}>{event.title}</Text>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'scroll',
  },
  inner: {
    minHeight: MIN_HEIGHT,
  },
  body: {
    flexDirection: 'row',
    flex: 1,
    minHeight: 800,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 12,
  },
  eventCell: {
    position: 'absolute' as const,
    backgroundColor: 'rgb(66, 133, 244)',
    zIndex: 100,
    width: '96%',
    alignSelf: 'center' as const,
    borderRadius: 3,
    padding: 4,
    color: '#fff',
  },
})
