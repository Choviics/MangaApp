import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback, memo, useEffect } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from '~/utils/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type ChapterVersion = {
  id: string;
  title: string | null;
  scanlationGroup: {
    id: string;
    name: string;
  } | null;
  translatedLanguage: string;
};

type Chapter = {
  chapter: string;
  volume: string;
  versions: ChapterVersion[];
};

type ReadChapterVersions = {
  [chapterNumber: string]: {
    versionId: string;
    isRead: boolean;
    title: string;
  }[];
};

const ChapterVersionItem = memo(
  ({
    version,
    chapterNumber,
    index,
    totalVersions,
    onToggleRead,
    isRead,
  }: {
    version: ChapterVersion;
    chapterNumber: string;
    index: number;
    totalVersions: number;
    onToggleRead: (versionId: string, chapterNumber: string, title: string) => void;
    isRead: boolean;
  }) => {
    const { theme } = useTheme();

    return (
      <TouchableOpacity
        key={version.id}
        className="flex-row justify-between p-2"
        style={[
          index < totalVersions - 1 ? { borderBottomWidth: 1, borderColor: theme.border } : {},
          isRead ? { opacity: 0.5 } : {},
        ]}
        onPress={() => onToggleRead(version.id, chapterNumber, version.title ?? '')}>
        <View className="flex-1">
          {version.title && <Text style={{ color: theme.text }}>{version.title}</Text>}
          <Text className="text-sm" style={{ color: theme.secondary }}>
            {version.scanlationGroup?.name ?? 'Desconocido'} • {version.translatedLanguage}
          </Text>
        </View>
        {!isRead ? (
          <Text style={{ color: theme.primary }}>Leer</Text>
        ) : (
          <Text style={{ color: theme.secondary }}>Leído</Text>
        )}
      </TouchableOpacity>
    );
  }
);

const ChapterCard = memo(
  ({
    chapter,
    isExpanded,
    onToggleExpanded,
    onToggleRead,
    readChapters,
    onToggleUnread,
  }: {
    chapter: Chapter;
    isExpanded: boolean;
    onToggleExpanded: () => void;
    onToggleRead: (versionId: string, chapterNumber: string, title: string) => void;
    readChapters: ReadChapterVersions;
    onToggleUnread: (chapterNumber: string) => void;
  }) => {
    const { theme } = useTheme();
    const isChapterRead = !!readChapters[chapter.chapter];

    return (
      <View className="mb-4 rounded-lg p-3" style={{ backgroundColor: theme.card }}>
        <View>
          <Pressable onPress={onToggleExpanded} onLongPress={() => onToggleUnread(chapter.chapter)}>
            <View className="flex-row justify-between">
              <Text
                className="mb-2 text-lg font-bold"
                style={[{ color: theme.text }, isChapterRead ? { opacity: 0.5 } : {}]}>
                Capítulo {chapter.chapter}
              </Text>
              <Ionicons
                name={isExpanded ? 'chevron-down' : 'chevron-back'}
                size={24}
                color={theme.text}
              />
            </View>
          </Pressable>

          {isExpanded && (
            <View>
              {chapter.versions.map((version, index) => (
                <ChapterVersionItem
                  key={version.id}
                  version={version}
                  chapterNumber={chapter.chapter}
                  index={index}
                  totalVersions={chapter.versions.length}
                  onToggleRead={onToggleRead}
                  isRead={
                    readChapters[chapter.chapter]?.some(
                      (v) => v.versionId === version.id && v.isRead
                    ) || false
                  }
                />
              ))}
            </View>
          )}
        </View>
      </View>
    );
  }
);

export default function ChaptersCards({
  chapters,
  mangaId,
  setMangaReaded,
  setCustomFunction,
}: {
  readonly chapters: readonly Chapter[];
  readonly mangaId: string;
  readonly setMangaReaded: any;
  readonly setCustomFunction: (fn: (versionId: string, chapterNumber: string, title: string) => void) => void;
}) {
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [readChapters, setReadChapters] = useState<ReadChapterVersions>({});

  // Clave única para el capitulo
  const STORAGE_KEY = `@manga_read_chapters_${mangaId}`;

  const loadReadChapters = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setReadChapters(parsedData);
        if (Object.keys(parsedData).length > 0) {
          setMangaReaded(true);
        } else {
          setMangaReaded(false);
        }
      }
    } catch (error) {
      console.error('Error al cargar capítulos leídos:', error);
    }
  };

  const toggleExpanded = useCallback((chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  }, []);

  const handleRead = useCallback(
    (versionId: string, chapterNumber: string, title: string) => {
      setReadChapters((prev) => {
        const existingVersions = prev[chapterNumber] ?? [];

        const alreadyReadIndex = existingVersions.findIndex((v) => v.versionId === versionId);

        let updatedVersions;

        if (alreadyReadIndex !== -1) {
          // Ya existe marcamos como leído si no lo está
          updatedVersions = [...existingVersions];
          updatedVersions[alreadyReadIndex] = {
            ...updatedVersions[alreadyReadIndex],
            isRead: true,
          };
        } else {
          // No existe agregamos nueva versión leída
          updatedVersions = [...existingVersions, { versionId, isRead: true, title }];
        }

        const newState: ReadChapterVersions = {
          ...prev,
          [chapterNumber]: updatedVersions,
        };

        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState)).catch((error) =>
          console.error('Error al guardar capítulos leídos:', error)
        );

        loadReadChapters();

        return newState;
      });

      router.push({
        pathname: '/ReadMangaPage',
        params: { id: versionId, title: title, chapter: chapterNumber },
      });
    },
    [mangaId]
  );

  const toggleUnread = useCallback(
    (chapterNumber: string) => {
      setReadChapters((prev) => {
        const newState = { ...prev };
        delete newState[chapterNumber]; // desmarcar solo ese capítulo

        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState)).catch((err) =>
          console.error('Error al guardar capítulos leídos:', err)
        );

        loadReadChapters();

        return newState;
      });
    },
    [mangaId]
  );

  useEffect(() => {
    loadReadChapters();
    if (setCustomFunction) {
      setCustomFunction(handleRead);
    }
  }, [mangaId]);

  return (
    <View>
      {chapters.map((chapter: Chapter) => (
        <ChapterCard
          key={`chapter-${chapter.chapter}`}
          chapter={chapter}
          isExpanded={!!expandedChapters[chapter.chapter]}
          onToggleExpanded={() => toggleExpanded(chapter.chapter)}
          onToggleRead={handleRead}
          readChapters={readChapters}
          onToggleUnread={toggleUnread}
        />
      ))}
    </View>
  );
}
