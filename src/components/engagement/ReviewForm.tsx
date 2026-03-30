"use client";

import { useState, useRef, useEffect } from "react";
import { trackReviewSubmission } from "@/lib/utils/analytics";

interface Product {
  slug: string;
  name: string;
}

export function ReviewForm({
  entitySlug,
  entityName,
  onReviewSubmitted,
}: {
  entitySlug?: string;
  entityName?: string;
  onReviewSubmitted?: () => void;
}) {
  const [productQuery, setProductQuery] = useState(entityName || "");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    entitySlug && entityName ? { slug: entitySlug, name: entityName } : null
  );
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const searchProducts = (query: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (query.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/reviews/products?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.products);
          setShowDropdown(data.products.length > 0);
        }
      } catch {
        // ignore search errors
      }
    }, 300);
  };

  const handleProductInput = (value: string) => {
    setProductQuery(value);
    setSelectedProduct(null);
    searchProducts(value);
  };

  const selectProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductQuery(product.name);
    setShowDropdown(false);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !text.trim()) return;

    const slug = selectedProduct?.slug || productQuery.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const name = selectedProduct?.name || productQuery.trim();

    if (!name) return;

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entitySlug: slug,
          productName: name,
          rating,
          text: text.trim(),
          pros: pros.trim(),
          cons: cons.trim(),
          authorName: authorName.trim() || "Anonymous",
          website: honeypot,
        }),
      });

      if (res.status === 429) {
        setError("Too many reviews. Please try again in a minute.");
        return;
      }

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      if (data.success) {
        trackReviewSubmission(name, rating);

        if (data.review?.flagged) {
          setSuccessMessage("Review submitted! Short reviews may be reviewed before appearing publicly.");
        } else {
          setSuccessMessage("Review submitted! Thank you for your feedback.");
        }

        // Reset form
        if (!entitySlug) {
          setProductQuery("");
          setSelectedProduct(null);
        }
        setRating(0);
        setText("");
        setPros("");
        setCons("");
        setAuthorName("");
        setHoneypot("");

        onReviewSubmitted?.();
      }
    } catch {
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <form onSubmit={submitReview} className="bg-white border border-border rounded-xl p-5 mb-6">
      <h3 className="text-lg font-display font-bold text-text mb-4">Write a Review</h3>

      {/* Product autocomplete (only if no fixed entity) */}
      {!entitySlug && (
        <div className="mb-4 relative" ref={dropdownRef}>
          <label htmlFor="review-product" className="block text-sm font-medium text-text mb-1">
            Product
          </label>
          <input
            id="review-product"
            type="text"
            value={productQuery}
            onChange={(e) => handleProductInput(e.target.value)}
            placeholder="Search for a product..."
            required
            maxLength={200}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-colors"
          />
          {showDropdown && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {suggestions.map((p) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => selectProduct(p)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-primary-50 transition-colors"
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Star rating selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-text mb-2">Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 transition-transform hover:scale-110"
              aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            >
              <svg
                className="w-7 h-7"
                viewBox="0 0 20 20"
                fill={star <= displayRating ? "#f59e0b" : "#e5e7eb"}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
          {displayRating > 0 && (
            <span className="ml-2 text-sm font-semibold text-text">{displayRating}/5</span>
          )}
        </div>
        {rating === 0 && (
          <p className="text-xs text-text-secondary mt-1">Click a star to rate</p>
        )}
      </div>

      {/* Review text */}
      <div className="mb-4">
        <label htmlFor="review-text" className="block text-sm font-medium text-text mb-1">
          Your Review
        </label>
        <textarea
          id="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your experience... (reviews over 100 characters are auto-published)"
          required
          rows={4}
          maxLength={2000}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-colors resize-none"
        />
        <p className="text-xs text-text-secondary mt-1 text-right">{text.length}/2000</p>
      </div>

      {/* Pros and Cons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="review-pros" className="block text-sm font-medium text-green-700 mb-1">
            Pros
          </label>
          <textarea
            id="review-pros"
            value={pros}
            onChange={(e) => setPros(e.target.value)}
            placeholder="What did you like?"
            rows={2}
            maxLength={1000}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-300 outline-none transition-colors resize-none"
          />
        </div>
        <div>
          <label htmlFor="review-cons" className="block text-sm font-medium text-red-700 mb-1">
            Cons
          </label>
          <textarea
            id="review-cons"
            value={cons}
            onChange={(e) => setCons(e.target.value)}
            placeholder="What could be better?"
            rows={2}
            maxLength={1000}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-300 outline-none transition-colors resize-none"
          />
        </div>
      </div>

      {/* Author name */}
      <div className="mb-4">
        <label htmlFor="review-author" className="block text-sm font-medium text-text mb-1">
          Name <span className="text-text-secondary font-normal">(optional)</span>
        </label>
        <input
          id="review-author"
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Anonymous"
          maxLength={100}
          className="w-full sm:w-1/2 px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-colors"
        />
      </div>

      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true" tabIndex={-1}>
        <label htmlFor="review-website">Website</label>
        <input
          id="review-website"
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      {successMessage && <p className="text-sm text-green-600 mb-3">{successMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting || !rating || !text.trim() || (!entitySlug && !productQuery.trim())}
        className="px-5 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
