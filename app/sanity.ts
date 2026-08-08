import { markets, type Currency, type Market, type Product } from "./inventory";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const listingQuery = `*[
  _type == "productListing" &&
  isActive == true &&
  archived != true
] | order(_updatedAt desc) {
  _id,
  sku,
  market,
  name,
  price,
  currencyOverride,
  category,
  condition,
  status,
  quantity,
  description,
  features,
  legacyImageUrls,
  "photos": photos[]{"url": asset->url, alt}
}`;

type SanityListing = {
  _id?: string;
  sku?: string;
  market?: Market;
  name?: string;
  price?: number;
  currencyOverride?: Currency;
  category?: Product["category"];
  condition?: Product["condition"];
  status?: Product["status"] | "inStock" | "pending" | "sold";
  description?: string;
  features?: string[];
  legacyImageUrls?: string[];
  photos?: { url?: string; alt?: string }[];
};

const currencies: Currency[] = ["NGN", "CAD", "USD"];

function isMarket(value: unknown): value is Market {
  return typeof value === "string" && value in markets;
}

function displayStatus(status: SanityListing["status"]): Product["status"] | null {
  const statuses: Record<string, Product["status"]> = {
    inStock: "In stock",
    pending: "Pending",
    sold: "Sold",
    "In stock": "In stock",
    Pending: "Pending",
    Sold: "Sold",
  };
  return status ? statuses[status] ?? null : null;
}

function toProduct(listing: SanityListing): Product | null {
  const status = displayStatus(listing.status);
  if (!listing._id || !listing.sku || !listing.name || !isMarket(listing.market) || typeof listing.price !== "number" || !listing.category || !listing.condition || !status) return null;
  const uploadedPhotos = listing.photos?.filter(
    (photo): photo is { url: string; alt?: string } => typeof photo.url === "string" && photo.url.length > 0,
  ) ?? [];
  const legacyImages = listing.legacyImageUrls?.filter(Boolean) ?? [];
  const images = uploadedPhotos.length ? uploadedPhotos.map((photo) => photo.url) : legacyImages;
  if (!images.length) return null;

  return {
    id: listing._id,
    sku: listing.sku,
    market: listing.market,
    name: listing.name,
    category: listing.category,
    condition: listing.condition,
    status,
    price: listing.price,
    currency: listing.currencyOverride && currencies.includes(listing.currencyOverride) ? listing.currencyOverride : undefined,
    images,
    imageAlts: uploadedPhotos.length
      ? uploadedPhotos.map((photo) => photo.alt?.trim() || listing.name || "Product photo")
      : legacyImages.map(() => listing.name || "Product photo"),
    description: listing.description || "Contact Victory Gadgets for full product details.",
    features: listing.features?.filter(Boolean) ?? [],
  };
}

export async function fetchSanityProducts(): Promise<Product[] | null> {
  if (!projectId) return null;
  const endpoint = new URL(`https://${projectId}.apicdn.sanity.io/v2026-08-01/data/query/${dataset}`);
  endpoint.searchParams.set("query", listingQuery);
  endpoint.searchParams.set("perspective", "published");

  try {
    const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Sanity returned ${response.status}`);
    const body = await response.json() as { result?: SanityListing[] };
    const listings = body.result?.flatMap((listing) => {
      const product = toProduct(listing);
      return product ? [product] : [];
    }) ?? [];
    return listings;
  } catch (error) {
    console.warn("Victory Gadgets is using its local inventory fallback.", error);
    return null;
  }
}
