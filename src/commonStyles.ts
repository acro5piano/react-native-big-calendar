import { StyleSheet } from 'react-native'

export const commonStyles = StyleSheet.create({
  dateCell: {
    borderWidth: 1,
    borderColor: '#eee',
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  guideText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  hourGuide: {
    width: '5%',
    minWidth: 50,
  },
})

export const MIN_HEIGHT = 1200
