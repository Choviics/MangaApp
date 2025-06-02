import { useEffect, useRef, useState } from 'react';
import {
  Platform,
  Text,
  useWindowDimensions,
  View,
  LayoutChangeEvent,
  Linking,
} from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Marquee from '~/components/marquee';
import ButtonCustom from '~/components/Button';
import BannerInfo from '~/components/BannerInfo';
import Card from '~/components/Card';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [availableSpace, setAvailableSpace] = useState(180);
  const headerRef = useRef(null);
  const cardsRef = useRef(null);
  const buttonsRef = useRef(null);
  const contentMeasured = useRef({
    header: false,
    cards: false,
    buttons: false,
  });

  // Para almacenar las alturas medidas
  const [heights, setHeights] = useState({
    header: 0,
    cards: 0,
    buttons: 0,
  });

  const { width, height } = useWindowDimensions();
  const fontSize = width < 360 ? 'text-3xl' : 'text-4xl';

  // Calcular el espacio disponible cuando tengamos todas las medidas
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBackgroundColorAsync('rgba(0,0,0,0)');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
    if (
      contentMeasured.current.header &&
      contentMeasured.current.cards &&
      contentMeasured.current.buttons
    ) {
      // Descontamos las alturas medidas y un poco para padding/margin
      const totalUsedSpace = heights.header + heights.cards + heights.buttons + 40; // 40px para paddings
      // Reducimos el espacio disponible para que los botones aparezcan más arriba
      // Usamos solo el 60% del espacio disponible para el Marquee
      const space = Math.max(100, (height - totalUsedSpace) * 0.9);

      setAvailableSpace(space);
    }
  }, [heights, height]);

  // Funciones para medir la altura de cada sección
  const onHeaderLayout = (event: LayoutChangeEvent) => {
    if (!contentMeasured.current.header) {
      const { height } = event.nativeEvent.layout;
      setHeights((prev) => ({ ...prev, header: height }));
      contentMeasured.current.header = true;
    }
  };

  const onCardsLayout = (event: LayoutChangeEvent) => {
    if (!contentMeasured.current.cards) {
      const { height } = event.nativeEvent.layout;
      setHeights((prev) => ({ ...prev, cards: height }));
      contentMeasured.current.cards = true;
    }
  };

  const onButtonsLayout = (event: LayoutChangeEvent) => {
    if (!contentMeasured.current.buttons) {
      const { height } = event.nativeEvent.layout;
      setHeights((prev) => ({ ...prev, buttons: height }));
      contentMeasured.current.buttons = true;
    }
  };

  const STORAGE_KEY = `@welcome_page_seen`;

  const markWelcomePageAsVisited = async () => {
    try {
      const welcomeData = {
        isVisited: true,
        timestamp: new Date().toISOString(),
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(welcomeData));
    } catch (error) {
      console.error('Error al guardar el estado de la página de bienvenida:', error);
    }
  };

  const onButtonStart = () => {
    markWelcomePageAsVisited();
    router.replace('/(tabs)/home');
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#000014' }}>
      <StatusBar translucent style="light" />
      <SafeAreaView edges={['bottom', 'top', 'left', 'right']} className="flex-1">
        <View className="flex-1 flex-col justify-between py-2">
          {/* Header */}
          <View ref={headerRef} onLayout={onHeaderLayout}>
            <View className="items-center">
              <BannerInfo
                title="Bienvenido a Tabimanga"
                colorText="#F69B0C"
                backgroundColor="#121226"
              />
            </View>
            <View className="w-full items-center p-5">
              <Text className={`${fontSize} mb-2 text-center font-extrabold text-white`}>
                Lee a tu <Text className="text-[#F69B0C]">ritmo</Text>
              </Text>
              <Text className={`text-center text-base font-medium tracking-wide text-gray-300/90`}>
                ¡Descubre, descarga y guarda tus mangas favoritos en un solo lugar!
              </Text>
            </View>
          </View>

          {/* Cards - Mantenemos tamaño fijo */}
          <View ref={cardsRef} onLayout={onCardsLayout} className="w-full px-5">
            <View className="w-full">
              <View className="flex-row py-2" style={{ gap: 12 }}>
                <Card
                  title="Biblioteca"
                  description="Accede a cientos de mangas"
                  icon="library"
                  color="#F69B0C"
                  backgroundIcon="rgba(246, 155, 12, 0.1)"
                  backgroundColor="#121226"
                />
                <Card
                  title="Progeso"
                  description="sigue tus mangas favoritos"
                  icon="sync"
                  color="#F69B0C"
                  backgroundIcon="rgba(246, 155, 12, 0.1)"
                  backgroundColor="#121226"
                />
              </View>
              <View className="flex-row py-2" style={{ gap: 12 }}>
                <Card
                  title="Avisos"
                  description="Te indica cuando hay un nuevo capitulo"
                  icon="notifications"
                  color="#F69B0C"
                  backgroundIcon="rgba(246, 155, 12, 0.1)"
                  backgroundColor="#121226"
                />
                <Card
                  title="Comunidad"
                  description="Puedes ingresar a nuestro discord"
                  icon="people"
                  color="#F69B0C"
                  backgroundIcon="rgba(246, 155, 12, 0.1)"
                  backgroundColor="#121226"
                />
              </View>
            </View>
          </View>

          {/* usa el espacio disponible */}
          <View
            className="w-full p-3"
            style={{
              height: availableSpace,
            }}>
            <Marquee imgs={covers} availableSpace={availableSpace} />
          </View>

          {/* Botones */}
          <View ref={buttonsRef} onLayout={onButtonsLayout} className="w-full gap-3 px-5 pb-5">
            <ButtonCustom
              text="¡Empezar!"
              onPress={onButtonStart}
              backgroundColor={['#f59d0b', '#f97415']}
              colorText="text-black"
              borderRadius={15}
              centered={true}
            />
            <ButtonCustom
              text="Sobre nosotros"
              onPress={() => {
                const projectUrl = 'https://github.com/Choviics/MangaApp';
                Linking.openURL(projectUrl);
              }}
              backgroundColor="#121226"
              colorText="text-white"
              borderRadius={15}
              centered={true}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
