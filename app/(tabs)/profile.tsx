import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '~/utils/themes';
import { useState } from 'react';
import ThemeModal from '~/components/ThemeModal';
export default function ProfileScreen() {
  const { theme } = useTheme();
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);

  return (
    <SafeAreaView edges={['top']} className="flex-1" style={{ backgroundColor: theme.background }}>
      <View className="flex-1 p-4">
        <Text className="mb-6 text-2xl font-bold" style={{ color: theme.text }}>
          Perfil
        </Text>

        {/* Información del usuario */}
        <View className="mb-6 items-center">
          <View
            className="mb-3 h-24 w-24 items-center justify-center rounded-full"
            style={{ backgroundColor: theme.card }}>
            <Ionicons name="person" size={50} color={theme.primary} />
          </View>
          <Text className="text-xl font-bold" style={{ color: theme.text }}>
            Usuario
          </Text>
          <Text style={{ color: theme.secondary }}>usuario@ejemplo.com</Text>
        </View>

        {/* Opciones del perfil */}
        <View className="mb-4 overflow-hidden rounded-xl" style={{ backgroundColor: theme.card }}>
          <TouchableOpacity
            className="flex-row items-center border-b p-4"
            style={{ borderColor: theme.border }}>
            <Ionicons name="settings-outline" size={24} color={theme.primary} className="mr-3" />
            <Text className="flex-1" style={{ color: theme.text }}>
              Configuración
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center border-b p-4"
            style={{ borderColor: theme.border }}
            onPress={() => setIsThemeModalVisible(true)}>
            <Ionicons name="moon-outline" size={24} color={theme.primary} className="mr-3" />
            <Text className="flex-1" style={{ color: theme.text }}>
              Tema
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.secondary} />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-4">
            <Ionicons name="help-circle-outline" size={24} color={theme.primary} className="mr-3" />
            <Text className="flex-1" style={{ color: theme.text }}>
              Ayuda y soporte
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.secondary} />
          </TouchableOpacity>
        </View>

        {/* Botón de cerrar sesión */}
        <TouchableOpacity
          className="mt-auto rounded-full p-4"
          style={{ backgroundColor: theme.error + '20' }}>
          <Text className="text-center font-semibold" style={{ color: theme.error }}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>

        {/* Usar el componente ThemeModal */}
        <ThemeModal visible={isThemeModalVisible} onClose={() => setIsThemeModalVisible(false)} />
      </View>
    </SafeAreaView>
  );
}
