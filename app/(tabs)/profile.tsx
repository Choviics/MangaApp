import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '~/utils/themes';
import { useState } from 'react';
import ThemeModal from "~/components/ThemeModal";
export default function ProfileScreen() {
  const { theme } = useTheme();
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);

  return (
    <SafeAreaView edges={['top']} className="flex-1" style={{ backgroundColor: theme.background }}>
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold mb-6" style={{ color: theme.text }}>Perfil</Text>
        
        {/* Información del usuario */}
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full mb-3 justify-center items-center" 
                style={{ backgroundColor: theme.card }}>
            <Ionicons name="person" size={50} color={theme.primary} />
          </View>
          <Text className="text-xl font-bold" style={{ color: theme.text }}>Usuario</Text>
          <Text style={{ color: theme.secondary }}>usuario@ejemplo.com</Text>
        </View>
        
        {/* Opciones del perfil */}
        <View className="rounded-xl overflow-hidden mb-4" style={{ backgroundColor: theme.card }}>
          <TouchableOpacity className="p-4 border-b flex-row items-center" 
                          style={{ borderColor: theme.border }}>
            <Ionicons name="settings-outline" size={24} color={theme.primary} className="mr-3" />
            <Text className="flex-1" style={{ color: theme.text }}>Configuración</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.secondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="p-4 border-b flex-row items-center" 
            style={{ borderColor: theme.border }}
            onPress={() => setIsThemeModalVisible(true)}
          >
            <Ionicons name="moon-outline" size={24} color={theme.primary} className="mr-3" />
            <Text className="flex-1" style={{ color: theme.text }}>Tema</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.secondary} />
          </TouchableOpacity>
          
          <TouchableOpacity className="p-4 flex-row items-center">
            <Ionicons name="help-circle-outline" size={24} color={theme.primary} className="mr-3" />
            <Text className="flex-1" style={{ color: theme.text }}>Ayuda y soporte</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.secondary} />
          </TouchableOpacity>
        </View>
        
        {/* Botón de cerrar sesión */}
        <TouchableOpacity 
          className="mt-auto p-4 rounded-full"
          style={{ backgroundColor: theme.error + '20' }}
        >
          <Text className="text-center font-semibold" style={{ color: theme.error }}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>

        {/* Usar el componente ThemeModal */}
        <ThemeModal 
          visible={isThemeModalVisible} 
          onClose={() => setIsThemeModalVisible(false)} 
        />
      </View>
    </SafeAreaView>
  );
}