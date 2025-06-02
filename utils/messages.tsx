export const shareMangaMsg = (title: string, id: string, description: string): string => {
  return (
    `🚀 ¡Dale una ojeada a **${title}**!` +
    `\n\n${description}\n\n👉` +
    `Empieza a leerlo gratis en MangaDex: https://mangadex.org/title/${id}`
  );
};

export const shareChapterMsg = (chapterLabel: string, id: string): string => {
  return (
    `✨ ¡Hora de manga! 📖\n` +
    `🌟 Te invito a leer ${chapterLabel}.\n\n` +
    `👉 Disponible en MangaDex:\n` +
    `https://mangadex.org/chapter/${id}\n\n` +
    `💬 ¡Cuéntame luego qué te pareció!`
  );
};

export const infoAppMsg = (): string => {
  return `Esta aplicación es un proyecto de código abierto creado por un desarrollador independiente por motivo de aprendizaje y realizar algunos proyectos divertidos. No está afiliada a ninguna empresa o servicio oficial. Si encuentras algún error o tienes sugerencias, no dudes en contactarme.`;
};
