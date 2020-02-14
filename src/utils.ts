import dayjs from 'dayjs'

export const DAY_MINUTES = 1440

export function getDatesInWeek(date: Date | dayjs.Dayjs = new Date()) {
  const subject = dayjs(date)
  const subjectDOW = subject.day()
  const days = Array(7)
    .fill(0)
    .map((_, i) => {
      return subject.add(i - subjectDOW, 'day')
    })

  return days
}

export function getDatesInNextThreeDays(date: Date | dayjs.Dayjs = new Date()) {
  const subject = dayjs(date)
  const days = Array(3)
    .fill(0)
    .map((_, i) => {
      return subject.add(i, 'day')
    })

  return days
}

export const hours = Array(24)
  .fill(0)
  .map((_, i) => i)

export function formatHour(hour: number) {
  return `${hour}:00`
}

export function isToday(date: dayjs.Dayjs) {
  const today = dayjs()
  return today.isSame(date, 'day')
}

export function getRelativeTopInDay(date = dayjs()) {
  return (100 * (date.hour() * 60 + date.minute())) / DAY_MINUTES
}

export function todayInMinutes() {
  const today = dayjs()
  return today.diff(dayjs().startOf('day'), 'minute')
}
