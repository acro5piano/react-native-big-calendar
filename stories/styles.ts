import { StyleSheet } from 'react-native'

const MOBILE_HEIGHT = 736

export const styles = StyleSheet.create({
  desktop: {
    height: '100%',
  },
  mobile: {
    width: 414,
    height: MOBILE_HEIGHT,
    overflow: 'hidden',
    borderWidth: 10,
    borderRadius: 10,
    // boxSizing: 'content-box',
  },
})
