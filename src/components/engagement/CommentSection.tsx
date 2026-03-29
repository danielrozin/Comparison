"use client";

import { useState, useEffect } from "react";

interface Comment {
  id: string;
  name: string;
  text: string;
  timestamp: string;
  likes: number;
}

export function CommentSection({
  comparisonId,
  comparisonTitle,
}: {
  comparisonId: string;
  comparisonTitle: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Load comments from API, fall back to localStorage
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/comments?comparisonId=${encodeURIComponent(comparisonId)}`)
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => {
        if (!cancelled && data.comments?.length) {
          setComments(data.comments);
        } else if (!cancelled) {
          const stored = JSON.parse(localStorage.getItem(`comments_${comparisonId}`) || "[]");
          setComments(stored);
        }
      })
      .catch(() => {
        if (!cancelled) {
          const stored = JSON.parse(localStorage.getItem(`comments_${comparisonId}`) || "[]");
          setComments(stored);
        }
      });
    return () => { cancelled = true; };
  }, [comparisonId]);

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comparisonId, name: name.trim(), text: text.trim() }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      const data = await res.json();
      const savedComment: Comment = data.comment;
      const updated = [savedComment, ...comments];
      setComments(updated);
      localStorage.setItem(`comments_${comparisonId}`, JSON.stringify(updated));

      setName("");
      setText("");
    } catch {
      // Fallback: save locally if API fails
      const newComment: Comment = {
        id: `c-${Date.now()}`,
        name: name.trim(),
        text: text.trim(),
        timestamp: new Date().toISOString(),
        likes: 0,
      };
      const updated = [newComment, ...comments];
      setComments(updated);
      localStorage.setItem(`comments_${comparisonId}`, JSON.stringify(updated));
      setName("");
      setText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const likeComment = (commentId: string) => {
    const updated = comments.map((c) =>
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    );
    setComments(updated);
    localStorage.setItem(`comments_${comparisonId}`, JSON.stringify(updated));
  };

  const displayComments = showAll ? comments : comments.slice(0, 5);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-display font-bold text-text mb-6">
        Discussion
      </h2>

      {/* Comment form */}
      <form onSubmit={submitComment} className="bg-white border border-border rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="comment-name" className="block text-sm font-medium text-text mb-1">
              Name
            </label>
            <input
              id="comment-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-colors"
            />
          </div>
          <div className="sm:flex sm:items-end">
            <p className="text-xs text-text-secondary mt-1 sm:mb-2">
              Share your thoughts on {comparisonTitle}
            </p>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="comment-text" className="block text-sm font-medium text-text mb-1">
            Comment
          </label>
          <textarea
            id="comment-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What do you think? Who wins this comparison?"
            required
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !name.trim() || !text.trim()}
          className="px-5 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-8 bg-surface-alt rounded-xl">
          <p className="text-text-secondary text-sm">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayComments.map((comment) => (
            <div key={comment.id} className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-bold text-xs">
                      {comment.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">{comment.name}</p>
                    <p className="text-xs text-text-secondary">
                      {new Date(comment.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => likeComment(comment.id)}
                  className="flex items-center gap-1 text-xs text-text-secondary hover:text-primary-600 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  {comment.likes > 0 && comment.likes}
                </button>
              </div>
              <p className="text-sm text-text leading-relaxed">{comment.text}</p>
            </div>
          ))}

          {comments.length > 5 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full py-3 text-sm font-medium text-primary-600 hover:text-primary-700 bg-surface-alt rounded-xl hover:bg-primary-50 transition-colors"
            >
              Show all {comments.length} comments
            </button>
          )}
        </div>
      )}
    </section>
  );
}
