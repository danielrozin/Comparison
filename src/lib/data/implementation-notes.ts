/**
 * Rollout notes for a small set of B2B compare pages.
 *
 * A compare page answers "which one". Readers who pick for a company then
 * face a second question, "what does switching involve", which the verdict
 * does not cover. Each note answers that in a few sentences and links to one
 * page on goldenroz.com (the studio that builds this site) that goes deeper.
 *
 * Rules, enforced by implementation-notes.test.ts:
 * - one note per slug, one goldenroz.com target per note, no target reused;
 * - deep links only, never the goldenroz.com home page;
 * - keep the list short. This is editorial, not a sitewide placement.
 */
export interface ImplementationNote {
  /** Sentences shown before the link. Plain text. */
  body: string;
  /** Link text. Describes the target page. */
  linkText: string;
  /** Absolute https://goldenroz.com/... URL with a trailing slash. */
  href: string;
}

export const IMPLEMENTATION_NOTES: Record<string, ImplementationNote> = {
  "google-workspace-vs-microsoft-365": {
    body:
      "Choosing the suite is the short part. Switching means moving mailboxes, calendars and shared drives, changing the MX and other DNS records, and rebuilding sharing permissions, which do not map one to one between Google Drive and SharePoint or OneDrive. Run a pilot group and set a cutover date before you buy licences.",
    linkText: "What a Microsoft 365 migration involves",
    href: "https://goldenroz.com/microsoft-365-migration/",
  },
  "aws-vs-azure": {
    body:
      "For a company already on Microsoft 365, identity is often the deciding detail: Azure uses the same Entra ID directory your staff already sign in with. Whichever provider you pick, most of the cost of moving sits in the applications, the data transfer and the people who will run it, not in the price list.",
    linkText: "How a fixed-price cloud migration is scoped",
    href: "https://goldenroz.com/cloud-migration-services/",
  },
  "aws-vs-azure-vs-gcp": {
    body:
      "Most mid-size companies settle on one primary cloud and use a second only for a specific service. Before comparing price lists, write down the workloads you actually run, where their data has to live and who will operate them day to day.",
    linkText: "What a cloud architecture review covers",
    href: "https://goldenroz.com/cloud-consulting-services/",
  },
  "chatgpt-vs-copilot": {
    body:
      "Inside a company the question changes from which assistant writes better to which one can safely see your data. Microsoft 365 Copilot answers from the files a user already has permission to open, so anything overshared in SharePoint can surface in its answers. Review permissions before a rollout.",
    linkText: "Connecting AI assistants to company systems",
    href: "https://goldenroz.com/ai-integration/",
  },
  "chatgpt-vs-claude": {
    body:
      "For a team, the chat app matters less than the API behind it. Both vendors sell API access, so an internal tool can be built in a way that lets you swap the model later. Decide where company data is allowed to go before you pick one.",
    linkText: "How custom AI agents are built for a business",
    href: "https://goldenroz.com/ai-development/",
  },
  "chatgpt-vs-claude-vs-gemini": {
    body:
      "Companies rarely standardise on a single model. A common setup is a general assistant for staff plus an internal system that answers from company documents, and that system can call any of the three through an API.",
    linkText: "What goes into a generative AI application",
    href: "https://goldenroz.com/generative-ai-development/",
  },
  "slack-vs-microsoft-teams": {
    body:
      "If your company already pays for Microsoft 365, check whether Teams is part of your plan before comparing features, because Microsoft also sells suites without it. Moving from one tool to the other means deciding what happens to channel history, guest access and the integrations people rely on.",
    linkText: "Microsoft 365 tenant and identity consulting",
    href: "https://goldenroz.com/microsoft-365-consulting/",
  },
  "cursor-vs-claude-code": {
    body:
      "For an engineering team the tool is the smaller decision. Results depend on agreeing how AI-written code gets reviewed, what the agent may run without asking, and which repositories it is allowed to touch.",
    linkText: "Claude Code training for engineering teams",
    href: "https://goldenroz.com/claude-code-training/",
  },
};

export function getImplementationNote(slug: string | undefined | null): ImplementationNote | null {
  if (!slug) return null;
  return IMPLEMENTATION_NOTES[slug] ?? null;
}
