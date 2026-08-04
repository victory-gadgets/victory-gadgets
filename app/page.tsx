"use client";

import { useMemo, useState } from "react";
import { products, type Product } from "./inventory";

const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];
const conditions = ["All", "New", "Used", "Refurbished"];

function money(value: number, currency: "NGN" | "CAD") {
  return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function StatusBadge({ status }: { status: Product["status"] }) {
  return <span className={`status status-${status.toLowerCase().replace(" ", "-")}`}>{status}</span>;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");
  const [currency, setCurrency] = useState<"NGN" | "CAD">("NGN");
  const [selected, setSelected] = useState<Product | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery = !needle || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(needle);
      return matchesQuery && (category === "All" || product.category === category) && (condition === "All" || product.condition === condition);
    });
  }, [query, category, condition]);

  const askAbout = (product: Product) => {
    const text = encodeURIComponent(`Hello Victory Gadgets, I’m interested in the ${product.name} (${product.sku}). Is it still available?`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Victory Gadgets home">
          <span className="brand-mark">V</span>
          <span><b>VICTORY</b><small>GADGETS & ACCESSORIES</small></span>
        </a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">Menu</button>
        <nav className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
          <a href="#shop" onClick={() => setMenuOpen(false)}>Shop</a>
          <a href="#why-us" onClick={() => setMenuOpen(false)}>Why us</a>
          <a className="nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">QUALITY YOU CAN TRUST · VALUE YOU DESERVE</p>
          <h1>Better tech.<br /><em>Smarter prices.</em></h1>
          <p className="hero-lede">Original gadgets and accessories, carefully sourced and ready for pickup or worldwide delivery.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#shop">Browse the collection <span>→</span></a>
            <a className="text-link" href="#contact">Talk to us</a>
          </div>
          <div className="hero-proof" aria-label="Store benefits">
            <span><b>100%</b> Original</span><span><b>Fast</b> Delivery</span><span><b>Secure</b> Service</span>
          </div>
        </div>
        <div className="hero-art" aria-label="Victory Gadgets product showcase">
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
          <img src="brand-flyer.jpeg" alt="Laptops, phones, earbuds and smart watches from Victory Gadgets" />
          <div className="hero-note"><b>Fresh stock</b><span>Updated regularly</span></div>
        </div>
      </section>

      <section className="category-strip" aria-label="Product categories">
        {categories.slice(1).map((item, index) => <button key={item} onClick={() => { setCategory(item); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}><span>{["◉", "▣", "⌁", "◇", "+"][index]}</span>{item}</button>)}
      </section>

      <section className="shop-section" id="shop">
        <div className="section-heading">
          <div><p className="eyebrow">CURATED FOR EVERYDAY LIFE</p><h2>Shop what’s available</h2></div>
          <div className="currency-toggle" aria-label="Display currency">
            <button className={currency === "NGN" ? "active" : ""} onClick={() => setCurrency("NGN")}>NGN</button>
            <button className={currency === "CAD" ? "active" : ""} onClick={() => setCurrency("CAD")}>CAD</button>
          </div>
        </div>

        <div className="filters">
          <label className="search-field"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" /></label>
          <label><span className="sr-only">Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span className="sr-only">Condition</span><select value={condition} onChange={(event) => setCondition(event.target.value)}>{conditions.map((item) => <option key={item}>{item}</option>)}</select></label>
          {(query || category !== "All" || condition !== "All") && <button className="clear-button" onClick={() => { setQuery(""); setCategory("All"); setCondition("All"); }}>Clear</button>}
        </div>

        <p className="result-count">{filtered.length} {filtered.length === 1 ? "item" : "items"} available</p>
        <div className="product-grid">
          {filtered.map((product) => (
            <article className={`product-card ${product.status !== "In stock" ? "muted" : ""}`} key={product.id}>
              <button className="product-image" onClick={() => setSelected(product)} aria-label={`View ${product.name}`}>
                <img src={product.image} alt={product.name} loading="lazy" />
                <StatusBadge status={product.status} />
              </button>
              <div className="product-info">
                <p className="product-meta">{product.category} · {product.condition}</p>
                <h3>{product.name}</h3>
                <div className="product-bottom"><strong>{money(product.price[currency], currency)}</strong><button onClick={() => setSelected(product)} aria-label={`View details for ${product.name}`}>View <span>↗</span></button></div>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && <div className="empty-state"><b>No exact matches.</b><p>Try another search or clear the filters.</p></div>}
      </section>

      <section className="service-section" id="why-us">
        <div className="service-intro"><p className="eyebrow">SHOP WITH CONFIDENCE</p><h2>From our shelf<br />to your doorstep.</h2><p>Reliable service, transparent condition notes, and secure packaging on every order.</p></div>
        <div className="service-grid">
          <article><span>01</span><h3>Quality checked</h3><p>Every listing is reviewed before it goes live.</p></article>
          <article><span>02</span><h3>Clear pricing</h3><p>Browse in Nigerian naira or Canadian dollars.</p></article>
          <article><span>03</span><h3>Worldwide delivery</h3><p>Safe packaging and dependable shipping options.</p></article>
          <article><span>04</span><h3>Human support</h3><p>Ask questions and confirm availability directly.</p></article>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div><p className="eyebrow">NEED HELP CHOOSING?</p><h2>Let’s find your next gadget.</h2></div>
        <a className="primary-button light" href="https://wa.me/?text=Hello%20Victory%20Gadgets%2C%20I%27d%20like%20help%20finding%20a%20product." target="_blank" rel="noreferrer">Message on WhatsApp <span>↗</span></a>
      </section>

      <footer><a className="brand" href="#top"><span className="brand-mark">V</span><span><b>VICTORY</b><small>GADGETS & ACCESSORIES</small></span></a><p>Quality gadgets. Better life.</p><p>© 2026 Victory Gadgets</p></footer>

      {selected && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}>
        <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
          <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close product details">×</button>
          <div className="modal-image"><img src={selected.image} alt={selected.name} /><StatusBadge status={selected.status} /></div>
          <div className="modal-copy"><p className="product-meta">{selected.category} · {selected.condition} · {selected.sku}</p><h2 id="modal-title">{selected.name}</h2><p>{selected.description}</p><ul>{selected.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><strong className="modal-price">{money(selected.price[currency], currency)}</strong><button className="primary-button" disabled={selected.status === "Sold"} onClick={() => askAbout(selected)}>{selected.status === "Sold" ? "Currently sold" : "Ask about this item"}<span>↗</span></button></div>
        </section>
      </div>}
    </main>
  );
}
