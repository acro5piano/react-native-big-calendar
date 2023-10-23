import dayjs from 'dayjs'
import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'

import { Calendar, ICalendarEventBase, Mode } from './build'

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
    title: 'Meeting again',
    start: dayjs().set('hour', 16).set('minute', 30).toDate(),
    end: dayjs().set('hour', 17).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner at the Plaza',
    start: dayjs().set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Go home',
    start: dayjs().set('hour', 21).set('minute', 30).toDate(),
    end: dayjs().set('hour', 22).set('minute', 30).toDate(),
  },
  {
    title: 'Read a book',
    start: dayjs().set('hour', 22).set('minute', 30).toDate(),
    end: dayjs().set('hour', 23).set('minute', 30).toDate(),
  },
  {
    title: 'Exercise',
    start: dayjs().add(1, 'day').set('hour', 5).set('minute', 0).toDate(),
    end: dayjs().add(1, 'day').set('hour', 5).set('minute', 30).toDate(),
  },
  {
    title: 'Repair my car',
    start: dayjs().add(1, 'day').set('hour', 7).set('minute', 45).toDate(),
    end: dayjs().add(1, 'day').set('hour', 13).set('minute', 30).toDate(),
  },
  {
    title: 'Gardening',
    start: dayjs().add(2, 'day').set('hour', 10).set('minute', 0).toDate(),
    end: dayjs().add(2, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Mowing',
    start: dayjs().add(2, 'day').set('hour', 11).set('minute', 0).toDate(),
    end: dayjs().add(2, 'day').set('hour', 11).set('minute', 30).toDate(),
  },
  {
    title: 'Go to beach',
    start: dayjs().add(3, 'day').set('hour', 8).set('minute', 0).toDate(),
    end: dayjs().add(3, 'day').set('hour', 8).set('minute', 30).toDate(),
  },
  {
    title: 'Meeting 2',
    start: dayjs().add(7, 'day').set('hour', 10).set('minute', 0).toDate(),
    end: dayjs().add(7, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Coffee break',
    start: dayjs().add(7, 'day').set('hour', 14).set('minute', 30).toDate(),
    end: dayjs().add(7, 'day').set('hour', 15).set('minute', 30).toDate(),
  },
  {
    title: 'Dentist appointment',
    start: dayjs().add(8, 'day').set('hour', 14).set('minute', 30).toDate(),
    end: dayjs().add(8, 'day').set('hour', 15).set('minute', 30).toDate(),
  },
  {
    title: 'Study',
    start: dayjs().add(9, 'day').set('hour', 7).set('minute', 45).toDate(),
    end: dayjs().add(12, 'day').set('hour', 20).set('minute', 30).toDate(),
  },
  {
    title: 'Go to airport',
    start: dayjs().add(10, 'day').set('hour', 7).set('minute', 45).toDate(),
    end: dayjs().add(10, 'day').set('hour', 13).set('minute', 30).toDate(),
  },
  {
    title: 'Meeting',
    start: dayjs().add(11, 'day').set('hour', 7).set('minute', 45).toDate(),
    end: dayjs().add(11, 'day').set('hour', 13).set('minute', 30).toDate(),
  },
  {
    title: 'Lunch',
    start: dayjs().add(11, 'day').set('hour', 12).set('minute', 0).toDate(),
    end: dayjs().add(11, 'day').set('hour', 13).set('minute', 0).toDate(),
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
    title: 'Brunch',
    start: dayjs().add(13, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(13, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(13, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(13, 'day').set('hour', 17).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(13, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(13, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(14, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(14, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(14, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(14, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(14, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(14, 'day').set('hour', 17).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(14, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(14, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(15, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(15, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(15, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(15, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(15, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(15, 'day').set('hour', 17).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(15, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(15, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(16, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(16, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(16, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(16, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(16, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(16, 'day').set('hour', 17).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(16, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(16, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(17, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(17, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(17, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(17, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(17, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(17, 'day').set('hour', 17).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(17, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(17, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(18, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(18, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(18, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(18, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(18, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(18, 'day').set('hour', 18).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(18, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(18, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(19, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(19, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(19, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(19, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(19, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(19, 'day').set('hour', 18).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(19, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(19, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(20, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(20, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(20, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(20, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(20, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(20, 'day').set('hour', 18).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(20, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(20, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(21, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(21, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(21, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(21, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(21, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(21, 'day').set('hour', 18).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(21, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(21, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(22, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(22, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(22, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(22, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(22, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(22, 'day').set('hour', 18).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(22, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(22, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(23, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(23, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(23, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(23, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(23, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(23, 'day').set('hour', 18).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(23, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(23, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(24, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(24, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(24, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(24, 'day').set('hour', 10).set('minute', 30).toDate(),
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
    <View>
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
    </View>
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
