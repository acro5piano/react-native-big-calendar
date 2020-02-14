import { storiesOf } from '@storybook/react'
import React from 'react'
import { Dimensions, View, StyleSheet } from 'react-native'
import { Calendar } from '../src/Calendar'
import { events } from './events'
import { AppHeader, HEADER_HEIGHT } from './components/AppHeader'

const MOBILE_HEIGHT = 736

storiesOf('Desktop', module)
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
  .add('3days mode', () => (
    <View style={styles.desktop}>
      <Calendar
        style={styles.calendar}
        height={Dimensions.get('window').height}
        events={events}
        onPressEvent={event => alert(event.title)}
        mode="3days"
      />
    </View>
  ))
  .add('event cell style', () => (
    <View style={styles.desktop}>
      <Calendar
        style={styles.calendar}
        height={Dimensions.get('window').height}
        events={events}
        mode="week"
        eventCellStyle={event => {
          const backgroundColor = event.title.match(/Meeting/) ? 'red' : 'blue'
          return { backgroundColor }
        }}
      />
    </View>
  ))
  .add('scroll to some time', () => (
    <View style={styles.desktop}>
      <Calendar
        style={styles.calendar}
        height={Dimensions.get('window').height}
        events={events}
        mode="week"
        scrollOffsetMinutes={300}
      />
    </View>
  ))

storiesOf('Mobile', module)
  .add('week mode', () => (
    <View style={styles.mobile}>
      <Calendar style={styles.calendar} height={MOBILE_HEIGHT} events={events} mode="week" />
    </View>
  ))
  .add('3days mode', () => (
    <View style={styles.mobile}>
      <Calendar
        style={styles.calendar}
        height={MOBILE_HEIGHT}
        events={events}
        mode="3days"
        onPressEvent={event => alert(event.title)}
      />
    </View>
  ))
  .add('with app header', () => (
    <View style={styles.mobile}>
      <AppHeader />
      <Calendar
        style={styles.calendar}
        height={MOBILE_HEIGHT - HEADER_HEIGHT}
        events={events}
        mode="week"
      />
    </View>
  ))

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
