import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { getDatesInWeek } from './utils'

interface BaseEvent {
  start: Date
  end: Date
  title: string
}

type Event<T = {}> = BaseEvent & T

interface CalendarProps<T = {}> {
  events: Event<T>[]
  height: number
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
  },
  dateCell: {
    borderWidth: 1,
    borderColor: '#eee',
  },
  hourGuide: {
    width: '5.5%',
  },
  dayColumnContainer: {
    width: '13.5%',
  },
  guideText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  eventTitle: {
    color: '#666',
    fontSize: 14,
  },
})

const hours = Array(24)
  .fill(0)
  .map((_, i) => i)

function formatHour(hour: number) {
  return `${hour}:00`
}

export function Calendar({ events, height }: CalendarProps) {
  const dayColumnStyles = [styles.dayColumnContainer, { height }]
  const cellHeight = (height - 30) / 24

  const datesInWeek = getDatesInWeek()

  return (
    <View style={[styles.container, { height }]}>
      <View style={[styles.hourGuide, { paddingTop: cellHeight * 2 }]}>
        {hours.map(hour => (
          <View style={{ height: cellHeight }}>
            <Text style={styles.guideText}>{formatHour(hour)}</Text>
          </View>
        ))}
      </View>
      {datesInWeek.map(date => (
        <View style={dayColumnStyles} key={date.toString()}>
          <View style={{ height: cellHeight }}>
            <Text style={styles.guideText}>{date.format('D(ddd)')}</Text>
          </View>
          <View style={[styles.dateCell, { height: cellHeight }]}></View>
          {hours.map(hour => {
            const event = events.find(event => event.start.getHours() === hour)
            if (!event) {
              return <View style={[styles.dateCell, { height: cellHeight }]} />
            }
            return (
              <View style={[styles.dateCell, { height: cellHeight }]}>
                <Text style={styles.eventTitle}>{event.title}</Text>
              </View>
            )
          })}
        </View>
      ))}
    </View>
  )
}
