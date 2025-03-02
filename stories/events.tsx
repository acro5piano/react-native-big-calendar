import dayjs from 'dayjs'
import React from 'react'
import { type RecursiveArray, Text, TouchableOpacity, View, type ViewStyle } from 'react-native'

import type { EventRenderer, HourRenderer, ICalendarEventBase } from '../src/interfaces'
import { formatStartEnd } from '../src/utils/datetime'

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min
}

const eventNotes = (
  <View style={{ marginTop: 3 }}>
    <Text style={{ fontSize: 10, color: 'white' }}> Phone number: 555-123-4567 </Text>
    <Text style={{ fontSize: 10, color: 'white' }}> Arrive 15 minutes early </Text>
  </View>
)

export const events: Array<ICalendarEventBase & { color?: string }> = [
  {
    title: 'Watch Boxing',
    start: dayjs().set('hour', 0).set('minute', 0).set('second', 0).toDate(),
    end: dayjs().set('hour', 1).set('minute', 30).toDate(),
    color: '#02edda',
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
    title: 'with color prop',
    start: dayjs().set('hour', 16).set('minute', 0).toDate(),
    end: dayjs().set('hour', 18).set('minute', 30).toDate(),
    color: 'purple',
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
  {
    title: 'Plan a holiday',
    start: dayjs().set('hour', 13).set('minute', 0).add(1, 'month').toDate(),
    end: dayjs().set('hour', 14).set('minute', 15).add(1, 'month').toDate(),
  },

  {
    title: 'Go on holiday',
    start: dayjs().set('hour', 13).set('minute', 0).add(3, 'month').toDate(),
    end: dayjs().set('hour', 14).set('minute', 15).add(3, 'month').toDate(),
  },
]

export const tonsOfEvents: Array<ICalendarEventBase & { color?: string }> = new Array(10)
  .fill(undefined)
  .map((_) => {
    const day = getRandomInt(dayjs().startOf('week').get('day'), dayjs().endOf('week').get('day'))
    const startHour = getRandomInt(0, 23)
    const endHour = getRandomInt(startHour + 2, 24)
    const startMinute = getRandomInt(0, 59)
    const endMinute = getRandomInt(0, 59)
    return {
      title: 'Watch Boxing',
      start: dayjs()
        .set('day', day)
        .set('hour', startHour)
        .set('minute', startMinute)
        .set('second', 0)
        .toDate(),
      end: dayjs()
        .set('day', day)
        .set('hour', endHour)
        .set('minute', endMinute)
        .set('second', 0)
        .toDate(),
    }
  })

// Add an event that spans multiple days
tonsOfEvents.push({
  title: 'Overlapping event',
  start: dayjs().set('hour', 10).set('minute', 0).toDate(),
  end: dayjs().set('hour', 10).set('minute', 0).add(1, 'day').toDate(),
})

export const tonsOfEventsSorted = tonsOfEvents.sort((a, b) => a.start.getTime() - b.start.getTime())

export const spanningEvents: Array<ICalendarEventBase & { color?: string }> = [
  {
    title: 'Watch Boxing',
    start: dayjs().subtract(1, 'week').set('hour', 14).set('minute', 30).toDate(),
    end: dayjs().subtract(1, 'week').set('hour', 15).set('minute', 30).toDate(),
  },
  {
    title: 'Laundry',
    start: dayjs().subtract(1, 'week').set('hour', 1).set('minute', 30).toDate(),
    end: dayjs().subtract(1, 'week').set('hour', 2).set('minute', 30).toDate(),
  },
  {
    title: 'Meeting',
    start: dayjs().subtract(1, 'week').set('hour', 10).set('minute', 0).toDate(),
    end: dayjs().add(1, 'week').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Coffee break',
    start: dayjs().set('hour', 14).set('minute', 30).toDate(),
    end: dayjs().add(1, 'week').set('hour', 15).set('minute', 30).toDate(),
  },
  {
    title: 'Repair my car',
    start: dayjs().add(1, 'day').set('hour', 7).set('minute', 45).toDate(),
    end: dayjs().add(4, 'day').set('hour', 13).set('minute', 30).toDate(),
  },
  {
    title: 'Vacation',
    start: dayjs().subtract(1, 'month').set('hour', 7).set('minute', 45).toDate(),
    end: dayjs().add(1, 'month').set('hour', 13).set('minute', 30).toDate(),
  },
]

export interface MyCustomEventType extends ICalendarEventBase {
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
        <Text style={[{ color: 'black' }]}>
          {event.title},
          <Text style={[{ color: 'black' }]}>{dayjs(event.start).format('HH:mm')}</Text>
        </Text>
      ) : (
        <>
          <Text style={[{ color: 'black' }]}>{event.title}</Text>
          <Text style={[{ color: 'black' }]}>
            {formatStartEnd(event.start, event.end, 'HH:mm')}
          </Text>
          {event.children && event.children}
        </>
      )}
    </TouchableOpacity>
  )
}

export const customHourRenderer: HourRenderer = ({ hour }) => {
  return (
    <Text
      style={{
        textAlign: 'right',
        paddingRight: 5,
      }}
    >
      {hour}
    </Text>
  )
}
