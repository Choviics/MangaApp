import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Buscar</Text>
        
        {/* Barra de búsqueda */}
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-4">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput 
            placeholder="Buscar manga..." 
            className="flex-1 ml-2 text-gray-800" 
          />
        </View>
        
        {/* Resultados de búsqueda o sugerencias */}
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Introduce tu búsqueda para encontrar mangas</Text>
        </View>
      </View>
    </SafeAreaView>
  );
} 