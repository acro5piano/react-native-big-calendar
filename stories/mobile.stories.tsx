import type { Meta, StoryObj } from '@storybook/react'
import dayjs from 'dayjs'
import React from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'

import { Calendar, type EventRenderer, type HasDateRange, type ICalendarEventBase } from '../src'
import { AppHeader, HEADER_HEIGHT } from './components/AppHeader'
import { events, tonsOfEvents, tonsOfEventsSorted } from './events'
import { useEvents } from './hooks'
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

const meta: Meta<typeof Calendar> = {
  title: 'showcase/Mobile',
  component: Calendar,
  decorators: [(Story) => <View style={styles.mobile}>{Story()}</View>],
}

export default meta
type Story = StoryObj<typeof Calendar>

export const DayMode: Story = {
  args: {
    height: MOBILE_HEIGHT,
    events: events,
    mode: 'day',
    onPressEvent: (event) => alert(event.title),
  },
}

export const ThreeDaysMode: Story = {
  args: {
    height: MOBILE_HEIGHT,
    events: events,
    mode: '3days',
    onPressEvent: (event) => alert(event.title),
  },
}

export const WeekMode: Story = {
  args: {
    hideHours: true,
    height: MOBILE_HEIGHT,
    events: events,
  },
}

export const TonsOfEvents: Story = {
  args: {
    height: MOBILE_HEIGHT,
    events: tonsOfEvents,
    mode: 'week',
    onPressEvent: (event) => alert(event.title),
  },
}

export const TonsOfSortedEvents: Story = {
  args: {
    height: MOBILE_HEIGHT,
    events: tonsOfEventsSorted,
    mode: 'week',
    onPressEvent: (event) => alert(event.title),
    enableEnrichedEvents: true,
    eventsAreSorted: true,
  },
}

export const MonthMode: Story = {
  render: () => {
    const state = useEvents(events)
    return (
      <Calendar
        mode="month"
        height={MOBILE_HEIGHT}
        events={state.events}
        onPressEvent={(event) => alert(event.title)}
        onPressCell={state.addEvent}
      />
    )
  },
}

export const WithAppHeader: Story = {
  render: () => (
    <>
      <AppHeader />
      <Calendar height={MOBILE_HEIGHT - HEADER_HEIGHT} events={events} />
    </>
  ),
}

export const DoNotShowTime: Story = {
  args: {
    height: MOBILE_HEIGHT,
    events: events,
    showTime: false,
  },
}

export const OnDateChanged: Story = {
  render: () => {
    const onChangeDate = React.useCallback(([start, end]: HasDateRange) => {
      alert(`${start} - ${end}`)
    }, [])

    const renderEvent: EventRenderer = (event, touchableOpacityProps) => (
      <TouchableOpacity {...touchableOpacityProps}>
        <Text>{`${event.title}`}</Text>
      </TouchableOpacity>
    )

    return (
      <Calendar
        height={MOBILE_HEIGHT}
        events={events}
        onChangeDate={onChangeDate}
        renderEvent={renderEvent}
      />
    )
  },
}

export const HiddenNowIndicator: Story = {
  args: {
    height: MOBILE_HEIGHT,
    events: events,
    hideNowIndicator: true,
  },
}

export const RTL: Story = {
  render: () => {
    React.useEffect(() => {
      require('dayjs/locale/he')
    }, [])
    return <Calendar isRTL locale="he" height={MOBILE_HEIGHT} events={events} />
  },
}

export const CustomWeekLength: Story = {
  args: {
    height: MOBILE_HEIGHT,
    events: events,
    mode: 'custom',
    weekStartsOn: 1,
    weekEndsOn: 5,
  },
}

export const MonthCalendarCellStyle: Story = {
  args: {
    height: MOBILE_HEIGHT,
    events: events,
    mode: 'month',
    calendarCellStyle: (date) => {
      let cellStyles = {
        backgroundColor: 'white',
        color: 'white',
      }

      const now = dayjs()

      const isBefore = dayjs(date).startOf('day').isBefore(now.startOf('day'))
      const isToday = dayjs(date).startOf('day').isSame(now.startOf('day'))
      const isAfter = dayjs(date).startOf('day').isAfter(now.startOf('day'))

      if (isBefore) {
        cellStyles = {
          ...cellStyles,
          backgroundColor: 'red',
        }
      } else if (isToday) {
        cellStyles = {
          ...cellStyles,
          backgroundColor: 'blue',
        }
      } else if (isAfter) {
        cellStyles = {
          ...cellStyles,
          backgroundColor: 'green',
        }
      }

      return cellStyles
    },
    calendarCellTextStyle: { color: 'white' },
  },
}

export const MonthEventCellEvenOddRowBgColor: Story = {
  args: {
    height: MOBILE_HEIGHT,
    events: events,
    mode: 'month',
    calendarCellStyle: (_, index = 0) => {
      const isEvenRow = index % 2 === 0
      return {
        backgroundColor: isEvenRow ? 'red' : 'green',
      }
    },
  },
}

export const WeekCalendarCellStyle: Story = {
  args: {
    height: MOBILE_HEIGHT,
    events: events,
    mode: 'week',
    calendarCellStyle: (date) => {
      let cellStyles = {
        backgroundColor: 'white',
        color: 'black',
      }

      const now = dayjs()

      const isBefore = dayjs(date).startOf('day').isBefore(now.startOf('day'))
      const isToday = dayjs(date).startOf('day').isSame(now.startOf('day'))
      const isAfter = dayjs(date).startOf('day').isAfter(now.startOf('day'))

      if (isBefore) {
        cellStyles = {
          ...cellStyles,
          backgroundColor: 'red',
        }
      } else if (isToday) {
        cellStyles = {
          ...cellStyles,
          backgroundColor: 'blue',
        }
      } else if (isAfter) {
        cellStyles = {
          ...cellStyles,
          backgroundColor: 'green',
        }
      }

      return cellStyles
    },
  },
}

export const WeekCalendarCellEvenOddRowBgColor: Story = {
  args: {
    height: MOBILE_HEIGHT,
    events: events,
    mode: 'week',
    calendarCellStyle: (_, index = 0) => {
      const isEvenRow: boolean = index % 2 === 0
      return {
        backgroundColor: isEvenRow ? 'red' : 'green',
      }
    },
  },
}

export const MonthCalendarCellCustomDateRenderer: Story = {
  render: () => {
    const renderCustomDate = (_date: Date) => {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: '#D4E0FE',
              borderRadius: 20,
              width: 15,
              height: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text>{_date.getDay()}</Text>
          </View>
        </View>
      )
    }

    return (
      <Calendar
        height={MOBILE_HEIGHT}
        events={events}
        mode="month"
        renderCustomDateForMonth={renderCustomDate}
      />
    )
  },
}

export const MonthCalendarCellDisabledPressing: Story = {
  args: {
    height: MOBILE_HEIGHT,
    events: events,
    mode: 'month',
    disableMonthEventCellPress: true,
    onPressCell: (_date) => {
      alert(`You can only press Date Cell. Not Event Cell ${_date.getDay()}`)
    },
  },
}

export const ScheduleMode: Story = {
  render: () => {
    const state = useEvents(events)
    return (
      <Calendar
        height={MOBILE_HEIGHT}
        events={state.events}
        mode="schedule"
        eventCellStyle={(event: ICalendarEventBase & { color?: string }) => {
          return [
            { backgroundColor: event.color ?? 'red' },
            { borderWidth: 1, borderColor: 'green' },
          ]
        }}
        scheduleMonthSeparatorStyle={{
          color: 'grey',
          fontSize: 12,
          paddingVertical: 4,
        }}
      />
    )
  },
}

export const WithOnSwipeHandler: Story = {
  args: {
    height: MOBILE_HEIGHT,
    events: events,
    mode: 'day',
    onPressEvent: (event) => alert(event.title),
    onSwipeEnd: (date) => alert(`You swiped to ${date.toUTCString()}`),
  },
}
