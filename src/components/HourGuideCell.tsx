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
  todayHighlight: boolean
}

export const HourGuideCell = ({ cellHeight, onPress, date, hour, todayHighlight }: HourGuideCellProps) => {
  const theme = useTheme()

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
        {[1, 2, 3, 4].map((item, index) => {
          return (
            <TouchableWithoutFeedback onPress={() => {
              onPress(dayjs(date.hour(hour).minute(0)).minute(index * 15).second(0));
              console.log(dayjs(date.hour(hour).minute(0)).minute(index * 15).second(0));
            }}>
              <View style={[
                index !== 3 && u['border-b'],
                { flex: 1 },
                index !== 3 && { borderBottomWidth: 1, borderColor: theme.palette.gray['200'] }
              ]} />
            </TouchableWithoutFeedback>
          )
        })}
      </View>
    </TouchableWithoutFeedback>
  )
}
