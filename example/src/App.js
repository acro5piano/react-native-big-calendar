import React from 'react'
import { Calendar } from 'react-native-big-calendar'
import { View, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
})

const events = [
  {
    title: 'Meeting',
    start: new Date(2020, 1, 11, 10, 0),
    end: new Date(2020, 1, 11, 10, 30),
  },
  {
    title: 'Coffee break',
    start: new Date(2020, 1, 11, 15, 45),
    end: new Date(2020, 1, 11, 16, 30),
  },
]

export default function App() {
  return (
    <View style={styles.container}>
      <Calendar height={800} events={events} />
    </View>
  )
}
