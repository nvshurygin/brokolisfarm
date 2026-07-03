(function () {
  "use strict";

  var DEFAULT_API = "https://store.tildaapi.com/api/getproductslist/";
  var DEFAULT_CURRENCY = "€";
  var LOCAL_FALLBACK_DATA = {
    partuid: 420955341102,
    total: 3,
    products: [
      {
        uid: 300418820943,
        title: "Apples",
        sku: "SKU0001",
        price: null,
        priceold: "",
        descr: "This is a description of an item in a catalog",
        gallery: '[{"img":"https://static.tildacdn.com/tild3966-6464-4236-b564-373933653536/apple.jpg"},{"img":"https://static.tildacdn.com/tild3832-3235-4438-b330-623262306239/apple-1834639_1280.jpg"}]',
        json_options: '[{"title":"Color","values":["Green apples","Red apples"]}]',
        url: "https://brokolisfarm.lv/tproduct/300418820943-apples",
        pack_label: "lwh",
        pack_x: 0,
        pack_y: 0,
        pack_z: 0,
        pack_m: 0,
        partuids: "[736744883663]",
        editions: [
          { uid: 145589740743, sku: "SKU0001-1", price: "10.00", priceold: "", quantity: "", img: "https://static.tildacdn.com/tild3966-6464-4236-b564-373933653536/apple.jpg", Color: "Green apples" },
          { uid: 895892864073, sku: "SKU0001-2", price: "15.00", priceold: "", quantity: "", img: "https://static.tildacdn.com/tild3832-3235-4438-b330-623262306239/apple-1834639_1280.jpg", Color: "Red apples" }
        ],
        characteristics: []
      },
      {
        uid: 154713232383,
        title: "Pears",
        sku: "SKU0002",
        price: "20.0000",
        priceold: "",
        descr: "Catalog helps to manage your products in an easy way",
        gallery: '[{"img":"https://static.tildacdn.com/tild3266-6231-4736-b234-393763356663/pear-1620467_64022.jpg"}]',
        json_options: "",
        url: "https://brokolisfarm.lv/tproduct/154713232383-pears",
        pack_label: "lwh",
        pack_x: 0,
        pack_y: 0,
        pack_z: 0,
        pack_m: 0,
        partuids: "[736744883663]",
        editions: [
          { uid: 154713232383, price: "20.0000", priceold: "", sku: "SKU0002", quantity: "", img: "https://static.tildacdn.com/tild3266-6231-4736-b234-393763356663/pear-1620467_64022.jpg" }
        ],
        characteristics: []
      },
      {
        uid: 164450874793,
        title: "Bananas",
        sku: "SKU0003",
        price: "30.0000",
        priceold: "",
        descr: "Add some products to launch your store",
        gallery: '[{"img":"https://static.tildacdn.com/tild6561-3931-4238-a332-636431363338/banana.jpg"}]',
        json_options: "",
        url: "https://brokolisfarm.lv/tproduct/164450874793-bananas",
        pack_label: "lwh",
        pack_x: 0,
        pack_y: 0,
        pack_z: 0,
        pack_m: 0,
        partuids: "[736744883663]",
        editions: [
          { uid: 164450874793, price: "30.0000", priceold: "", sku: "SKU0003", quantity: "", img: "https://static.tildacdn.com/tild6561-3931-4238-a332-636431363338/banana.jpg" }
        ],
        characteristics: []
      }
    ],
    parts: [
      { uid: 420955341102, title: "", root: true, path: [""] },
      { uid: 736744883663, title: "FRUITS", root: false, path: ["FRUITS"] }
    ],
    options: []
  };

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function renderCommonChrome() {
    var templates = window.BrokolisFarmTemplates || {};
    if (templates.header) {
      toArray(document.querySelectorAll("[data-bf-header]")).forEach(function (mount) {
        if (!mount.getAttribute("data-bf-rendered")) {
          mount.innerHTML = templates.header;
          mount.setAttribute("data-bf-rendered", "true");
        }
      });
    }
    if (templates.footer) {
      toArray(document.querySelectorAll("[data-bf-footer]")).forEach(function (mount) {
        if (!mount.getAttribute("data-bf-rendered")) {
          mount.innerHTML = templates.footer;
          mount.setAttribute("data-bf-rendered", "true");
        }
      });
    }
  }

  function isMobileMenuViewport() {
    return !window.matchMedia || window.matchMedia("(max-width: 960px)").matches;
  }

  function openMobileMenu(menu, toggle) {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    document.body.classList.add("bf-mobile-menu-open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
  }

  function closeMobileMenu(menu, toggle) {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("bf-mobile-menu-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function bindMobileMenu() {
    toArray(document.querySelectorAll("[data-bf-mobile-menu]")).forEach(function (menu) {
      if (menu.getAttribute("data-bf-menu-bound") === "true") return;
      var toggle = document.querySelector('[data-bf-menu-toggle][aria-controls="' + menu.id + '"]');
      if (!toggle) return;
      menu.setAttribute("data-bf-menu-bound", "true");

      toggle.addEventListener("click", function (event) {
        if (!isMobileMenuViewport()) return;
        event.preventDefault();
        if (menu.classList.contains("is-open")) {
          closeMobileMenu(menu, toggle);
        } else {
          openMobileMenu(menu, toggle);
        }
      });

      toArray(menu.querySelectorAll("[data-bf-menu-close]")).forEach(function (closeButton) {
        closeButton.addEventListener("click", function () {
          closeMobileMenu(menu, toggle);
        });
      });

      toArray(menu.querySelectorAll("a")).forEach(function (link) {
        link.addEventListener("click", function () {
          closeMobileMenu(menu, toggle);
        });
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && menu.classList.contains("is-open")) {
          closeMobileMenu(menu, toggle);
        }
      });

      if (window.matchMedia) {
        var media = window.matchMedia("(max-width: 960px)");
        var onChange = function (event) {
          if (!event.matches) closeMobileMenu(menu, toggle);
        };
        if (media.addEventListener) {
          media.addEventListener("change", onChange);
        } else if (media.addListener) {
          media.addListener(onChange);
        }
      }
    });
  }

  function updateStickyHeaderState() {
    var isScrolled = (window.pageYOffset || document.documentElement.scrollTop || 0) > 6;
    toArray(document.querySelectorAll(".bf-header")).forEach(function (header) {
      header.classList.toggle("is-scrolled", isScrolled);
    });
  }

  function bindStickyHeader() {
    if (document.documentElement.getAttribute("data-bf-sticky-header-bound") !== "true") {
      document.documentElement.setAttribute("data-bf-sticky-header-bound", "true");
      window.addEventListener("scroll", updateStickyHeaderState, { passive: true });
      window.addEventListener("resize", updateStickyHeaderState);
    }
    updateStickyHeaderState();
  }

  function getStoredCartTotal() {
    if (window.tcart && typeof window.tcart.total !== "undefined") {
      return Number(window.tcart.total) || 0;
    }
    if (typeof localStorage === "undefined") return 0;
    try {
      var stored = JSON.parse(localStorage.getItem("tcart") || "{}");
      if (typeof stored.total !== "undefined") return Number(stored.total) || 0;
      if (!Array.isArray(stored.products)) return 0;
      return stored.products.reduce(function (total, product) {
        if (!product || product.deleted === "yes") return total;
        if (product.single === "y") return total + 1;
        return total + (Number(product.quantity) || 0);
      }, 0);
    } catch (error) {
      return 0;
    }
  }

  function syncCustomCartCounter() {
    var total = getStoredCartTotal();
    toArray(document.querySelectorAll("[data-bf-cart-count]")).forEach(function (counter) {
      counter.textContent = total > 0 ? String(total) : "";
    });
  }

  function patchTildaCartRedraw() {
    if (typeof window.tcart__reDrawCartIcon !== "function" || window.tcart__reDrawCartIcon.bfWrapped) {
      return;
    }
    var redraw = window.tcart__reDrawCartIcon;
    window.tcart__reDrawCartIcon = function () {
      var result = redraw.apply(this, arguments);
      syncCustomCartCounter();
      return result;
    };
    window.tcart__reDrawCartIcon.bfWrapped = true;
  }

  function bindCartBridge() {
    if (document.documentElement.getAttribute("data-bf-cart-bridge-bound") !== "true") {
      document.documentElement.setAttribute("data-bf-cart-bridge-bound", "true");
      document.addEventListener("click", function (event) {
        var opener = event.target.closest("[data-bf-cart-open]");
        if (!opener || typeof window.tcart__openCart !== "function") return;
        event.preventDefault();
        event.stopPropagation();
        window.tcart__openCart();
        syncCustomCartCounter();
      }, true);
      document.addEventListener("click", function (event) {
        if (typeof window.tcart__addProduct !== "function" || !event.target.closest('[href^="#order"], .t706__product-plus, .t706__product-minus, .t706__product-del')) return;
        setTimeout(syncCustomCartCounter, 250);
        setTimeout(syncCustomCartCounter, 900);
      });
      window.addEventListener("storage", function (event) {
        if (!event || event.key === "tcart") syncCustomCartCounter();
      });
    }

    patchTildaCartRedraw();
    syncCustomCartCounter();
    [100, 500, 1200, 2500].forEach(function (delay) {
      setTimeout(function () {
        patchTildaCartRedraw();
        syncCustomCartCounter();
      }, delay);
    });
  }

  function toArray(value) {
    return Array.prototype.slice.call(value || []);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function parseJson(value, fallback) {
    if (!value) return fallback;
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  function normalizePrice(value) {
    if (value == null || value === "") return "";
    var number = Number(String(value).replace(",", "."));
    if (!Number.isFinite(number)) return "";
    return number.toFixed(number % 1 === 0 ? 0 : 2);
  }

  function money(value, currency) {
    var price = normalizePrice(value);
    return price ? currency + price : "";
  }

  function getGallery(product) {
    var gallery = parseJson(product.gallery, []);
    return Array.isArray(gallery) ? gallery : [];
  }

  function getProductImage(product, edition) {
    if (edition && edition.img) return edition.img;
    var gallery = getGallery(product);
    return gallery[0] && gallery[0].img ? gallery[0].img : "";
  }

  function getPartUids(product) {
    var value = parseJson(product.partuids, []);
    return Array.isArray(value) ? value : [];
  }

  function isAvailable(edition) {
    return !edition || edition.quantity === "" || edition.quantity == null || Number(edition.quantity) > 0;
  }

  function firstAvailableEdition(product) {
    var editions = Array.isArray(product.editions) ? product.editions : [];
    return editions.find(isAvailable) || editions[0] || {
      uid: product.uid,
      price: product.price,
      priceold: product.priceold,
      sku: product.sku,
      quantity: product.quantity,
      img: getProductImage(product)
    };
  }

  function getEditionOptions(product) {
    var options = parseJson(product.json_options, []);
    if (!Array.isArray(options) || options.length === 0) {
      var editions = Array.isArray(product.editions) ? product.editions : [];
      var ignored = {
        uid: true,
        externalid: true,
        sku: true,
        price: true,
        priceold: true,
        quantity: true,
        img: true
      };
      var names = [];
      editions.forEach(function (edition) {
        Object.keys(edition || {}).forEach(function (key) {
          if (!ignored[key] && names.indexOf(key) === -1) names.push(key);
        });
      });
      return names.map(function (name) {
        return {
          title: name,
          values: editions.map(function (edition) {
            return edition[name];
          }).filter(Boolean)
        };
      });
    }
    return options.map(function (option) {
      return {
        title: option.title,
        values: Array.isArray(option.values) ? option.values : []
      };
    });
  }

  function unique(values) {
    return values.filter(function (value, index) {
      return value && values.indexOf(value) === index;
    });
  }

  function findEditionBySelections(product, selections) {
    var editions = Array.isArray(product.editions) ? product.editions : [];
    return editions.find(function (edition) {
      return Object.keys(selections).every(function (name) {
        return !selections[name] || edition[name] === selections[name];
      });
    }) || firstAvailableEdition(product);
  }

  function buildApiUrl(root, slice) {
    var params = new URLSearchParams();
    params.set("storepartuid", root.getAttribute("data-storepartuid") || "");
    params.set("recid", root.getAttribute("data-recid") || "");
    params.set("c", String(Date.now()));
    params.set("getparts", "true");
    params.set("getoptions", "true");
    params.set("slice", String(slice || 1));
    params.set("size", root.getAttribute("data-products-size") || "36");
    params.set("flag_root", "withroot");
    return (root.getAttribute("data-api") || DEFAULT_API) + "?" + params.toString();
  }

  function requestJson(url) {
    return new Promise(function (resolve, reject) {
      if (typeof XMLHttpRequest !== "undefined") {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.timeout = 20000;
        xhr.onload = function () {
          if (xhr.status < 200 || xhr.status >= 300) {
            reject(new Error("Catalog request failed: " + xhr.status));
            return;
          }
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (error) {
            reject(error);
          }
        };
        xhr.onerror = function () {
          reject(new Error("Catalog request failed"));
        };
        xhr.ontimeout = function () {
          reject(new Error("Catalog request timed out"));
        };
        xhr.send();
        return;
      }

      if (typeof fetch === "function") {
        fetch(url, {
          method: "GET",
          credentials: "omit"
        })
          .then(function (response) {
            if (!response.ok) throw new Error("Catalog request failed: " + response.status);
            return response.json();
          })
          .then(resolve)
          .catch(reject);
        return;
      }

      reject(new Error("No request API is available"));
    });
  }

  function getLocalFallbackData() {
    var host = window.location && window.location.hostname;
    if (host === "127.0.0.1" || host === "localhost") {
      return LOCAL_FALLBACK_DATA;
    }
    return null;
  }

  function renderParts(root, data, state) {
    var mount = root.querySelector("[data-bf-parts]");
    if (!mount) return;
    var parts = Array.isArray(data.parts) ? data.parts.filter(function (part) {
      return !part.root && !part.hideonpublic;
    }) : [];
    if (!parts.length) {
      mount.hidden = true;
      mount.innerHTML = "";
      return;
    }
    var buttons = ['<button class="bf-store-part is-active" type="button" data-part="">Все</button>'];
    parts.forEach(function (part) {
      buttons.push(
        '<button class="bf-store-part" type="button" data-part="' + escapeHtml(String(part.uid)) + '">' +
          escapeHtml(part.title || part.path && part.path.join(" / ") || "Категория") +
          "</button>"
      );
    });
    mount.innerHTML = buttons.join("");
    mount.hidden = false;
    mount.onclick = function (event) {
      var button = event.target.closest("[data-part]");
      if (!button) return;
      state.activePartUid = button.getAttribute("data-part");
      toArray(mount.querySelectorAll(".bf-store-part")).forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });
      renderProducts(root, state.products, state);
    };
  }

  function productMatchesPart(product, partUid) {
    if (!partUid) return true;
    return getPartUids(product).map(String).indexOf(String(partUid)) !== -1;
  }

  function normalizeText(value) {
    return String(value || "").toLowerCase().trim();
  }

  function productMatchesQuery(product, query) {
    if (!query) return true;
    var haystack = [
      product.title,
      product.descr,
      product.text,
      product.sku
    ].map(normalizeText).join(" ");
    return haystack.indexOf(query) !== -1;
  }

  function productText(product) {
    var characteristics = Array.isArray(product.characteristics) ? product.characteristics : [];
    return [
      product.title,
      product.descr,
      product.text,
      product.sku,
      product.mark,
      product.badge,
      characteristics.map(function (item) {
        return [item.title, item.value, item.name].join(" ");
      }).join(" ")
    ].map(normalizeText).join(" ");
  }

  function productHasAnyWord(product, words) {
    var text = productText(product);
    return words.some(function (word) {
      return text.indexOf(word) !== -1;
    });
  }

  function productHasDiscount(product) {
    var edition = firstAvailableEdition(product);
    var price = normalizePrice(edition.price != null && edition.price !== "" ? edition.price : product.price);
    var oldPrice = normalizePrice(edition.priceold || product.priceold || "");
    if (!oldPrice) return false;
    if (!price) return true;
    return Number(oldPrice) > Number(price);
  }

  function productIsOffer(product) {
    return productHasDiscount(product) || productHasAnyWord(product, ["акц", "скид", "sale", "discount", "offer"]);
  }

  function productIsNew(product) {
    return productHasAnyWord(product, ["новин", "new", "fresh", "jaun"]);
  }

  function productsByMode(products, state) {
    var list = products || [];
    if (state.mode === "offers") {
      var offers = list.filter(productIsOffer);
      list = offers.length ? offers : list.slice(0, state.limit || 12);
    } else if (state.mode === "new") {
      var newest = list.filter(productIsNew);
      list = newest.length ? newest : list.slice(0, state.limit || 12);
    }
    if (state.limit && list.length > state.limit) {
      list = list.slice(0, state.limit);
    }
    return list;
  }

  function productPrice(product) {
    var edition = firstAvailableEdition(product);
    var price = edition.price != null && edition.price !== "" ? edition.price : product.price;
    var number = Number(String(price || "0").replace(",", "."));
    return Number.isFinite(number) ? number : 0;
  }

  function sortProducts(products, sort) {
    var list = products.slice();
    if (sort === "price:asc") {
      list.sort(function (a, b) {
        return productPrice(a) - productPrice(b);
      });
    } else if (sort === "price:desc") {
      list.sort(function (a, b) {
        return productPrice(b) - productPrice(a);
      });
    } else if (sort === "title:asc") {
      list.sort(function (a, b) {
        return String(a.title || "").localeCompare(String(b.title || ""));
      });
    } else if (sort === "title:desc") {
      list.sort(function (a, b) {
        return String(b.title || "").localeCompare(String(a.title || ""));
      });
    }
    return list;
  }

  function renderProducts(root, products, state) {
    var mount = root.querySelector("[data-bf-products]");
    if (!mount) return;
    var query = normalizeText(state.query);
    var visible = sortProducts(productsByMode(products, state).filter(function (product) {
      return productMatchesPart(product, state.activePartUid) && productMatchesQuery(product, query);
    }), state.sort);
    if (!visible.length) {
      mount.innerHTML = '<div class="bf-products__status">' + escapeHtml(state.emptyMessage || "Товары не найдены.") + "</div>";
      return;
    }
    mount.innerHTML = visible.map(function (product) {
      return productCardHtml(product, state.currency);
    }).join("");
    bindEditionControls(mount, state.currency);
  }

  function productCardHtml(product, currency) {
    var edition = firstAvailableEdition(product);
    var options = getEditionOptions(product);
    var image = getProductImage(product, edition);
    var price = edition.price != null && edition.price !== "" ? edition.price : product.price;
    var priceOld = edition.priceold || product.priceold || "";
    var soldOut = !isAvailable(edition);
    var partUids = getPartUids(product).join(",");
    var url = product.url || "#";
    var sku = edition.sku || product.sku || "";
    var optionHtml = options.map(function (option) {
      var selectedValue = edition[option.title] || option.values[0] || "";
      var values = unique(option.values);
      if (!values.length) return "";
      return (
        '<label class="bf-product__select js-product-edition-option" data-edition-option-id="' + escapeHtml(option.title) + '">' +
          '<span class="js-product-edition-option-name">' + escapeHtml(option.title) + "</span>" +
          '<select class="js-product-edition-option-variants">' +
            values.map(function (value) {
              var matched = findEditionBySelections(product, (function () {
                var obj = {};
                obj[option.title] = value;
                return obj;
              })());
              var selected = value === selectedValue ? " selected" : "";
              return '<option value="' + escapeHtml(value) + '" data-product-edition-variant-price="' + escapeHtml(normalizePrice(matched.price)) + '"' + selected + ">" + escapeHtml(value) + "</option>";
            }).join("") +
          "</select>" +
        "</label>"
      );
    }).join("");

    return (
      '<article class="bf-product js-product t-item' + (soldOut ? " is-soldout" : "") + '"' +
        ' data-product-lid="' + escapeHtml(edition.uid || product.uid) + '"' +
        ' data-product-uid="' + escapeHtml(edition.uid || product.uid) + '"' +
        ' data-product-gen-uid="' + escapeHtml(product.uid) + '"' +
        ' data-product-url="' + escapeHtml(url) + '"' +
        ' data-product-img="' + escapeHtml(image) + '"' +
        ' data-product-inv="' + escapeHtml(edition.quantity || "") + '"' +
        ' data-product-pack-label="' + escapeHtml(product.pack_label || "") + '"' +
        ' data-product-pack-m="' + escapeHtml(product.pack_m || "") + '"' +
        ' data-product-pack-x="' + escapeHtml(product.pack_x || "") + '"' +
        ' data-product-pack-y="' + escapeHtml(product.pack_y || "") + '"' +
        ' data-product-pack-z="' + escapeHtml(product.pack_z || "") + '"' +
        ' data-product-part-uid="' + escapeHtml(partUids) + '"' +
        ' data-bf-product="' + escapeHtml(JSON.stringify(product)) + '"' +
      ">" +
        '<a class="bf-product__image-link js-product-link" href="' + escapeHtml(url) + '">' +
          '<img class="bf-product__image js-product-img" src="' + escapeHtml(image) + '" data-original="' + escapeHtml(image) + '" alt="' + escapeHtml(product.title) + '" />' +
        "</a>" +
        '<span class="bf-product__badge" aria-hidden="true">+</span>' +
        '<div class="bf-product__body">' +
          '<h3 class="bf-product__title js-product-name">' + escapeHtml(product.title) + "</h3>" +
          '<div class="bf-product__price-row">' +
            '<span class="bf-product__price js-product-price" data-product-price-def="' + escapeHtml(normalizePrice(price)) + '" data-product-price-def-str="' + escapeHtml(normalizePrice(price)) + '">' + escapeHtml(money(price, currency)) + "</span>" +
            (priceOld ? '<span class="bf-product__price-old js-store-prod-price-old-val">' + escapeHtml(money(priceOld, currency)) + "</span>" : "") +
          "</div>" +
          (sku ? '<span class="bf-product__sku js-store-prod-sku" hidden>' + escapeHtml(sku) + "</span>" : "") +
          '<div class="bf-product__options js-product-controls-wrapper">' + optionHtml + "</div>" +
          '<div class="bf-product__actions">' +
            '<a class="bf-product__details" href="' + escapeHtml(url) + '">Подробнее</a>' +
            '<a class="bf-product__cart" href="#order" aria-label="Добавить в корзину">' + (soldOut ? "×" : "+") + "</a>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function bindEditionControls(mount, currency) {
    toArray(mount.querySelectorAll(".bf-product")).forEach(function (card) {
      var data = card.getAttribute("data-bf-product");
      var product = parseJson(data, null);
      if (!product) return;
      toArray(card.querySelectorAll(".js-product-edition-option-variants")).forEach(function (select) {
        select.addEventListener("change", function () {
          var selections = {};
          toArray(card.querySelectorAll(".js-product-edition-option")).forEach(function (optionEl) {
            var name = optionEl.getAttribute("data-edition-option-id");
            var value = optionEl.querySelector("select").value;
            selections[name] = value;
          });
          updateCardEdition(card, product, findEditionBySelections(product, selections), currency);
        });
      });
    });
  }

  function updateCardEdition(card, product, edition, currency) {
    var image = getProductImage(product, edition);
    var price = edition.price != null && edition.price !== "" ? edition.price : product.price;
    var priceEl = card.querySelector(".js-product-price");
    var imgEl = card.querySelector(".js-product-img");
    var skuEl = card.querySelector(".js-store-prod-sku");
    card.setAttribute("data-product-lid", edition.uid || product.uid);
    card.setAttribute("data-product-uid", edition.uid || product.uid);
    card.setAttribute("data-product-img", image);
    card.setAttribute("data-product-inv", edition.quantity || "");
    card.classList.toggle("is-soldout", !isAvailable(edition));
    if (imgEl) {
      imgEl.src = image;
      imgEl.setAttribute("data-original", image);
    }
    if (priceEl) {
      priceEl.textContent = money(price, currency);
      priceEl.setAttribute("data-product-price-def", normalizePrice(price));
      priceEl.setAttribute("data-product-price-def-str", normalizePrice(price));
    }
    if (skuEl) {
      skuEl.textContent = edition.sku || product.sku || "";
    }
  }

  function bindCategoryShortcuts(root, state) {
    toArray(root.querySelectorAll("[data-bf-category]")).forEach(function (link) {
      link.addEventListener("click", function () {
        var name = link.getAttribute("data-bf-category").toLowerCase();
        var part = state.parts.find(function (item) {
          return String(item.title || "").toLowerCase() === name;
        });
        if (part) {
          state.activePartUid = String(part.uid);
          renderProducts(root, state.products, state);
        }
      });
    });
  }

  function bindLocalDemoCart(root) {
    root.addEventListener("click", function (event) {
      var trigger = event.target.closest('.bf-product__cart[href="#order"]');
      if (!trigger || typeof window.tcart__addProduct === "function") return;
      event.preventDefault();
      var count = root.querySelector("[data-bf-cart-count]");
      var current = Number(count && count.textContent || 0) + 1;
      if (count) {
        count.textContent = String(current);
      }
    });
  }

  function bindCatalogControls(root, state) {
    var search = root.querySelector("[data-bf-search]");
    var sort = root.querySelector("[data-bf-sort]");
    if (search) {
      search.addEventListener("input", function () {
        state.query = search.value;
        renderProducts(root, state.products, state);
      });
    }
    if (sort) {
      sort.addEventListener("change", function () {
        state.sort = sort.value;
        renderProducts(root, state.products, state);
      });
    }
  }

  function applyCatalogData(root, state, data, append) {
    var products = Array.isArray(data.products) ? data.products : [];
    state.parts = Array.isArray(data.parts) ? data.parts : [];
    state.products = append ? state.products.concat(products) : products;
    state.nextSlice = data.nextslice || "";
    renderParts(root, data, state);
    bindCategoryShortcuts(root, state);
    renderProducts(root, state.products, state);
    var more = root.querySelector("[data-bf-load-more]");
    if (more) more.hidden = !state.nextSlice;
  }

  function load(root, state, append) {
    var mount = root.querySelector("[data-bf-products]");
    if (!append && mount) {
      mount.innerHTML = '<div class="bf-products__status">Загружаем товары...</div>';
    }
    requestJson(buildApiUrl(root, state.slice))
      .then(function (data) {
        applyCatalogData(root, state, data, append);
      })
      .catch(function (error) {
        var fallback = getLocalFallbackData();
        if (fallback) {
          applyCatalogData(root, state, fallback, false);
          return;
        }
        if (mount) {
          mount.innerHTML = '<div class="bf-products__error">Не удалось загрузить товары. Проверьте API каталога Tilda.</div>';
        }
        console.error(error);
      });
  }

  function init(root) {
    if (root.getAttribute("data-bf-initialized") === "true") return;
    root.setAttribute("data-bf-initialized", "true");
    var state = {
      activePartUid: "",
      currency: root.getAttribute("data-currency") || DEFAULT_CURRENCY,
      nextSlice: "",
      emptyMessage: root.getAttribute("data-bf-empty-message") || "",
      limit: Number(root.getAttribute("data-products-limit") || 0),
      mode: root.getAttribute("data-bf-product-mode") || "",
      parts: [],
      products: [],
      query: "",
      sort: "",
      slice: 1
    };
    var more = root.querySelector("[data-bf-load-more]");
    if (more) {
      more.addEventListener("click", function () {
        if (!state.nextSlice) return;
        state.slice = state.nextSlice;
        load(root, state, true);
      });
    }
    bindLocalDemoCart(root);
    bindCatalogControls(root, state);
    if (root.querySelector("[data-bf-products]")) {
      load(root, state, false);
    }
  }

  function initAll() {
    toArray(document.querySelectorAll("[data-bf-app]")).forEach(init);
  }

  function boot() {
    renderCommonChrome();
    bindStickyHeader();
    bindMobileMenu();
    bindCartBridge();
    initAll();
  }

  ready(boot);
  window.addEventListener("brokolisfarm:block-ready", boot);
  window.BrokolisFarmTilda = {
    boot: boot,
    initAll: initAll
  };
})();
