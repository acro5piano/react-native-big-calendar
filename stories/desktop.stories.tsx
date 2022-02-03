import 'dayjs/locale/ja'

import { storiesOf } from '@storybook/react'
import dayjs from 'dayjs'
import React from 'react'
import { Alert, Dimensions, View } from 'react-native'

import { Calendar } from '../src'
import { CONTROL_HEIGHT, Control } from './components/Control'
import { customEventRenderer, events, spanningEvents } from './events'
import { useEvents } from './hooks'
import { styles } from './styles'
import { themes } from './themes'

function alert(input: any) {
  // @ts-ignore
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.alert(String(input))
  }
  return Alert.alert('', String(input))
}

const SCREEN_HEIGHT = Dimensions.get('window').height

storiesOf('showcase - Desktop', module)
  .add('day mode', () => (
    <View style={styles.desktop}>
      <Calendar
        height={SCREEN_HEIGHT}
        events={events}
        onPressEvent={(event) => alert(event.title)}
        onPressCell={() => void 0}
        mode="day"
        dragEndCallback={(data) =>
          alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
        }
      />
    </View>
  ))
  .add('3days mode', () => (
    <View style={styles.desktop}>
      <Calendar
        height={SCREEN_HEIGHT}
        events={events}
        onPressEvent={(event) => alert(event.title)}
        onPressCell={() => void 0}
        mode="3days"
        dragEndCallback={(data) =>
          alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
        }
      />
    </View>
  ))
  .add('Week mode', () => {
    const state = useEvents(events)
    return (
      <View style={styles.desktop}>
        <Calendar
          height={SCREEN_HEIGHT}
          events={state.events}
          onPressEvent={(event) => alert(event.title)}
          onPressCell={state.addEvent}
          dragEndCallback={(data) =>
            alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
          }
        />
      </View>
    )
  })
  .add('Week mode with minHour and maxHour props', () => {
    const state = useEvents(events)
    return (
      <View style={styles.desktop}>
        <Calendar
          height={SCREEN_HEIGHT}
          events={state.events}
          minHour={6}
          maxHour={19}
          onPressEvent={(event) => alert(event.title)}
          onPressCell={state.addEvent}
          dragEndCallback={(data) =>
            alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
          }
        />
      </View>
    )
  })
  .add('Week mode with drag disabled', () => {
    const state = useEvents(events)
    return (
      <View style={styles.desktop}>
        <Calendar
          height={SCREEN_HEIGHT}
          events={state.events}
          onPressEvent={(event) => alert(event.title)}
          onPressCell={state.addEvent}
          disableDrag
          swipeEnabled
          dragEndCallback={(data) =>
            alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
          }
        />
      </View>
    )
  })
  .add('Week mode with medium drag precision', () => {
    const state = useEvents(events)
    return (
      <View style={styles.desktop}>
        <Calendar
          height={SCREEN_HEIGHT}
          events={state.events}
          onPressEvent={(event) => alert(event.title)}
          onPressCell={state.addEvent}
          dragPrecision="medium"
          dragEndCallback={(data) =>
            alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
          }
        />
      </View>
    )
  })
  .add('Week mode with high drag precision', () => {
    const state = useEvents(events)
    return (
      <View style={styles.desktop}>
        <Calendar
          height={SCREEN_HEIGHT}
          events={state.events}
          onPressEvent={(event) => alert(event.title)}
          onPressCell={state.addEvent}
          dragPrecision="high"
          dragEndCallback={(data) =>
            alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
          }
        />
      </View>
    )
  })
  .add('Month mode', () => {
    const state = useEvents(events)
    return (
      <View style={styles.desktop}>
        <Calendar
          mode="month"
          height={SCREEN_HEIGHT}
          events={[
            ...state.events,
            {
              start: dayjs().add(2, 'days').toDate(),
              end: dayjs().add(2, 'days').add(5, 'hours').toDate(),
              title: 'This is sooooo long name event which will be truncated',
            },
          ]}
          onPressEvent={(event) => alert(event.title)}
          onPressCell={state.addEvent}
        />
      </View>
    )
  })
  .add('Month mode - RTL', () => {
    const state = useEvents(events)
    return (
      <View style={styles.desktop}>
        <Calendar
          mode="month"
          height={SCREEN_HEIGHT}
          isRTL
          events={state.events}
          onPressEvent={(event) => alert(event.title)}
          onPressCell={state.addEvent}
        />
      </View>
    )
  })
  .add('Month mode - Spanning Events', () => {
    const state = useEvents(spanningEvents)
    return (
      <View style={styles.desktop}>
        <Calendar
          mode="month"
          height={SCREEN_HEIGHT}
          events={state.events}
          onPressEvent={(event) => alert(event.title)}
          onPressCell={state.addEvent}
        />
      </View>
    )
  })
  .add('Month mode - Spanning Events RTL', () => {
    const state = useEvents(spanningEvents)
    return (
      <View style={styles.desktop}>
        <Calendar
          mode="month"
          height={SCREEN_HEIGHT}
          events={state.events}
          onPressEvent={(event) => alert(event.title)}
          onPressCell={state.addEvent}
          isRTL
        />
      </View>
    )
  })
  .add('event cell style', () => (
    <View style={styles.desktop}>
      <Calendar
        height={SCREEN_HEIGHT}
        events={events}
        eventCellStyle={(event) => {
          const backgroundColor = event.title.match(/Meeting/) ? 'red' : 'blue'
          return { backgroundColor }
        }}
        dragEndCallback={(data) =>
          alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
        }
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
          height={SCREEN_HEIGHT - CONTROL_HEIGHT}
          events={events}
          date={date.toDate()}
          swipeEnabled={false}
          dragEndCallback={(data) =>
            alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
          }
        />
      </View>
    )
  })
  .add('scroll to some time', () => (
    <View style={styles.desktop}>
      <Calendar
        height={SCREEN_HEIGHT}
        events={events}
        scrollOffsetMinutes={300}
        dragEndCallback={(data) =>
          alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
        }
      />
    </View>
  ))
  .add('week start on Monday', () => (
    <View style={styles.desktop}>
      <Calendar
        height={SCREEN_HEIGHT}
        events={events}
        weekStartsOn={1}
        dragEndCallback={(data) =>
          alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
        }
      />
    </View>
  ))
  .add('all day event', () => {
    const monday = dayjs().day(1)
    const _events = [
      {
        title: 'Holiday',
        start: monday.set('hour', 0).set('minute', 0).toDate(),
        end: monday.set('hour', 0).set('minute', 0).toDate(),
      },
      {
        title: 'Vacation',
        start: monday.set('hour', 0).set('minute', 0).toDate(),
        end: monday.add(2, 'day').set('hour', 0).set('minute', 0).toDate(),
      },
      {
        title: 'Vacation Recovery',
        start: monday.add(4, 'day').set('hour', 0).set('minute', 0).toDate(),
        end: monday.add(4, 'day').set('hour', 0).set('minute', 0).toDate(),
      },
    ]

    return (
      <View style={styles.desktop}>
        <Calendar
          height={SCREEN_HEIGHT}
          events={_events}
          weekStartsOn={1}
          dragEndCallback={(data) =>
            alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
          }
        />
      </View>
    )
  })
  .add('on press date header', () => {
    return (
      <View style={styles.desktop}>
        <Calendar
          height={SCREEN_HEIGHT}
          events={events}
          onPressDateHeader={(date) => alert(date)}
          mode="3days"
          dragEndCallback={(data) =>
            alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
          }
        />
      </View>
    )
  })
  .add('locale', () => {
    return (
      <View style={styles.desktop}>
        <Calendar
          locale="ja"
          height={SCREEN_HEIGHT}
          events={events}
          dragEndCallback={(data) =>
            alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
          }
        />
      </View>
    )
  })
  .add('AM/PM format', () => {
    return (
      <View style={styles.desktop}>
        <Calendar
          ampm
          height={SCREEN_HEIGHT}
          events={events}
          dragEndCallback={(data) =>
            alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
          }
        />
      </View>
    )
  })
  .add('Hidden Now indicator', () => (
    <View style={styles.desktop}>
      <Calendar
        height={SCREEN_HEIGHT}
        events={events}
        hideNowIndicator
        dragEndCallback={(data) =>
          alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
        }
      />
    </View>
  ))
  .add('More overlap padding', () => (
    <View style={styles.desktop}>
      <Calendar
        height={SCREEN_HEIGHT}
        events={events}
        overlapOffset={70}
        dragEndCallback={(data) =>
          alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
        }
      />
    </View>
  ))
  .add('RTL', () => {
    React.useEffect(() => {
      require('dayjs/locale/he')
    }, [])
    return (
      <View style={styles.desktop}>
        <Calendar
          locale="he"
          height={SCREEN_HEIGHT}
          events={events}
          isRTL
          dragEndCallback={(data) =>
            alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
          }
        />
      </View>
    )
  })
  .add('Custom Event Component renderer', () => {
    return (
      <View style={styles.desktop}>
        <Calendar
          height={SCREEN_HEIGHT}
          renderEvent={customEventRenderer}
          events={events}
          dragEndCallback={(data) =>
            alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
          }
        />
      </View>
    )
  })
  .add('Custom week length', () => (
    <View style={styles.desktop}>
      <Calendar
        height={SCREEN_HEIGHT}
        events={events}
        mode={'custom'}
        weekStartsOn={1}
        weekEndsOn={5}
        dragEndCallback={(data) =>
          alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
        }
      />
    </View>
  ))
  .add('Event spanning multiple days', () => (
    <View style={styles.desktop}>
      <Calendar
        height={SCREEN_HEIGHT}
        events={[
          {
            title: 'Multiple span',
            start: dayjs().toDate(),
            end: dayjs().add(28, 'hour').toDate(),
          },
          {
            title: 'Multiple span longer',
            start: dayjs().add(29, 'hour').toDate(),
            end: dayjs().add(64, 'hour').toDate(),
          },
        ]}
        eventCellStyle={(event) => (/longer/.test(event.title) ? { backgroundColor: 'green' } : {})}
        mode={'week'}
        dragEndCallback={(data) =>
          alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
        }
      />
    </View>
  ))
  .add('Provide custom theme', () => {
    const state = useEvents(events)
    return (
      <View style={styles.desktop}>
        <Calendar
          height={SCREEN_HEIGHT}
          events={state.events}
          onPressEvent={(event) => alert(event.title)}
          onPressCell={state.addEvent}
          theme={{
            palette: {
              primary: {
                main: 'purple',
                contrastText: '#fff',
              },
            },
          }}
          dragEndCallback={(data) =>
            alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
          }
        />
      </View>
    )
  })
  .add('Dark mode', () => {
    const state = useEvents(events)
    return (
      <View style={[styles.desktop, { backgroundColor: '#333' }]}>
        <Calendar
          height={SCREEN_HEIGHT}
          events={state.events}
          onPressEvent={(event) => alert(event.title)}
          onPressCell={state.addEvent}
          theme={themes.dark}
          dragEndCallback={(data) =>
            alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
          }
        />
      </View>
    )
  })
  .add('Without the header', () => {
    const state = useEvents(events)
    return (
      <View style={[styles.desktop]}>
        <Calendar
          height={SCREEN_HEIGHT}
          events={state.events}
          onPressEvent={(event) => alert(event.title)}
          onPressCell={state.addEvent}
          renderHeader={() => null}
          dragEndCallback={(data) =>
            alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
          }
        />
      </View>
    )
  })
  .add('Without the header (month)', () => {
    const state = useEvents(events)
    return (
      <View style={[styles.desktop]}>
        <Calendar
          height={SCREEN_HEIGHT}
          events={state.events}
          onPressEvent={(event) => alert(event.title)}
          onPressCell={state.addEvent}
          renderHeaderForMonthView={() => null}
          mode="month"
          dragEndCallback={(data) =>
            alert('you moved this event ' + data.day + 'days and ' + data.hour + 'hours')
          }
        />
      </View>
    )
  })
