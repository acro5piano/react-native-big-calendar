import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { Calendar } from 'react-native-big-calendar'
import { events } from './events'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    height: '100%',
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
})

export default function App() {
  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        height={Dimensions.get('window').height}
        events={events}
        mode="3days"
      />
    </View>
  )
}
