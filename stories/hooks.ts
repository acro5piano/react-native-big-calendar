import dayjs from 'dayjs'
import React from 'react'

import { ICalendarEventBase } from '../src/interfaces'

export function useEvents(defaultEvents: ICalendarEventBase[]) {
  const [events, setEvents] = React.useState(defaultEvents)
  const addEvent = React.useCallback(
    (start: Date) => {
      // @ts-ignore
      const title = prompt('What is the event title?')
      if (title) {
        const end = dayjs(start).add(1, 'hour').toDate()
        setEvents([...events, { start, end, title: title }])
      }
    },
    [events],
  )

  return {
    events,
    addEvent,
  }
}
