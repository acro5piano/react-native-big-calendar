import { storiesOf } from '@storybook/react'
import dayjs from 'dayjs'
import React from 'react'
import { Alert, Dimensions, View } from 'react-native'
import { Calendar } from '../src/Calendar'
import { Control, CONTROL_HEIGHT } from './components/Control'
import { events } from './events'
import { styles } from './styles'

function alert(input: any) {
  // @ts-ignore
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.alert(String(input))
  }
  return Alert.alert('', String(input))
}

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
  .add('AM/PM format', () => {
    return (
      <View style={styles.desktop}>
        <Calendar style={styles.calendar} ampm height={SCREEN_HEIGHT} events={events} />
      </View>
    )
  })
  .add('Hidden Now indicator', () => (
    <View style={styles.desktop}>
      <Calendar style={styles.calendar} height={SCREEN_HEIGHT} events={events} hideNowIndicator />
    </View>
  ))
  .add('More overlap padding', () => (
    <View style={styles.desktop}>
      <Calendar style={styles.calendar} height={SCREEN_HEIGHT} events={events} overlapOffset={70} />
    </View>
  ))
