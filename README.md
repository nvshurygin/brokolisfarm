# BrokolisFarm Tilda page

Tilda-ready implementation of the BrokolisFarm home page from Figma.

## What is here

- `index.html` - local preview.
- `src/block.html` - page markup for the custom Tilda block.
- `src/brokolisfarm-tilda.css` - responsive layout and visual system.
- `src/brokolisfarm-tilda.js` - global Tilda helper: header/footer injection, catalog API loader, cart-compatible product cards.
- `src/partials/header.html` and `src/partials/footer.html` - reusable header/footer templates.
- `src/pages/*.html` - page source files.
- `dist/00-global-head.html` - paste once into Tilda HEAD. It contains global styles, global JS, and reusable header/footer templates.
- `dist/page-*.html` - one pasteable HTML+JS file per page.
- `dist/brokolisfarm-loader.js` - CDN/Git loader that fetches CSS, JS, templates, and page fragments.
- `dist/pages/*.html` - page fragments for the loader mode.
- `dist/loader-head.html` - example Tilda HEAD snippet for CDN/Git loader mode.
- `dist/loader-container.html` - one-line body mount example for loader mode.
- `dist/tilda-custom-block.html` - legacy all-in-one home fallback.
- `docs/tilda-integration-plan.md` - integration plan and findings from the Tilda files.

## Local preview

Run a static server from this folder:

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

## Tilda usage

### Recommended: Git/CDN loader

1. Push this project to GitHub.
2. Use a CDN URL for `dist/brokolisfarm-loader.js`, for example:

```html
<script>
window.BrokolisFarmLoaderConfig = {
  version: "2026-07-08-1"
};
</script>
<script src="https://cdn.jsdelivr.net/gh/nvshurygin/brokolisfarm@2026-07-08-1/dist/brokolisfarm-loader.js?v=2026-07-08-1"></script>
```

3. Paste that snippet once into Tilda HEAD. The loader automatically pulls:
   - `dist/brokolisfarm.css`
   - `dist/brokolisfarm-templates.js`
   - `dist/brokolisfarm-app.js`
   - `dist/pages/<page>.html`
   The loader and assets are opened from the same git tag, so page CSS/JS are not served from the stale `@main` branch cache.
4. Create real Tilda pages for routes such as `/`, `/catalog`, `/offers`, `/new`, `/about`, `/delivery`, `/contacts`, `/privacy`, and `/terms`.
5. Add one HTML block to each page with its page key:

```html
<div data-bf-page="home"></div>
<div data-bf-page="catalog"></div>
<div data-bf-page="offers"></div>
<div data-bf-page="new"></div>
<div data-bf-page="about"></div>
<div data-bf-page="delivery"></div>
<div data-bf-page="contacts"></div>
<div data-bf-page="privacy"></div>
<div data-bf-page="terms"></div>
```

6. The loader does not enable SPA navigation by default. Header/footer links navigate to real Tilda pages, and each page loads its own fragment from Git/CDN.
7. For updates, push to GitHub, create the matching git tag, and change `version` plus the tag in the CDN URL.

Prefer `cdn.jsdelivr.net/gh/...` over `raw.githubusercontent.com` for production because it serves better cache headers and content types for browser-loaded assets.

### Manual paste fallback

1. Add a standard Tilda cart/order block (`t706`) to pages with products, because checkout, delivery, discounts, forms, and cart persistence remain native Tilda features.
2. Paste `dist/00-global-head.html` once into Tilda site/page HEAD. This is the reusable `.bf-*` style layer, global JS, header and footer.
3. Add one HTML block per page and paste the matching page file:
   - `dist/page-home.html`
   - `dist/page-catalog.html`
   - `dist/page-offers.html`
   - `dist/page-new.html`
   - `dist/page-about.html`
   - `dist/page-delivery.html`
   - `dist/page-contacts.html`
   - `dist/page-privacy.html`
   - `dist/page-terms.html`
   - `dist/page-not-found.html`
4. On catalog/product pages, keep these data attributes:
   - `data-storepartuid="420955341102"`
   - `data-recid="2450241213"`
5. Figma images are mirrored in `src/assets` and published from `dist/assets`, so production pages do not depend on Figma MCP asset URLs.

`dist/tilda-custom-block.html` remains available as a fallback when global HEAD injection cannot be used.

The dynamic product cards intentionally keep Tilda-compatible hooks:

- `.js-product`
- `.js-product-name`
- `.js-product-price`
- `.js-product-img`
- `.js-product-edition-option`
- `href="#order"`
- `data-product-*`

That lets Tilda cart read the product data using its normal `tcart__addEvent__links` flow.
