import dayjs from 'dayjs'
import React from 'react'

export function useNow(enabled: boolean) {
  const [now, setNow] = React.useState(dayjs())

  React.useEffect(() => {
    if (!enabled) {
      return () => {};
    }
    const updateNow = () => {
      const currentMinute = dayjs().minute();
      setNow(dayjs());
      if (currentMinute !== lastMinuteRef.current) {
        lastMinuteRef.current = currentMinute;
        setNow(dayjs());
      }
    };
    updateNow();
    const intervalId = setInterval(updateNow, 1000);
    return () => clearInterval(intervalId);
  }, [enabled]);
  const lastMinuteRef = React.useRef(dayjs().minute());
  return {
    now,
  };
}
