import dayjs from 'dayjs'
import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native'

import { ICalendarEventBase, Mode } from './build'
import { Calendar } from './src/components/Calendar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

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
    title: 'Shopping',
    start: dayjs().add(11, 'day').set('hour', 14).set('minute', 0).toDate(),
    end: dayjs().add(11, 'day').set('hour', 15).set('minute', 0).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(11, 'day').set('hour', 18).set('minute', 0).toDate(),
    end: dayjs().add(11, 'day').set('hour', 19).set('minute', 0).toDate(),
  },
  {
    title: 'Go to movies',
    start: dayjs().add(11, 'day').set('hour', 20).set('minute', 0).toDate(),
    end: dayjs().add(11, 'day').set('hour', 22).set('minute', 0).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(12, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(12, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(12, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(12, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(12, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(12, 'day').set('hour', 17).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(12, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(12, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(13, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(13, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(24, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(24, 'day').set('hour', 18).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(24, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(24, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(25, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(25, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(25, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(25, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(25, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(25, 'day').set('hour', 18).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(25, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(25, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
]

export const App = () => {
  const { height } = useWindowDimensions()
  const [mode, setMode] = React.useState<Mode>('schedule')
  const [additionalEvents, setAdditionalEvents] = React.useState<ICalendarEventBase[]>([])

  const addEvent = React.useCallback(
    (start: Date) => {
      const title = 'new Event'
      const end = dayjs(start).add(59, 'minute').toDate()
      setAdditionalEvents([...additionalEvents, { start, end, title }])
    },
    [additionalEvents, setAdditionalEvents],
  )

  const addLongEvent = React.useCallback(
    (start: Date) => {
      const title = 'new Long Event'
      const end = dayjs(start).add(1, 'hour').add(59, 'minute').toDate()
      setAdditionalEvents([...additionalEvents, { start, end, title }])
    },
    [additionalEvents, setAdditionalEvents],
  )

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView>
        <Text style={styles.headline}>Calendar Mode</Text>
        <ScrollView horizontal={true}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => setMode('week')}
              style={[styles.buttonContainer, mode === 'week' && styles.buttonContainerActive]}
            >
              <Text>week</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('day')}
              style={[styles.buttonContainer, mode === 'day' && styles.buttonContainerActive]}
            >
              <Text>day</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('3days')}
              style={[styles.buttonContainer, mode === '3days' && styles.buttonContainerActive]}
            >
              <Text>3days</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('month')}
              style={[styles.buttonContainer, mode === 'month' && styles.buttonContainerActive]}
            >
              <Text>month</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('schedule')}
              style={[styles.buttonContainer, mode === 'schedule' && styles.buttonContainerActive]}
            >
              <Text>schedule</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Calendar
          height={height - 60}
          events={[...events, ...additionalEvents]}
          onLongPressCell={addLongEvent}
          onPressCell={addEvent}
          sortedMonthView={false}
          mode={mode}
          moreLabel="+{moreCount}"
          onPressMoreLabel={(moreEvents) => {
            console.log(moreEvents)
          }}
          itemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginEnd: 15,
  },
  buttonContainerActive: {
    borderBottomColor: 'blue',
    borderBottomWidth: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  headline: {
    fontSize: 16,
  },
  itemSeparator: {
    height: 5,
    marginBottom: 20,
  },
})
