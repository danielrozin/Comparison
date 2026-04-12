/**
 * Video Service — Maps comparison slugs to YouTube video data.
 * Reads from src/data/video-uploads.json (synced by the video pipeline).
 */

import videoUploads from "@/data/video-uploads.json";

interface VideoUpload {
  slug: string;
  title: string;
  entityA: string;
  entityB: string;
  category: string;
  videoFile: string;
  youtubeTitle: string;
  youtubeDescription: string;
  youtubeVideoId: string | null;
  youtubeUrl: string | null;
  uploadedAt: string;
}

interface UploadLog {
  uploads: VideoUpload[];
}

const log = videoUploads as UploadLog;

/**
 * Get the YouTube video ID for a comparison slug.
 * Returns the most recent successful upload for that slug.
 */
export function getYouTubeVideoId(slug: string): string | null {
  const uploads = log.uploads
    .filter((u) => u.slug === slug && u.youtubeVideoId)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  return uploads[0]?.youtubeVideoId || null;
}

/**
 * Get full video metadata for a comparison slug.
 */
export function getVideoMetadata(slug: string): VideoUpload | null {
  const uploads = log.uploads
    .filter((u) => u.slug === slug && u.youtubeVideoId)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  return uploads[0] || null;
}

/**
 * Check if a comparison has a video uploaded.
 */
export function hasVideo(slug: string): boolean {
  return !!getYouTubeVideoId(slug);
}
