import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const loaderVersion = "2026-07-08-1";

const css = await readFile(path.join(root, "src", "brokolisfarm-tilda.css"), "utf8");
const js = await readFile(path.join(root, "src", "brokolisfarm-tilda.js"), "utf8");
const loaderJs = await readFile(path.join(root, "src", "brokolisfarm-loader.js"), "utf8");
const header = await readFile(path.join(root, "src", "partials", "header.html"), "utf8");
const footer = await readFile(path.join(root, "src", "partials", "footer.html"), "utf8");

const pages = [
  ["home", path.join(root, "src", "block.html"), "BrokolisFarm"],
  ["catalog", path.join(root, "src", "pages", "catalog.html"), "BrokolisFarm katalogs"],
  ["offers", path.join(root, "src", "pages", "offers.html"), "BrokolisFarm akcijas"],
  ["new", path.join(root, "src", "pages", "new.html"), "BrokolisFarm jaunumi"],
  ["about", path.join(root, "src", "pages", "about.html"), "Par BrokolisFarm"],
  ["delivery", path.join(root, "src", "pages", "delivery.html"), "Apmaksa un piegāde"],
  ["contacts", path.join(root, "src", "pages", "contacts.html"), "BrokolisFarm kontakti"],
  ["privacy", path.join(root, "src", "pages", "privacy.html"), "Privātuma politika"],
  ["terms", path.join(root, "src", "pages", "terms.html"), "Pirkuma noteikumi"],
  ["not-found", path.join(root, "src", "pages", "not-found.html"), "Lapa nav atrasta"]
];

const headStyles = `<style id="brokolisfarm-global-styles">\n${css}\n</style>\n`;
const headJs =
  `<script id="brokolisfarm-global-templates">\n` +
  `window.BrokolisFarmTemplates = ${JSON.stringify({ header, footer })};\n` +
  `</script>\n` +
  `<script id="brokolisfarm-global-js">\n${js}\n</script>\n`;
const globalHead = `${headStyles}\n${headJs}`;
const pageInit = `<script>window.BrokolisFarmTilda && window.BrokolisFarmTilda.boot && window.BrokolisFarmTilda.boot();</script>\n`;
const templatesJs = `window.BrokolisFarmTemplates = ${JSON.stringify({ header, footer })};\n`;
const loaderSnippet = `<script>
window.BrokolisFarmLoaderConfig = {
  version: "${loaderVersion}"
};
</script>
<script src="https://cdn.jsdelivr.net/gh/nvshurygin/brokolisfarm@${loaderVersion}/dist/brokolisfarm-loader.js?v=${loaderVersion}"></script>
`;
const loaderContainer = `<div data-bf-page="home"></div>\n`;

function renderPageSource(source) {
  return source
    .replaceAll("{{BF_HEADER}}", '<div data-bf-header></div>')
    .replaceAll("{{BF_FOOTER}}", '<div data-bf-footer></div>');
}

function previewDocument(title, body) {
  return `<!doctype html>
<html lang="lv">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@600&family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet" />
    ${globalHead}
  </head>
  <body>
    ${body}
  </body>
</html>
`;
}

await mkdir(distDir, { recursive: true });
await mkdir(path.join(distDir, "pages"), { recursive: true });
await cp(path.join(root, "src", "assets"), path.join(distDir, "assets"), {
  recursive: true,
  force: true
});
await writeFile(path.join(distDir, "00-global-head.html"), globalHead);
await writeFile(path.join(distDir, "00-global-styles.html"), headStyles);
await writeFile(path.join(distDir, "00-global-js.html"), headJs);
await writeFile(path.join(distDir, "brokolisfarm.css"), css);
await writeFile(path.join(distDir, "brokolisfarm-app.js"), js);
await writeFile(path.join(distDir, "brokolisfarm-loader.js"), loaderJs);
await writeFile(path.join(distDir, "brokolisfarm-templates.js"), templatesJs);
await writeFile(path.join(distDir, "loader-head.html"), loaderSnippet);
await writeFile(path.join(distDir, "loader-container.html"), loaderContainer);

for (const [name, file, title] of pages) {
  const source = await readFile(file, "utf8");
  const pageFragment = renderPageSource(source);
  const pageBlock = `${pageFragment}\n${pageInit}`;
  await writeFile(path.join(distDir, "pages", `${name}.html`), pageFragment);
  await writeFile(path.join(distDir, `page-${name}.html`), pageBlock);
  await writeFile(path.join(root, name === "home" ? "index.html" : `${name}.html`), previewDocument(title, pageBlock));
}

// Legacy aliases kept for quick manual tests.
const homeSource = await readFile(path.join(root, "src", "block.html"), "utf8");
const homeBlock = `${renderPageSource(homeSource)}\n${pageInit}`;
await writeFile(path.join(distDir, "tilda-head-styles.html"), headStyles);
await writeFile(path.join(distDir, "tilda-home-block.html"), homeBlock);
await writeFile(path.join(distDir, "tilda-custom-block.html"), `${globalHead}\n${homeBlock}`);

const loaderPreview = `<!doctype html>
<html lang="lv">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>BrokolisFarm Loader Preview</title>
    <script>
      window.BrokolisFarmLoaderConfig = {
        baseUrl: "/dist/",
        page: new URLSearchParams(window.location.search).get("page") || "",
        version: String(Date.now())
      };
    </script>
    <script src="/dist/brokolisfarm-loader.js"></script>
  </head>
  <body>
    <div data-bf-page=""></div>
  </body>
</html>
`;
await writeFile(path.join(root, "loader.html"), loaderPreview);

const loaderAttributePreview = `<!doctype html>
<html lang="lv">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>BrokolisFarm Loader Attribute Preview</title>
    <script>
      window.BrokolisFarmLoaderConfig = {
        baseUrl: "/dist/",
        version: String(Date.now())
      };
    </script>
    <script src="/dist/brokolisfarm-loader.js"></script>
  </head>
  <body>
    <div data-bf-page="catalog"></div>
  </body>
</html>
`;
await writeFile(path.join(root, "loader-catalog.html"), loaderAttributePreview);
