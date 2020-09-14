import { storiesOf } from '@storybook/react'
import dayjs from 'dayjs'
import React from 'react'
import { Alert, Dimensions, StyleSheet, View } from 'react-native'
import { Calendar } from '../src/Calendar'
import { AppHeader, HEADER_HEIGHT } from './components/AppHeader'
import { Control, CONTROL_HEIGHT } from './components/Control'
import { events } from './events'

function alert(input: any) {
  // @ts-ignore
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.alert(String(input))
  }
  return Alert.alert('', String(input))
}

const MOBILE_HEIGHT = 736
const SCREEN_HEIGHT = Dimensions.get('window').height

storiesOf('Desktop', module)
  .add('week mode', () => {
    const [additionalEvents, setAdditionalEvents] = React.useState<typeof events>([])

    const addEvent = (start: Date) => {
      // @ts-ignore
      const title = prompt('What is the event title?')
      if (title) {
        const end = dayjs(start).add(1, 'hour').toDate()
        setAdditionalEvents([...additionalEvents, { start, end, title: title }])
      }
    }

    return (
      <View style={styles.desktop}>
        <Calendar
          style={styles.calendar}
          height={SCREEN_HEIGHT}
          events={[...events, ...additionalEvents]}
          onPressEvent={(event) => alert(event.title)}
          onPressCell={addEvent}
        />
      </View>
    )
  })
  .add('3days mode', () => (
    <View style={styles.desktop}>
      <Calendar
        style={styles.calendar}
        height={SCREEN_HEIGHT}
        events={events}
        onPressEvent={(event) => alert(event.title)}
        onPressCell={() => void 0}
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
        eventCellStyle={(event) => {
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
        start: dayjs().add(1, 'day').set('hour', 0).set('minute', 0).toDate(),
        end: dayjs().add(1, 'day').set('hour', 0).set('minute', 0).toDate(),
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
  .add('on press date header', () => {
    return (
      <View style={styles.desktop}>
        <Calendar
          style={styles.calendar}
          height={SCREEN_HEIGHT}
          events={events}
          onPressDateHeader={(date) => alert(date)}
          mode="3days"
        />
      </View>
    )
  })
  .add('locale', () => {
    React.useEffect(() => {
      require('dayjs/locale/ja')
    }, [])
    return (
      <View style={styles.desktop}>
        <Calendar style={styles.calendar} locale="ja" height={SCREEN_HEIGHT} events={events} />
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
        onPressEvent={(event) => alert(event.title)}
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
  .add('on date changed', () => {
    const onChangeDate = React.useCallback(([start, end]) => {
      alert(`${start} - ${end}`)
    }, [])

    return (
      <View style={styles.mobile}>
        <Calendar
          style={styles.calendar}
          height={SCREEN_HEIGHT}
          events={events}
          onChangeDate={onChangeDate}
        />
      </View>
    )
  })

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
    // boxSizing: 'content-box',
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
})
