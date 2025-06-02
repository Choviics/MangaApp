import axios from 'axios';
import { MangaInfo } from './interfaces';

const CHAPTER_URL = 'https://api.mangadex.org/chapter';
const MANGA_URL = 'https://api.mangadex.org/manga';
const COVER_BASE_URL = 'https://uploads.mangadex.org/covers';

  export const getLastUpdatedMangas = async (limit: number = 10): Promise<MangaInfo[]> => {
  try {
    let offset = 0;
    const pageLimit = 100;
    const preliminaryMangas: {
      mangaId: string;
      lastChapter: string;
      lastChapterTitle: string;
      language: string;
    }[] = [];
    const seenMangaIds = new Set();

    while (preliminaryMangas.length < limit + 1) {
      const chapterRes = await axios.get(CHAPTER_URL, {
        params: {
          limit: pageLimit,
          offset,
          'translatedLanguage[]': ['es', 'es-la'],
          'order[publishAt]': 'desc',
          'includes[]': ['manga'],
        },
      });

      if (chapterRes.data.data.length === 0) {
        // No quedan más capítulos, salir del bucle
        break;
      }

      for (const chapter of chapterRes.data.data) {
        const mangaRel = chapter.relationships.find((rel: any) => rel.type === 'manga');
        if (!mangaRel || seenMangaIds.has(mangaRel.id)) continue;

        seenMangaIds.add(mangaRel.id);

        preliminaryMangas.push({
          mangaId: mangaRel.id,
          lastChapter: chapter.attributes.chapter,
          lastChapterTitle: chapter.attributes.title,
          language: chapter.attributes.translatedLanguage,
        });

        if (preliminaryMangas.length >= limit + 1) break;
      }

      offset += chapterRes.data.data.length;
    }

    if (preliminaryMangas.length === 0) {
      return [];
    }

    // Eliminar el primer elemento de preliminaryMangas ya que es un error de fecha de publicación
    // (esto es un workaround temporal, ya que la API de MangaDex no devuelve el último manga actualizado correctamente)
    if (preliminaryMangas.length > 0) {
      preliminaryMangas.shift();
    }

    // 2. Obtener los mangas en bloques para evitar limitaciones de la API
    const mangaIds = preliminaryMangas.map((m) => m.mangaId);

    // Obtenemos los mangas en bloques de 10 para evitar problemas de límite de la API
    const chunkSize = 10;
    let allMangaData: any[] = [];

    for (let i = 0; i < mangaIds.length; i += chunkSize) {
      const chunkIds = mangaIds.slice(i, i + chunkSize);

      try {
        const mangaRes = await axios.get(MANGA_URL, {
          params: {
            'ids[]': chunkIds,
            'includes[]': ['cover_art'],
          },
        });

        allMangaData = [...allMangaData, ...mangaRes.data.data];
      } catch (error) {
        console.error(
          `❌ Error al obtener el bloque de mangas ${Math.floor(i / chunkSize) + 1}:`,
          error
        );
      }
    }

    // 3. Unir info del capítulo con info del manga
    const finalMangas: MangaInfo[] = preliminaryMangas.map((item) => {
      const fullManga = allMangaData.find((m: any) => m.id === item.mangaId);

      if (!fullManga) {
        return {
          mangaId: item.mangaId,
          title: 'Título no disponible',
          coverUrl: null,
          language: item.language,
        };
      }

      const fileName = fullManga.relationships?.find((rel: any) => rel.type === 'cover_art')
        ?.attributes?.fileName;

      let title;
      if (fullManga.attributes.title.en) {
        title = fullManga.attributes.title.en;
      } else if (fullManga.attributes.title['es-la']) {
        title = fullManga.attributes.title['es-la'];
      } else if (fullManga.attributes.title.es) {
        title = fullManga.attributes.title.es;
      } else {
        // Buscar en altTitles para español
        const altTitle = fullManga.attributes.altTitles?.find(
          (alt: any) => alt['es'] ?? alt['es-la'] ?? alt['en']
        );
        title = altTitle ? (altTitle['es'] ?? altTitle['es-la'] ?? altTitle['en']) : 'Sin título';
      }

      const coverUrl = fileName ? `${COVER_BASE_URL}/${item.mangaId}/${fileName}` : null;

      const mangaInfo = {
        mangaId: item.mangaId,
        title,
        coverUrl,
        language: item.language,
      };

      return mangaInfo;
    });
    return finalMangas;
  } catch (error) {
    console.error('Error al obtener mangas actualizados:', error);
    return [];
  }
};

export const getPopularMangas = async (): Promise<MangaInfo[]> => {
  try {
    const response = await axios.get(MANGA_URL, {
      params: {
        limit: 10,
        'availableTranslatedLanguage[]': ['es', 'es-la'],
        'order[followedCount]': 'desc',
        'includes[]': ['cover_art'],
      },
    });

    // Transformar los datos para obtener solo lo que necesitas
    const trendMangas = response.data.data.map((manga: any) => {
      // Obtener el id del manga
      const mangaId = manga.id;

      // Obtener el título en español o inglés
      let title;
      if (manga.attributes.title.en) {
        title = manga.attributes.title.en;
      } else if (manga.attributes.title['es-la']) {
        title = manga.attributes.title['es-la'];
      } else if (manga.attributes.title.es) {
        title = manga.attributes.title.es;
      } else {
        // Buscar en altTitles para español
        const altTitle = manga.attributes.altTitles?.find(
          (alt: any) => alt['es'] ?? alt['es-la'] ?? alt['en']
        );
        title = altTitle ? (altTitle['es'] ?? altTitle['es-la'] ?? altTitle['en']) : 'Sin título';
      }

      // Obtener el filename de la cover_art y construir la URL
      let coverUrl = null;
      const coverArt = manga.relationships?.find((rel: any) => rel.type === 'cover_art');
      if (coverArt?.attributes?.fileName) {
        coverUrl = `${COVER_BASE_URL}/${mangaId}/${coverArt.attributes.fileName}`;
      }

      const language = 'es';

      return {
        mangaId,
        title,
        coverUrl,
        language,
      };
    });

    return trendMangas;
  } catch (error) {
    console.error('Error al obtener los mangas populares:', error);
    throw error;
  }
};

export const getRecentCreatedMangas = async (): Promise<MangaInfo[]> => {
  try {
    const response = await axios.get(MANGA_URL, {
      params: {
        limit: 10,
        'availableTranslatedLanguage[]': ['es', 'es-la'],
        'order[createdAt]': 'desc',
        'includes[]': ['cover_art'],
      },
    });
    const recentMangas = response.data.data.map((manga: any) => {
      // Obtener el id del manga
      const mangaId = manga.id;

      // Obtener el título en español o inglés
      let title;
      if (manga.attributes.title.en) {
        title = manga.attributes.title.en;
      } else if (manga.attributes.title['es-la']) {
        title = manga.attributes.title['es-la'];
      } else if (manga.attributes.title.es) {
        title = manga.attributes.title.es;
      } else {
        // Buscar en altTitles para español
        const altTitle = manga.attributes.altTitles?.find(
          (alt: any) => alt['es'] ?? alt['es-la'] ?? alt['en']
        );
        title = altTitle ? (altTitle['es'] ?? altTitle['es-la'] ?? altTitle['en']) : 'Sin título';
      }

      // Obtener el filename de la cover_art y construir la URL
      let coverUrl = null;
      const coverArt = manga.relationships?.find((rel: any) => rel.type === 'cover_art');
      if (coverArt?.attributes?.fileName) {
        coverUrl = `${COVER_BASE_URL}/${mangaId}/${coverArt.attributes.fileName}`;
      }

      const language = 'es';

      return {
        mangaId,
        title,
        coverUrl,
        language,
      };
    });

    return recentMangas;
  } catch (error) {
    console.error('Error al obtener los últimos mangas:', error);
    throw error;
  }
};

export const getMangaInfo = async (id: string): Promise<any> => {
  try {
    const response = await axios.get(`${MANGA_URL}/${id}`, {
      params: {
        'includes[]': ['author', 'cover_art'],
      },
    });

    const manga = response.data.data;

    const coverUrl = manga.relationships?.find((rel: any) => rel.type === 'cover_art')?.attributes
      ?.fileName
      ? `${COVER_BASE_URL}/${manga.id}/${manga.relationships.find((rel: any) => rel.type === 'cover_art').attributes.fileName}`
      : null;

    const author = manga.relationships?.find((rel: any) => rel.type === 'author')?.attributes?.name;

    const tags =
      manga.attributes.tags?.map((tag: any) => tag.attributes?.name?.en).filter(Boolean) ?? [];

    const description =
      manga.attributes.description?.['es-la'] ??
      manga.attributes.description?.['es'] ??
      manga.attributes.description?.['en'] ??
      'Sin descripción';

    // Extraer el título de la misma manera que en otras funciones
    let title;
    if (manga.attributes.title.en) {
      title = manga.attributes.title.en;
    } else if (manga.attributes.title['es-la']) {
      title = manga.attributes.title['es-la'];
    } else if (manga.attributes.title.es) {
      title = manga.attributes.title.es;
    } else {
      const altTitle = manga.attributes.altTitles?.find(
        (alt: any) => alt['es'] ?? alt['es-la'] ?? alt['en']
      );
      title = altTitle ? (altTitle['es'] ?? altTitle['es-la'] ?? altTitle['en']) : 'Sin título';
    }

    return {
      title,
      description: description,
      status: manga.attributes.status ?? 'Desconocido',
      year: manga.attributes.year ?? 'Desconocido',
      demographic: manga.attributes.publicationDemographic ?? 'Desconocido',
      coverUrl,
      author: author ?? 'Autor desconocido',
      tags: tags,
    };
  } catch (error) {
    console.error('Error al obtener el manga por ID:', error);
    throw error;
  }
};

export const searchNameManga = async (name: string, limit: number = 100): Promise<any> => {
  try {
    const response = await axios.get(MANGA_URL, {
      params: {
        title: name,
        limit: limit,
        'availableTranslatedLanguage[]': ['es', 'es-la'],
        'includes[]': ['cover_art'],
        offset: 0,
      },
    });

    // Transformar los datos para obtener solo lo que necesitas
    const matchMangas = response.data.data.map((manga: any) => {
      // Obtener el id del manga
      const mangaId = manga.id;

      // Obtener el título en español o inglés
      let title;
      if (manga.attributes.title.en) {
        title = manga.attributes.title.en;
      } else if (manga.attributes.title['es-la']) {
        title = manga.attributes.title['es-la'];
      } else if (manga.attributes.title.es) {
        title = manga.attributes.title.es;
      } else {
        // Buscar en altTitles para español
        const altTitle = manga.attributes.altTitles?.find(
          (alt: any) => alt['es'] ?? alt['es-la'] ?? alt['en']
        );
        title = altTitle ? (altTitle['es'] ?? altTitle['es-la'] ?? altTitle['en']) : 'Sin título';
      }

      // Obtener el filename de la cover_art y construir la URL
      let coverUrl = null;
      const coverArt = manga.relationships?.find((rel: any) => rel.type === 'cover_art');
      if (coverArt?.attributes?.fileName) {
        coverUrl = `${COVER_BASE_URL}/${mangaId}/${coverArt.attributes.fileName}`;
      }

      const language = 'es';

      return {
        mangaId,
        title,
        coverUrl,
        language,
      };
    });

    return matchMangas;
  } catch (error) {
    console.error('Error al obtener los mangas populares:', error);
    throw error;
  }
};
