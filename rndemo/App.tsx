import dayjs from 'dayjs'
import React from 'react'
import { Dimensions, Picker, SafeAreaView, StatusBar, Text, View } from 'react-native'
import { Calendar, ICalendarEventBase } from './src'

const events = [
  {
    title: '고구마 감자 무른밥',
    start: dayjs('2023-09-20T00:01').toDate(),
    end: dayjs('2023-09-24T00:01').toDate(),
    color: 0,
  },
  {
    title: '소고기 청경채 미음',
    start: dayjs('2023-09-17T00:01').toDate(),
    end: dayjs('2023-09-21T00:01').toDate(),
    color: 1,
  },
  {
    title: '소고기 당근 무른밥',
    start: dayjs('2023-09-17T00:01').toDate(),
    end: dayjs('2023-09-18T00:01').toDate(),
    color: 2,
  },
  {
    title: '소고기 브로콜리 무른밥',
    start: dayjs('2023-09-22T10:01').toDate(),
    end: dayjs('2023-09-22T10:01').toDate(),
    color: 4,
  },
  {
    title: '호박 고구마',
    start: dayjs('2023-09-22T10:01').toDate(),
    end: dayjs('2023-09-22T10:01').toDate(),
    color: 3,
  },
  {
    title: '찹쌀영양닭죽',
    start: dayjs('2023-09-21T10:01').toDate(),
    end: dayjs('2023-09-22T10:01').toDate(),
    color: 5,
  },
]

export const App = () => {
  const [mode, setMode] = React.useState<Mode>('week')
  const [additionalEvents, setAdditionalEvents] = React.useState<ICalendarEventBase[]>([])

  const addEvent = React.useCallback(
    (start) => {
      const title = 'new Event'
      const end = dayjs(start).add(59, 'minute').toDate()
      setAdditionalEvents([...additionalEvents, { start, end, title, color }])
    },
    [additionalEvents, setAdditionalEvents],
  )

  const [current, setCurrent] = React.useState(dayjs())
  const basicColorSet = {
    0: {
      background: '#E57373',
      text: '#ffffff',
    },
    1: {
      background: '#BA68C8',
      text: '#ffffff',
    },
    2: {
      background: '#7986CB',
      text: '#ffffff',
    },
    3: {
      background: '#4FC3F7',
      text: '#ffffff',
    },
    4: {
      background: '#C8E6C9',
      text: '#000000',
    },
    5: {
      background: '#ffeecc',
      text: '#000000',
    },
  }

  return (
    <React.Fragment>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        {/* <View style={{ height: 60, borderBottomWidth: 0.5 }}>
          <View style={{ width: '50%', marginLeft: 'auto' }}>
            <Picker onValueChange={setMode} mode="dropdown">
              <Picker.Item value="week" label="week" />
              <Picker.Item value="day" label="day" />
              <Picker.Item value="3days" label="3days" />
              <Picker.Item value="month" label="month" />
            </Picker>
          </View>
        </View> */}
        {/* <Calendar
          height={Dimensions.get('window').height - 60}
          events={[...events, ...additionalEvents]}
          onPressCell={addEvent}
          sortedMonthView={false}
          mode={'month'}
          moreLabel="+{moreCount}"
          onPressMoreLabel={(events) => {
            console.log(events)
          }}
        /> */}
        <Calendar
          calendarCellStyle={{ borderColor: 'transparent' }}
          mode="month"
          events={events}
          eventCellStyle={(events) => ({
            backgroundColor: basicColorSet[events.color].background,
            elevation: 0,
          })}
          date={current.toDate()}
          height={800}
          maxVisibleEventCount={4}
          moreLabel={'{moreCount}개 더보기'}
          showAdjacentMonths={true}
          overlapOffset={10}
          sortedMonthView={true}
          eventMinHeightForMonthView={22}
          colorPalettes={basicColorSet}
          onPressEvent={(events) => console.log('test', events.title)}
        />
      </SafeAreaView>
    </React.Fragment>
  )
}
