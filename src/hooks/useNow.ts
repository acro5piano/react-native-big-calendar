import dayjs from 'dayjs'
import React from 'react'

export function useNow(enabled: boolean, date: any) {
  const [now, setNow] = React.useState(dayjs(date))

  React.useEffect(() => {
    if (!enabled) {
      return () => {}
    }
    const pid = setInterval(() => setNow(dayjs()), 60 * 1000)
    return () => clearInterval(pid)
  }, [enabled])

  return {
    now,
  }
}
