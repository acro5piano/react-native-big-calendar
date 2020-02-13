import dayjs from 'dayjs'

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

export const DAY_MINUTES = 1440
