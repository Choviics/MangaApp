import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold mb-6">Perfil</Text>
        
        {/* Información del usuario */}
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-gray-300 mb-3 justify-center items-center">
            <Ionicons name="person" size={50} color="#6B7280" />
          </View>
          <Text className="text-xl font-bold">Usuario</Text>
          <Text className="text-gray-500">usuario@ejemplo.com</Text>
        </View>
        
        {/* Opciones del perfil */}
        <View className="bg-white rounded-xl overflow-hidden mb-4">
          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center">
            <Ionicons name="settings-outline" size={24} color="#3B82F6" className="mr-3" />
            <Text className="text-gray-800 flex-1">Configuración</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center">
            <Ionicons name="moon-outline" size={24} color="#3B82F6" className="mr-3" />
            <Text className="text-gray-800 flex-1">Tema</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity className="p-4 flex-row items-center">
            <Ionicons name="help-circle-outline" size={24} color="#3B82F6" className="mr-3" />
            <Text className="text-gray-800 flex-1">Ayuda y soporte</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        
        {/* Botón de cerrar sesión */}
        <TouchableOpacity className="mt-auto bg-red-100 p-4 rounded-full">
          <Text className="text-red-600 text-center font-semibold">Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 