import { Modal, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '~/utils/themes';

interface Props {
  visible: boolean;
  close: () => void;
  text: string;
  title?: string;
}

export default function ModalInfo({
  visible,
  close,
  text,
  title = 'Elige como ver',
}: Readonly<Props>) {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={close}>
      <SafeAreaView className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View className="flex-1 items-center justify-center">
          <TouchableOpacity className="absolute inset-0" activeOpacity={1} onPress={close} />

          {/* Contenido del modal centrado */}
          <View
            className="w-[90%] max-w-md rounded-2xl p-4"
            style={{ backgroundColor: theme.card }}>
            <View className="flex-row items-center justify-center">
              <Ionicons name="information-circle" size={24} color={theme.text} className='mr-2'/>
              <Text className="text-center text-xl font-bold" style={{ color: theme.text }}>
                {title}
              </Text>
            </View>
            <ScrollView className="max-h-80 mt-10 ">
              <Text className="mb-4 text-lg" style={{ color: theme.text }}>
                {text}
              </Text>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
