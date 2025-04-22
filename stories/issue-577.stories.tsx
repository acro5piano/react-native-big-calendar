import type { Meta, StoryObj } from '@storybook/react'
import dayjs from 'dayjs'
import React from 'react'
import { Alert, View } from 'react-native'

import { Calendar } from '../src'
import { styles } from './styles'

function alert(input: string) {
  // @ts-ignore
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.alert(String(input))
  }
  return Alert.alert('', String(input))
}

const MOBILE_HEIGHT = 736

const events = [
  {
    title: 'RX-1002',
    start: dayjs().hour(0).minute(0).second(0).toDate(),
    end: dayjs().add(5, 'days').hour(0).minute(0).second(0).toDate(),
  },
]

const meta: Meta<typeof Calendar> = {
  title: 'reproduction-issue-577',
  component: Calendar,
}

export default meta

type Story = StoryObj<typeof Calendar>

export const MonthMode: Story = {
  render: () => (
    <View style={styles.mobile}>
      <Calendar
        height={MOBILE_HEIGHT}
        events={events}
        mode="month"
        onPressEvent={(event) => alert(event.title)}
      />
    </View>
  ),
}
