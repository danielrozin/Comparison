import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/utils/constants";
import { EmbedRegistrationForm } from "./EmbedRegistrationForm";

export const metadata: Metadata = {
  title: "Partner Embed Registration | A Versus B",
  description:
    "Register as an embed partner to get your own white-label comparison widgets. Free and paid plans available.",
  alternates: { canonical: `${SITE_URL}/embed/register` },
};

interface PageProps {
  searchParams: Promise<{ tier?: string }>;
}

export default async function EmbedRegisterPage({ searchParams }: PageProps) {
  const { tier } = await searchParams;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-1.5 text-sm text-text-secondary flex-wrap">
          <li>
            <Link href="/" className="hover:text-primary-600 transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="sr-only sm:not-sr-only">Home</span>
            </Link>
          </li>
          <li aria-hidden="true"><svg className="w-3 h-3 text-border flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
          <li><Link href="/embed" className="hover:text-primary-600 transition-colors">Embed</Link></li>
          <li aria-hidden="true"><svg className="w-3 h-3 text-border flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
          <li className="text-text font-medium" aria-current="page">Register</li>
        </ol>
      </nav>

      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-display font-black text-text mb-3">
          Embed Partner Registration
        </h1>
        <p className="text-text-secondary text-lg">
          Get your partner key and start embedding comparisons on your site.
          <br />
          <Link href="/embed#pricing" className="text-primary-600 hover:underline">
            View pricing plans
          </Link>
        </p>
      </div>

      <div className="bg-white border border-border rounded-2xl p-8">
        <EmbedRegistrationForm defaultTier={tier} />
      </div>
    </div>
  );
}
