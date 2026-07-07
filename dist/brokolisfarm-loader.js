(function () {
  "use strict";

  var script = document.currentScript;
  var config = window.BrokolisFarmLoaderConfig || {};
  var PAGE_BY_PATH = {
    "": "home",
    "/": "home",
    "/home": "home",
    "/index": "home",
    "/index.html": "home",
    "/catalog": "catalog",
    "/catalog/": "catalog",
    "/offers": "offers",
    "/offers/": "offers",
    "/akcii": "offers",
    "/akcii/": "offers",
    "/sale": "offers",
    "/sale/": "offers",
    "/new": "new",
    "/new/": "new",
    "/novinki": "new",
    "/novinki/": "new",
    "/about": "about",
    "/about/": "about",
    "/o-nas": "about",
    "/o-nas/": "about",
    "/delivery": "delivery",
    "/delivery/": "delivery",
    "/contacts": "contacts",
    "/contacts/": "contacts",
    "/privacy": "privacy",
    "/privacy/": "privacy",
    "/terms": "terms",
    "/terms/": "terms"
  };

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function dirname(url) {
    return url.slice(0, url.lastIndexOf("/") + 1);
  }

  function getScriptBaseUrl() {
    if (config.baseUrl) return normalizeBaseUrl(config.baseUrl);
    if (script && script.src) return dirname(script.src.split("?")[0]);
    return "/dist/";
  }

  function pinJsdelivrBaseUrl(baseUrl) {
    var ref = config.assetRef || config.version;
    if (config.pinAssetsToVersion === false || !ref || /[/?#]/.test(String(ref))) return baseUrl;
    return baseUrl.replace(
      /\/gh\/([^@/]+\/[^@/]+)@[^/]+\/dist\/?$/,
      "/gh/$1@" + String(ref) + "/dist/"
    );
  }

  function normalizeBaseUrl(url) {
    return String(url || "").replace(/\/?$/, "/");
  }

  function absoluteUrl(url) {
    try {
      return new URL(url, document.baseURI).href;
    } catch (error) {
      return String(url || "");
    }
  }

  function nodeAssetUrl(node) {
    return node && (node.src || node.href || "");
  }

  function isSameAssetUrl(node, url) {
    return absoluteUrl(nodeAssetUrl(node)) === absoluteUrl(url);
  }

  function removeNode(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node);
  }

  function withVersion(url) {
    if (!config.version) return url;
    return url + (url.indexOf("?") === -1 ? "?" : "&") + "v=" + encodeURIComponent(config.version);
  }

  function loadScript(src, id) {
    return new Promise(function (resolve, reject) {
      var desiredSrc = withVersion(src);
      var existing = id && document.getElementById(id);
      if (existing) {
        if (isSameAssetUrl(existing, desiredSrc)) {
          resolve();
          return;
        }
        removeNode(existing);
      }
      var node = document.createElement("script");
      if (id) node.id = id;
      if (config.version) node.setAttribute("data-bf-loader-version", config.version);
      node.src = desiredSrc;
      node.async = false;
      node.onload = function () {
        resolve();
      };
      node.onerror = function () {
        reject(new Error("Failed to load " + src));
      };
      document.head.appendChild(node);
    });
  }

  function ensureStylesheet(href, id) {
    var desiredHref = withVersion(href);
    var existing = id && document.getElementById(id);
    if (existing) {
      if (existing.tagName && existing.tagName.toLowerCase() === "link") {
        existing.rel = "stylesheet";
        if (config.version) existing.setAttribute("data-bf-loader-version", config.version);
        if (!isSameAssetUrl(existing, desiredHref)) existing.href = desiredHref;
        return;
      }
      removeNode(existing);
    }
    var link = document.createElement("link");
    if (id) link.id = id;
    if (config.version) link.setAttribute("data-bf-loader-version", config.version);
    link.rel = "stylesheet";
    link.href = desiredHref;
    document.head.appendChild(link);
  }

  function ensureColorOverrides() {
    var style = document.getElementById("brokolisfarm-color-overrides");
    if (!style) {
      style = document.createElement("style");
      style.id = "brokolisfarm-color-overrides";
    }
    style.textContent =
      ".bf-page .bf-header .bf-logo,.bf-page .bf-header .bf-logo:link,.bf-page .bf-header .bf-logo:visited,.bf-page .bf-header .bf-logo:hover,.bf-page .bf-header .bf-logo__text,.bf-page .bf-header .bf-menu a,.bf-page .bf-header .bf-menu a:link,.bf-page .bf-header .bf-menu a:visited,.bf-page .bf-header .bf-menu a:hover,.bf-page .bf-header .bf-phone,.bf-page .bf-header .bf-phone:link,.bf-page .bf-header .bf-phone:visited,.bf-page .bf-header .bf-phone:hover,.bf-page .bf-mobile-menu__nav a,.bf-page .bf-mobile-menu__nav a:link,.bf-page .bf-mobile-menu__nav a:visited,.bf-page .bf-mobile-menu__nav a:hover{color:#2e2e39!important}" +
      ".bf-page .bf-header .bf-catalog-button,.bf-page .bf-header .bf-catalog-button:link,.bf-page .bf-header .bf-catalog-button:visited,.bf-page .bf-header .bf-catalog-button:hover,.bf-page .bf-header .bf-catalog-button *,.bf-page .bf-logo__mark{color:#fff!important}" +
      ".bf-page .bf-button:not(.bf-button_light),.bf-page .bf-button:not(.bf-button_light):link,.bf-page .bf-button:not(.bf-button_light):visited,.bf-page .bf-button:not(.bf-button_light):hover{color:#fff!important}" +
      ".bf-page .bf-button_light,.bf-page .bf-button_light:link,.bf-page .bf-button_light:visited,.bf-page .bf-button_light:hover{color:#2e2e39!important}" +
      ".bf-page .bf-newsletter__form button{color:#6dac4a!important}" +
      ".bf-page .bf-footer a:not(.bf-button),.bf-page .bf-footer a:not(.bf-button):link,.bf-page .bf-footer a:not(.bf-button):visited{color:rgba(255,255,255,.78)!important}" +
      ".bf-page .bf-footer a:not(.bf-button):hover,.bf-page .bf-footer h3,.bf-page .bf-footer .bf-logo__text{color:#fff!important}" +
      ".bf-page .bf-footer .bf-button,.bf-page .bf-footer .bf-button:link,.bf-page .bf-footer .bf-button:visited,.bf-page .bf-footer .bf-button:hover{color:#fff!important}" +
      ".bf-tilda-product-page .bf-tilda-product-breadcrumb__link,.bf-tilda-product-page .bf-tilda-product-breadcrumb__link:link,.bf-tilda-product-page .bf-tilda-product-breadcrumb__link:visited,.bf-tilda-product-page .bf-tilda-product-breadcrumb__link:hover,.bf-tilda-product-page .bf-tilda-product-breadcrumb a,.bf-tilda-product-page .bf-tilda-product-breadcrumb a:link,.bf-tilda-product-page .bf-tilda-product-breadcrumb a:visited,.bf-tilda-product-page .bf-tilda-product-breadcrumb a:hover{color:#6dac4a!important;text-decoration:none!important}" +
      ".bf-tilda-product-page .bf-tilda-product-breadcrumb__separator{color:rgba(46,46,57,.38)!important}" +
      ".bf-tilda-product-page .bf-tilda-product-breadcrumb__current{color:rgba(46,46,57,.62)!important}";
    document.head.appendChild(style);
  }

  function ensureLoaderStyles() {
    if (document.getElementById("brokolisfarm-loader-critical-css")) return;
    var style = document.createElement("style");
    style.id = "brokolisfarm-loader-critical-css";
    style.textContent =
      ".bf-loader-screen{align-items:center;background:#fff;color:#2e2e39;display:flex;font-family:Ubuntu,Arial,sans-serif;justify-content:center;min-height:320px;padding:64px 20px}" +
      ".bf-loader-card{align-items:center;display:grid;gap:16px;justify-items:center;max-width:360px;width:100%}" +
      ".bf-loader-logo{align-items:center;background:#6dac4a;border-radius:12px;box-shadow:0 16px 36px rgba(109,172,74,.24);color:#fff;display:inline-flex;font-family:Comfortaa,Ubuntu,Arial,sans-serif;font-size:34px;font-weight:600;height:68px;justify-content:center;width:68px;animation:bfLoaderBlink 1s ease-in-out infinite}" +
      ".bf-loader-label{font-size:14px;font-weight:500;letter-spacing:0;text-align:center}" +
      ".bf-loader-track{background:#ececec;border-radius:999px;height:8px;overflow:hidden;width:100%}" +
      ".bf-loader-bar{background:#6dac4a;border-radius:999px;display:block;height:100%;transition:width .18s ease;width:0}" +
      ".bf-loader-percent{color:#6dac4a;font-family:Comfortaa,Ubuntu,Arial,sans-serif;font-size:13px;font-weight:600}" +
      "@keyframes bfLoaderBlink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.42;transform:scale(.94)}}";
    document.head.appendChild(style);
  }

  function ensureFonts() {
    if (!document.getElementById("bf-fonts-preconnect")) {
      var preconnect = document.createElement("link");
      preconnect.id = "bf-fonts-preconnect";
      preconnect.rel = "preconnect";
      preconnect.href = "https://fonts.gstatic.com";
      preconnect.crossOrigin = "";
      document.head.appendChild(preconnect);
    }
    ensureStylesheet(
      "https://fonts.googleapis.com/css2?family=Comfortaa:wght@600&family=Ubuntu:wght@300;400;500;700&display=swap",
      "bf-fonts"
    );
  }

  function normalizePath(pathname) {
    var path = String(pathname || "/").replace(/\/+/g, "/");
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
    return path;
  }

  function pageFromUrl(mount) {
    var mountPage = mount && (mount.getAttribute("data-bf-page") || mount.getAttribute("data-bf-loader-page"));
    if (mountPage) return mountPage;
    var params = new URLSearchParams(window.location.search || "");
    var explicit = config.page || params.get("bf_page") || params.get("page");
    if (explicit) return explicit;
    var path = normalizePath(window.location.pathname);
    if (path === "/loader.html" || path === "/loader-preview.html") return "home";
    var map = Object.assign({}, PAGE_BY_PATH, config.routes || {});
    return map[path] || "not-found";
  }

  function isTildaProductPage() {
    return normalizePath(window.location.pathname).indexOf("/tproduct/") === 0 ||
      !!document.querySelector(".t-store__product-snippet, .js-store-product");
  }

  function getMount() {
    var selector = config.mountSelector || "[data-bf-page], [data-bf-loader-root]";
    var mount = document.querySelector(selector);
    if (mount) return mount;
    if (isTildaProductPage() && config.autoMount !== true) return null;
    if (config.autoMount === false) return null;

    mount = document.createElement("div");
    mount.setAttribute("data-bf-loader-root", "");
    var allrecords = document.getElementById("allrecords");
    var cartRecord = allrecords && allrecords.querySelector(".t706") && allrecords.querySelector(".t706").closest(".r");
    if (cartRecord && cartRecord.parentNode) {
      cartRecord.parentNode.insertBefore(mount, cartRecord);
    } else {
      (allrecords || document.body).appendChild(mount);
    }
    return mount;
  }

  function pageUrl(baseUrl, page) {
    var file = (config.pagesPath || "pages/") + page + ".html";
    return withVersion(baseUrl + file);
  }

  function setLoading(mount) {
    ensureLoaderStyles();
    mount.innerHTML =
      '<div class="bf-loader-screen" role="status" aria-live="polite">' +
        '<div class="bf-loader-card">' +
          '<span class="bf-loader-logo" aria-hidden="true">B</span>' +
          '<span class="bf-loader-label">Ielādējam BrokolisFarm</span>' +
          '<span class="bf-loader-track" aria-hidden="true"><span class="bf-loader-bar" data-bf-loader-bar></span></span>' +
          '<span class="bf-loader-percent" data-bf-loader-percent>0%</span>' +
        "</div>" +
      "</div>";
    return startLoadingProgress(mount);
  }

  function startLoadingProgress(mount) {
    var value = 0;
    var bar = mount.querySelector("[data-bf-loader-bar]");
    var percent = mount.querySelector("[data-bf-loader-percent]");

    function setProgress(nextValue) {
      value = Math.max(0, Math.min(100, Math.round(nextValue)));
      if (bar) bar.style.width = value + "%";
      if (percent) percent.textContent = value + "%";
    }

    setProgress(0);
    var timer = window.setInterval(function () {
      var step = value < 48 ? 7 : value < 78 ? 4 : 1;
      setProgress(Math.min(94, value + step));
    }, 130);

    return {
      stop: function () {
        window.clearInterval(timer);
      },
      complete: function () {
        window.clearInterval(timer);
        setProgress(100);
        return new Promise(function (resolve) {
          window.setTimeout(resolve, 220);
        });
      }
    };
  }

  function setError(mount) {
    mount.innerHTML = '<div class="bf-page"><div class="bf-shell"><div class="bf-loader-status bf-loader-status_error">Neizdevās ielādēt lapu.</div></div></div>';
  }

  function fetchText(url) {
    return fetch(url, { credentials: config.credentials || "omit" }).then(function (response) {
      if (!response.ok) throw new Error("Request failed: " + response.status);
      return response.text();
    });
  }

  function bootApp() {
    if (window.BrokolisFarmTilda && typeof window.BrokolisFarmTilda.boot === "function") {
      window.BrokolisFarmTilda.boot();
    }
  }

  function renderPage(baseUrl, page, mount) {
    var progress = setLoading(mount);
    return fetchText(pageUrl(baseUrl, page))
      .catch(function (error) {
        if (page === "not-found") throw error;
        return fetchText(pageUrl(baseUrl, "not-found"));
      })
      .then(function (html) {
        return progress.complete().then(function () {
          mount.innerHTML = html;
          mount.setAttribute("data-bf-loaded-page", page);
          bootApp();
          window.dispatchEvent(new CustomEvent("brokolisfarm:page-loaded", { detail: { page: page } }));
        });
      })
      .catch(function (error) {
        console.error(error);
        progress.stop();
        setError(mount);
      });
  }

  function bindClientNavigation(baseUrl, mount) {
    if (config.clientNavigation !== true || document.documentElement.getAttribute("data-bf-loader-nav-bound") === "true") return;
    document.documentElement.setAttribute("data-bf-loader-nav-bound", "true");
    document.addEventListener("click", function (event) {
      var link = event.target.closest("a[href]");
      if (!link || link.target || link.hasAttribute("download") || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.hash && url.pathname === window.location.pathname) return;
      var page = (Object.assign({}, PAGE_BY_PATH, config.routes || {}))[normalizePath(url.pathname)];
      if (!page) return;
      event.preventDefault();
      history.pushState({ bfPage: page }, "", url.pathname + url.search + url.hash);
      renderPage(baseUrl, page, mount);
      window.scrollTo({ top: 0, behavior: "auto" });
    });
    window.addEventListener("popstate", function () {
      renderPage(baseUrl, pageFromUrl(mount), mount);
    });
  }

  function start() {
    var baseUrl = pinJsdelivrBaseUrl(getScriptBaseUrl());
    var mount = getMount();
    var productPage = !mount && isTildaProductPage();
    if (!mount && !productPage) return;
    ensureFonts();
    ensureStylesheet(baseUrl + "brokolisfarm.css", "brokolisfarm-global-css");
    ensureColorOverrides();
    Promise.resolve()
      .then(function () {
        return loadScript(baseUrl + "brokolisfarm-templates.js", "brokolisfarm-templates-js");
      })
      .then(function () {
        return loadScript(baseUrl + "brokolisfarm-app.js", "brokolisfarm-app-js");
      })
      .then(function () {
        if (!mount) {
          bootApp();
          window.dispatchEvent(new CustomEvent("brokolisfarm:product-page-ready"));
          return null;
        }
        bindClientNavigation(baseUrl, mount);
        return renderPage(baseUrl, pageFromUrl(mount), mount);
      })
      .catch(function (error) {
        console.error(error);
        if (mount) setError(mount);
      });
  }

  ready(start);
})();
