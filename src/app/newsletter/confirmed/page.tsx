import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Newsletter Confirmed | A Versus B",
  robots: { index: false },
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function NewsletterConfirmedPage({ searchParams }: PageProps) {
  const { status } = await searchParams;

  const content = {
    success: {
      heading: "You're subscribed!",
      message:
        "Your email has been confirmed. You'll receive our weekly comparison picks starting next week.",
      icon: (
        <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    already: {
      heading: "Already confirmed",
      message: "This email is already subscribed. No action needed!",
      icon: (
        <svg className="w-16 h-16 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    invalid: {
      heading: "Invalid link",
      message:
        "This confirmation link is invalid or has expired. Please try signing up again.",
      icon: (
        <svg className="w-16 h-16 text-amber-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    error: {
      heading: "Something went wrong",
      message:
        "We couldn't confirm your subscription. Please try again later.",
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
