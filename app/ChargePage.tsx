import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '~/utils/themes';

export default function ChargePage() {
  const { theme } = useTheme();

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: theme.background }}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
}
