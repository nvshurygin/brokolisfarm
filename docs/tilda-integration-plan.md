# BrokolisFarm Tilda integration plan

## Figma page map

Source node: `Fb8uJd3Abme1MlihH5hLtE`, node `11:96`, frame `Osnova`, 1440 x 4375.

Main blocks:

1. Header/topbar: country/language/phone, logo, catalog button, menu, search, cart.
2. Hero: green delivery promo, category tags, CTA, food photo.
3. Category grid: 10 farm product categories.
4. Products/offers: product cards in the Figma style, loaded from Tilda catalog.
5. Newsletter/brand block.
6. Delivery information.
7. Benefits: local production, quality control, time care.
8. Instagram CTA.
9. Recipes/blog cards.
10. Footer placeholder.

## What the Tilda files show

Catalog:

- `t_store_loadProducts` requests `https://store.tildaapi.com/api/getproductslist/`.
- Required params are `storepartuid`, `recid`, cache timestamp `c`, `getparts`, `getoptions`, `slice`, `size`, and `flag_root=withroot`.
- The response returns `products`, `parts`, optional `nextslice`, and `options`.
- `gallery`, `json_options`, and `partuids` arrive as JSON strings and must be parsed.
- Product variants are stored in `editions`. If the product price is empty, the selected edition price must be used.

Cart:

- `tcart__addEvent__links` listens for links starting with `href="#order"`.
- The nearest `.js-product` is used as the product source.
- Tilda reads `.js-product-name`, `.js-product-price`, `.js-product-img`, `.js-product-edition-option`, `.js-product-option`, and `data-product-*`.
- `tcart__addProduct` stores the item in `window.tcart`, recalculates totals, redraws cart icon, and persists to localStorage.

Filters/categories:

- Native category controls use `t_store_addStoreParts` and `t_store_filters_send`.
- In this custom page, category chips are rendered from API `parts` and filtered client-side by `partuids`. This avoids depending on minified internal serialization.

## Implementation approach

- Keep checkout native: add Tilda cart/order block (`t706`) to the page.
- Put `dist/00-global-head.html` into Tilda HEAD once. It includes `.bf-*` styles, global JS, and reusable header/footer templates.
- Use one custom HTML block per page. Each `dist/page-*.html` file contains page HTML and a tiny page-level init script.
- Header/footer are injected by global JS into `[data-bf-header]` and `[data-bf-footer]` placeholders.
- Fetch catalog products directly from Tilda API using the current store IDs:
  - `storepartuid=420955341102`
  - `recid=2176935951`
- Render cards with Figma styling and Tilda-compatible product hooks.
- For products with editions:
  - choose the first available edition by default;
  - render edition selects from `json_options`;
  - update card price, image, SKU, inventory, and `data-product-uid` on change.
- Use `href="#order"` for add-to-cart so the native cart receives the product.

## Responsive rules

- Desktop: 1160px shell, 5-column categories/products.
- Tablet: 4 columns, hero/newsletter/delivery collapse to fewer columns.
- Mobile: category and product sections become horizontal scroll strips, header menu scrolls, hero becomes image-first.

## Tilda production checklist

1. Add standard cart/order block (`t706`) and configure currency, forms, delivery, and payments in Tilda.
2. Paste `dist/00-global-head.html` into site/page HEAD once.
3. Paste the relevant `dist/page-*.html` file into each page HTML block.
4. Keep `dist/tilda-custom-block.html` only as a home-page all-in-one fallback.
5. Make sure the page allows custom HTML/JS.
6. Upload Figma image assets to Tilda CDN and replace the current Figma MCP asset URLs if they expire.
7. Test:
   - product list loads;
   - edition switch changes Apple price from 10 to 15;
   - add-to-cart creates the right product in the Tilda cart;
   - mobile horizontal product strip works;
   - no duplicate add-to-cart events fire.
