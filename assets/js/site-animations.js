(function () {
  if (window.__siteAnimationsInit) return;
  window.__siteAnimationsInit = true;

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var minLoadTime = prefersReduced ? 0 : 900;
  var loadStart = Date.now();
  var progress = 0;
  var progressTimer;

  function hasRevealClass(el) {
    return el.classList.contains("site-reveal") || el.classList.contains("home-reveal");
  }

  function markReveal(el, type, onLoad, stagger) {
    if (!el || hasRevealClass(el)) return;
    el.classList.add("site-reveal", "site-reveal--" + type);
    if (onLoad) el.classList.add("site-reveal--on-load");
    if (stagger) el.classList.add("site-reveal--stagger");
  }

  function ensurePreloader() {
    var preloader = document.getElementById("page-preloader");
    if (preloader) return preloader;

    preloader = document.createElement("div");
    preloader.id = "page-preloader";
    preloader.className = "page-preloader";
    preloader.setAttribute("role", "status");
    preloader.setAttribute("aria-live", "polite");
    preloader.setAttribute("aria-label", "جاري تحميل الصفحة");
    preloader.innerHTML =
      '<div class="page-preloader__inner">' +
      '<div class="page-preloader__logo-wrap">' +
      '<img src="assets/images/logo.png" alt="" class="page-preloader__logo" width="64" height="64" />' +
      "</div>" +
      '<p class="page-preloader__title">مصري بالخارج</p>' +
      '<div class="page-preloader__track" aria-hidden="true">' +
      '<span class="page-preloader__bar" data-preloader-progress style="width: 0%"></span>' +
      "</div>" +
      "</div>";

    document.body.prepend(preloader);
    return preloader;
  }

  function autoApplyReveals() {
    document.querySelectorAll(".faq-hero__inner").forEach(function (el) {
      markReveal(el, "fade-up", true, false);
    });

    document.querySelectorAll(".landing-panel__inner > *").forEach(function (el) {
      markReveal(el, "fade-up", true, true);
    });

    document.querySelectorAll(".branding-panel__content, .branding-panel__tagline").forEach(function (el) {
      markReveal(el, "fade-left", true, false);
    });

    document.querySelectorAll(".selection-panel .page-heading, .search-box").forEach(function (el) {
      markReveal(el, "fade-up", true, false);
    });

    [
      ".faq-search",
      ".faq-item",
      ".rt-card",
      ".rt-past-card",
      ".rt-empty-state",
      ".fm-card",
      ".news-card",
      ".news-filters",
      ".news-details__article",
      ".news-details__sidebar",
      ".news-details__related-item",
      ".notifications-filters",
      ".notification-item",
      ".complaints-card",
      ".er-card",
      ".er-showcase__step",
      ".afm-card",
      ".afm-showcase",
      ".sm-card",
      ".sm-follow",
      ".wh-panel",
      ".option-link",
      ".services__header",
      ".app-promo__content",
      ".location__content",
      ".site-footer__column",
    ].forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        markReveal(el, "fade-up", false, true);
      });
    });

    document.querySelectorAll(".app-promo__visual, .location__map, .hero__visual").forEach(function (el) {
      markReveal(el, "fade-right", false, false);
    });

    document.querySelectorAll(".chat-fab").forEach(function (el) {
      markReveal(el, "scale", true, false);
    });

    applyStaggerDelays();
  }

  function applyStaggerDelays() {
    var staggerParents =
      ".services__grid, .faq-grid, .news-grid, .sm-grid, .options-grid, .site-footer__inner, .hero__features, .notifications-list, .rt-grid, .rt-past-grid, .fm-grid, .landing-panel__inner, .er-showcase__steps";

    document.querySelectorAll(staggerParents).forEach(function (parent) {
      var items = parent.querySelectorAll(":scope > .site-reveal--stagger, :scope > .home-reveal--stagger");
      items.forEach(function (el, index) {
        el.style.setProperty("--reveal-delay", index * 70 + "ms");
      });
    });
  }

  var preloader = ensurePreloader();
  var progressEl = preloader.querySelector("[data-preloader-progress]");

  function setProgress(value) {
    progress = Math.min(100, value);
    if (progressEl) progressEl.style.width = progress + "%";
  }

  function simulateProgress() {
    if (progress >= 92) return;
    var step = progress < 50 ? 8 + Math.random() * 12 : 2 + Math.random() * 5;
    setProgress(progress + step);
    progressTimer = window.setTimeout(simulateProgress, 120 + Math.random() * 180);
  }

  function revealOnLoadItems() {
    var items = document.querySelectorAll(".site-reveal--on-load, .home-reveal--on-load");
    items.forEach(function (el, index) {
      window.setTimeout(function () {
        el.classList.add("is-revealed");
      }, prefersReduced ? 0 : index * 90);
    });
  }

  function initScrollReveal() {
    var reveals = document.querySelectorAll(
      ".site-reveal:not(.site-reveal--on-load), .home-reveal:not(.home-reveal--on-load)"
    );

    if (prefersReduced || !("IntersectionObserver" in window)) {
      reveals.forEach(function (el) {
        el.classList.add("is-revealed");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  function hidePreloader() {
    setProgress(100);
    preloader.classList.add("is-done");

    window.setTimeout(function () {
      preloader.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
      revealOnLoadItems();
      initScrollReveal();

      window.setTimeout(function () {
        if (preloader.parentNode) preloader.remove();
      }, 600);
    }, prefersReduced ? 0 : 350);
  }

  function finishLoading() {
    if (progressTimer) window.clearTimeout(progressTimer);
    var elapsed = Date.now() - loadStart;
    var remaining = Math.max(0, minLoadTime - elapsed);
    window.setTimeout(hidePreloader, remaining);
  }

  function initHeaderScroll() {
    var header = document.querySelector(".site-header");
    if (!header || prefersReduced) return;

    var onScroll = function () {
      header.classList.toggle("site-header--scrolled", window.scrollY > 12);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  document.body.classList.add("is-loading");
  autoApplyReveals();

  if (!prefersReduced) {
    simulateProgress();
  } else {
    setProgress(100);
  }

  if (document.readyState === "complete") {
    finishLoading();
  } else {
    window.addEventListener("load", finishLoading);
  }

  initHeaderScroll();
})();
