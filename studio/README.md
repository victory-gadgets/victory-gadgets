# Victory Gadgets Sanity Studio

Private inventory-editing workspace for the Victory Gadgets storefront. The Studio manages one physical listing per market, including local price, inventory state, photos, and publication controls.

## 1. Sanity project

The Studio is deployed at [victory-gadgets-admin.sanity.studio](https://victory-gadgets-admin.sanity.studio/) and uses the `Victory Gadgets` Sanity project (`6e3p2b4u`) with its `production` dataset. The dataset name can be changed with `SANITY_STUDIO_DATASET`, but `production` is the default throughout this project.

For a catalog-only GitHub Pages site, a **public dataset** is the simplest setup: anonymous visitors can read catalog records, while only authenticated Sanity project members can create or edit them. Do not store private customer, supplier, cost, or credential data in this dataset. A private dataset requires a server-side or build-time token, which must never be included in browser code.

## 2. Configure and run locally

Requirements: Node.js 20 or newer and npm.

```sh
cd studio
cp .env.example .env.local
```

Set `SANITY_STUDIO_PROJECT_ID` in `.env.local` to the project ID shown in Sanity Manage. Leave `SANITY_STUDIO_DATASET=production` unless a different dataset was deliberately created.

Then install and start the Studio:

```sh
npm ci
npm run dev
```

After installation, `npm run typecheck` validates the Studio configuration and schema without producing build files.

## 3. Secure editor access

In Sanity Manage, open the project's **Members** area and invite only the people who should edit inventory. Use individual accounts rather than a shared login, remove former staff promptly, and grant the least-privileged role available on the selected Sanity plan.

The public storefront must use only a project ID, dataset, and public API version. Never add a Sanity write token to the GitHub repository, frontend environment variables, generated JavaScript, or GitHub Pages.

## 4. Deploy the Studio

Authenticate the Sanity CLI and deploy the hosted Studio:

```sh
npx sanity login
npm run deploy
```

The first deployment asks for an available `*.sanity.studio` hostname. Studio access still requires membership in the Sanity project.

## 5. Allow the storefront origin

In Sanity Manage, open **API → CORS origins** and add:

- `http://localhost:4173` for the local storefront preview, without credentials.
- `https://myvictorygadget.com` for the production storefront, without credentials.
- `https://www.myvictorygadget.com` for the `www` alias, without credentials.
- `https://victory-gadgets.github.io` for the GitHub Pages fallback URL, without credentials.

Add origins only, without paths or trailing slashes.

## Content model

Each `productListing` document represents one physical listing in exactly one market:

- Nigeria (`NG`, default currency `NGN`)
- Canada (`CA`, default currency `CAD`)
- United States (`US`, default currency `USD`)

The optional currency override is for exceptional listings only. Uploaded Sanity images are preferred; legacy image URLs exist solely to make migration from the current hard-coded inventory gradual. Every uploaded photo requires alternative text.

The Studio separates Sanity's own draft/publish lifecycle from the storefront's `isActive` switch. Editors should publish the Sanity document after changing fields. The storefront should additionally require `isActive == true` and `archived != true`.

## Suggested storefront query

Use a fixed API version and the CDN for the public, read-only client. The query below returns all visible listings for one market and resolves uploaded photo metadata while retaining legacy URLs during migration:

```groq
*[
  _type == "productListing" &&
  market == $market &&
  isActive == true &&
  archived != true
] | order(_updatedAt desc) {
  _id,
  name,
  sku,
  "slug": slug.current,
  market,
  category,
  condition,
  status,
  quantity,
  price,
  "currency": coalesce(
    currencyOverride,
    select(market == "NG" => "NGN", market == "CA" => "CAD", "USD")
  ),
  description,
  features,
  photos[]{
    _key,
    alt,
    caption,
    asset->{_id, url, metadata{dimensions}}
  },
  legacyImageUrls
}
```

The storefront uses the public Sanity CDN with no token and filters the returned catalog locally by the selected `NG`, `CA`, or `US` market. Keep privileged tokens out of browser code.

## Editorial workflow

1. Create a listing using the market-specific template in the Studio's create menu.
2. Complete every required field and upload product photos with accurate alt text.
3. Confirm status and quantity agree: in-stock needs at least 1; sold needs 0.
4. Enable **Active on storefront**, then use Sanity's **Publish** action.
5. To retire a listing, disable **Active on storefront**, publish that change, enable **Archived**, and publish again.

The custom desk is grouped by market, availability, inactive records, and archived records so editors can quickly find operational exceptions.
