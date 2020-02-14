import { storiesOf } from '@storybook/react'
import dayjs from 'dayjs'
import React from 'react'
import { Dimensions, View, StyleSheet } from 'react-native'
import { Calendar } from '../src/Calendar'
import { events } from './events'
import { AppHeader, HEADER_HEIGHT } from './components/AppHeader'
import { Control, CONTROL_HEIGHT } from './components/Control'

const MOBILE_HEIGHT = 736
const SCREEN_HEIGHT = Dimensions.get('window').height

storiesOf('Desktop', module)
  .add('week mode', () => (
    <View style={styles.desktop}>
      <Calendar style={styles.calendar} height={SCREEN_HEIGHT} events={events} />
    </View>
  ))
  .add('3days mode', () => (
    <View style={styles.desktop}>
      <Calendar
        style={styles.calendar}
        height={SCREEN_HEIGHT}
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
        height={SCREEN_HEIGHT}
        events={events}
        eventCellStyle={event => {
          const backgroundColor = event.title.match(/Meeting/) ? 'red' : 'blue'
          return { backgroundColor }
        }}
      />
    </View>
  ))
  .add('with controls', () => {
    const [date, setDate] = React.useState(dayjs())
    const props = {
      onNext: React.useCallback(() => setDate(date.add(1, 'week')), [date]),
      onPrev: React.useCallback(() => setDate(date.add(-1, 'week')), [date]),
      onToday: React.useCallback(() => setDate(dayjs()), []),
    }

    return (
      <View style={styles.desktop}>
        <Control {...props} />
        <Calendar
          style={styles.calendar}
          height={SCREEN_HEIGHT - CONTROL_HEIGHT}
          events={events}
          date={date.toDate()}
          swipeEnabled={false}
        />
      </View>
    )
  })
  .add('scroll to some time', () => (
    <View style={styles.desktop}>
      <Calendar
        style={styles.calendar}
        height={SCREEN_HEIGHT}
        events={events}
        scrollOffsetMinutes={300}
      />
    </View>
  ))
  .add('week start on Monday', () => (
    <View style={styles.desktop}>
      <Calendar style={styles.calendar} height={SCREEN_HEIGHT} events={events} weekStartsOn={1} />
    </View>
  ))
  .add('all day event', () => {
    const _events = [
      ...events,
      {
        title: 'Vacation',
        start: dayjs()
          .add(-1, 'day')
          .set('hour', 0)
          .set('minute', 0)
          .toDate(),
        end: dayjs()
          .add(-1, 'day')
          .set('hour', 0)
          .set('minute', 0)
          .toDate(),
      },
    ]

    return (
      <View style={styles.desktop}>
        <Calendar
          style={styles.calendar}
          height={SCREEN_HEIGHT}
          events={_events}
          weekStartsOn={1}
        />
      </View>
    )
  })

storiesOf('Mobile', module)
  .add('week mode', () => (
    <View style={styles.mobile}>
      <Calendar style={styles.calendar} height={MOBILE_HEIGHT} events={events} />
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
      <Calendar style={styles.calendar} height={MOBILE_HEIGHT - HEADER_HEIGHT} events={events} />
    </View>
  ))
  .add('do not show time', () => (
    <View style={styles.mobile}>
      <Calendar style={styles.calendar} height={SCREEN_HEIGHT} events={events} showTime={false} />
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
