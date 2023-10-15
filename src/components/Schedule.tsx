import React from 'react'
import { typedMemo } from '../utils/react'
import { Text, View } from 'react-native'

function _Schedule() {
  return (
    <View>
      <Text>Schedule view</Text>
    </View>
  )
}

export const Schedule = typedMemo(_Schedule)
