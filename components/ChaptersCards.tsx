import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from '~/utils/themes';

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

const ChapterVersionItem = memo(
  ({
    version,
    index,
    totalVersions,
    onToggleRead,
    isRead,
  }: {
    version: ChapterVersion;
    index: number;
    totalVersions: number;
    onToggleRead: (versionId: string) => void;
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
        onPress={() => onToggleRead(version.id)}>
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
    readVersions,
  }: {
    chapter: Chapter;
    isExpanded: boolean;
    onToggleExpanded: () => void;
    onToggleRead: (versionId: string) => void;
    readVersions: Record<string, boolean>;
  }) => {
    const { theme } = useTheme();
    const hasReadVersion = chapter.versions.some((version) => readVersions[version.id]);

    return (
      <View className="mb-4 rounded-lg p-3" style={{ backgroundColor: theme.card }}>
        <View>
          <Pressable onPress={onToggleExpanded}>
            <View className="flex-row justify-between">
              <Text
                className="mb-2 text-lg font-bold"
                style={[{ color: theme.text }, hasReadVersion ? { opacity: 0.5 } : {}]}>
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
                  index={index}
                  totalVersions={chapter.versions.length}
                  onToggleRead={onToggleRead}
                  isRead={!!readVersions[version.id]}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    );
  }
);

export default function ChaptersCards({ chapters }: { readonly chapters: readonly Chapter[] }) {
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [readVersions, setReadVersions] = useState<Record<string, boolean>>({});

  const toggleChapter = useCallback((chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  }, []);

  const toggleRead = useCallback((versionId: string) => {
    setReadVersions((prev) => ({
      ...prev,
      [versionId]: true,
    }));
  }, []);

  return (
    <View>
      {chapters.map((chapter: Chapter) => (
        <ChapterCard
          key={`chapter-${chapter.chapter}`}
          chapter={chapter}
          isExpanded={!!expandedChapters[chapter.chapter]}
          onToggleExpanded={() => toggleChapter(chapter.chapter)}
          onToggleRead={(versionId) => toggleRead(versionId)}
          readVersions={readVersions}
        />
      ))}
    </View>
  );
}
