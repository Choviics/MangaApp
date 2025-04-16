import '../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="welcome"
          options={{ headerShown: false, presentation: 'fullScreenModal' }}
        />
        {/* esconde el header para la pagina de inicio*/}
      </Stack>
    </GestureHandlerRootView>
  );
}
