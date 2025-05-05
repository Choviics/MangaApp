import React, { PropsWithChildren, useMemo } from 'react';
import { View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';

interface MarqueeProps {
  readonly imgs: { id: number; imageUrl: any }[];
  renderItem?: ({ item, index }: { item: any; index: number }) => React.ReactNode;
  availableSpace: number;
}

type MarqueeItemProps = {
  readonly index: number;
  readonly scroll: SharedValue<number>;
  readonly itemWidth: number;
  readonly totalItems: number;
  readonly gap: number;
};

// Componente individual para cada elemento del marquee
const MarqueeItem = ({
  index,
  scroll,
  itemWidth,
  totalItems,
  children,
  gap,
}: PropsWithChildren<MarqueeItemProps>) => {  
  // Ancho total de cada elemento con su gap
  const itemTotalWidth = itemWidth + gap;

  // Posición inicial: distribuimos los elementos uniformemente
  const startPosition = index * itemTotalWidth;

  // Estilo animado para el desplazamiento continuo
  const animatedStyle = useAnimatedStyle(() => {
    // Calculamos la posición actual aplicando el scroll
    let position = startPosition - scroll.value;

    // Efecto de movimiento infinito: cuando un elemento sale completamente por la izquierda,
    // lo reposicionamos a la derecha
    const totalContentWidth = totalItems * itemTotalWidth;
    if (position < -itemTotalWidth) {
      // Calculamos cuántas posiciones completas se ha desplazado
      const offset = Math.abs(Math.floor(position / totalContentWidth)) * totalContentWidth;
      // Ajustamos la posición sumando el offset del ciclo completo
      position += offset + totalContentWidth;
    }

    return {
      transform: [{ translateX: position }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: itemWidth,
          height: '100%',
          marginHorizontal: gap / 2, // Agregamos margen horizontal
        },
        animatedStyle,
      ]}>
      {children}
    </Animated.View>
  );
};

export default function Marquee({ imgs, renderItem, availableSpace }: Readonly<MarqueeProps>) {  
  // Gap fijo entre elementos
  const GAP = 8;

  // Valor compartido para la animación
  const scroll = useSharedValue(0);

  // Velocidad de desplazamiento adaptable al tamaño de pantalla
  const scrollSpeed = 20;

  // Calculamos el ancho del elemento manteniendo la proporción de una portada de manga
  const itemWidth = (availableSpace * 3) / 5.4; 

  // Duplicamos las imágenes para asegurar un efecto continuo
  const duplicatedImgs = useMemo(() => {
    // Duplicamos el array para asegurar un ciclo completo
    return [...imgs, ...imgs];
  }, [imgs]);

  const contentWidth = imgs.length * (itemWidth + GAP);

  // Función de renderizado predeterminada
  const defaultRenderItem = ({ item }: { item: any; index: number }) => (
    <View style={{
      width: itemWidth,
      height: '100%',
      overflow: 'hidden', // Esto es importante
    }}>
      <Animated.Image
        source={item.imageUrl}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 12,
        }}
        resizeMode="cover"
      />
    </View>
  );

  const actualRenderItem = renderItem || defaultRenderItem;

  // Animación automática
  useFrameCallback((frameInfo) => {
    const deltaSeconds = (frameInfo.timeSincePreviousFrame ?? 0) / 1000;

    // Avanzamos el scroll
    scroll.value = scroll.value + scrollSpeed * deltaSeconds;

    // Reiniciamos el scroll cuando ha completado un ciclo para evitar valores muy grandes
    // Solo necesitamos un ciclo completo para crear la ilusión de infinito
    if (scroll.value > contentWidth) {
      scroll.value = 0;
    }
  });

  return (
    <View className="h-full overflow-hidden">
      {duplicatedImgs.map((item, index) => (
        <MarqueeItem
          key={`${item.id}-${index}`}
          index={index}
          scroll={scroll}
          itemWidth={itemWidth}
          totalItems={duplicatedImgs.length}
          gap={GAP}
          >
          {actualRenderItem({ item, index: index % imgs.length })}
        </MarqueeItem>
      ))}
    </View>
  );
}
