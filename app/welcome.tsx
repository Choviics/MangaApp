import { useEffect } from 'react';
import { Platform, Text, useWindowDimensions, View } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Marquee from '~/components/marquee';
import ButtonCustom from '~/components/Button';
import Cards from '~/components/Cards';
import BannerInfo from '~/components/BannerInfo';
const covers = [
  {
    id: 1,
    imageUrl: require('../assets/images/cover1.webp'),
  },
  {
    id: 2,
    imageUrl: require('../assets/images/cover2.webp'),
  },
  {
    id: 3,
    imageUrl: require('../assets/images/cover3.webp'),
  },
  {
    id: 4,
    imageUrl: require('../assets/images/cover4.webp'),
  },
  {
    id: 5,
    imageUrl: require('../assets/images/cover5.jpg'),
  },
  {
    id: 6,
    imageUrl: require('../assets/images/cover6.webp'),
  },
  {
    id: 7,
    imageUrl: require('../assets/images/cover7.webp'),
  },
  {
    id: 8,
    imageUrl: require('../assets/images/cover8.webp'),
  },
  {
    id: 9,
    imageUrl: require('../assets/images/cover9.jpg'),
  },
  {
    id: 10,
    imageUrl: require('../assets/images/cover10.jpg'),
  },
];

export default function Welcome() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBackgroundColorAsync('rgba(0,0,0,0)');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
  }, []);

  const { width } = useWindowDimensions();
  const fontSize = width < 360 ? 'text-3xl' : 'text-4xl';

  return (
    <View className="flex-1 bg-gray-950">
      <StatusBar translucent style="light" />
      <SafeAreaView edges={['bottom', 'top', 'left', 'right']} className="flex-1">
        <View className="flex-1 flex-col justify-between py-2">
          {/* superior */}
          <View>
            <BannerInfo
              title="Bienvenido a Tabimanga"
              colorText="#F69B0C"
              backgroundColor="rgba(246, 155, 12, 0.1)"
            />
            {/* Header */}
            <View className="mb-4 w-full items-center p-5">
              <Text className={`${fontSize} mb-2 text-center font-extrabold text-white`}>
                Tu lector de manga
              </Text>
              <Text
                className={`mb-2 text-center text-base font-medium tracking-wide text-gray-300/90`}>
                ¡Descubre, descarga y guarda tus mangas favoritos en un solo lugar!
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View className="w-full gap-3 p-5">
            <View className="mb-6 h-48 w-full">
              <Marquee imgs={covers} />
            </View>
            <ButtonCustom
              text="¡Empezar!"
              onPress={() => console.log('¡Empezar!')}
              backgroundColor={['#f59d0b', '#f97415']}
              colorText="text-black"
              borderRadius={15}
            />
            <ButtonCustom
              text="Sobre nosotros"
              onPress={() => console.log('sobre nosotros')}
              backgroundColor="#111827"
              colorText="text-white"
              borderRadius={15}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
