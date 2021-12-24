import { storiesOf } from '@storybook/react'
import React from 'react'
import { Alert, View } from 'react-native'

import { Calendar } from '../src'
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

storiesOf('reproduction-issue-575', module)
  .add('month mode', () => (
    <View style={styles.mobile}>
      <Calendar
        height={MOBILE_HEIGHT}
        events={events}
        mode="month"
        onPressEvent={(event) => alert(event.title)}
      />
    </View>
  ))
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

const events = [
  {
    title: 'RX-1001',
    start: '2021-12-14T18:30:00.000Z',
    end: '2021-12-14T18:30:00.000Z',
    invoiceId: 3,
    serviceTypeId: 2,
  },
  {
    title: 'RX-1002',
    start: '2021-12-27T18:30:00.000Z',
    end: '2021-12-30T18:30:00.000Z',
    invoiceId: 4,
    serviceTypeId: 5,
  },
  {
    title: 'RX-1003',
    start: '2021-12-29T18:30:00.000Z',
    end: '2021-12-30T18:30:00.000Z',
    invoiceId: 5,
    serviceTypeId: 8,
  },
  {
    title: 'RX-1003',
    start: '2021-12-21T18:30:00.000Z',
    end: '2021-12-22T18:30:00.000Z',
    invoiceId: 5,
    serviceTypeId: 9,
  },
  {
    title: 'RX-1004',
    start: '2022-01-01T18:30:00.000Z',
    end: '2022-01-04T18:30:00.000Z',
    invoiceId: 6,
    serviceTypeId: 15,
  },
  {
    title: 'RX-1004',
    start: '2021-12-23T18:30:00.000Z',
    end: '2021-12-23T18:30:00.000Z',
    invoiceId: 6,
    serviceTypeId: 16,
  },
  {
    title: 'RX-1005',
    start: '2021-12-25T18:30:00.000Z',
    end: '2021-12-25T18:30:00.000Z',
    invoiceId: 8,
    serviceTypeId: 23,
  },
  {
    title: 'PO-1001',
    start: '2021-12-28T18:30:00.000Z',
    end: '2021-12-28T18:30:00.000Z',
    invoiceId: 9,
    serviceTypeId: 25,
  },
  {
    title: 'RX-1006',
    start: '2021-12-30T18:30:00.000Z',
    end: '2021-12-30T18:30:00.000Z',
    invoiceId: 10,
    serviceTypeId: 27,
  },
  {
    title: 'PO-1002',
    start: '2021-12-20T18:30:00.000Z',
    end: '2021-12-20T18:30:00.000Z',
    invoiceId: 11,
    serviceTypeId: 29,
  },
].map((e) => ({
  ...e,
  start: new Date(e.start),
  end: new Date(e.end),
}))
