import dayjs from 'dayjs'
import React from 'react'
import { Dimensions, Picker, SafeAreaView, StatusBar, View } from 'react-native'

import { Calendar, ICalendarEvent, Mode } from './build'

const events = [
  {
    title: 'Meeting',
    start: dayjs().set('hour', 10).set('minute', 0).toDate(),
    end: dayjs().set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Coffee break',
    start: dayjs().set('hour', 14).set('minute', 30).toDate(),
    end: dayjs().set('hour', 15).set('minute', 30).toDate(),
  },
  {
    title: 'Repair my car',
    start: dayjs().add(1, 'day').set('hour', 7).set('minute', 45).toDate(),
    end: dayjs().add(1, 'day').set('hour', 13).set('minute', 30).toDate(),
  },
]

export const App = () => {
  const [mode, setMode] = React.useState<Mode>('week')
  const [additionalEvents, setAdditionalEvents] = React.useState<ICalendarEvent[]>([])

  const addEvent = React.useCallback(
    (start) => {
      const title = 'new Event'
      const end = dayjs(start).add(59, 'minute').toDate()
      setAdditionalEvents([...additionalEvents, { start, end, title }])
    },
    [additionalEvents, setAdditionalEvents],
  )

  return (
    <React.Fragment>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <View style={{ height: 60, borderBottomWidth: 0.5 }}>
          <View style={{ width: '50%', marginLeft: 'auto' }}>
            <Picker onValueChange={setMode} mode="dropdown">
              <Picker.Item value="week" label="week" />
              <Picker.Item value="day" label="day" />
              <Picker.Item value="3days" label="3days" />
              <Picker.Item value="month" label="month" />
            </Picker>
          </View>
        </View>
        <Calendar
          height={Dimensions.get('window').height - 60}
          events={[...events, ...additionalEvents]}
          onPressCell={addEvent}
          mode={mode}
          minTime="07:00"
          maxTime="17:00"
          steps={30}
        />
      </SafeAreaView>
    </React.Fragment>
  )
}
