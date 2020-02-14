import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

export const HEADER_HEIGHT = 50

export function AppHeader() {
  return (
    <View style={styles.header}>
      <Text>Big Calendar</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
