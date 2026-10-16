import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Shopify vs WooCommerce.
 * Shopify pricing page; WooCommerce site and WordPress.org plugin listing.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Shopify is a hosted platform you rent by the month: Basic is $39 a month billed monthly or $35 billed yearly, rising to Grow ($105/$95), Advanced ($399/$359) and Plus from $2,300. WooCommerce is a free, open source plugin for WordPress with no monthly platform fee, but you supply hosting, a domain and maintenance yourself. Choose Shopify for an all-in-one hosted store; choose WooCommerce if you already run WordPress and want full control.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Shopify is hosted; WooCommerce is a free WordPress plugin you host yourself.
- Shopify Basic is $39 a month billed monthly or $35 a month billed yearly.
- Shopify charges 2%, 1%, 0.6% or 0.2% on third-party payment providers, by plan; none when using Shopify Payments.
- WooCommerce has no monthly platform fee; hosting, domain and paid extensions are separate.
- WooCommerce has more than 7 million active installations on WordPress.org.

Pricing model

Shopify lists four plans: Basic ($39 a month, or $35 billed yearly), Grow ($105 or $95), Advanced ($399 or $359) and Plus from $2,300 a month. There are no setup fees, and new stores get a 3-day free trial. WooCommerce is free to install; the costs are hosting, a domain, and any paid extensions or themes you choose.

Payment fees

Shopify adds a third-party transaction fee when you use a payment provider other than Shopify Payments: 2% on Basic, 1% on Grow, 0.6% on Advanced and 0.2% on Plus. Payment processing fees from your provider apply on both platforms.

Control and requirements

1. Shopify runs the hosting, security updates and checkout for you.
2. WooCommerce runs inside your WordPress site. It requires WordPress 7.0 or higher and PHP 7.4 or higher, and you handle updates and backups.
3. WooCommerce is open source, so developers can change any part of the store.

Who should pick which

Pick Shopify if you want a store running quickly without managing servers. Pick WooCommerce if you already use WordPress, want to own the stack and can handle hosting. Squarespace vs Wix and WordPress vs Wix cover other site builders. This is general information, not financial or legal advice.`;

const BUILT = buildEditorialComparison({
  slug: "shopify-vs-woocommerce",
  title: "Shopify vs WooCommerce: Hosted Plans vs Free Plugin",
  shortAnswer: SHORT_ANSWER,
  verdict: "Shopify: hosted, all-in-one, from $39 a month (or $35 billed yearly).\n\nWooCommerce: free open source plugin for WordPress; you pay for hosting and extensions.\n\nThis is general information, not financial or legal advice.",
  category: "software",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "shopify", "slug": "shopify", "name": "Shopify", "shortDesc": "Hosted ecommerce platform with monthly plans from Basic to Plus.", "imageUrl": null, "entityType": "software", "position": 0, "pros": ["Hosting included in every plan", "No setup fees", "No third-party transaction fee when using Shopify Payments"], "cons": ["Monthly plan fee: Basic $39 a month billed monthly, $35 billed yearly", "2% fee on Basic when using a third-party payment provider"], "bestFor": "Sellers who want a hosted store without managing servers"},
    {"id": "woocommerce", "slug": "woocommerce", "name": "WooCommerce", "shortDesc": "Free, open source ecommerce plugin for WordPress.", "imageUrl": null, "entityType": "software", "position": 1, "pros": ["Free plugin with no monthly platform fee", "Open source and customizable", "Runs on WordPress"], "cons": ["You arrange and pay for hosting, domain and maintenance", "Needs WordPress 7.0 or higher and PHP 7.4 or higher"], "bestFor": "WordPress users who want full control and can manage hosting"},
  ],
  keyDifferences: [{"label": "Model", "entityAValue": "Hosted platform", "entityBValue": "WordPress plugin you host", "winner": "tie"}, {"label": "Base cost", "entityAValue": "Basic $39/mo monthly, $35/mo yearly", "entityBValue": "Free plugin; hosting extra", "winner": "tie"}, {"label": "Third-party payment fee", "entityAValue": "2% / 1% / 0.6% / 0.2% by plan", "entityBValue": "None from WooCommerce", "winner": "tie"}, {"label": "Source code", "entityAValue": "Closed platform", "entityBValue": "Open source", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Plans", "Ecommerce", "shopify", "woocommerce", "Basic, Grow, Advanced, Plus (from $2,300 a month)", "Free core plugin"),
    textAttr("a1", "Monthly price", "Ecommerce", "shopify", "woocommerce", "$39 / $105 / $399 billed monthly; $35 / $95 / $359 billed yearly", "No platform fee"),
    textAttr("a2", "Third-party payment fee", "Ecommerce", "shopify", "woocommerce", "2% Basic, 1% Grow, 0.6% Advanced, 0.2% Plus", "None from WooCommerce"),
    textAttr("a3", "Hosting", "Ecommerce", "shopify", "woocommerce", "Included", "You provide it"),
    textAttr("a4", "Requirements", "Ecommerce", "shopify", "woocommerce", "Browser and account", "WordPress 7.0+ and PHP 7.4+"),
    textAttr("a5", "Installs", "Ecommerce", "shopify", "woocommerce", "Hosted service", "7+ million active installations"),
  ],
  faqs: [{"question": "Is WooCommerce really free?", "answer": "The WooCommerce plugin is free and has no monthly platform fee. You still pay for web hosting, a domain, and any paid extensions or themes, and your payment provider charges processing fees."}, {"question": "How much does Shopify cost per month?", "answer": "Shopify lists Basic at $39 a month billed monthly or $35 billed yearly, Grow at $105 or $95, Advanced at $399 or $359, and Plus from $2,300 a month. New stores get a 3-day trial and there are no setup fees."}, {"question": "Does Shopify charge transaction fees?", "answer": "Only when you use a third-party payment provider instead of Shopify Payments: 2% on Basic, 1% on Grow, 0.6% on Advanced and 0.2% on Plus. Payment processing fees apply either way."}, {"question": "Do I need WordPress for WooCommerce?", "answer": "Yes. WooCommerce is a WordPress plugin. The current version requires WordPress 7.0 or higher and PHP 7.4 or higher."}, {"question": "Which is easier for beginners?", "answer": "Shopify handles hosting, security and updates, so there is less to manage. WooCommerce gives more control but you maintain the WordPress site yourself."}, {"question": "Can I move from WooCommerce to Shopify later?", "answer": "Yes, stores can be migrated, but products, customers, URLs and apps need planning. Choose the platform that fits how you want to run the store now."}],
  relatedComparisons: [{"slug": "squarespace-vs-wix", "title": "Squarespace vs Wix", "category": "software"}, {"slug": "wordpress-vs-wix", "title": "WordPress vs Wix", "category": "software"}],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Shopify for a hosted all-in-one store; WooCommerce for WordPress users who want control and no platform fee.", keyFact: "Shopify Basic is $39 a month billed monthly; the WooCommerce plugin is free." },
  citationStats: {"sourceCount": 3, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "Shopify: Pricing", "url": "https://www.shopify.com/pricing"}, {"name": "WooCommerce: What is WooCommerce?", "url": "https://woocommerce.com/woocommerce/"}, {"name": "WordPress.org: WooCommerce plugin", "url": "https://wordpress.org/plugins/woocommerce/"}]},
  resources: [{"type": "external", "label": "Shopify: Pricing", "url": "https://www.shopify.com/pricing", "description": "Basic $39/$35, Grow $105/$95, Advanced $399/$359, Plus from $2,300; third-party fees 2%/1%/0.6%/0.2%; no setup fees."}, {"type": "external", "label": "WooCommerce: What is WooCommerce?", "url": "https://woocommerce.com/woocommerce/", "description": "Open-source platform with no monthly platform fees, powered by WordPress."}, {"type": "external", "label": "WordPress.org: WooCommerce plugin", "url": "https://wordpress.org/plugins/woocommerce/", "description": "Version 11.2.1, 7+ million active installations, WordPress 7.0+ and PHP 7.4+."}],
  metaTitle: "Shopify vs WooCommerce | A Versus B",
});

BUILT.metadata.metaDescription = "Shopify vs WooCommerce: hosted plans from $39 a month vs a free WordPress plugin. Plan prices, third-party payment fees, hosting and requirements.";

export const SHOPIFY_VS_WOOCOMMERCE: EditorialComparison = BUILT;
