"use client";

import type { AffiliateLink } from "@/types";

const PARTNER_ICONS: Record<string, React.ReactNode> = {
  amazon: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.493.126.12.19.065.376-.16.558-.246.2-.54.4-.873.59a24.3 24.3 0 01-3.727 1.742c-1.347.485-2.667.785-3.96.895a20.3 20.3 0 01-4.108-.136 19.7 19.7 0 01-5.202-1.604 17.3 17.3 0 01-3.197-2.08c-.283-.254-.397-.463-.34-.63zm6.166-1.384c.133-.372-.037-.683-.512-.93a2.5 2.5 0 00-.315-.128 7.5 7.5 0 00-.538-.152 7.3 7.3 0 00-1.327-.175c-.416-.02-.84.002-1.27.065-.243.03-.373.114-.39.254-.02.16.073.28.282.36l.24.08c.155.044.315.1.48.165.44.17.862.39 1.27.662l.262.182c.242.168.47.285.687.35.218.063.39.045.52-.054.058-.047.123-.138.195-.272.073-.134.148-.27.225-.413l.2-.393zm9.875-6.957c0-.79-.167-1.528-.502-2.216-.335-.688-.783-1.245-1.343-1.673-.56-.428-1.187-.687-1.883-.777-.364-.044-.684-.062-.96-.052-.276.008-.467.027-.575.05v6.932c0 .29.055.518.163.684.11.166.277.292.503.38.226.087.412.145.56.173.146.028.366.04.66.04a3.22 3.22 0 001.4-.318c.44-.21.815-.502 1.123-.877.31-.374.55-.824.72-1.348.17-.524.254-1.09.254-1.698zm3.654.103c0 .848-.13 1.643-.392 2.384a5.8 5.8 0 01-1.123 1.964 5.4 5.4 0 01-1.723 1.354c-.66.34-1.396.51-2.206.51-.156 0-.373-.013-.653-.04-.28-.026-.533-.07-.76-.13v4.637c0 .163-.028.303-.084.422a.82.82 0 01-.202.29.6.6 0 01-.262.155 1.2 1.2 0 01-.28.055l-.16.007c-.048 0-.12-.003-.218-.01a1.4 1.4 0 01-.265-.054.56.56 0 01-.222-.155.81.81 0 01-.186-.29c-.048-.117-.072-.258-.072-.42V7.86c0-.268.03-.51.088-.723.06-.214.182-.4.37-.563.186-.163.475-.3.87-.416a8.6 8.6 0 011.556-.32c.523-.07 1.024-.082 1.505-.038.48.044.93.16 1.347.347a4.12 4.12 0 011.12.743c.33.307.606.668.83 1.084.223.415.393.87.51 1.363.116.494.175 1.012.175 1.555z" />
    </svg>
  ),
};

function partnerLabel(partner: string): string {
  const labels: Record<string, string> = {
    amazon: "Amazon",
    impact: "Official Store",
    shareasale: "Partner Store",
  };
  return labels[partner] || "Shop";
}

export function AffiliateButton({
  link,
  variant = "primary",
  size = "sm",
}: {
  link: AffiliateLink;
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
}) {
  const icon = PARTNER_ICONS[link.partner];

  const baseClasses =
    "inline-flex items-center gap-1.5 font-semibold rounded-lg transition-all duration-200 no-underline";
  const sizeClasses =
    size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm";
  const variantClasses =
    variant === "primary"
      ? "bg-amber-500 hover:bg-amber-600 text-white shadow-sm hover:shadow-md"
      : "bg-white border border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400";

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      className={`${baseClasses} ${sizeClasses} ${variantClasses}`}
      onClick={() => {
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
          window.gtag("event", "affiliate_click", {
            affiliate_partner: link.partner,
            affiliate_label: link.label,
          });
        }
      }}
    >
      {icon}
      <span>Check Price</span>
      <svg
        className="w-3 h-3 opacity-60"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  );
}

export function AffiliateDisclosure() {
  return (
    <p className="text-[10px] text-text-secondary/70 mt-2 leading-tight">
      As an affiliate, we may earn a commission from qualifying purchases at no
      extra cost to you.{" "}
      <a
        href="/disclaimer"
        className="underline hover:text-text-secondary"
      >
        Learn more
      </a>
    </p>
  );
}

export function WhereToBuySection({
  entities,
}: {
  entities: { name: string; affiliateLinks?: AffiliateLink[] }[];
}) {
  const hasAnyLinks = entities.some(
    (e) => e.affiliateLinks && e.affiliateLinks.length > 0,
  );
  if (!hasAnyLinks) return null;

  return (
    <div className="mt-4 pt-4 border-t border-border/50">
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
        <svg
          className="w-4 h-4 text-amber-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        Where to Buy
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {entities.map((entity) =>
          entity.affiliateLinks?.map((link) => (
            <a
              key={`${entity.name}-${link.partner}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="group flex items-center gap-3 p-3 rounded-lg border border-border hover:border-amber-300 hover:bg-amber-50/50 transition-all"
              onClick={() => {
                if (
                  typeof window !== "undefined" &&
                  typeof window.gtag === "function"
                ) {
                  window.gtag("event", "affiliate_click", {
                    affiliate_partner: link.partner,
                    affiliate_label: link.label,
                  });
                }
              }}
            >
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                {PARTNER_ICONS[link.partner] || (
                  <svg
                    className="w-4 h-4 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text group-hover:text-amber-700 transition-colors truncate">
                  {entity.name}
                </p>
                <p className="text-xs text-text-secondary">
                  {partnerLabel(link.partner)}
                </p>
              </div>
              <span className="text-xs text-amber-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                Shop &rarr;
              </span>
            </a>
          )),
        )}
      </div>
      <AffiliateDisclosure />
    </div>
  );
}
