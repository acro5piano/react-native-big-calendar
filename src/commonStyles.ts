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
    fontSize: 10,
    textAlign: 'center',
  },
  hourGuide: {
    backgroundColor: '#fff',
    zIndex: 1000,
    width: 50,
  },
})

export const MIN_HEIGHT = 1200
