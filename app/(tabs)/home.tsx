import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function Home() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-2xl font-bold mb-4">Bienvenido a Tabimanga</Text>
          
          {/* Sección de mangas populares */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-2">Mangas Populares</Text>
            {/* Aquí puedes agregar un componente de lista horizontal */}
          </View>
          
          {/* Sección de últimas actualizaciones */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-2">Últimas Actualizaciones</Text>
            {/* Aquí puedes agregar un componente de lista */}
          </View>
          
          {/* Sección de recomendados */}
          <View>
            <Text className="text-lg font-semibold mb-2">Recomendados</Text>
            {/* Aquí puedes agregar otro componente de lista */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}