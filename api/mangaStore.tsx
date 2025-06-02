import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MangaInfo } from '~/api/interfaces';

interface SavedMangasContextType {
  savedMangas: MangaInfo[];
  refreshSavedMangas: () => Promise<void>;
  addManga: (manga: MangaInfo) => Promise<void>;
  removeManga: (mangaId: string) => Promise<void>;
  isMangaSaved: (mangaId: string) => boolean;
  removeAllMangas: () => Promise<void>;
}

const SavedMangasContext = createContext<SavedMangasContextType | undefined>(undefined);

interface SavedMangasProviderProps {
  children: ReactNode;
}

export const SavedMangasProvider: React.FC<SavedMangasProviderProps> = ({ children }) => {
  const [savedMangas, setSavedMangas] = useState<MangaInfo[]>([]);

  const refreshSavedMangas = useCallback(async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const mangaKeys = allKeys.filter((key) => key.startsWith('@manga_saved'));
      const mangaData = await AsyncStorage.multiGet(mangaKeys);

      const mangas = mangaData
        .map(([key, value]) => {
          if (!value) return null;
          return JSON.parse(value);
        })
        .filter((manga) => manga !== null);

      setSavedMangas(mangas);
    } catch (error) {
      console.error('Error getting saved mangas:', error);
    }
  }, []);

  const addManga = useCallback(
    async (manga: MangaInfo) => {
      try {
        const storageKey = `@manga_saved${manga.mangaId}`;
        await AsyncStorage.setItem(storageKey, JSON.stringify(manga));
        await refreshSavedMangas();
      } catch (error) {
        console.error('Error saving manga:', error);
      }
    },
    [refreshSavedMangas]
  );

  const removeManga = useCallback(
    async (mangaId: string) => {
      try {
        const storageKey = `@manga_saved${mangaId}`;
        await AsyncStorage.removeItem(storageKey);
        await refreshSavedMangas();
      } catch (error) {
        console.error('Error removing manga:', error);
      }
    },
    [refreshSavedMangas]
  );

  const isMangaSaved = useCallback(
    (mangaId: string) => {
      return savedMangas.some((manga) => manga.mangaId === mangaId);
    },
    [savedMangas]
  );

  const removeAllMangas = useCallback(async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const mangaKeys = allKeys.filter((key) => key.startsWith('@manga_saved'));
      await AsyncStorage.multiRemove(mangaKeys);

      // Refrescar la lista después de eliminar
      await refreshSavedMangas();
    } catch (error) {
      console.error('Error removing all mangas:', error);
    }
  }, [refreshSavedMangas]);

  const value = React.useMemo(
    () => ({
      savedMangas,
      refreshSavedMangas,
      addManga,
      removeManga,
      isMangaSaved,
      removeAllMangas,
    }),
    [savedMangas, refreshSavedMangas, addManga, removeManga, isMangaSaved, removeAllMangas]
  );

  return <SavedMangasContext.Provider value={value}>{children}</SavedMangasContext.Provider>;
};

export const useSavedMangas = (): SavedMangasContextType => {
  const context = useContext(SavedMangasContext);
  if (context === undefined) {
    throw new Error('useSavedMangas must be used within a SavedMangasProvider');
  }
  return context;
};
