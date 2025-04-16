import React, { PropsWithChildren } from 'react';
import { useWindowDimensions, View, Dimensions } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';

interface MarqueeProps {
  readonly imgs: { id: number; imageUrl: any }[];
  renderItem?: ({ item, index }: { item: any; index: number }) => React.ReactNode;
}

type MarqueeItemProps = {
  index: number;
  scroll: SharedValue<number>;
  containerWidth: number;
  itemWidth: number;
};

// Componente individual para cada elemento del marquee
const MarqueeItem = ({
  index,
  scroll,
  containerWidth,
  itemWidth,
  children,
}: PropsWithChildren<MarqueeItemProps>) => {
  const { width: screenWidth } = useWindowDimensions();

  // Calcular el desplazamiento para centrar el contenedor
  const shift = (containerWidth - screenWidth) / 2;

  // Calcular posición inicial de cada imagen
  const initialPosition = itemWidth * index - shift;

  // Estilo animado para desplazamiento infinito
  const animatedStyle = useAnimatedStyle(() => {
    // Calcular posición con módulo para efecto de desplazamiento infinito
    const position = ((initialPosition - scroll.value) % containerWidth) + shift;

    return {
      left: position,
    };
  });

  return (
    <Animated.View
      className="absolute h-full p-2"
      style={[
        {
          width: itemWidth,
          transformOrigin: 'bottom',
        },
        animatedStyle,
      ]}>
      {children}
    </Animated.View>
  );
};

export default function Marquee({ imgs, renderItem }: MarqueeProps) {
  // Valor compartido para la animación
  const scroll = useSharedValue(0);

  // Velocidad fija de desplazamiento (píxeles por segundo)
  const scrollSpeed = 50;

  // Dimensiones de la pantalla
  const screenWidth = Dimensions.get('window').width;

  // Dimensiones fijas para las imágenes
  const itemWidth = 120; // Ancho fijo en píxeles
  const containerWidth = imgs.length * itemWidth;
  const imageHeight = 180; // Altura fija en píxeles

  // Función de renderizado predeterminada o personalizada
  const defaultRenderItem = ({ item }: { item: any; index: number }) => (
    <Animated.Image
      source={item.imageUrl}
      className="rounded-2xl"
      style={{
        width: itemWidth - 16,
        height: imageHeight,
        aspectRatio: 3/5,
      }}
      resizeMode="cover"
    />
  );

  const actualRenderItem = renderItem || defaultRenderItem;

  // Animación automática a ~60fps
  useFrameCallback((frameInfo) => {
    const deltaSeconds = (frameInfo.timeSincePreviousFrame ?? 0) / 1000;
    scroll.value = scroll.value + scrollSpeed * deltaSeconds;
  });

  return (
    <View className="h-full flex-row">
      {imgs.map((item, index) => (
        <MarqueeItem
          key={item.id}
          index={index}
          scroll={scroll}
          itemWidth={itemWidth}
          containerWidth={containerWidth}>
          {actualRenderItem({ item, index })}
        </MarqueeItem>
      ))}
    </View>
  );
}
