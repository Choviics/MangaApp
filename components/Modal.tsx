import { Modal, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '~/utils/themes';

interface Props {
  visible: boolean;
  close: () => void;
  options: {
    name: string;
    onPress: () => void;
    selected?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
  }[];
  title?: string;
}

export default function ModalPer({ visible, close, options, title = "Elige como ver" }: Readonly<Props>) {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={close}>
      <SafeAreaView className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View className="flex-1 justify-center items-center">
          <TouchableOpacity 
            className="absolute inset-0" 
            activeOpacity={1}
            onPress={close} 
          />
          
          {/* Contenido del modal centrado */}
          <View
            className="w-[90%] max-w-md rounded-2xl p-4"
            style={{ backgroundColor: theme.card }}
          >
              <Text className="mb-4 text-center text-xl font-bold" style={{ color: theme.text }}>
                {title}
              </Text>
              <ScrollView className="max-h-80">
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.name}
                    className={`mb-2 flex-row items-center rounded-xl p-4 ${
                      option.selected ? 'border-2' : ''
                    }`}
                    style={{ 
                      borderColor: option.selected ? theme.primary : 'transparent',
                      backgroundColor: theme.card
                    }}
                    onPress={option.onPress}
                  >
                    {option.selected && (
                      <View className="mr-3">
                        <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                      </View>
                    )}
                    {option.icon && (
                      <View className="mr-3">
                        <Ionicons name={option.icon} size={24} color={theme.primary} />
                      </View>
                    )}
                    <Text className="flex-1 capitalize" style={{ color: theme.text }}>
                      {option.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}