import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CardProps {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly color: string;
  readonly backgroundIcon: string;
  readonly backgroundColor: string;
}

export default function Card({ title, description, icon, color, backgroundIcon, backgroundColor }: CardProps) {
  return (
    <View className="h-38 flex-1 rounded-2xl bg-slate-700/35" style={{ backgroundColor }}>
      <View className="flex-col gap-2 py-3 px-5">
        <View className="w-12 h-12 items-center justify-center rounded-xl" style={{ backgroundColor: backgroundIcon }}>
          <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={24} color={color} />
        </View>
        <Text className="text-lg font-bold text-white">{title}</Text>
        <Text className="text-sm font-semibold text-gray-500">{description}</Text>
      </View>
    </View>
  );
}
