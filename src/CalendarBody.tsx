import * as React from 'react'
import dayjs from 'dayjs'
import { StyleSheet, Text, View } from 'react-native'
import { commonStyles, MIN_HEIGHT } from './commonStyles'
import { formatHour, hours, DAY_MINUTES } from './utils'

function getEventCellPositionStyle({ end, start }: { end: dayjs.Dayjs; start: dayjs.Dayjs }) {
  const relativeHeight = 100 * (1 / DAY_MINUTES) * end.diff(start, 'minute')
  const relativeTop = (100 * (start.hour() * 60 + start.minute())) / DAY_MINUTES
  return {
    height: `${relativeHeight}%`,
    top: `${relativeTop}%`,
  }
}

interface DayJsConvertedEvent {
  title: string
  start: dayjs.Dayjs
  end: dayjs.Dayjs
}

interface CalendarBodyProps {
  containerHeight: number
  cellHeight: number
  dateRange: dayjs.Dayjs[]
  dayJsConvertedEvents: DayJsConvertedEvent[]
  style: any
}

export const CalendarBody = React.memo(
  ({
    containerHeight,
    cellHeight,
    dateRange,
    style = {},
    dayJsConvertedEvents,
  }: CalendarBodyProps) => {
    return (
      <View style={[styles.container, { height: containerHeight - cellHeight * 2 }, style]}>
        <View style={styles.inner}>
          <View style={[styles.body]}>
            <View style={[commonStyles.hourGuide]}>
              {hours.map(hour => (
                <View key={hour} style={{ height: cellHeight }}>
                  <Text style={commonStyles.guideText}>{formatHour(hour)}</Text>
                </View>
              ))}
            </View>
            {dateRange.map(date => (
              <View style={[{ flex: 1 }]} key={date.toString()}>
                {hours.map(hour => (
                  <View key={hour} style={[commonStyles.dateCell, { height: cellHeight }]}></View>
                ))}
                {dayJsConvertedEvents
                  .filter(
                    ({ start, end }) =>
                      start.isAfter(date.startOf('day')) && end.isBefore(date.endOf('day')),
                  )
                  .map(event => (
                    <View
                      key={event.start.toString()}
                      style={[styles.eventCell, getEventCellPositionStyle(event)]}
                    >
                      <Text style={styles.eventTitle}>{event.title}</Text>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    overflow: 'scroll',
  },
  inner: {
    minHeight: MIN_HEIGHT,
  },
  body: {
    flexDirection: 'row',
    flex: 1,
    minHeight: 800,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 12,
  },
  eventCell: {
    position: 'absolute' as const,
    backgroundColor: 'rgb(66, 133, 244)',
    zIndex: 100,
    width: '96%',
    alignSelf: 'center' as const,
    borderRadius: 3,
    padding: 4,
    color: '#fff',
  },
})
