import dayjs from 'dayjs'
import * as React from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'

import { u } from '../commonStyles'
import { useTheme } from '../theme/ThemeContext'
import { isToday } from '../utils';

interface HourGuideCellProps {
  cellHeight: number
  onPress: (d: dayjs.Dayjs) => void
  date: dayjs.Dayjs
  hour: number,
  todayHighlight?: boolean
  slotDuration?: number
}

export const HourGuideCell = ({ cellHeight, onPress, date, hour, todayHighlight, slotDuration =15 }: HourGuideCellProps) => {
  const theme = useTheme()
  const lineArray = Array(4).fill(0);
  return (
    <TouchableWithoutFeedback>
      <View
        style={[
          // u['border-l'],
          u['border-b'],
          { borderColor: theme.palette.gray['200'] },
          { height: cellHeight },
          todayHighlight && {backgroundColor: isToday(dayjs(date)) ? 'rgba(255,187,0, 0.1)' : 'white'}
        ]}
      >
        {lineArray.map((_: any, index: number) => {
        const isNotLast = index !== lineArray.length - 1

          return (
            <TouchableWithoutFeedback key={`${index}`} onPress={() => {
              onPress(dayjs(date.hour(hour).minute(0)).minute(index * 15).second(0));
              console.log(dayjs(date.hour(hour).minute(0)).minute(index * 15).second(0));
            }}>
              <View style={[
                isNotLast && u['border-b'],
                { flex: 1 },
                isNotLast && { borderBottomWidth: 1, borderColor: theme.palette.gray['200'] }
              ]} />
            </TouchableWithoutFeedback>
          )
        })}
      </View>
    </TouchableWithoutFeedback>
  )
}
