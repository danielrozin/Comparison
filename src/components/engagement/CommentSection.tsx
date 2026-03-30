"use client";

import { useState, useEffect, useCallback } from "react";
import { trackCommentSubmitted } from "@/lib/utils/analytics";

interface Comment {
  id: string;
  name: string;
  text: string;
  createdAt: string;
  likes: number;
  hasLinks?: boolean;
}

interface CommentsResponse {
  comments: Comment[];
  total: number;
  page: number;
  totalPages: number;
}

export function CommentSection({
  comparisonId,
  comparisonTitle,
}: {
  comparisonId: string;
  comparisonTitle: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [honeypot, setHoneypot] = useState(""); // honeypot field
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadComments = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/comments?comparisonId=${encodeURIComponent(comparisonId)}&page=${pageNum}`
      );
      if (!res.ok) throw new Error("Failed to load");
      const data: CommentsResponse = await res.json();
      setComments(data.comments);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch {
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [comparisonId]);

  useEffect(() => {
    loadComments(1);
  }, [loadComments]);

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comparisonId,
          name: name.trim() || "Anonymous",
          text: text.trim(),
          website: honeypot, // honeypot — bots fill this
        }),
      });

      if (res.status === 429) {
        setError("Too many comments. Please try again in a minute.");
        return;
      }

      if (!res.ok) throw new Error("Failed to post comment");

      const data = await res.json();
      if (data.success) {
        trackCommentSubmitted(comparisonId, comparisonTitle);

        if (data.comment?.hasLinks) {
          setSuccessMessage("Comment posted! Comments with links may be reviewed before appearing.");
        } else {
          setSuccessMessage("Comment posted!");
        }

        setName("");
        setText("");
        setHoneypot("");

        // Reload page 1 to show new comment
        await loadComments(1);
      }
    } catch {
      setError("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      loadComments(p);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-display font-bold text-text mb-6">
        Discussion
        {total > 0 && (
          <span className="ml-2 text-base font-normal text-text-secondary">
            ({total} comment{total !== 1 ? "s" : ""})
          </span>
        )}
      </h2>

      {/* Comment form */}
      <form onSubmit={submitComment} className="bg-white border border-border rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="comment-name" className="block text-sm font-medium text-text mb-1">
              Name <span className="text-text-secondary font-normal">(optional)</span>
            </label>
            <input
              id="comment-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anonymous"
              maxLength={100}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-colors"
            />
          </div>
          <div className="sm:flex sm:items-end">
            <p className="text-xs text-text-secondary mt-1 sm:mb-2">
              Share your thoughts on {comparisonTitle}
            </p>
          </div>
        </div>

        {/* Honeypot — hidden from real users, bots will fill it */}
        <div className="absolute -left-[9999px]" aria-hidden="true" tabIndex={-1}>
          <label htmlFor="comment-website">Website</label>
          <input
            id="comment-website"
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            autoComplete="off"
            tabIndex={-1}
          />
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
            maxLength={2000}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-colors resize-none"
          />
          <p className="text-xs text-text-secondary mt-1 text-right">
            {text.length}/2000
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-3">{error}</p>
        )}
        {successMessage && (
          <p className="text-sm text-green-600 mb-3">{successMessage}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          className="px-5 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {/* Comments list */}
      {isLoading && comments.length === 0 ? (
        <div className="text-center py-8 bg-surface-alt rounded-xl">
          <p className="text-text-secondary text-sm">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 bg-surface-alt rounded-xl">
          <p className="text-text-secondary text-sm">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-bold text-xs">
                    {comment.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">{comment.name}</p>
                  <p className="text-xs text-text-secondary">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-text leading-relaxed">{comment.text}</p>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-text-secondary px-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
