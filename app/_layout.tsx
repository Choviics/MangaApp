import '../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { ThemeProvider } from '~/utils/themes';
import { SavedMangasProvider } from '../api/mangaStore'

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SavedMangasProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
      </SavedMangasProvider>
    </ThemeProvider>
  );
}