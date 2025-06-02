import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '~/utils/themes';
import { useState, useCallback, useRef } from 'react';
import SearchBar from '~/components/SearchBar';
import { searchNameManga } from '~/api/MangaService';
import { MangaInfo } from '~/api/interfaces';
import MangaColumns from '~/components/MangaColumns';

export default function SearchScreen() {
  const { theme } = useTheme();
  const timeoutIdRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [searchText, setSearchText] = useState('');
  const [matchMangas, setMatchMangas] = useState<MangaInfo[]>([]);
  const [screenCase, setScreenCase] = useState< 1 | 2  | 3>(1);

  // Debounce: espera 500ms después de que el usuario deje de escribir
  const handleSearch = useCallback((name: string) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    setSearchText(name);

    timeoutIdRef.current = setTimeout(async () => {
      if (!name.trim()) {
        setScreenCase(1);
        setMatchMangas([]);
        return;
      }
      const response = await searchNameManga(name);
      setMatchMangas(response);
      if (response.length === 0) {
        setScreenCase(3);
      } else {
        setScreenCase(2);
      }
    }, 600);
  }, []);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
      <View className="flex-1 p-4">
        {/* Barra de búsqueda */}
        <SearchBar
          placeHolder="Buscar manga por nombre..."
          onSearch={handleSearch}
          value={searchText}
        />
        {/* Resultados de búsqueda o sugerencias */}
        {(() => {
          switch(screenCase) {
            case 1:
              return (
                <View className="flex-1 items-center justify-center">
                  <Text className="mb-4 text-4xl text-center " style={{ color: theme.text }}>
                    Busca tu manga favorito
                  </Text>
                  <Image
                    source={require('../../assets/empty-text.png')}
                    style={{
                      width: 200,
                      height: 200,
                    }}
                  />
                </View>
              );
            case 2:
              return <MangaColumns mangas={matchMangas} />;
            case 3:
              return (
                <View className="flex-1 items-center justify-center">
                  <Text className="mb-4 text-4xl text-center " style={{ color: theme.text }}>
                    No se encontraron resultados
                  </Text>
                  <Image
                    source={require('../../assets/notFound.png')}
                    style={{
                      width: 200,
                      height: 200,
                    }}
                  />
                </View>
              );
            default:
              return null;
          }
        })()}
      </View>
    </SafeAreaView>
  );
}
