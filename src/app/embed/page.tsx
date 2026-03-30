import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: "Embed Comparisons on Your Site | A Versus B",
  description:
    "Add data-driven comparisons to your blog, review site, or content platform. Free, responsive, and always up-to-date.",
  alternates: { canonical: `${SITE_URL}/embed` },
  openGraph: {
    title: "Embed Comparisons on Your Site",
    description:
      "Add data-driven comparisons to your blog, review site, or content platform.",
    url: `${SITE_URL}/embed`,
    type: "website",
  },
};

const STEPS = [
  {
    number: "1",
    title: "Choose a comparison",
    description:
      "Browse our library of data-driven comparisons or search for the one you need.",
    icon: (
      <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    number: "2",
    title: "Copy the embed code",
    description:
      'Click the "Embed" button on any comparison page and pick Script, iFrame, or Link Badge.',
    icon: (
      <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    number: "3",
    title: "Paste on your site",
    description:
      "Drop the code into your blog post, review page, or CMS. It just works.",
    icon: (
      <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 3H12.75a2.25 2.25 0 00-2.15 1.586m0 0a2.25 2.25 0 00-.1.664c0 .414.336.75.75.75H15a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
      </svg>
    ),
  },
];

const BENEFITS = [
  {
    title: "Always up-to-date",
    description: "Embedded comparisons pull the latest data automatically. No manual updates needed.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
      </svg>
    ),
  },
  {
    title: "Mobile responsive",
    description: "Looks great on every screen size, from phones to desktops.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
  {
    title: "Free to use",
    description: "No API keys, no registration, no fees. Just copy, paste, and go.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
];

export default function EmbedLandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Embed Widget
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight mb-6">
            Embed Comparisons<br className="hidden sm:block" /> on Your Site
          </h1>
          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-10">
            Add data-driven comparisons to your blog, review site, or content platform.
            Three embed options, zero setup, always free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/trending"
              className="px-8 py-3.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
            >
              Browse Comparisons to Embed
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mb-4">
            How It Works
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Three simple steps to embed a comparison on your website.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="relative bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg hover:border-primary-200 transition-all duration-300"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                {step.number}
              </div>
              <div className="flex justify-center mb-4 mt-2">{step.icon}</div>
              <h3 className="text-lg font-display font-bold text-text mb-2">{step.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Demo */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mb-4">
              Live Demo
            </h2>
            <p className="text-text-secondary text-lg">
              Here is what an embedded comparison looks like on your site.
            </p>
          </div>
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg bg-white">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-400 font-mono text-center border border-gray-200">
                  yourblog.com/review-post
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4 text-sm text-gray-500 italic">Your blog content here...</div>
              <iframe
                src={`${SITE_URL}/embed/react-vs-angular`}
                width="100%"
                height="400"
                frameBorder="0"
                style={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                title="Embed demo"
                loading="lazy"
              />
              <div className="mt-4 text-sm text-gray-500 italic">More of your content below...</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mb-4">
            Why Embed With Us?
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="text-center">
              <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-display font-bold text-text mb-2">{benefit.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* White-Label Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-text mb-4">
            White-Label Embed Plans
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Embed comparisons with your own branding. Remove attribution, customize colors,
            and make it yours.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="font-display font-bold text-text text-lg mb-1">Free</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-display font-black text-text">$0</span>
              <span className="text-text-secondary text-sm">/month</span>
            </div>
            <p className="text-sm text-text-secondary mb-6">Get started with branded embeds</p>
            <ul className="space-y-3 mb-8">
              {[
                "Up to 10,000 embed views/month",
                "All comparisons available",
                "Script tag, iFrame, & badge",
                "Auto-resize & responsive",
                "\"Powered by A Versus B\" branding",
              ].map((f) => (
                <li key={f} className="flex gap-2 text-sm text-text-secondary">
                  <span className="text-primary-600 font-bold shrink-0">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/embed/register"
              className="block w-full text-center px-6 py-3 bg-gray-100 text-text font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-white border-2 border-primary-600 rounded-2xl p-8 relative ring-2 ring-primary-600/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Most Popular
            </div>
            <h3 className="font-display font-bold text-text text-lg mb-1">Pro</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-display font-black text-text">$199</span>
              <span className="text-text-secondary text-sm">/month</span>
            </div>
            <p className="text-sm text-text-secondary mb-6">Full white-label experience</p>
            <ul className="space-y-3 mb-8">
              {[
                "Up to 100,000 embed views/month",
                "Custom brand colors & gradient",
                "Your logo in embed header",
                "Remove \"Powered by\" attribution",
                "Custom footer text & link",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex gap-2 text-sm text-text-secondary">
                  <span className="text-primary-600 font-bold shrink-0">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/embed/register?tier=pro"
              className="block w-full text-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
            >
              Start Pro Trial
            </Link>
          </div>

          {/* Enterprise */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="font-display font-bold text-text text-lg mb-1">Enterprise</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-display font-black text-text">$499</span>
              <span className="text-text-secondary text-sm">/month</span>
            </div>
            <p className="text-sm text-text-secondary mb-6">For high-volume publishers</p>
            <ul className="space-y-3 mb-8">
              {[
                "Unlimited embed views",
                "Everything in Pro",
                "Category-specific embeds",
                "Featured comparison pinning",
                "API access to comparison data",
                "Dedicated account manager",
              ].map((f) => (
                <li key={f} className="flex gap-2 text-sm text-text-secondary">
                  <span className="text-primary-600 font-bold shrink-0">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/embed/register?tier=enterprise"
              className="block w-full text-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Ready to embed?
          </h2>
          <p className="text-white/85 text-lg mb-8">
            Start free or go white-label. Embed comparisons on your site in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/trending"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-lg text-lg"
            >
              Browse Comparisons
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/embed/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20 text-lg"
            >
              Register as Partner
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
