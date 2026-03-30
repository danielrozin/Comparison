"use client";

import { useState } from "react";
import { SITE_URL } from "@/lib/utils/constants";
import { trackEmbedKeyRegistration, trackEmbedKeyEmailed } from "@/lib/utils/analytics";

const TIER_INFO = {
  free: { name: "Free", price: "$0/month", features: "Branded embeds, 10K views/month" },
  pro: { name: "Pro", price: "$199/month", features: "White-label, custom colors, 100K views/month" },
  enterprise: { name: "Enterprise", price: "$499/month", features: "Unlimited views, API access, dedicated support" },
};

type Tier = keyof typeof TIER_INFO;

export function EmbedRegistrationForm({ defaultTier }: { defaultTier?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [tier, setTier] = useState<Tier>((defaultTier as Tier) || "free");
  const [partnerKey, setPartnerKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/embed-partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, website, tier }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setPartnerKey(data.partnerKey);
      trackEmbedKeyRegistration(tier);
      trackEmbedKeyEmailed(tier);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (partnerKey) {
    return <EmbedCodeGenerator partnerKey={partnerKey} tier={tier} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
          Company / Site Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          placeholder="Acme Reviews"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-text mb-1">
          Website URL (optional)
        </label>
        <input
          id="website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          placeholder="https://yoursite.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-2">Plan</label>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(TIER_INFO) as Tier[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTier(t)}
              className={`p-3 rounded-xl border text-left transition-all ${
                tier === t
                  ? "border-primary-600 ring-2 ring-primary-600/20 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-sm font-semibold text-text">{TIER_INFO[t].name}</div>
              <div className="text-xs text-text-secondary mt-0.5">{TIER_INFO[t].price}</div>
            </button>
          ))}
        </div>
        <p className="text-xs text-text-secondary mt-2">{TIER_INFO[tier].features}</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create Partner Account"}
      </button>
    </form>
  );
}

function EmbedCodeGenerator({ partnerKey, tier }: { partnerKey: string; tier: Tier }) {
  const [slug, setSlug] = useState("react-vs-angular");
  const [copied, setCopied] = useState<string | null>(null);

  const scriptCode = `<script src="${SITE_URL}/api/v1/widget?slug=${slug}&partner=${partnerKey}"></script>`;
  const iframeCode = `<iframe src="${SITE_URL}/embed/${slug}?partner=${partnerKey}" width="100%" height="400" frameborder="0" style="border-radius: 12px; border: 1px solid #e2e8f0;"></iframe>`;

  const handleCopy = async (code: string, label: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
        <h3 className="text-sm font-semibold text-green-800 mb-1">Account Created!</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-green-700">Your partner key:</span>
          <code className="bg-green-100 px-2 py-0.5 rounded font-mono text-xs">{partnerKey}</code>
          <button
            onClick={() => handleCopy(partnerKey, "key")}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
              copied === "key"
                ? "bg-green-200 text-green-800 border-green-300"
                : "bg-white text-green-700 border-green-200 hover:bg-green-100"
            }`}
          >
            {copied === "key" ? "Copied!" : "Copy Key"}
          </button>
        </div>
        <p className="text-xs text-green-600 mt-2">Save this key — you will need it for all embed codes. A copy has also been sent to your email.</p>
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-text mb-1">
          Comparison Slug
        </label>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          placeholder="product-a-vs-product-b"
        />
        <p className="text-xs text-text-secondary mt-1">
          Enter the slug of any comparison (e.g. &quot;react-vs-angular&quot;)
        </p>
      </div>

      {/* Script Tag */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-text">Script Tag (easiest)</h4>
          <button
            onClick={() => handleCopy(scriptCode, "script")}
            className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
              copied === "script"
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-white text-gray-600 border-gray-200 hover:bg-primary-50 hover:text-primary-600"
            }`}
          >
            {copied === "script" ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs font-mono text-gray-700 overflow-x-auto whitespace-pre-wrap break-all">
          {scriptCode}
        </pre>
      </div>

      {/* iFrame */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-text">iFrame</h4>
          <button
            onClick={() => handleCopy(iframeCode, "iframe")}
            className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
              copied === "iframe"
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-white text-gray-600 border-gray-200 hover:bg-primary-50 hover:text-primary-600"
            }`}
          >
            {copied === "iframe" ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs font-mono text-gray-700 overflow-x-auto whitespace-pre-wrap break-all">
          {iframeCode}
        </pre>
      </div>

      {/* Preview */}
      <div>
        <h4 className="text-sm font-semibold text-text mb-2">Preview</h4>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <span className="text-xs text-gray-400 font-mono ml-2">Preview</span>
          </div>
          <iframe
            src={`${SITE_URL}/api/v1/embed/${slug}?partner=${partnerKey}`}
            width="100%"
            height="400"
            frameBorder="0"
            className="bg-white"
            title="Embed preview"
            loading="lazy"
          />
        </div>
      </div>

      {tier !== "free" && (
        <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl">
          <h4 className="text-sm font-semibold text-primary-800 mb-1">Customize Your Branding</h4>
          <p className="text-sm text-primary-700">
            As a {tier === "pro" ? "Pro" : "Enterprise"} partner, you can customize colors, add your logo,
            and remove &quot;Powered by&quot; branding. Use the{" "}
            <code className="bg-primary-100 px-1.5 py-0.5 rounded text-xs font-mono">PATCH /api/v1/embed-partners</code>{" "}
            endpoint with your partner key to update branding.
          </p>
        </div>
      )}
    </div>
  );
}
