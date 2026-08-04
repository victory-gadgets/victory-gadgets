# Victory Gadgets storefront

A lightweight, mobile-first catalog for GitHub Pages. Customers can search and filter current inventory, switch between NGN and CAD, open product details, and send a pre-filled WhatsApp inquiry.

## Update products

Edit `app/inventory.ts`. Each product includes its name, category, condition, availability, prices, image, description, and features. Push the change to `main`; GitHub Actions republishes the storefront automatically.

## Publish

1. Create a GitHub repository and push this project to its `main` branch.
2. In the repository, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push any change or run the deployment workflow manually.

The first release is intentionally catalog-only. GitHub Pages cannot securely host a password-protected inventory backend. A later phase can connect this same storefront to a hosted CMS or database without redesigning the customer experience.
