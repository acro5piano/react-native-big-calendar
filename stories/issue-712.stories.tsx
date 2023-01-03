import { storiesOf } from '@storybook/react'
import { DateRangeHandler } from 'build'
import dayjs from 'dayjs'
import React, { useCallback, useState } from 'react'
import { Dimensions, Text, TouchableOpacity, View } from 'react-native'

import { Calendar, CalendarTouchableOpacityProps, ICalendarEventBase } from '../src'
import { styles } from './styles'

const SCREEN_HEIGHT = Dimensions.get('window').height

storiesOf('reproduction-issue-712', module).add('month mode', () => (
  <View style={styles.mobile}>
    <Schedule />
  </View>
))

const events = [
  {
    title: 'RX-1003',
    start: dayjs().hour(0).minute(0).second(0).toDate(),
    end: dayjs().hour(0).minute(0).second(0).toDate(),
  },
]

const Schedule = () => {
  const [selectedDate, changeSelectedDate] = useState(new Date())

  const onChangeDate: DateRangeHandler = useCallback(([, end]) => {
    changeSelectedDate(end)
  }, [])

  const onPressEvent = useCallback((event) => {
    console.log(event)
  }, [])

  const renderEvent = <T extends ICalendarEventBase>(
    event: T,
    touchableOpacityProps: CalendarTouchableOpacityProps,
  ) => (
    <TouchableOpacity {...touchableOpacityProps}>
      <Text>{`${event.title}`}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.desktop}>
      <Calendar
        events={events}
        height={SCREEN_HEIGHT}
        ampm={true}
        mode={'day'}
        date={selectedDate}
        renderHeader={() => null}
        scrollOffsetMinutes={new Date().getHours() * 60}
        swipeEnabled={true}
        renderEvent={renderEvent}
        onChangeDate={onChangeDate}
        onPressEvent={onPressEvent}
      />
    </View>
  )
}
