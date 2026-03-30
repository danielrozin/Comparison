/**
 * Cross-referral partner review links from SmartReview.
 * Maps aversusb.net comparison slugs to detailed product reviews on SmartReview.
 */

export interface PartnerReviewLink {
  productName: string;
  url: string;
  smartScore: number;
  reviewCount: number;
  source: string;
}

const SMARTREVIEW_BASE = "https://smartreview.com";

export const PARTNER_REVIEWS: Record<string, PartnerReviewLink[]> = {
  "roomba-vs-roborock": [
    {
      productName: "Roborock S8 MaxV Ultra",
      url: `${SMARTREVIEW_BASE}/category/robot-vacuums/roborock-s8-maxv-ultra`,
      smartScore: 91,
      reviewCount: 342,
      source: "SmartReview",
    },
    {
      productName: "iRobot Roomba j7+",
      url: `${SMARTREVIEW_BASE}/category/robot-vacuums/irobot-roomba-j7-plus`,
      smartScore: 84,
      reviewCount: 287,
      source: "SmartReview",
    },
    {
      productName: "Ecovacs Deebot X2 Omni",
      url: `${SMARTREVIEW_BASE}/category/robot-vacuums/ecovacs-deebot-x2-omni`,
      smartScore: 82,
      reviewCount: 198,
      source: "SmartReview",
    },
    {
      productName: "Dreame L20 Ultra",
      url: `${SMARTREVIEW_BASE}/category/robot-vacuums/dreame-l20-ultra`,
      smartScore: 86,
      reviewCount: 156,
      source: "SmartReview",
    },
  ],
  "dyson-vs-shark-vacuum": [
    {
      productName: "Roborock S8 MaxV Ultra",
      url: `${SMARTREVIEW_BASE}/category/robot-vacuums/roborock-s8-maxv-ultra`,
      smartScore: 91,
      reviewCount: 342,
      source: "SmartReview",
    },
    {
      productName: "iRobot Roomba j7+",
      url: `${SMARTREVIEW_BASE}/category/robot-vacuums/irobot-roomba-j7-plus`,
      smartScore: 84,
      reviewCount: 287,
      source: "SmartReview",
    },
  ],
  "airpods-pro-vs-galaxy-buds": [
    {
      productName: "Apple AirPods Pro 2",
      url: `${SMARTREVIEW_BASE}/category/wireless-earbuds/apple-airpods-pro-2`,
      smartScore: 89,
      reviewCount: 412,
      source: "SmartReview",
    },
    {
      productName: "Samsung Galaxy Buds3 Pro",
      url: `${SMARTREVIEW_BASE}/category/wireless-earbuds/samsung-galaxy-buds3-pro`,
      smartScore: 83,
      reviewCount: 234,
      source: "SmartReview",
    },
    {
      productName: "Sony WF-1000XM5",
      url: `${SMARTREVIEW_BASE}/category/wireless-earbuds/sony-wf-1000xm5`,
      smartScore: 90,
      reviewCount: 378,
      source: "SmartReview",
    },
    {
      productName: "Jabra Elite 10",
      url: `${SMARTREVIEW_BASE}/category/wireless-earbuds/jabra-elite-10`,
      smartScore: 79,
      reviewCount: 145,
      source: "SmartReview",
    },
  ],
};

export function getPartnerReviews(slug: string): PartnerReviewLink[] {
  return PARTNER_REVIEWS[slug] || [];
}
