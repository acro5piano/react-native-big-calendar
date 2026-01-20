import { Text, View } from 'react-native'
import { Calendar } from 'react-native-big-calendar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Calendar height={800} mode="3days" events={[]} />
      </GestureHandlerRootView>
      <Text>Foge</Text>
    </View>
  )
}
