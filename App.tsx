import React from 'react'
import ScholarStack from './src/navigation/Navigator'
import { NavigationContainer } from '@react-navigation/native'
import { MenuProvider } from 'react-native-popup-menu'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AlertNotificationRoot } from 'react-native-alert-notification';

const App = () => {
  return (
   
    <MenuProvider>
      <AlertNotificationRoot>
      <NavigationContainer>
          <ScholarStack />
         </NavigationContainer>
      </AlertNotificationRoot>
    </MenuProvider>
    
  )
}

export default App