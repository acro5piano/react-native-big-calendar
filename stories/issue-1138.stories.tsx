import type { Meta, StoryObj } from '@storybook/react'
import dayjs from 'dayjs'
import React, { type FC } from 'react'
import { Calendar } from '../src'

const MOBILE_HEIGHT = 736

const meta: Meta<typeof Calendar> = {
  title: 'reproduction-issue-1138',
  component: Calendar,
}

export default meta

type Story = StoryObj<typeof Calendar>

export const EventDurationsWhenHideAdjacentMonths: Story = {
  render: () => <CalendarContainer />,
}

const events = [
  {
    title: 'event3',
    start: dayjs('2025-02-13').toDate(),
    end: dayjs('2025-02-23').toDate(),
  },
]

const CalendarContainer: FC = () => {
  return (
    <>
      <Calendar
        events={events}
        swipeEnabled={true}
        date={new Date('2025-02-01')}
        height={MOBILE_HEIGHT}
        mode="month"
        showAdjacentMonths={false}
      />
    </>
  )
}
