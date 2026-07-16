"use client";

import { useState, useEffect } from "react";
import { trackCommentSubmission } from "@/lib/utils/analytics";

interface Comment {
  id: string;
  name: string;
  text: string;
  timestamp: string;
  likes: number;
}

const AVATAR_COLORS = [
  "from-primary-400 to-primary-600",
  "from-accent-400 to-accent-600",
  "from-emerald-400 to-teal-600",
  "from-rose-400 to-pink-600",
  "from-amber-400 to-orange-600",
  "from-violet-400 to-purple-600",
];

function avatarGradient(name: string) {
  const code = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
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
  const [validationError, setValidationError] = useState<string | null>(null);

  const MIN_COMMENT_LENGTH = 5;

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

    const trimmedName = name.trim();
    const trimmedText = text.trim();

    if (!trimmedName) {
      setValidationError("Add your name to post.");
      return;
    }
    if (trimmedText.length < MIN_COMMENT_LENGTH) {
      setValidationError(
        `Write something to post — at least ${MIN_COMMENT_LENGTH} characters.`,
      );
      return;
    }

    setValidationError(null);
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
      trackCommentSubmission(comparisonId, window.location.pathname);

      setName("");
      setText("");
    } catch {
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
    <section aria-labelledby="discussion-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <h2 id="discussion-heading" className="text-2xl font-display font-bold text-text">Discussion</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            {comments.length > 0 ? `${comments.length} comment${comments.length !== 1 ? "s" : ""}` : "Join the conversation"}
          </p>
        </div>
      </div>

      {/* Comment form */}
      <form onSubmit={submitComment} className="relative bg-white border border-border rounded-2xl p-5 mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 via-accent-500 to-primary-400" />
        <div className="flex items-start gap-3">
          {/* Placeholder avatar for the commenter */}
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-surface-alt to-border flex items-center justify-center mt-0.5 ring-2 ring-white">
            <svg className="w-4 h-4 text-text-secondary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <label htmlFor="comment-name" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Your name
              </label>
              <input
                autoComplete="name"
                id="comment-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="First name or handle"
                className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-surface-alt/40 focus:bg-white focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 outline-none transition-all duration-150 placeholder:text-text-secondary/50"
              />
            </div>
            <div>
              <label htmlFor="comment-text" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Your take on <span className="text-primary-600 normal-case tracking-normal font-bold">{comparisonTitle}</span>
              </label>
              <textarea
                id="comment-text"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="Who wins? What's your experience? Any facts we missed?"
                rows={3}
                aria-invalid={validationError ? true : undefined}
                aria-describedby={validationError ? "comment-validation" : undefined}
                className="w-full px-3 py-2.5 border border-border rounded-xl text-sm bg-surface-alt/40 focus:bg-white focus:ring-2 focus:ring-primary-400/60 focus:border-primary-400 outline-none transition-all duration-150 resize-none placeholder:text-text-secondary/50 leading-relaxed"
              />
              {validationError && (
                <p id="comment-validation" role="alert" className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {validationError}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-text-secondary/50 leading-tight">Be respectful · No spam</p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white text-sm font-semibold rounded-xl hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Posting…
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-surface-alt/60 to-white border border-dashed border-border rounded-2xl">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-text mb-1">No comments yet</p>
          <p className="text-xs text-text-secondary">Be the first to share your take on this comparison.</p>
        </div>
      ) : (
        <ol role="list" className="space-y-3 list-none">
          {displayComments.map((comment, idx) => (
            <li
              key={comment.id}
              style={{ animationDelay: `${idx * 40}ms` }}
              className="flex items-start gap-3 bg-white border border-border rounded-2xl p-4 hover:border-primary-200 hover:shadow-sm transition-all duration-200 animate-fade-in group"
            >
              {/* Per-commenter color-coded avatar */}
              <div className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br ${avatarGradient(comment.name)} flex items-center justify-center shadow-sm ring-2 ring-white`}>
                <span className="text-white font-bold text-sm">{comment.name.charAt(0).toUpperCase()}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-semibold text-text truncate">{comment.name}</span>
                    <time dateTime={new Date(comment.timestamp).toISOString()} className="text-xs text-text-secondary/60 flex-shrink-0">
                      {new Date(comment.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                  <button
                    type="button"
                    onClick={() => likeComment(comment.id)}
                    className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-primary-600 bg-surface-alt hover:bg-primary-50 border border-transparent hover:border-primary-200 rounded-full px-2 py-0.5 transition-all duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
                    aria-label="Like this comment"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    {comment.likes > 0 ? comment.likes : "Like"}
                  </button>
                </div>
                <p className="text-sm text-text leading-relaxed">{comment.text}</p>
              </div>
            </li>
          ))}

          {comments.length > 5 && !showAll && (
            <li>
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-primary-600 hover:text-primary-700 rounded-2xl border border-dashed border-primary-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
                aria-label={`Show ${comments.length - 5} more comments`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                Show {comments.length - 5} more comment{comments.length - 5 !== 1 ? "s" : ""}
              </button>
            </li>
          )}
        </ol>
      )}
    </section>
  );
}
