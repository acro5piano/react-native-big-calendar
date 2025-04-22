import type { Meta, StoryObj } from '@storybook/react'
import React, { useCallback } from 'react'
import { Button } from 'react-native'

import { Calendar } from '../src'

const MOBILE_HEIGHT = 736

const meta: Meta<typeof Calendar> = {
  title: 'reproduction-issue-961',
  component: Calendar,
}

export default meta

type Story = StoryObj<typeof Calendar>

export const MyBehaviour: Story = {
  render: () => <CalendarContainer swipeEnabled={false} />,
}

export const Working: Story = {
  render: () => <CalendarContainer swipeEnabled={true} />,
}

interface CalendarContainerProps {
  swipeEnabled: boolean
}

const CalendarContainer: React.FC<CalendarContainerProps> = ({ swipeEnabled }) => {
  const [date, setDate] = React.useState(new Date())

  const toNextWeek = () => {
    const nextWeek = new Date(date)
    nextWeek.setDate(nextWeek.getDate() + 7)
    setDate(nextWeek)
  }

  const toLastWeek = () => {
    const lastWeek = new Date(date)
    lastWeek.setDate(lastWeek.getDate() - 7)
    setDate(lastWeek)
  }

  const onChangeDate = useCallback(([start, end]: [Date, Date]) => {
    //here I normally do my event fetching with the given timeframe.
    //this way I dont need to calculate the start and end date by myself
    //but the function is only called if I swipe the calendar
    //not by changing the date prop

    console.log(start)
    console.log(end)
  }, [])

  return (
    <>
      {!swipeEnabled && (
        <>
          <Button onPress={toLastWeek} title="left" />
          <Button onPress={toNextWeek} title="right" />
        </>
      )}
      <Calendar
        events={[]}
        swipeEnabled={swipeEnabled}
        date={date}
        onChangeDate={onChangeDate}
        height={MOBILE_HEIGHT}
      />
    </>
  )
}
