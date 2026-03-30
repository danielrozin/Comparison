import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unsubscribed | A Versus B",
  robots: { index: false },
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function UnsubscribePage({ searchParams }: PageProps) {
  const { status } = await searchParams;

  const content = {
    success: {
      heading: "You've been unsubscribed",
      message:
        "You will no longer receive marketing emails from us. If this was a mistake, you can re-subscribe anytime from our homepage.",
      icon: (
        <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    already: {
      heading: "Already unsubscribed",
      message: "This email is already unsubscribed. No further action needed.",
      icon: (
        <svg className="w-16 h-16 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    invalid: {
      heading: "Invalid link",
      message:
        "This unsubscribe link is invalid. If you need help, please contact us.",
      icon: (
        <svg className="w-16 h-16 text-amber-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    error: {
      heading: "Something went wrong",
      message:
        "We couldn't process your unsubscribe request. Please try again later or contact us.",
      icon: (
        <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const current = content[status as keyof typeof content] || content.error;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {current.icon}
        <h1 className="text-2xl font-bold text-text mb-3">{current.heading}</h1>
        <p className="text-text-secondary mb-8">{current.message}</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
        >
          Browse Comparisons
        </Link>
      </div>
    </div>
  );
}
