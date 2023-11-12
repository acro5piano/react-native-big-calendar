import { storiesOf } from '@storybook/react'
import React, { useCallback } from 'react'
import { Button } from 'react-native'

import { Calendar } from '../src'

const MOBILE_HEIGHT = 736

storiesOf('reproduction-issue-961', module)
  .add('myBehaviour', () => <CalendarContainer swipeEnabled={false} />)
  .add('working', () => <CalendarContainer swipeEnabled={true} />)

interface CalendarContainerProps {
  swipeEnabled: boolean
}

const CalendarContainer: React.FC<CalendarContainerProps> = ({ swipeEnabled }) => {
  const [date, setDate] = React.useState(new Date())

  const toNextWeek = () => {
    let nextWeek = new Date(date)
    nextWeek.setDate(nextWeek.getDate() + 7)
    setDate(nextWeek)
  }

  const toLastWeek = () => {
    let lastWeek = new Date(date)
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
