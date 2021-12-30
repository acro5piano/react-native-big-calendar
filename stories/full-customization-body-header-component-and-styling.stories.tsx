import { storiesOf } from '@storybook/react'
import dayjs from 'dayjs'
import React from 'react'
import { Dimensions, Picker, Text, TouchableOpacity, View } from 'react-native'
import tailwind from 'tailwind-rn'

import { Calendar, Mode, modeToNum } from '../src'
import { events } from './events'
import { useEvents } from './hooks'
import { styles } from './styles'
import { themes } from './themes'

const SCREEN_HEIGHT = Dimensions.get('window').height

const today = new Date()

storiesOf('Full Customization Body Header Component and Styling', module).add('Main', () => {
  const { events: calendarEvents, addEvent } = useEvents(events)

  const [mode, setMode] = React.useState<Mode>('week')
  const [date, setDate] = React.useState(today)
  const [theme, setTheme] = React.useState<keyof typeof themes>('default')

  const _onPrevDate = () => {
    if (mode === 'month') {
      setDate(
        dayjs(date)
          .add(dayjs(date).date() * -1, 'day')
          .toDate(),
      )
    } else {
      setDate(
        dayjs(date)
          .add(modeToNum(mode, date) * -1, 'day')
          .toDate(),
      )
    }
  }

  const _onNextDate = () => {
    setDate(dayjs(date).add(modeToNum(mode, date), 'day').toDate())
  }

  const _onToday = () => {
    setDate(today)
  }

  const textStyle = theme === 'dark' ? tailwind('text-white') : tailwind('text-gray-800')

  const Button = ({ onPress, title }: { onPress: () => any; title: string }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[tailwind('px-4 py-2 border border-gray-200 mx-2 rounded')]}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  )

  const pickerStyle = [
    tailwind('border-gray-300 py-1 px-2 rounded text-gray-700 text-base'),
    theme === 'dark' ? tailwind('bg-gray-800 text-white') : tailwind('bg-white text-gray-700'),
  ]

  return (
    <View style={[styles.desktop, theme === 'dark' && tailwind('bg-gray-900')]}>
      <View
        style={tailwind(
          'flex flex-1 flex-row items-center justify-between border-gray-200 border-b py-4',
        )}
      >
        <View style={tailwind('flex-1 flex-row items-center')}>
          <Button title="Today" onPress={_onToday} />
          <Button title="<" onPress={_onPrevDate} />
          <Button title=">" onPress={_onNextDate} />
          <View style={tailwind('ml-4')}>
            <Text style={textStyle}>{dayjs(date).format('MMMM YYYY')}</Text>
          </View>
        </View>
        <Picker style={pickerStyle} selectedValue={theme} onValueChange={setTheme}>
          <Picker.Item value="default" label="default theme" />
          <Picker.Item value="dark" label="dark" />
          <Picker.Item value="green" label="green" />
          <Picker.Item value="green_bg" label="green-rows bg" />
        </Picker>
        <Picker
          style={[pickerStyle, tailwind('mx-4')]}
          selectedValue={mode}
          onValueChange={setMode}
        >
          <Picker.Item value="day" label="day" />
          <Picker.Item value="3days" label="3days" />
          <Picker.Item value="week" label="week" />
          <Picker.Item value="month" label="month" />
        </Picker>
      </View>
      <View style={{ marginTop: 16 }}>
        <Calendar
          date={date}
          height={SCREEN_HEIGHT - 80}
          events={calendarEvents}
          onPressCell={addEvent}
          mode={mode}
          theme={themes[theme]}
          headerContentStyle={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          dayHeaderStyle={{
            marginLeft: 10,
            backgroundColor: '#f1f1f1',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          dayHeaderHighlightColor={'#000'}
          weekDayHeaderHighlightColor={'#aaa'}
          headerComponent={
            <Text style={{ color: '#aaa', fontSize: 25 }}>CalendarBody's headerComponent</Text>
          }
          headerComponentStyle={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          hourStyle={{ color: '#355070', fontSize: 15 }}
          showAllDayEventCell={false}
          showHeaderPan={true}
          topHeaderComponent={
            <Text style={{ color: '#aaa', fontSize: 25 }}>TopHeader Component</Text>
          }
          topHeaderComponentStyle={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          showWeekDayModes={['3days', 'custom', 'day', 'month']}
          showWeekDayInnerModes={['week']}
          showShortWeekDayModes={['week']}
          weekDayStyle={{ fontSize: 18, color: '#355070' }}
        />
      </View>
    </View>
  )
})
