import { Text, View } from 'react-native'
import { Calendar } from './react-native-big-calendar/build'

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Calendar height={600} events={[]} />
    </View>
  )
}
