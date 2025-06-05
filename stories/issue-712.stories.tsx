import type { Meta, StoryObj } from '@storybook/react'
import dayjs from 'dayjs'
import React, { useCallback, useState } from 'react'
import { Dimensions, Text, TouchableOpacity } from 'react-native'

import { Calendar, type CalendarTouchableOpacityProps, type ICalendarEventBase } from '../src'
import type { DateRangeHandler } from '../src/interfaces'

const SCREEN_HEIGHT = Dimensions.get('window').height

const meta: Meta<typeof Calendar> = {
  title: 'reproduction-issue-712',
  component: Calendar,
}

export default meta

type Story = StoryObj<typeof Calendar>

export const Basic: Story = {
  render: () => {
    const [selectedDate, changeSelectedDate] = useState(new Date())

    const onChangeDate: DateRangeHandler = useCallback(([, end]) => {
      changeSelectedDate(end)
    }, [])

    const onPressEvent = useCallback((event: ICalendarEventBase) => {
      console.log(event)
    }, [])

    const renderEvent = useCallback(
      (event: ICalendarEventBase, touchableOpacityProps: CalendarTouchableOpacityProps) => (
        <TouchableOpacity {...touchableOpacityProps}>
          <Text>{`${event.title}`}</Text>
        </TouchableOpacity>
      ),
      [],
    )

    return (
      <Calendar
        events={events}
        height={SCREEN_HEIGHT}
        ampm={true}
        mode={'month'}
        date={selectedDate}
        scrollOffsetMinutes={new Date().getHours() * 60}
        swipeEnabled={true}
        renderEvent={renderEvent}
        onChangeDate={onChangeDate}
        onPressEvent={onPressEvent}
      />
    )
  },
}

const events = [
  {
    title: 'RX-1003',
    start: dayjs().hour(0).minute(0).second(0).toDate(),
    end: dayjs().hour(0).minute(0).second(0).toDate(),
  },
]
