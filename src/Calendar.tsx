import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'

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
  container: {},
})

export function Calendar({ events, height }: CalendarProps) {
  const containerStyle = {
    height,
    ...styles.container,
  }
  return (
    <View style={containerStyle}>
      {events.map(event => (
        <View key={event.start.toString()}>
          <Text>{event.title}</Text>
        </View>
      ))}
    </View>
  )
}
