"use client";

import { useState, useEffect } from "react";

interface ComparisonVideoPlayerProps {
  slug: string;
  title: string;
}

export function ComparisonVideoPlayer({ slug, title }: ComparisonVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoExists, setVideoExists] = useState(true);
  const videoSrc = `/videos/${slug}.mp4`;

  useEffect(() => {
    // Check if video exists via HEAD request
    fetch(videoSrc, { method: "HEAD" })
      .then((res) => {
        if (!res.ok) setVideoExists(false);
      })
      .catch(() => setVideoExists(false));
  }, [videoSrc]);

  if (!videoExists) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-xl font-display font-bold text-text mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
        </svg>
        Video Comparison
      </h2>

      <div className="relative bg-slate-900 rounded-xl overflow-hidden shadow-lg w-full max-w-sm mx-auto">
        {!isPlaying ? (
          <button
            onClick={() => setIsPlaying(true)}
            className="relative w-full aspect-[9/16] flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 group cursor-pointer"
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
            className="w-full aspect-[9/16]"
            onEnded={() => setIsPlaying(false)}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </section>
  );
}
