import dayjs from 'dayjs'

export const events = [
  {
    title: 'Meeting',
    start: dayjs().set('hour', 10).set('minute', 0).toDate(),
    end: dayjs().set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Coffee break',
    start: dayjs().set('hour', 14).set('minute', 30).toDate(),
    end: dayjs().set('hour', 15).set('minute', 30).toDate(),
  },
  {
    title: 'Meeting again',
    start: dayjs().set('hour', 16).set('minute', 30).toDate(),
    end: dayjs().set('hour', 17).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner at the Plaza',
    start: dayjs().set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Go home',
    start: dayjs().set('hour', 21).set('minute', 30).toDate(),
    end: dayjs().set('hour', 22).set('minute', 30).toDate(),
  },
  {
    title: 'Read a book',
    start: dayjs().set('hour', 22).set('minute', 30).toDate(),
    end: dayjs().set('hour', 23).set('minute', 30).toDate(),
  },
  {
    title: 'Exercise',
    start: dayjs().add(1, 'day').set('hour', 5).set('minute', 0).toDate(),
    end: dayjs().add(1, 'day').set('hour', 5).set('minute', 30).toDate(),
  },
  {
    title: 'Repair my car',
    start: dayjs().add(1, 'day').set('hour', 7).set('minute', 45).toDate(),
    end: dayjs().add(1, 'day').set('hour', 13).set('minute', 30).toDate(),
  },
  {
    title: 'Gardening',
    start: dayjs().add(2, 'day').set('hour', 10).set('minute', 0).toDate(),
    end: dayjs().add(2, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Mowing',
    start: dayjs().add(2, 'day').set('hour', 11).set('minute', 0).toDate(),
    end: dayjs().add(2, 'day').set('hour', 11).set('minute', 30).toDate(),
  },
  {
    title: 'Go to beach',
    start: dayjs().add(3, 'day').set('hour', 8).set('minute', 0).toDate(),
    end: dayjs().add(3, 'day').set('hour', 8).set('minute', 30).toDate(),
  },
  {
    title: 'Meeting 2',
    start: dayjs().add(7, 'day').set('hour', 10).set('minute', 0).toDate(),
    end: dayjs().add(7, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Coffee break',
    start: dayjs().add(7, 'day').set('hour', 14).set('minute', 30).toDate(),
    end: dayjs().add(7, 'day').set('hour', 15).set('minute', 30).toDate(),
  },
  {
    title: 'Dentist appointment',
    start: dayjs().add(8, 'day').set('hour', 14).set('minute', 30).toDate(),
    end: dayjs().add(8, 'day').set('hour', 15).set('minute', 30).toDate(),
  },
  {
    title: 'Study',
    start: dayjs().add(9, 'day').set('hour', 7).set('minute', 45).toDate(),
    end: dayjs().add(12, 'day').set('hour', 20).set('minute', 30).toDate(),
  },
  {
    title: 'Go to airport',
    start: dayjs().add(10, 'day').set('hour', 7).set('minute', 45).toDate(),
    end: dayjs().add(10, 'day').set('hour', 13).set('minute', 30).toDate(),
  },
  {
    title: 'Meeting',
    start: dayjs().add(11, 'day').set('hour', 7).set('minute', 45).toDate(),
    end: dayjs().add(11, 'day').set('hour', 13).set('minute', 30).toDate(),
  },
  {
    title: 'Lunch',
    start: dayjs().add(11, 'day').set('hour', 12).set('minute', 0).toDate(),
    end: dayjs().add(11, 'day').set('hour', 13).set('minute', 0).toDate(),
  },
  {
    title: 'Shopping',
    start: dayjs().add(11, 'day').set('hour', 14).set('minute', 0).toDate(),
    end: dayjs().add(11, 'day').set('hour', 15).set('minute', 0).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(11, 'day').set('hour', 18).set('minute', 0).toDate(),
    end: dayjs().add(11, 'day').set('hour', 19).set('minute', 0).toDate(),
  },
  {
    title: 'Go to movies',
    start: dayjs().add(11, 'day').set('hour', 20).set('minute', 0).toDate(),
    end: dayjs().add(11, 'day').set('hour', 22).set('minute', 0).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(12, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(12, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(12, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(12, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(12, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(12, 'day').set('hour', 17).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(12, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(12, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(13, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(13, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(13, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(13, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(13, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(13, 'day').set('hour', 17).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(13, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(13, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(14, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(14, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(14, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(14, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(14, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(14, 'day').set('hour', 17).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(14, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(14, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(15, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(15, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(15, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(15, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(15, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(15, 'day').set('hour', 17).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(15, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(15, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(16, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(16, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(16, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(16, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(16, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(16, 'day').set('hour', 17).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(16, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(16, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(17, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(17, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(17, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(17, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(17, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(17, 'day').set('hour', 17).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(17, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(17, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(18, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(18, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(18, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(18, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(18, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(18, 'day').set('hour', 18).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(18, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(18, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(19, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(19, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(19, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(19, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(19, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(19, 'day').set('hour', 18).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(19, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(19, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(20, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(20, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(20, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(20, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(20, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(20, 'day').set('hour', 18).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(20, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(20, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(21, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(21, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(21, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(21, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(21, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(21, 'day').set('hour', 18).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(21, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(21, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(22, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(22, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(22, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(22, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(22, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(22, 'day').set('hour', 18).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(22, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(22, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(23, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(23, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(23, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(23, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(23, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(23, 'day').set('hour', 18).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(23, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(23, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(24, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(24, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(24, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(24, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(24, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(24, 'day').set('hour', 18).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(24, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(24, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
  {
    title: 'Gym',
    start: dayjs().add(25, 'day').set('hour', 6).set('minute', 0).toDate(),
    end: dayjs().add(25, 'day').set('hour', 7).set('minute', 0).toDate(),
  },
  {
    title: 'Brunch',
    start: dayjs().add(25, 'day').set('hour', 9).set('minute', 30).toDate(),
    end: dayjs().add(25, 'day').set('hour', 10).set('minute', 30).toDate(),
  },
  {
    title: 'Work',
    start: dayjs().add(25, 'day').set('hour', 11).set('minute', 30).toDate(),
    end: dayjs().add(25, 'day').set('hour', 18).set('minute', 30).toDate(),
  },
  {
    title: 'Dinner',
    start: dayjs().add(25, 'day').set('hour', 18).set('minute', 30).toDate(),
    end: dayjs().add(25, 'day').set('hour', 19).set('minute', 30).toDate(),
  },
]
