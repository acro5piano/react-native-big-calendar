import dayjs from 'dayjs'
import React from 'react'
import { RecursiveArray, Text, TouchableOpacity, View, ViewStyle } from 'react-native'

import { eventTitleStyle } from '../src/commonStyles'
import { EventRenderer, ICalendarEvent } from '../src/interfaces'
import { formatStartEnd } from '../src/utils'

const eventNotes = (
  <View style={{ marginTop: 3 }}>
    <Text style={{ fontSize: 10, color: 'white' }}> Phone number: 555-123-4567 </Text>
    <Text style={{ fontSize: 10, color: 'white' }}> Arrive 15 minutes early </Text>
  </View>
)

export const events: ICalendarEvent[] = [
  {
    title: 'Watch Boxing',
    start: dayjs().set('hour', 0).set('minute', 0).set('second', 0).toDate(),
    end: dayjs().set('hour', 1).set('minute', 30).toDate(),
  },
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
    title: 'Meet Realtor',
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

export interface MyCustomEventType {
  color?: string
}

export const customEventRenderer: EventRenderer<MyCustomEventType> = (
  event,
  touchableOpacityProps,
) => {
  return (
    <TouchableOpacity
      {...touchableOpacityProps}
      style={[
        ...(touchableOpacityProps.style as RecursiveArray<ViewStyle>),
        {
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: 'lightgrey',
          borderLeftColor: event.color ? event.color : 'green',
          borderLeftWidth: 10,
          borderStyle: 'solid',
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      {dayjs(event.end).diff(event.start, 'minute') < 32 ? (
        <Text style={[eventTitleStyle, { color: 'black' }]}>
          {event.title},
          <Text style={[eventTitleStyle, { color: 'black' }]}>
            {dayjs(event.start).format('HH:mm')}
          </Text>
        </Text>
      ) : (
        <>
          <Text style={[eventTitleStyle, { color: 'black' }]}>{event.title}</Text>
          <Text style={[eventTitleStyle, { color: 'black' }]}>
            {formatStartEnd(event.start, event.end)}
          </Text>
          {event.children && event.children}
        </>
      )}
    </TouchableOpacity>
  )
}

export const customRendererEvents: ICalendarEvent<MyCustomEventType>[] = [
  {
    title: 'Custom Renderer',
    start: dayjs().add(1, 'day').set('hour', 12).set('minute', 0).toDate(),
    end: dayjs().add(1, 'day').set('hour', 15).set('minute', 30).toDate(),
  },
  {
    title: 'Custom reminder',
    start: dayjs().set('hour', 16).set('minute', 0).toDate(),
    end: dayjs().set('hour', 17).set('minute', 0).toDate(),
    color: 'purple',
  },
]
