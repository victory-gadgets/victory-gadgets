# Victory Gadgets storefront

A lightweight, mobile-first catalog for GitHub Pages. Customers can choose Nigeria, Canada, or the United States, then browse only that market's inventory, images, availability, and NGN/CAD/USD pricing. Their location choice is remembered on their device and included in every WhatsApp inquiry.

## Update products

Edit `app/inventory.ts`. Each row represents one physical listing in one market and includes its location, local price, photos, condition, availability, description, and features. To clone an item across markets, duplicate the row and change its market, SKU, price, and photos. Push the change to `main`; GitHub Actions republishes automatically.

## Publish

1. Create a GitHub repository and push this project to its `main` branch.
2. In the repository, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push any change or run the deployment workflow manually.

The location selector uses a soft browser-locale default and lets the customer switch at any time; it does not use IP tracking. The first release remains catalog-only because GitHub Pages cannot securely host a password-protected inventory backend. A later phase can connect this storefront to a hosted CMS, authentication service, and image storage without redesigning the customer experience.
