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

  function normalizeBaseUrl(url) {
    return String(url || "").replace(/\/?$/, "/");
  }

  function withVersion(url) {
    if (!config.version) return url;
    return url + (url.indexOf("?") === -1 ? "?" : "&") + "v=" + encodeURIComponent(config.version);
  }

  function loadScript(src, id) {
    return new Promise(function (resolve, reject) {
      if (id && document.getElementById(id)) {
        resolve();
        return;
      }
      var node = document.createElement("script");
      if (id) node.id = id;
      node.src = withVersion(src);
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
    if (id && document.getElementById(id)) return;
    var link = document.createElement("link");
    if (id) link.id = id;
    link.rel = "stylesheet";
    link.href = withVersion(href);
    document.head.appendChild(link);
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

  function getMount() {
    var selector = config.mountSelector || "[data-bf-page], [data-bf-loader-root]";
    var mount = document.querySelector(selector);
    if (mount) return mount;
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
    mount.innerHTML = '<div class="bf-page"><div class="bf-shell"><div class="bf-loader-status">Загружаем страницу...</div></div></div>';
  }

  function setError(mount) {
    mount.innerHTML = '<div class="bf-page"><div class="bf-shell"><div class="bf-loader-status bf-loader-status_error">Не удалось загрузить страницу.</div></div></div>';
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
    setLoading(mount);
    return fetchText(pageUrl(baseUrl, page))
      .catch(function (error) {
        if (page === "not-found") throw error;
        return fetchText(pageUrl(baseUrl, "not-found"));
      })
      .then(function (html) {
        mount.innerHTML = html;
        mount.setAttribute("data-bf-loaded-page", page);
        bootApp();
        window.dispatchEvent(new CustomEvent("brokolisfarm:page-loaded", { detail: { page: page } }));
      })
      .catch(function (error) {
        console.error(error);
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
    var baseUrl = getScriptBaseUrl();
    var mount = getMount();
    if (!mount) return;
    ensureFonts();
    ensureStylesheet(baseUrl + "brokolisfarm.css", "brokolisfarm-global-css");
    Promise.resolve()
      .then(function () {
        return loadScript(baseUrl + "brokolisfarm-templates.js", "brokolisfarm-templates-js");
      })
      .then(function () {
        return loadScript(baseUrl + "brokolisfarm-app.js", "brokolisfarm-app-js");
      })
      .then(function () {
        bindClientNavigation(baseUrl, mount);
        return renderPage(baseUrl, pageFromUrl(mount), mount);
      })
      .catch(function (error) {
        console.error(error);
        setError(mount);
      });
  }

  ready(start);
})();
