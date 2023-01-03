import { storiesOf } from '@storybook/react'
import dayjs from 'dayjs'
import React from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'

import { Calendar, EventRenderer } from '../src'
import { AppHeader, HEADER_HEIGHT } from './components/AppHeader'
import { events } from './events'
import { useEvents } from './hooks'
import { styles } from './styles'

function alert(input: any) {
  // @ts-ignore
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.alert(String(input))
  }
  return Alert.alert('', String(input))
}

const MOBILE_HEIGHT = 736

storiesOf('showcase - Mobile', module)
  .add('day mode', () => (
    <View style={styles.mobile}>
      <Calendar
        height={MOBILE_HEIGHT}
        events={events}
        mode="day"
        onPressEvent={(event) => alert(event.title)}
      />
    </View>
  ))
  .add('3days mode', () => (
    <View style={styles.mobile}>
      <Calendar
        height={MOBILE_HEIGHT}
        events={events}
        mode="3days"
        onPressEvent={(event) => alert(event.title)}
      />
    </View>
  ))
  .add('week mode', () => (
    <View style={styles.mobile}>
      <Calendar hideHours height={MOBILE_HEIGHT} events={events} />
    </View>
  ))
  .add('Month mode', () => {
    const state = useEvents(events)
    return (
      <View style={styles.mobile}>
        <Calendar
          mode="month"
          height={MOBILE_HEIGHT}
          events={state.events}
          onPressEvent={(event) => alert(event.title)}
          onPressCell={state.addEvent}
        />
      </View>
    )
  })
  .add('with app header', () => (
    <View style={styles.mobile}>
      <AppHeader />
      <Calendar height={MOBILE_HEIGHT - HEADER_HEIGHT} events={events} />
    </View>
  ))
  .add('do not show time', () => (
    <View style={styles.mobile}>
      <Calendar height={MOBILE_HEIGHT} events={events} showTime={false} />
    </View>
  ))
  .add('on date changed', () => {
    const onChangeDate = React.useCallback(([start, end]) => {
      alert(`${start} - ${end}`)
    }, [])

    const renderEvent: EventRenderer = (event, touchableOpacityProps) => (
      <TouchableOpacity {...touchableOpacityProps}>
        <Text>{`${event.title}`}</Text>
      </TouchableOpacity>
    )

    return (
      <View style={styles.mobile}>
        <Calendar
          height={MOBILE_HEIGHT}
          events={events}
          onChangeDate={onChangeDate}
          renderEvent={renderEvent}
        />
      </View>
    )
  })
  .add('Hidden now indocator', () => (
    <View style={styles.mobile}>
      <Calendar height={MOBILE_HEIGHT} events={events} hideNowIndicator />
    </View>
  ))
  .add('RTL', () => {
    React.useEffect(() => {
      require('dayjs/locale/he')
    }, [])
    return (
      <View style={styles.mobile}>
        <Calendar isRTL locale="he" height={MOBILE_HEIGHT} events={events} />
      </View>
    )
  })
  .add('Custom week length', () => (
    <View style={styles.mobile}>
      <Calendar
        height={MOBILE_HEIGHT}
        events={events}
        mode={'custom'}
        weekStartsOn={1}
        weekEndsOn={5}
      />
    </View>
  ))
  .add('Month - Calendar Cell Style', () => (
    <View style={styles.mobile}>
      <Calendar
        height={MOBILE_HEIGHT}
        events={events}
        mode={'month'}
        calendarCellStyle={(date) => {
          let cellStyles = {
            backgroundColor: 'white',
            color: 'white',
          }

          const now = dayjs()

          const isBefore = dayjs(date).startOf('day').isBefore(now.startOf('day'))
          const isToday = dayjs(date).startOf('day').isSame(now.startOf('day'))
          const isAfter = dayjs(date).startOf('day').isAfter(now.startOf('day'))

          if (isBefore) {
            cellStyles = {
              ...cellStyles,
              backgroundColor: 'red',
            }
          } else if (isToday) {
            cellStyles = {
              ...cellStyles,
              backgroundColor: 'blue',
            }
          } else if (isAfter) {
            cellStyles = {
              ...cellStyles,
              backgroundColor: 'green',
            }
          } else {
            cellStyles = {
              ...cellStyles,
            }
          }

          return cellStyles
        }}
        calendarCellTextStyle={{ color: 'white' }}
      />
    </View>
  ))
  .add('Month - Event Cell - Even and Odd Row BgColor', () => (
    <View style={styles.mobile}>
      <Calendar
        height={MOBILE_HEIGHT}
        events={events}
        mode={'month'}
        calendarCellStyle={(_, index = 0) => {
          const isEvenRow = index % 2 === 0

          return {
            backgroundColor: isEvenRow ? 'red' : 'green',
          }
        }}
      />
    </View>
  ))
  .add('Week - Calendar Cell Style', () => (
    <View style={styles.mobile}>
      <Calendar
        height={MOBILE_HEIGHT}
        events={events}
        mode={'week'}
        calendarCellStyle={(date) => {
          let cellStyles = {
            backgroundColor: 'white',
            color: 'black',
          }

          const now = dayjs()

          const isBefore = dayjs(date).startOf('day').isBefore(now.startOf('day'))
          const isToday = dayjs(date).startOf('day').isSame(now.startOf('day'))
          const isAfter = dayjs(date).startOf('day').isAfter(now.startOf('day'))

          if (isBefore) {
            cellStyles = {
              ...cellStyles,
              backgroundColor: 'red',
            }
          } else if (isToday) {
            cellStyles = {
              ...cellStyles,
              backgroundColor: 'blue',
            }
          } else if (isAfter) {
            cellStyles = {
              ...cellStyles,
              backgroundColor: 'green',
            }
          } else {
            cellStyles = {
              ...cellStyles,
            }
          }

          return cellStyles
        }}
      />
    </View>
  ))
  .add('Week - Calendar Cell - Even and Odd Row BgColor', () => (
    <View style={styles.mobile}>
      <Calendar
        height={MOBILE_HEIGHT}
        events={events}
        mode={'week'}
        calendarCellStyle={(_, index = 0) => {
          const isEvenRow: boolean = index % 2 === 0

          return {
            backgroundColor: isEvenRow ? 'red' : 'green',
          }
        }}
      />
    </View>
  ))
