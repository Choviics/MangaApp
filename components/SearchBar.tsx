import { Ionicons } from '@expo/vector-icons';
import { Pressable, TextInput, View } from 'react-native';
import { useTheme } from '~/utils/themes';

interface SearchBarProps {
  placeHolder?: string;
  value: string;
  onSearch: (text: string) => void;
}

export default function SearchBar({ placeHolder, value, onSearch }: Readonly<SearchBarProps>) {
  const { theme } = useTheme();

  return (
    <View
      className="mb-4 flex-row content-between items-center rounded-full px-4"
      style={{ backgroundColor: theme.card }}>
      <TextInput
        placeholder={placeHolder ?? 'Buscar...'}
        placeholderTextColor={theme.secondary}
        className="ml-2 flex-1"
        style={{ color: theme.text }}
        value={value}
        onChangeText={onSearch}
      />
      <Pressable onPress={() => onSearch('')}>
        <Ionicons name="close-outline" size={24} color={theme.text} className="ml-2" />
      </Pressable>
    </View>
  );
}
