"use client";

import { useEffect, useMemo, useState } from "react";
import { markets, products, type Market, type Product } from "./inventory";

const conditions = ["All", "New", "Used", "Refurbished"];
const marketCodes = Object.keys(markets) as Market[];

const priceBands: Record<Market, { label: string; value: number }[]> = {
  NG: [{ label: "Under ₦50,000", value: 50000 }, { label: "Under ₦100,000", value: 100000 }, { label: "Under ₦300,000", value: 300000 }],
  CA: [{ label: "Under $100 CAD", value: 100 }, { label: "Under $300 CAD", value: 300 }, { label: "Under $700 CAD", value: 700 }],
  US: [{ label: "Under $100 USD", value: 100 }, { label: "Under $300 USD", value: 300 }, { label: "Under $700 USD", value: 700 }],
};

function money(value: number, market: Market) {
  const details = markets[market];
  return new Intl.NumberFormat(details.locale, { style: "currency", currency: details.currency, maximumFractionDigits: 0 }).format(value);
}

function StatusBadge({ status }: { status: Product["status"] }) {
  return <span className={`status status-${status.toLowerCase().replace(" ", "-")}`}>{status}</span>;
}

function detectedMarket(): Market {
  if (typeof window === "undefined") return "NG";
  const saved = window.localStorage.getItem("victory-market");
  if (saved && marketCodes.includes(saved as Market)) return saved as Market;
  const region = window.navigator.language.split("-")[1]?.toUpperCase();
  return region === "CA" ? "CA" : region === "US" ? "US" : "NG";
}

export default function Home() {
  const [market, setMarket] = useState<Market>("NG");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMarket(detectedMarket()); }, []);
  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", close); document.body.style.overflow = ""; };
  }, [selected]);

  const currentMarket = markets[market];
  const marketProducts = useMemo(() => products.filter((product) => product.market === market), [market]);
  const categories = useMemo(() => ["All", ...Array.from(new Set(marketProducts.map((product) => product.category)))], [marketProducts]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return marketProducts.filter((product) => {
      const matchesQuery = !needle || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(needle);
      const matchesPrice = maxPrice === null || product.price <= maxPrice;
      return matchesQuery && matchesPrice && (category === "All" || product.category === category) && (condition === "All" || product.condition === condition);
    });
  }, [marketProducts, query, category, condition, maxPrice]);

  const changeMarket = (nextMarket: Market, scrollToShop = false) => {
    setMarket(nextMarket);
    window.localStorage.setItem("victory-market", nextMarket);
    setQuery(""); setCategory("All"); setCondition("All"); setMaxPrice(null); setSelected(null); setMenuOpen(false);
    if (scrollToShop) window.setTimeout(() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }), 50);
  };
  const openProduct = (product: Product) => { setSelected(product); setActiveImage(0); };
  const askAbout = (product: Product) => {
    const text = encodeURIComponent(`Hello Victory Gadgets, I’m interested in the ${product.name} (${product.sku}) — ${markets[product.market].name} listing. Is it still available?`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };
  const contactHref = `https://wa.me/?text=${encodeURIComponent(`Hello Victory Gadgets, I’d like help finding a product in your ${currentMarket.name} inventory.`)}`;

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Victory Gadgets home"><span className="brand-mark">V</span><span><b>VICTORY</b><small>GADGETS & ACCESSORIES</small></span></a>
        <label className="header-market"><span aria-hidden="true">{currentMarket.flag}</span><span className="sr-only">Shopping location</span><select value={market} onChange={(event) => changeMarket(event.target.value as Market)}>{marketCodes.map((code) => <option key={code} value={code}>{markets[code].name} · {markets[code].currency}</option>)}</select></label>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">Menu</button>
        <nav className={menuOpen ? "nav-open" : ""} aria-label="Main navigation"><a href="#shop" onClick={() => setMenuOpen(false)}>Shop</a><a href="#why-us" onClick={() => setMenuOpen(false)}>Why us</a><a className="nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">QUALITY YOU CAN TRUST · WHEREVER YOU ARE</p>
          <h1>Great tech.<br /><em>Right where you are.</em></h1>
          <p className="hero-lede">Choose your market to see only the products, photos, availability, and local pricing prepared for you.</p>
          <div className="market-picker" role="group" aria-label="Choose your shopping location">
            {marketCodes.map((code) => <button key={code} className={market === code ? "active" : ""} onClick={() => changeMarket(code, true)} aria-pressed={market === code}><span className="market-flag" aria-hidden="true">{markets[code].flag}</span><span><b>{markets[code].name}</b><small>Shop in {markets[code].currency}</small></span><i aria-hidden="true">→</i></button>)}
          </div>
          <p className="location-note"><span>●</span> Showing {currentMarket.name} inventory. Your choice is remembered on this device.</p>
        </div>
        <div className="hero-art" aria-label="Victory Gadgets product showcase"><div className="hero-orbit hero-orbit-one" /><div className="hero-orbit hero-orbit-two" /><img src="brand-flyer.jpeg" alt="Laptops, phones, earbuds and smart watches from Victory Gadgets" /><div className="hero-note"><b>{currentMarket.flag} {currentMarket.name}</b><span>{marketProducts.length} local listings · {currentMarket.currency}</span></div></div>
      </section>

      <section className="category-strip" aria-label={`${currentMarket.name} product categories`}>
        {categories.slice(1).map((item, index) => <button key={item} onClick={() => { setCategory(item); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}><span>{["◉", "▣", "⌁", "◇", "+"][index]}</span>{item}</button>)}
      </section>

      <section className="shop-section" id="shop">
        <div className="section-heading"><div><p className="eyebrow">{currentMarket.flag} {currentMarket.name.toUpperCase()} INVENTORY</p><h2>Shop what’s available</h2></div><div className="market-summary"><span>{currentMarket.flag}</span><div><small>PRICES SHOWN IN</small><b>{currentMarket.currency}</b></div></div></div>
        <div className="filters">
          <label className="search-field"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${currentMarket.name} products`} aria-label={`Search ${currentMarket.name} products`} /></label>
          <label><span className="sr-only">Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span className="sr-only">Condition</span><select value={condition} onChange={(event) => setCondition(event.target.value)}>{conditions.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span className="sr-only">Maximum price</span><select value={maxPrice ?? ""} onChange={(event) => setMaxPrice(event.target.value ? Number(event.target.value) : null)}><option value="">Any price</option>{priceBands[market].map((band) => <option key={band.value} value={band.value}>{band.label}</option>)}</select></label>
          {(query || category !== "All" || condition !== "All" || maxPrice !== null) && <button className="clear-button" onClick={() => { setQuery(""); setCategory("All"); setCondition("All"); setMaxPrice(null); }}>Clear</button>}
        </div>
        <p className="result-count">{filtered.length} {filtered.length === 1 ? "item" : "items"} in {currentMarket.name}</p>
        <div className="product-grid">
          {filtered.map((product) => <article className={`product-card ${product.status !== "In stock" ? "muted" : ""}`} key={product.id}><button className="product-image" onClick={() => openProduct(product)} aria-label={`View ${product.name}`}><img src={product.images[0]} alt={product.name} loading="lazy" /><StatusBadge status={product.status} />{product.images.length > 1 && <span className="photo-count" aria-label={`${product.images.length} photos`}>{product.images.length} photos</span>}</button><div className="product-info"><p className="product-meta">{product.category} · {product.condition}</p><h3>{product.name}</h3><div className="product-bottom"><strong>{money(product.price, market)}</strong><button onClick={() => openProduct(product)} aria-label={`View details for ${product.name}`}>View <span>↗</span></button></div></div></article>)}
        </div>
        {filtered.length === 0 && <div className="empty-state"><b>No exact matches in {currentMarket.name}.</b><p>Try another search, clear the filters, or switch markets.</p></div>}
      </section>

      <section className="service-section" id="why-us"><div className="service-intro"><p className="eyebrow">SHOP WITH CONFIDENCE</p><h2>Local stock.<br />Victory service.</h2><p>Every market has its own product availability, photos, and pricing—backed by the same reliable service.</p></div><div className="service-grid"><article><span>01</span><h3>Market-specific stock</h3><p>See only the products physically listed for your chosen location.</p></article><article><span>02</span><h3>Local pricing</h3><p>Prices stay tied to NGN, CAD, or USD—no confusing conversions.</p></article><article><span>03</span><h3>Clear condition notes</h3><p>Every unit is labelled new, used, or professionally refurbished.</p></article><article><span>04</span><h3>Direct support</h3><p>Your inquiry automatically includes the item and market you selected.</p></article></div></section>

      <section className="contact-section" id="contact"><div><p className="eyebrow">SHOPPING IN {currentMarket.name.toUpperCase()}?</p><h2>Let’s find your next gadget.</h2></div><a className="primary-button light" href={contactHref} target="_blank" rel="noreferrer">Message on WhatsApp <span>↗</span></a></section>
      <footer><a className="brand" href="#top"><span className="brand-mark">V</span><span><b>VICTORY</b><small>GADGETS & ACCESSORIES</small></span></a><p>Nigeria · Canada · United States</p><p>© 2026 Victory Gadgets</p></footer>

      {selected && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}><section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close product details">×</button><div className="modal-visual"><div className="modal-image"><img src={selected.images[activeImage]} alt={`${selected.name}, photo ${activeImage + 1}`} /><StatusBadge status={selected.status} /></div>{selected.images.length > 1 && <div className="thumbnail-row" aria-label="Product photos">{selected.images.map((image, index) => <button key={`${image}-${index}`} className={activeImage === index ? "active" : ""} onClick={() => setActiveImage(index)} aria-label={`Show photo ${index + 1}`} aria-pressed={activeImage === index}><img src={image} alt="" /></button>)}</div>}</div><div className="modal-copy"><p className="product-meta">{markets[selected.market].flag} {markets[selected.market].name} · {selected.category} · {selected.condition} · {selected.sku}</p><h2 id="modal-title">{selected.name}</h2><p>{selected.description}</p><ul>{selected.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><strong className="modal-price">{money(selected.price, selected.market)}</strong><button className="primary-button" disabled={selected.status === "Sold"} onClick={() => askAbout(selected)}>{selected.status === "Sold" ? "Currently sold" : "Ask about this item"}<span>↗</span></button></div></section></div>}
    </main>
  );
}
