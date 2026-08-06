import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the market-aware Victory Gadgets storefront", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Victory Gadgets \| Quality Gadgets, Better Life<\/title>/i);
  assert.match(html, /Choose your shopping location/);
  assert.match(html, /Nigeria/);
  assert.match(html, /Canada/);
  assert.match(html, /United States/);
  assert.match(html, /NGN/);
  assert.match(html, /CAD/);
  assert.match(html, /USD/);
  assert.match(html, /Any price/);
  assert.match(html, /Shop what’s available/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("keeps market selection, filtering, galleries, and inquiries location-aware", async () => {
  const [page, inventory] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/inventory.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /localStorage\.getItem\("victory-market"\)/);
  assert.match(page, /localStorage\.setItem\("victory-market", nextMarket\)/);
  assert.match(page, /product\.market === market/);
  assert.match(page, /product\.price <= maxPrice/);
  assert.match(page, /selected\.images\[activeImage\]/);
  assert.match(page, /markets\[product\.market\]\.name} listing/);

  for (const market of ["NG", "CA", "US"]) {
    assert.match(inventory, new RegExp(`market: "${market}"`));
  }
  assert.match(inventory, /currency: "NGN"/);
  assert.match(inventory, /currency: "CAD"/);
  assert.match(inventory, /currency: "USD"/);
  assert.match(inventory, /images: string\[\]/);
});
