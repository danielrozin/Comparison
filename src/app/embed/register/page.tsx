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
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li>
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/embed" className="hover:text-primary-600 transition-colors">
              Embed
            </Link>
          </li>
          <li>/</li>
          <li className="text-text font-medium">Register</li>
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

      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <EmbedRegistrationForm defaultTier={tier} />
      </div>
    </div>
  );
}
