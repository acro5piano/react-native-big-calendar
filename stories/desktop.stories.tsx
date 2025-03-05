import 'dayjs/locale/ja'
import type { Meta, StoryObj } from '@storybook/react'
import dayjs from 'dayjs'
import React from 'react'
import { Alert, Dimensions, View } from 'react-native'
import { Calendar, type ICalendarEventBase } from '../src'
import { CONTROL_HEIGHT, Control } from './components/Control'
import { events, customEventRenderer, customHourRenderer, spanningEvents } from './events'
import { useEvents } from './hooks'
import { styles } from './styles'
import { themes } from './themes'

function alert(input: string) {
  // @ts-ignore React Native + web integration limitation
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.alert(String(input))
  }
  return Alert.alert('', String(input))
}

const SCREEN_HEIGHT = Dimensions.get('window').height

const meta: Meta<typeof Calendar> = {
  title: 'showcase/Desktop',
  component: Calendar,
  decorators: [
    (Story) => (
      <View style={styles.desktop}>
        <Story />
      </View>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Calendar>

export const DayMode: Story = {
  args: {
    height: SCREEN_HEIGHT,
    events: events,
    onPressEvent: (event) => alert(event.title),
    onPressCell: () => void 0,
    mode: 'day',
  },
}

export const ThreeDaysMode: Story = {
  args: {
    height: SCREEN_HEIGHT,
    events: events,
    onPressEvent: (event) => alert(event.title),
    onPressCell: () => void 0,
    mode: '3days',
  },
}

export const WeekMode: Story = {
  render: () => {
    const state = useEvents(events)
    return (
      <Calendar
        height={SCREEN_HEIGHT}
        events={state.events}
        onPressEvent={(event) => alert(event.title)}
        onPressCell={state.addEvent}
      />
    )
  },
}

export const MonthMode: Story = {
  render: () => {
    const state = useEvents(events)
    return (
      <Calendar
        mode="month"
        height={SCREEN_HEIGHT}
        events={[
          ...state.events,
          {
            start: dayjs().add(2, 'days').toDate(),
            end: dayjs().add(2, 'days').add(5, 'hours').toDate(),
            title: 'This is sooooo long name event which will be truncated',
          },
        ]}
        onPressEvent={(event) => alert(event.title)}
        onPressCell={state.addEvent}
      />
    )
  },
}

export const MonthModeRTL: Story = {
  render: () => {
    const state = useEvents(events)
    return (
      <Calendar
        mode="month"
        height={SCREEN_HEIGHT}
        isRTL
        events={state.events}
        onPressEvent={(event) => alert(event.title)}
        onPressCell={state.addEvent}
      />
    )
  },
}

export const MonthModeSpanningEvents: Story = {
  render: () => {
    const state = useEvents(spanningEvents)
    return (
      <Calendar
        mode="month"
        height={SCREEN_HEIGHT}
        events={state.events}
        onPressEvent={(event) => alert(event.title)}
        onPressCell={state.addEvent}
      />
    )
  },
}

export const MonthModeSpanningEventsRTL: Story = {
  render: () => {
    const state = useEvents(spanningEvents)
    return (
      <Calendar
        mode="month"
        height={SCREEN_HEIGHT}
        events={state.events}
        onPressEvent={(event) => alert(event.title)}
        onPressCell={state.addEvent}
        isRTL
      />
    )
  },
}

export const MonthModeSpanningEventsHideAdjacent: Story = {
  render: () => {
    const state = useEvents(spanningEvents)
    return (
      <Calendar
        mode="month"
        height={SCREEN_HEIGHT}
        events={state.events}
        onPressEvent={(event) => alert(event.title)}
        onPressCell={state.addEvent}
        showAdjacentMonths={false}
      />
    )
  },
}

export const EventCellStyle: Story = {
  args: {
    height: SCREEN_HEIGHT,
    events: events,
    eventCellStyle: (event) => {
      const backgroundColor = event.title.match(/Meeting/) ? 'red' : 'blue'
      return { backgroundColor }
    },
  },
}

export const WithControls: Story = {
  render: () => {
    const [date, setDate] = React.useState(dayjs())
    const props = {
      onNext: React.useCallback(() => setDate(date.add(1, 'week')), [date]),
      onPrev: React.useCallback(() => setDate(date.add(-1, 'week')), [date]),
      onToday: React.useCallback(() => setDate(dayjs()), []),
    }

    return (
      <>
        <Control {...props} />
        <Calendar
          height={SCREEN_HEIGHT - CONTROL_HEIGHT}
          events={events}
          date={date.toDate()}
          swipeEnabled={false}
        />
      </>
    )
  },
}

export const ScrollToTime: Story = {
  args: {
    height: SCREEN_HEIGHT,
    events: events,
    scrollOffsetMinutes: 300,
  },
}

export const WeekStartsOnMonday: Story = {
  args: {
    height: SCREEN_HEIGHT,
    events: events,
    weekStartsOn: 1,
  },
}

export const WeekModeWithHourLimits: Story = {
  args: {
    height: SCREEN_HEIGHT,
    events: events,
    minHour: 5,
    maxHour: 22,
  },
}

export const AllDayEvents: Story = {
  render: () => {
    const monday = dayjs().day(1)
    const _events = [
      {
        title: 'Holiday',
        start: monday.set('hour', 0).set('minute', 0).toDate(),
        end: monday.set('hour', 0).set('minute', 0).toDate(),
      },
      {
        title: 'Vacation',
        start: monday.set('hour', 0).set('minute', 0).toDate(),
        end: monday.add(2, 'day').set('hour', 0).set('minute', 0).toDate(),
      },
      {
        title: 'Vacation Recovery',
        start: monday.add(4, 'day').set('hour', 0).set('minute', 0).toDate(),
        end: monday.add(4, 'day').set('hour', 0).set('minute', 0).toDate(),
      },
    ]

    return <Calendar height={SCREEN_HEIGHT} events={_events} weekStartsOn={1} />
  },
}

export const OnPressDateHeader: Story = {
  args: {
    height: SCREEN_HEIGHT,
    events: events,
    onPressDateHeader: (date) => alert(date.toISOString()),
    mode: '3days',
  },
}

export const LocaleJapanese: Story = {
  args: {
    locale: 'ja',
    height: SCREEN_HEIGHT,
    events: events,
  },
}

export const AMPMFormat: Story = {
  args: {
    ampm: true,
    height: SCREEN_HEIGHT,
    events: events,
  },
}

export const HiddenNowIndicator: Story = {
  args: {
    height: SCREEN_HEIGHT,
    events: events,
    hideNowIndicator: true,
  },
}

export const MoreOverlapPadding: Story = {
  args: {
    height: SCREEN_HEIGHT,
    events: events,
    overlapOffset: 70,
  },
}

export const WithTimeslots: Story = {
  args: {
    height: SCREEN_HEIGHT,
    events: events,
    overlapOffset: 70,
    timeslots: 1,
  },
}

export const RTL: Story = {
  render: () => {
    React.useEffect(() => {
      require('dayjs/locale/he')
    }, [])
    return <Calendar locale="he" height={SCREEN_HEIGHT} events={events} isRTL />
  },
}

export const CustomEventRenderer: Story = {
  args: {
    height: SCREEN_HEIGHT,
    renderEvent: customEventRenderer,
    events: events,
  },
}

export const CustomHourRenderer: Story = {
  args: {
    height: SCREEN_HEIGHT,
    events: events,
    hourComponent: customHourRenderer,
    mode: 'custom',
  },
}

export const CustomWeekLength: Story = {
  args: {
    height: SCREEN_HEIGHT,
    events: events,
    mode: 'custom',
    weekStartsOn: 1,
    weekEndsOn: 5,
  },
}

export const EventSpanningMultipleDays: Story = {
  args: {
    height: SCREEN_HEIGHT,
    events: [
      {
        title: 'Multiple span',
        start: dayjs().toDate(),
        end: dayjs().add(28, 'hour').toDate(),
      },
      {
        title: 'Multiple span longer',
        start: dayjs().add(29, 'hour').toDate(),
        end: dayjs().add(64, 'hour').toDate(),
      },
    ],
    eventCellStyle: (event) => (/longer/.test(event.title) ? { backgroundColor: 'green' } : {}),
    mode: 'week',
  },
}

export const CustomTheme: Story = {
  render: () => {
    const state = useEvents(events)
    return (
      <Calendar
        height={SCREEN_HEIGHT}
        events={state.events}
        onPressEvent={(event) => alert(event.title)}
        onPressCell={state.addEvent}
        theme={{
          palette: {
            primary: {
              main: 'purple',
              contrastText: '#fff',
            },
          },
        }}
      />
    )
  },
}

export const DarkMode: Story = {
  render: () => {
    const state = useEvents(events)
    return (
      <View style={{ backgroundColor: '#333' }}>
        <Calendar
          height={SCREEN_HEIGHT}
          events={state.events}
          onPressEvent={(event) => alert(event.title)}
          onPressCell={state.addEvent}
          theme={themes.dark}
        />
      </View>
    )
  },
}

export const WithoutHeader: Story = {
  render: () => {
    const state = useEvents(events)
    return (
      <Calendar
        height={SCREEN_HEIGHT}
        events={state.events}
        onPressEvent={(event) => alert(event.title)}
        onPressCell={state.addEvent}
        renderHeader={() => null}
      />
    )
  },
}

export const WithoutHeaderMonth: Story = {
  render: () => {
    const state = useEvents(events)
    return (
      <Calendar
        height={SCREEN_HEIGHT}
        events={state.events}
        onPressEvent={(event) => alert(event.title)}
        onPressCell={state.addEvent}
        renderHeaderForMonthView={() => null}
        mode="month"
      />
    )
  },
}

export const MultipleStyles: Story = {
  render: () => {
    const state = useEvents(events)
    return (
      <Calendar
        height={SCREEN_HEIGHT}
        events={state.events}
        eventCellStyle={[{ backgroundColor: 'red' }, { borderWidth: 1, borderColor: 'green' }]}
      />
    )
  },
}

export const ScheduleMode: Story = {
  args: {
    height: SCREEN_HEIGHT,
    events: events,
    mode: 'schedule',
    eventCellStyle: (event: ICalendarEventBase & { color?: string }) => [
      { backgroundColor: event.color ?? 'red' },
      { borderWidth: 1, borderColor: 'green' },
    ],
    scheduleMonthSeparatorStyle: {
      color: 'grey',
      fontSize: 12,
      paddingVertical: 4,
    },
  },
}

export const WeekModeWithWeekNumber: Story = {
  render: () => {
    const state = useEvents(events)
    return (
      <Calendar
        height={SCREEN_HEIGHT}
        events={state.events}
        onPressEvent={(event) => alert(event.title)}
        onPressCell={state.addEvent}
        showWeekNumber={true}
        weekNumberPrefix={'W'}
      />
    )
  },
}

export const MonthModeWithWeekNumber: Story = {
  render: () => {
    const state = useEvents(events)
    return (
      <Calendar
        mode="month"
        height={SCREEN_HEIGHT}
        events={state.events}
        onPressEvent={(event) => alert(event.title)}
        onPressCell={state.addEvent}
        showWeekNumber={true}
        weekNumberPrefix={'W'}
      />
    )
  },
}
