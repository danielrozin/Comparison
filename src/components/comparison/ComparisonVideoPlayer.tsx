"use client";

import { useState, useEffect, useRef } from "react";

interface ComparisonVideoPlayerProps {
  slug: string;
  title: string;
  youtubeVideoId?: string;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^[a-zA-Z0-9_-]{11}$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1] || match[0];
  }
  return null;
}

export function ComparisonVideoPlayer({ slug, title, youtubeVideoId }: ComparisonVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSource, setVideoSource] = useState<"mp4" | "youtube" | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const videoSrc = `/videos/${slug}.mp4`;
  const ytId = youtubeVideoId ? extractYouTubeId(youtubeVideoId) : null;

  // Lazy loading: only render when visible in viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Check which video source is available
  useEffect(() => {
    if (!isVisible) return;

    if (ytId) {
      setVideoSource("youtube");
      return;
    }

    // Check if self-hosted MP4 exists
    fetch(videoSrc, { method: "HEAD" })
      .then((res) => {
        if (res.ok) setVideoSource("mp4");
      })
      .catch(() => {});
  }, [isVisible, ytId, videoSrc]);

  // Don't render anything if no video source available after check
  if (isVisible && !videoSource) return null;

  return (
    <section ref={containerRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!isVisible ? (
        <div className="aspect-video bg-surface-alt rounded-xl animate-pulse" />
      ) : (
        <>
          <h2 className="text-xl font-display font-bold text-text mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            Video Comparison
          </h2>

          <div className="relative bg-slate-900 rounded-xl overflow-hidden shadow-lg w-full">
            {videoSource === "youtube" ? (
              !isPlaying ? (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="relative w-full aspect-video flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 group cursor-pointer"
                >
                  {ytId && (
                    <img
                      src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                      alt={title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      loading="lazy"
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-500 transition-all group-hover:scale-110">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                    <p className="mt-4 text-white font-semibold text-base sm:text-lg px-4 text-center drop-shadow-lg">
                      {title}
                    </p>
                    <p className="text-slate-300 text-sm mt-1 drop-shadow">Watch the comparison</p>
                  </div>
                </button>
              ) : (
                <div className="relative w-full aspect-video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              )
            ) : videoSource === "mp4" ? (
              !isPlaying ? (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="relative w-full aspect-video flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 group cursor-pointer"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-primary-500 transition-all group-hover:scale-110">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                    <p className="mt-4 text-white font-semibold text-base sm:text-lg px-4 text-center">{title}</p>
                    <p className="text-slate-400 text-sm mt-1">Watch the stat battle</p>
                  </div>
                </button>
              ) : (
                <video
                  src={videoSrc}
                  autoPlay
                  controls
                  playsInline
                  className="w-full aspect-video"
                  onEnded={() => setIsPlaying(false)}
                >
                  Your browser does not support the video tag.
                </video>
              )
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}
