import React from 'react'
import { Button, View, StyleSheet } from 'react-native'

export const CONTROL_HEIGHT = 100

interface ControlProps {
  onNext: () => void
  onPrev: () => void
  onToday: () => void
}

export function Control({ onNext, onPrev, onToday }: ControlProps) {
  return (
    <View style={styles.control}>
      <Button title="Prev" onPress={onPrev} />
      <Button title="Today" onPress={onToday} />
      <Button title="Next" onPress={onNext} />
    </View>
  )
}

const styles = StyleSheet.create({
  control: {
    height: CONTROL_HEIGHT,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
})
