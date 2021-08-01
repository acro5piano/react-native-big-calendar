import { AppRegistry, LogBox } from 'react-native'

import { App } from './App'
import { name as appName } from './app.json'

LogBox.ignoreLogs(['Remote debugger', 'Picker has been extracted'])

AppRegistry.registerComponent(appName, () => App)
