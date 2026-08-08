export type Market = "NG" | "CA" | "US";
export type Currency = "NGN" | "CAD" | "USD";

export const markets: Record<Market, { name: string; flag: string; currency: Currency; locale: string; shortLabel: string }> = {
  NG: { name: "Nigeria", flag: "🇳🇬", currency: "NGN", locale: "en-NG", shortLabel: "Nigeria" },
  CA: { name: "Canada", flag: "🇨🇦", currency: "CAD", locale: "en-CA", shortLabel: "Canada" },
  US: { name: "United States", flag: "🇺🇸", currency: "USD", locale: "en-US", shortLabel: "United States" },
};

export type Product = {
  id: string;
  sku: string;
  market: Market;
  name: string;
  category: "Electronics" | "Appliances" | "Auto Parts" | "Vehicles" | "Other";
  condition: "New" | "Used" | "Refurbished";
  status: "In stock" | "Pending" | "Sold";
  price: number;
  currency?: Currency;
  images: string[];
  imageAlts?: string[];
  description: string;
  features: string[];
};

const images = {
  earbudsPink: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=78",
  earbudsBlack: "https://images.unsplash.com/photo-1606741965429-8d76ff50bb2f?auto=format&fit=crop&w=900&q=78",
  laptopSilver: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=78",
  laptopDesk: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=78",
  laptopDark: "https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&w=900&q=78",
  watchClassic: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=78",
  watchModern: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=78",
  headphonesBlack: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=78",
  headphonesStudio: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=78",
  phoneGraphite: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=900&q=78",
  phoneHand: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=78",
  kitchen: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=78",
  dashcam: "https://images.unsplash.com/photo-1597007066704-67bf2068d5b2?auto=format&fit=crop&w=900&q=78",
};

// Each row is one physical listing in one market. Duplicate a row and change
// its market, SKU, price, and photos to clone an item into another market.
export const products: Product[] = [
  { id: "ng-jlab", sku: "NG-JL-032", market: "NG", name: "JLab Go Air Pop Earbuds", category: "Electronics", condition: "New", status: "In stock", price: 30000, images: [images.earbudsPink, images.earbudsBlack], description: "Compact true wireless earbuds from our Nigeria inventory, with a secure fit and pocket-sized charging case.", features: ["32+ hours total playtime", "Clear wireless audio", "Comfortable everyday fit"] },
  { id: "ng-asus", sku: "NG-AS-128", market: "NG", name: "ASUS Everyday Laptop", category: "Electronics", condition: "Refurbished", status: "In stock", price: 300000, images: [images.laptopSilver, images.laptopDesk], description: "A dependable, professionally refurbished laptop for work, school, and daily browsing.", features: ["Intel Core processor", "4GB RAM", "128GB SSD"] },
  { id: "ng-airfryer", sku: "NG-AF-055", market: "NG", name: "Digital Air Fryer", category: "Appliances", condition: "New", status: "In stock", price: 120000, images: [images.kitchen], description: "A simple countertop air fryer for quick, crisp meals with less oil.", features: ["Digital controls", "Easy-clean basket", "Multiple cook presets"] },
  { id: "ng-dashcam", sku: "NG-CM-221", market: "NG", name: "4K Dash Camera", category: "Auto Parts", condition: "New", status: "In stock", price: 95000, images: [images.dashcam], description: "A compact vehicle camera designed to capture clear footage on every drive.", features: ["4K front recording", "Loop recording", "Night vision"] },
  { id: "ng-watch", sku: "NG-WT-104", market: "NG", name: "Classic Chronograph Watch", category: "Other", condition: "New", status: "Pending", price: 45000, images: [images.watchClassic, images.watchModern], description: "A timeless wristwatch with a polished case and versatile everyday styling.", features: ["Durable metal case", "Adjustable band", "Gift-ready presentation"] },

  { id: "ca-sony", sku: "CA-SN-050", market: "CA", name: "Sony Wireless Earbuds", category: "Electronics", condition: "New", status: "In stock", price: 79, images: [images.earbudsBlack, images.earbudsPink], description: "Premium wireless sound in a lightweight, travel-ready design from our Canadian inventory.", features: ["Long battery life", "Secure in-ear fit", "Fast Bluetooth pairing"] },
  { id: "ca-asus", sku: "CA-AS-128", market: "CA", name: "ASUS Everyday Laptop", category: "Electronics", condition: "Refurbished", status: "In stock", price: 429, images: [images.laptopDesk, images.laptopSilver], description: "A professionally refurbished laptop prepared and photographed for our Canadian market.", features: ["Intel Core processor", "8GB RAM", "256GB SSD"] },
  { id: "ca-iphone", sku: "CA-IP-013", market: "CA", name: "iPhone 13 Pro", category: "Electronics", condition: "Used", status: "Pending", price: 649, images: [images.phoneGraphite, images.phoneHand], description: "A carefully inspected pre-owned smartphone with a bright Pro display and capable camera system.", features: ["Device fully tested", "Battery health checked", "Unlocked in Canada"] },
  { id: "ca-jbl", sku: "CA-JB-720", market: "CA", name: "JBL Over-Ear Headphones", category: "Electronics", condition: "New", status: "In stock", price: 119, images: [images.headphonesBlack, images.headphonesStudio], description: "Immersive wireless listening with cushioned earcups for long sessions.", features: ["Deep, balanced sound", "Soft over-ear cushions", "Foldable design"] },
  { id: "ca-watch", sku: "CA-WT-204", market: "CA", name: "Minimal Everyday Watch", category: "Other", condition: "New", status: "In stock", price: 89, images: [images.watchModern, images.watchClassic], description: "A clean, versatile wristwatch ready for pickup or delivery across Canada.", features: ["Minimal face", "Adjustable strap", "Quality checked"] },

  { id: "us-jlab", sku: "US-JL-132", market: "US", name: "JLab Go Air Pop Earbuds", category: "Electronics", condition: "New", status: "In stock", price: 29, images: [images.earbudsBlack, images.earbudsPink], description: "A United States listing for compact true wireless earbuds with an all-day charging case.", features: ["32+ hours total playtime", "Clear wireless audio", "Comfortable everyday fit"] },
  { id: "us-asus", sku: "US-AS-228", market: "US", name: "ASUS Everyday Laptop", category: "Electronics", condition: "Refurbished", status: "In stock", price: 349, images: [images.laptopDark, images.laptopSilver], description: "A professionally refurbished laptop configured for dependable everyday use.", features: ["Intel Core processor", "8GB RAM", "256GB SSD"] },
  { id: "us-iphone", sku: "US-IP-113", market: "US", name: "iPhone 13 Pro", category: "Electronics", condition: "Used", status: "Sold", price: 599, images: [images.phoneHand, images.phoneGraphite], description: "A tested, unlocked pre-owned iPhone photographed from our United States inventory.", features: ["Device fully tested", "Battery health checked", "Unlocked"] },
  { id: "us-jbl", sku: "US-JB-820", market: "US", name: "JBL Over-Ear Headphones", category: "Electronics", condition: "New", status: "In stock", price: 89, images: [images.headphonesStudio, images.headphonesBlack], description: "Wireless over-ear listening with a comfortable fit and travel-friendly design.", features: ["Balanced sound", "Soft over-ear cushions", "Foldable design"] },
  { id: "us-dashcam", sku: "US-CM-321", market: "US", name: "4K Dash Camera", category: "Auto Parts", condition: "New", status: "In stock", price: 79, images: [images.dashcam], description: "A compact camera for capturing clear front-facing footage on daily drives.", features: ["4K front recording", "Loop recording", "Night vision"] },
];
