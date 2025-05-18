import axios from 'axios';

const CHAPTER_URL = 'https://api.mangadex.org/chapter';
const MANGA_URL = 'https://api.mangadex.org/manga';
const COVER_BASE_URL = 'https://uploads.mangadex.org/covers';

export const getMangaChapters = async (id: string) => {
  let response = await axios.get(`${MANGA_URL}/${id}/feed`, {
    params: {
      limit: 500,
      offset: 0,
      'translatedLanguage[]': ['es', 'es-la'],
      includeExternalUrl: 0,
      'order[chapter]': 'asc',
      'includes[]': ['scanlation_group'],
    },
  });
  
  // Si no hay datos, intentar de nuevo con includeExternalUrl: 1
  if (response.data.data.length === 0) {
    response = await axios.get(`${MANGA_URL}/${id}/feed`, {
      params: {
        limit: 500,
        offset: 0,
        'translatedLanguage[]': ['es', 'es-la'],
        includeExternalUrl: 1,
        'order[chapter]': 'asc',
        'includes[]': ['scanlation_group'],
      },
    });
  }

  // Agrupar capítulos por número de capítulo
  const chaptersData = response.data.data;
  const groupedChapters: Record<
    string,
    {
      chapter: string;
      volume: string;
      chapterNum: number;
      versions: Array<{
        id: string;
        title: string | null;
        scanlationGroup: {
          id: string;
          name: string;
        } | null;
        translatedLanguage: string;
      }>;
    }
  > = {};

  chaptersData.forEach((chapter: any) => {
    const chapterNumber = chapter.attributes.chapter;
    const chapterFloat = parseFloat(chapterNumber);
    
    const scanlationGroupRel = chapter.relationships.find(
      (rel: any) => rel.type === 'scanlation_group'
    );

    const scanlationGroup = scanlationGroupRel?.attributes ? {
      id: scanlationGroupRel.id,
      name: scanlationGroupRel.attributes.name,
    } : null;

    if (!groupedChapters[chapterNumber]) {
      groupedChapters[chapterNumber] = {
        chapter: chapterNumber,
        volume: chapter.attributes.volume ?? '',
        chapterNum: chapterFloat,
        versions: [],
      };
    }

    groupedChapters[chapterNumber].versions.push({
      id: chapter.id,
      title: getChapterTitle(chapter.attributes.title),
      scanlationGroup,
      translatedLanguage: chapter.attributes.translatedLanguage,
    });
  });

  // Ordenar los capítulos numéricamente
  const sortedChapters = Object.values(groupedChapters).sort((a, b) => a.chapterNum - b.chapterNum);

  return sortedChapters;
};

// Función auxiliar para obtener el título del capítulo
const getChapterTitle = (title: string | null): string => {
  if (!title) return 'Sin título';
  return title.trim() === '' ? 'Sin título' : title;
};
