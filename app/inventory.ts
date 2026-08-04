export type Product = {
  id: number;
  sku: string;
  name: string;
  category: "Electronics" | "Appliances" | "Auto Parts" | "Vehicles" | "Other";
  condition: "New" | "Used" | "Refurbished";
  status: "In stock" | "Pending" | "Sold";
  price: { NGN: number; CAD: number };
  image: string;
  description: string;
  features: string[];
};

// Update this list to change what appears in the storefront.
export const products: Product[] = [
  { id: 1, sku: "VG-JL-032", name: "JLab Go Air Pop Earbuds", category: "Electronics", condition: "New", status: "In stock", price: { NGN: 30000, CAD: 29 }, image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=78", description: "Compact true wireless earbuds with a secure fit and a pocket-sized charging case.", features: ["32+ hours total playtime", "Clear wireless audio", "Comfortable everyday fit"] },
  { id: 2, sku: "VG-SN-050", name: "Sony Wireless Earbuds", category: "Electronics", condition: "New", status: "In stock", price: { NGN: 50000, CAD: 49 }, image: "https://images.unsplash.com/photo-1606741965429-8d76ff50bb2f?auto=format&fit=crop&w=900&q=78", description: "Premium wireless sound in a lightweight, travel-ready design.", features: ["Long battery life", "Secure in-ear fit", "Fast Bluetooth pairing"] },
  { id: 3, sku: "VG-AS-128", name: "ASUS Everyday Laptop", category: "Electronics", condition: "Refurbished", status: "In stock", price: { NGN: 300000, CAD: 289 }, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=78", description: "A dependable, professionally refurbished laptop for work, school, and daily browsing.", features: ["Intel Core processor", "4GB RAM", "128GB SSD"] },
  { id: 4, sku: "VG-WT-104", name: "Classic Chronograph Watch", category: "Other", condition: "New", status: "Pending", price: { NGN: 45000, CAD: 44 }, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=78", description: "A timeless wristwatch with a polished case and versatile everyday styling.", features: ["Durable metal case", "Adjustable band", "Gift-ready presentation"] },
  { id: 5, sku: "VG-JB-720", name: "JBL Over-Ear Headphones", category: "Electronics", condition: "New", status: "In stock", price: { NGN: 85000, CAD: 82 }, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=78", description: "Immersive wireless listening with cushioned earcups for long sessions.", features: ["Deep, balanced sound", "Soft over-ear cushions", "Foldable design"] },
  { id: 6, sku: "VG-IP-013", name: "iPhone 13 Pro", category: "Electronics", condition: "Used", status: "Sold", price: { NGN: 620000, CAD: 599 }, image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=900&q=78", description: "A carefully inspected pre-owned smartphone with a bright Pro display and capable camera system.", features: ["Device fully tested", "Battery health checked", "Unlocked"] },
  { id: 7, sku: "VG-AF-055", name: "Digital Air Fryer", category: "Appliances", condition: "New", status: "In stock", price: { NGN: 120000, CAD: 116 }, image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=78", description: "A simple countertop air fryer for quick, crisp meals with less oil.", features: ["Digital controls", "Easy-clean basket", "Multiple cook presets"] },
  { id: 8, sku: "VG-CM-221", name: "4K Dash Camera", category: "Auto Parts", condition: "New", status: "In stock", price: { NGN: 95000, CAD: 92 }, image: "https://images.unsplash.com/photo-1597007066704-67bf2068d5b2?auto=format&fit=crop&w=900&q=78", description: "A compact vehicle camera designed to capture clear footage on every drive.", features: ["4K front recording", "Loop recording", "Night vision"] },
];
