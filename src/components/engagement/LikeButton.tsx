"use client";

import { useState, useEffect } from "react";

export function LikeButton({ comparisonId }: { comparisonId: string }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  // Load liked state from localStorage and count from API
  useEffect(() => {
    const likes = JSON.parse(localStorage.getItem("comparison_likes") || "{}");
    if (likes[comparisonId]) {
      setLiked(true);
    }
    fetch(`/api/comparisons/like?comparisonId=${encodeURIComponent(comparisonId)}`)
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => setCount(data.count || 0))
      .catch(() => setCount(0));
  }, [comparisonId]);

  const toggleLike = () => {
    const likes = JSON.parse(localStorage.getItem("comparison_likes") || "{}");

    if (liked) {
      delete likes[comparisonId];
      setCount((c) => c - 1);
    } else {
      likes[comparisonId] = true;
      setCount((c) => c + 1);
    }

    localStorage.setItem("comparison_likes", JSON.stringify(likes));
    setLiked(!liked);

    fetch("/api/comparisons/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comparisonId, liked: !liked }),
    }).catch(() => {/* localStorage already updated as fallback */});
  };

  return (
    <button
      onClick={toggleLike}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
        liked
          ? "bg-red-50 text-red-600 border border-red-200"
          : "bg-surface-alt text-text-secondary border border-border hover:border-red-200 hover:text-red-500"
      }`}
    >
      <svg
        className={`w-4 h-4 transition-transform ${liked ? "scale-110" : ""}`}
        fill={liked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={liked ? 0 : 2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{count}</span>
    </button>
  );
}
