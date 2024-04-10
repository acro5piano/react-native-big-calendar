import dayjs from 'dayjs'
import React from 'react'

export function useNow(enabled: boolean, current?: Date) {
  const [now, setNow] = React.useState(dayjs(current))

  React.useEffect(() => {
    if (!enabled) {
      return () => {}
    }
    const pid = setInterval(() => setNow(dayjs()), 60 * 1000)
    return () => clearInterval(pid)
  }, [enabled, current])

  return {
    now,
  }
}
