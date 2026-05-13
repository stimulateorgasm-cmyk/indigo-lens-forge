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
  // mp4: "...",
  // youtube: "https://www.youtube.com/embed/...",
  // vk: "https://vk.com/video_ext.php?...",
  // rutube: "https://rutube.ru/play/embed/...",
  // cloud: "https://disk.yandex.ru/i/...",
};

export function youtubeEmbedUrl(input: string): string {
  if (input.includes("/embed/")) return input;
  const id = input.match(/(?:v=|youtu\.be\/)([\w-]{6,})/)?.[1] ?? input;
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
}