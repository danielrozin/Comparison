import Link from "next/link";
import type { ComparisonResource, AffiliateLink } from "@/types";
import { WhereToBuySection, AffiliateDisclosure } from "./AffiliateButton";

const ICON_MAP = {
  wikipedia: (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .119-.075.176-.225.176l-.564.031c-.485.029-.727.164-.727.436 0 .135.053.33.166.601 1.082 2.646 4.818 10.521 4.818 10.521l2.681-5.249-1.554-3.395c-.339-.727-.567-1.17-.679-1.326-.112-.15-.396-.27-.853-.36l-.463-.078c-.117 0-.176-.058-.176-.176v-.434l.048-.045h4.37l.049.045v.434c0 .119-.059.176-.176.176l-.455.031c-.529.014-.793.18-.793.494 0 .109.043.285.137.539l2.062 4.578 1.98-3.857c.139-.298.208-.547.208-.748 0-.382-.318-.584-.949-.614l-.381-.019c-.136 0-.205-.074-.205-.176v-.434l.044-.045h3.674l.044.045v.434c0 .102-.068.176-.205.176l-.197.019c-.491.039-.846.2-1.068.478-.218.279-.682 1.076-1.392 2.403l-2.349 4.457 2.752 5.834c.108.222.196.361.262.418.065.058.196.086.391.086l.319-.019c.117 0 .176.059.176.176v.434l-.048.045s-4.643 0-4.643 0l-.048-.045v-.434c0-.117.058-.176.176-.176l.455-.031c.449-.014.674-.14.674-.375 0-.104-.047-.271-.143-.502L12.09 13.119z" />
    </svg>
  ),
  blog: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  ),
  external: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  video: (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

export function ResourcesSection({
  resources,
  entities,
}: {
  resources: ComparisonResource[];
  entities?: { name: string; affiliateLinks?: AffiliateLink[] }[];
}) {
  if (resources.length === 0) return null;

  const wikipedia = resources.filter((r) => r.type === "wikipedia");
  const blogs = resources.filter((r) => r.type === "blog");
  const external = resources.filter((r) => r.type === "external");
  const videos = resources.filter((r) => r.type === "video");

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-xl font-bold text-text flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Resources & Learn More
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Dive deeper with these curated resources
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Where to Buy (affiliate links) */}
        {entities && <WhereToBuySection entities={entities} />}

        {/* Wikipedia */}
        {wikipedia.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
              {ICON_MAP.wikipedia}
              Wikipedia
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {wikipedia.map((r) => (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 p-3 rounded-lg border border-border hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <span className="text-gray-500 group-hover:text-blue-600 text-xs font-bold">W</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text group-hover:text-blue-700 transition-colors truncate">
                      {r.label}
                    </p>
                    {r.description && (
                      <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
                        {r.description}
                      </p>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 flex-shrink-0 ml-auto mt-0.5 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Blog Articles */}
        {blogs.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
              {ICON_MAP.blog}
              Related Articles
            </h3>
            <div className="space-y-2">
              {blogs.map((r) => (
                <Link
                  key={r.url}
                  href={r.url}
                  className="group flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary-300 hover:bg-primary-50/50 transition-all"
                >
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                    <span className="text-primary-600 text-xs font-bold">B</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text group-hover:text-primary-700 transition-colors">
                      {r.label}
                    </p>
                    {r.description && (
                      <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
                        {r.description}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    Read &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
        {/* Videos */}
        {videos.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
              {ICON_MAP.video}
              Videos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {videos.map((r) => (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 p-3 rounded-lg border border-border hover:border-red-300 hover:bg-red-50/50 transition-all"
                >
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text group-hover:text-red-700 transition-colors truncate">
                      {r.label}
                    </p>
                    {r.description && (
                      <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
                        {r.description}
                      </p>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-red-400 flex-shrink-0 ml-auto mt-0.5 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
