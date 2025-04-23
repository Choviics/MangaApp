import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

// Definimos la interfaz para los mangas guardados
interface SavedManga {
  id: number;
  title: string;
  author: string;
}

export default function SavedScreen() {
  // Datos de ejemplo - reemplaza con datos reales de tu aplicación
  const savedMangas: SavedManga[] = [];

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
      <View className="p-4 flex-1">
        <Text className="text-2xl font-bold mb-4">Mis Mangas Guardados</Text>
        
        {savedMangas.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500 text-center mb-2">No tienes mangas guardados</Text>
            <Text className="text-gray-500 text-center">Explora la biblioteca y guarda tus mangas favoritos</Text>
          </View>
        ) : (
          <FlatList
            data={savedMangas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="bg-white p-3 rounded-lg mb-3 flex-row items-center">
                <View className="mr-3 w-16 h-24 bg-gray-200 rounded-md"></View>
                <View className="flex-1">
                  <Text className="font-semibold text-lg">{item.title}</Text>
                  <Text className="text-gray-500">{item.author}</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
} 