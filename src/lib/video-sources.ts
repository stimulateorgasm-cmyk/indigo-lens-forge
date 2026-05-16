export interface VideoSources {
  /** Direct MP4/WebM file (HTML5 <video>) */
  mp4?: string;
  /** YouTube embed URL or video ID */
  youtube?: string;
  /** VK Video embed URL */
  vk?: string;
  /** Rutube embed URL */
  rutube?: string;
  /** Cloud download/preview URL (Yandex.Disk, Google Drive, etc.) */
  cloud?: string;
}

/**
 * Промо-видео Indigo Lab. Заполняется по мере поступления.
 * Кнопки платформ под видео автоматически становятся активными,
 * когда соответствующий ключ заполнен.
 */
export const heroVideoSources: VideoSources = {
  mp4: "https://main.strah.fun/b2bvideo/videob2b.mp4",
  youtube: "https://youtu.be/pqlHc8UzZz0",
  rutube: "https://rutube.ru/play/embed/bfeefedd6c6cde66c0ce794a012164c4",
  cloud: "https://disk.yandex.ru/i/ZXPQeyiroMtG8A",
};

export function youtubeEmbedUrl(input: string): string {
  if (input.includes("/embed/")) return input;
  const id = input.match(/(?:v=|youtu\.be\/)([\w-]{6,})/)?.[1] ?? input;
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
}