import dayjs from 'dayjs'
import React from 'react'
import { Text, View } from 'react-native'

const eventNotes = () => {
  const containerStyle = { marginTop: 3 }
  const textStyle = { fontSize: 10, color: 'white' }
  return (
    <View style={containerStyle}>
      <Text style={textStyle}> Phone number: 555 - 123 - 4567 </Text>
      <Text style={textStyle}> Arrive 15 minutes early </Text>
    </View>
  )
}

export const events = [
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
  {
    title: 'Meet Larry',
    start: dayjs().add(1, 'day').set('hour', 8).set('minute', 25).toDate(),
    end: dayjs().add(1, 'day').set('hour', 9).set('minute', 55).toDate(),
  },
  {
    title: 'Laundry',
    start: dayjs().add(1, 'day').set('hour', 8).set('minute', 25).toDate(),
    end: dayjs().add(1, 'day').set('hour', 11).set('minute', 0).toDate(),
  },
  {
    title: "Doctor's appointment",
    start: dayjs().set('hour', 13).set('minute', 0).toDate(),
    end: dayjs().set('hour', 14).set('minute', 15).toDate(),
    children: eventNotes,
  },
]
