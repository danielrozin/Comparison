/**
 * Legacy /category URLs that are not real pages. One hop to the live
 * category or subcategory. Same destinations `categoryPagePath` links to.
 */
export const CATEGORY_SOFT_404_REDIRECTS: {
  source: string;
  destination: string;
  statusCode: 301;
}[] = [
  { source: "/category/gaming", destination: "/category/products/gaming", statusCode: 301 },
  {
    source: "/category/ecommerce",
    destination: "/category/companies/retail-ecommerce",
    statusCode: 301,
  },
  {
    source: "/category/kitchen-appliances",
    destination: "/category/products/home-kitchen",
    statusCode: 301,
  },
  {
    source: "/category/food_and_drink",
    destination: "/category/companies/food-beverage",
    statusCode: 301,
  },
  // Stored keys with no category page, still linked from older entity pages.
  { source: "/category/social_media", destination: "/category/software", statusCode: 301 },
  { source: "/category/science", destination: "/category/education", statusCode: 301 },
  { source: "/category/general", destination: "/category/products", statusCode: 301 },
];
