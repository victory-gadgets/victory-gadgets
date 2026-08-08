# Victory Gadgets storefront

A lightweight, mobile-first catalog for GitHub Pages. Customers can choose Nigeria, Canada, or the United States, then browse only that market's inventory, images, availability, and NGN/CAD/USD pricing. Their location choice is remembered on their device and included in every WhatsApp inquiry.

- Storefront: [myvictorygadget.com](https://myvictorygadget.com/)
- Inventory admin: [victory-gadgets-admin.sanity.studio](https://victory-gadgets-admin.sanity.studio/)

## Update products

The secure Sanity Studio is the primary inventory manager. Each entry represents one physical listing in one market and includes its location, local price, photos, condition, availability, description, and features. Published Studio changes appear on the storefront without a GitHub deployment.

`app/inventory.ts` remains a read-only fallback so the public catalog stays available if the content service is temporarily unreachable.

## Publish

The `main` branch deploys through GitHub Actions to GitHub Pages. The repository variable `SANITY_PROJECT_ID` supplies the public Sanity project ID during the build, while `NEXT_PUBLIC_SITE_URL` in the workflow keeps canonical and social metadata on the custom domain. Push a change or run the deployment workflow manually to publish a new storefront build.

The location selector uses a soft browser-locale default and lets the customer switch at any time; it does not use IP tracking. Sanity handles secure member authentication, product drafts, publishing, and image storage; no privileged Sanity token is included in the public website.
