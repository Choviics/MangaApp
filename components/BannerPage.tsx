import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { useTheme } from '~/utils/themes';

interface BannerPageProps {
  title: string;
  icon: keyof typeof Ionicons['glyphMap'];
}

export default function BannerPage({ title, icon }: Readonly<BannerPageProps>) {  
  const { theme } = useTheme();

  return (
    <View
      className="h-14 justify-center border-b"
      style={{ borderColor: theme.border, backgroundColor: theme.background }}>
      <View className="flex-row items-center px-4">
        <Ionicons name={icon} size={24} color={theme.accent} />
        <Text className="ml-4 text-2xl font-bold" style={{ color: theme.text }}>
          {title}
        </Text>
      </View>
    </View>
  );
}
