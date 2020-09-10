import { StyleSheet } from 'react-native'

export const MIN_HEIGHT = 1200
export const PRIMARY_COLOR = 'rgb(66, 133, 244)'
export const HOUR_GUIDE_WIDTH = 50

export const commonStyles = StyleSheet.create({
  dateCell: {
    borderWidth: 1,
    borderColor: '#eee',
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  guideText: {
    color: '#888',
    fontSize: 11,
    textAlign: 'center',
  },
  hourGuide: {
    backgroundColor: '#fff',
    zIndex: 1000,
    width: HOUR_GUIDE_WIDTH,
  },
  eventCell: {
    position: 'absolute' as const,
    backgroundColor: PRIMARY_COLOR,
    zIndex: 100,
    width: '96%',
    alignSelf: 'center' as const,
    borderRadius: 3,
    padding: 4,
    overflow: 'hidden',
  },
  eventTitle: {
    color: '#fff',
    fontSize: 12,
  },
})
