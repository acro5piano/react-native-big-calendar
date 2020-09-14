import { StyleSheet } from 'react-native'
import { Color } from './theme'

export const MIN_HEIGHT = 1200
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
    backgroundColor: Color.primary,
    zIndex: 100,
    start: 3,
    end: 3,
    borderRadius: 3,
    padding: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    minWidth: '33%',
  },
  eventTitle: {
    color: '#fff',
    fontSize: 12,
  },
})
