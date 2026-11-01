/**
 * Amazon Associates disclosure (DAN-2603).
 *
 * Verbatim wording required by the Amazon Associates Operating Agreement
 * (§5). Do not paraphrase — a reworded disclosure is a compliance defect
 * even though it reads the same.
 */
export function AffiliateDisclosure() {
  return (
    <p className="text-xs text-text-secondary/70 mt-2 leading-tight">
      As an Amazon Associate I earn from qualifying purchases. Other links on
      this page may also earn us a commission, at no extra cost to you.{" "}
      <a
        href="/disclaimer"
        className="underline hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:rounded-sm"
      >
        Learn more about our affiliate disclosure
      </a>
    </p>
  );
}
