import { storiesOf } from '@storybook/react'
import React from 'react'
import { Dimensions, View, StyleSheet } from 'react-native'
import dayjs from 'dayjs'
import { Calendar } from './Calendar'

const MOBILE_HEIGHT = 736

const styles = StyleSheet.create({
  desktop: {
    height: '100%',
  },
  mobile: {
    width: 414,
    height: MOBILE_HEIGHT,
    overflow: 'hidden',
    borderWidth: 10,
    borderRadius: 10,
    boxSizing: 'content-box',
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
})

const events = [
  {
    title: 'Meeting',
    start: dayjs()
      .set('hour', 10)
      .set('minute', 0)
      .toDate(),
    end: dayjs()
      .set('hour', 10)
      .set('minute', 30)
      .toDate(),
  },
  {
    title: 'Coffee break',
    start: dayjs()
      .set('hour', 14)
      .set('minute', 30)
      .toDate(),
    end: dayjs()
      .set('hour', 15)
      .set('minute', 30)
      .toDate(),
  },
  {
    title: 'Repair my car',
    start: dayjs()
      .add(1, 'day')
      .set('hour', 7)
      .set('minute', 45)
      .toDate(),
    end: dayjs()
      .add(1, 'day')
      .set('hour', 13)
      .set('minute', 30)
      .toDate(),
  },
]

storiesOf('Desktop', module)
  .add('3days mode', () => (
    <View style={styles.desktop}>
      <Calendar
        style={styles.calendar}
        height={Dimensions.get('window').height}
        events={events}
        mode="3days"
      />
    </View>
  ))
  .add('week mode', () => (
    <View style={styles.desktop}>
      <Calendar
        style={styles.calendar}
        height={Dimensions.get('window').height}
        events={events}
        mode="week"
      />
    </View>
  ))

storiesOf('Mobile', module)
  .add('3days mode', () => (
    <View style={styles.mobile}>
      <Calendar style={styles.calendar} height={MOBILE_HEIGHT} events={events} mode="3days" />
    </View>
  ))
  .add('week mode', () => (
    <View style={styles.mobile}>
      <Calendar style={styles.calendar} height={MOBILE_HEIGHT} events={events} mode="week" />
    </View>
  ))
