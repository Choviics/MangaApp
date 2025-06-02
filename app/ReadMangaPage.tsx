import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import {
  Image,
  View,
  Dimensions,
  ActivityIndicator,
  FlatList,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import MangaBackBar from '~/components/MangaBackBar';
import { getMangaImages } from '../api/ChaptersServices';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ModalPer from '~/components/Modal';
import * as NavigationBar from 'expo-navigation-bar';

interface TouchEvent {
  nativeEvent: {
    locationX: number;
    locationY: number;
  };
}

export default function ReadMangaPage() {
  const { id, title, chapter } = useLocalSearchParams<{
    id: string;
    title: string;
    chapter: string;
  }>();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true); // Nuevo estado
  const flatListRef = useRef<FlatList<string>>(null);
  const [selectedOption, setSelectedOption] = useState('1');
  const [inverted, setInverted] = useState(true);

  // Obtenemos las dimensiones de la pantalla
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const options = [
    {
      name: 'Horizontal DER - IZQ',
      selected: selectedOption === '1',
      onPress: () => {
        setSelectedOption('1');
        setModalVisible(false);
        setInverted(true);
      },
    },
    {
      name: 'Horizontal IZQ - DER',
      selected: selectedOption === '2',
      onPress: () => {
        setSelectedOption('2');
        setModalVisible(false);
        setInverted(false);
      },
    },
    // {
    //   name: 'Vertical Continuo',
    //   selected: selectedOption === '3',
    //   onPress: () => {
    //     setSelectedOption('3');
    //     setModalVisible(false);
    //     setInverted(false);
    //   },
    // },
  ];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await getMangaImages(id);
        setImages(response);
      } catch (error) {
        console.error('Error cargando imágenes del manga:', error);
      } finally {
        setLoading(false);
      }

      if (Platform.OS === 'android') {
        NavigationBar.setVisibilityAsync('hidden');
        NavigationBar.setBackgroundColorAsync('rgba(0,0,0,0)');
        NavigationBar.setBehaviorAsync('overlay-swipe');
      }
    };

    fetchImages();
  }, [id]);

  // Funciones de navegación
  const goToNextPage = () => {
    if (currentPage < images.length - 1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentPage + 1,
        animated: true,
      });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentPage - 1,
        animated: true,
      });
    }
  };

  const toggleControls = () => {
    setControlsVisible(!controlsVisible);
  };

  const handleZoneTap = (event: TouchEvent): void => {
    const { locationX } = event.nativeEvent;

    const leftZone: boolean = locationX < screenWidth * 0.25; // 25% izquierdo
    const rightZone: boolean = locationX > screenWidth * 0.75; // 25% derecho
    const centerZone: boolean = !leftZone && !rightZone;

    if (leftZone) {
      if (selectedOption !== '2') {
        goToNextPage();
      } else {
        goToPreviousPage();
      }
      return;
    }

    if (rightZone) {
      if (selectedOption !== '2') {
        goToPreviousPage();
      } else {
        goToNextPage();
      }
      return;
    }

    if (centerZone) {
      toggleControls();
    }
  };

  const renderMangaPage = ({ item: imageUrl, index }: { item: string; index: number }) => {
    return (
      <Pressable
        onPress={handleZoneTap}
        style={{ width: screenWidth, height: screenHeight }}
        className="items-center justify-center"
        delayLongPress={500}>
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: screenWidth,
            height: screenHeight,
            resizeMode: 'contain',
          }}
          onError={(e) => console.error(`Error cargando imagen ${index}:`, e.nativeEvent.error)}
        />
      </Pressable>
    );
  };

  interface ScrollEvent {
    nativeEvent: {
      contentOffset: {
        x: number;
        y: number;
      };
    };
  }

  const handlePageChange = (event: ScrollEvent): void => {
    const { contentOffset } = event.nativeEvent;
    const pageIndex = Math.round(contentOffset.x / screenWidth);
    setCurrentPage(pageIndex);
  };

  const handleConfigPress = () => {
    setModalVisible(!modalVisible);
  };

  const handleBackChevron = () => {
    if (currentPage > 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: 0, animated: true });
    }
  };

  const handleNextChevron = () => {
    if (currentPage < images.length - 1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: images.length - 1,
        animated: true,
      });
    }
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar translucent style="light" />

      {controlsVisible && (
        <View className="absolute left-0 right-0 top-0 z-10">
          <SafeAreaView>
            <MangaBackBar id={id} chapter={chapter} title={title} />
          </SafeAreaView>
        </View>
      )}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={renderMangaPage}
          keyExtractor={(_, index) => `manga-page-${index}`}
          horizontal={selectedOption !== '3'}
          pagingEnabled={selectedOption !== '3'}
          ItemSeparatorComponent={null}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={handlePageChange}
          initialNumToRender={2}
          maxToRenderPerBatch={1}
          windowSize={3}
          removeClippedSubviews={true}
          updateCellsBatchingPeriod={50}
          onEndReachedThreshold={1.5}
          onStartReachedThreshold={1.5}
          inverted={inverted}
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          getItemLayout={(data, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          scrollEnabled={true}
          bounces={false}
          decelerationRate="fast"
          legacyImplementation={false}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 0,
            minimumViewTime: 100,
          }}
        />
      )}

      {controlsVisible && (
        <View className="absolute bottom-0 left-0 right-0 z-10">
          <SafeAreaView>
            {/* Indicador de página */}
            <View
              style={{
                alignSelf: 'center',
                backgroundColor: 'rgba(0,0,0,0.7)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 15,
                marginBottom: 20,
              }}>
              <Text className="text-sm text-white">{`${currentPage + 1} / ${images.length}`}</Text>
            </View>

            {/* Controles de navegación */}
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderRadius: 25,
              }}
              className="mx-20 mb-5 flex-row items-center justify-center gap-x-12">
              <Pressable
                onPress={() => (selectedOption != '2' ? handleNextChevron() : handleBackChevron())}
                className="p-2">
                <Ionicons name="chevron-back-outline" size={24} color="white" />
              </Pressable>
              <Pressable
                onPress={() => (selectedOption != '2' ? handleBackChevron() : handleNextChevron())}
                className="p-2">
                <Ionicons name="chevron-forward-outline" size={24} color="white" />
              </Pressable>
              <Pressable onPress={handleConfigPress} className="p-2">
                <Ionicons name="settings-outline" size={24} color="white" />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      )}

      {/* Modal de configuración */}
      <ModalPer visible={modalVisible} close={() => setModalVisible(false)} options={options} />
    </View>
  );
}
