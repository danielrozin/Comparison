"use client";

interface StarRatingProps {
  rating: number; // 0-5
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
}

const SIZES = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const TEXT_SIZES = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  showValue = true,
  reviewCount,
}: StarRatingProps) {
  const clampedRating = Math.min(Math.max(rating, 0), maxStars);
  const fullStars = Math.floor(clampedRating);
  const partialFill = clampedRating - fullStars;
  const emptyStars = maxStars - fullStars - (partialFill > 0 ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5" role="img" aria-label={`${clampedRating.toFixed(1)} out of ${maxStars} stars`}>
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} fill={1} className={SIZES[size]} />
        ))}
        {/* Partial star */}
        {partialFill > 0 && (
          <Star key="partial" fill={partialFill} className={SIZES[size]} />
        )}
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} fill={0} className={SIZES[size]} />
        ))}
      </div>
      {showValue && (
        <span className={`font-semibold text-text ${TEXT_SIZES[size]}`}>
          {clampedRating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={`text-text-secondary ${TEXT_SIZES[size]}`}>
          ({reviewCount.toLocaleString()} review{reviewCount !== 1 ? "s" : ""})
        </span>
      )}
    </div>
  );
}

function Star({ fill, className }: { fill: number; className: string }) {
  const id = `star-grad-${Math.random().toString(36).slice(2, 8)}`;

  if (fill >= 1) {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="#f59e0b">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  }

  if (fill <= 0) {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="#e5e7eb">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  }

  // Partial fill
  return (
    <svg className={className} viewBox="0 0 20 20">
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="#f59e0b" />
          <stop offset={`${fill * 100}%`} stopColor="#e5e7eb" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
      />
    </svg>
  );
}
