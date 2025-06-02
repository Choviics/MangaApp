import { Link, Stack } from 'expo-router';
import { Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '~/utils/themes';

export default function NotFoundScreen() {
  const { theme } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-2xl" style={{ color: theme.text }}>
            This screen does not exist.
          </Text>
          <Link href="/(tabs)/home" className='mt-4' style={{ color: theme.primary }}>
            <Text>Go to home screen!</Text>
          </Link>
          <Image
            source={require('../assets/animeCries.png')}
            className="mt-8 w-64 h-64"
            />
        </View>
      </SafeAreaView>
    </>
  );
}
