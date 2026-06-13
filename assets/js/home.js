(function () {
  var openDropdown = null;
  var menuToggle = document.querySelector("[data-sidebar-toggle]");
  var sidebarOverlay = document.querySelector("[data-sidebar-overlay]");
  var sidebarClose = document.querySelectorAll("[data-sidebar-close]");
  var siteNav = document.getElementById("site-nav");

  function openSidebar() {
    document.body.classList.add("site-sidebar-open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
    if (sidebarOverlay) sidebarOverlay.hidden = false;
    closeAllDropdowns();
  }

  function closeSidebar() {
    document.body.classList.remove("site-sidebar-open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    if (sidebarOverlay) sidebarOverlay.hidden = true;
    closeAllDropdowns();
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      if (document.body.classList.contains("site-sidebar-open")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
  }

  if (sidebarClose.length) {
    sidebarClose.forEach(function (btn) {
      btn.addEventListener("click", closeSidebar);
    });
  }

  if (siteNav) {
    siteNav.querySelectorAll(".site-nav__link, .header-dropdown__link").forEach(function (link) {
      link.addEventListener("click", closeSidebar);
    });
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024) closeSidebar();
  });

  function closeDropdown(dropdown) {
    if (!dropdown) return;
    var toggle = dropdown.querySelector("[aria-expanded]");
    var panel = dropdown.querySelector(".header-dropdown__panel");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    if (panel) panel.hidden = true;
    if (openDropdown === dropdown) openDropdown = null;
  }

  function closeAllDropdowns() {
    document.querySelectorAll(".header-dropdown").forEach(closeDropdown);
  }

  function openDropdownMenu(dropdown) {
    if (openDropdown && openDropdown !== dropdown) {
      closeDropdown(openDropdown);
    }
    var toggle = dropdown.querySelector("[aria-expanded]");
    var panel = dropdown.querySelector(".header-dropdown__panel");
    if (!toggle || !panel) return;
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    openDropdown = dropdown;
  }

  document.querySelectorAll(".header-dropdown").forEach(function (dropdown) {
    var toggle = dropdown.querySelector(
      ".site-nav__trigger, .lang-dropdown__toggle, .user-dropdown__toggle"
    );
    if (!toggle) return;

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var panel = dropdown.querySelector(".header-dropdown__panel");
      var isOpen = panel && !panel.hidden;
      if (isOpen) {
        closeDropdown(dropdown);
      } else {
        openDropdownMenu(dropdown);
      }
    });
  });

  document.addEventListener("click", function () {
    closeAllDropdowns();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllDropdowns();
      closeSidebar();
    }
  });

  var guestEls = document.querySelectorAll(".auth-guest");
  var userEls = document.querySelectorAll(".auth-user");
  var authStorageKey = "cons-ui-auth";

  function setAuthState(loggedIn) {
    guestEls.forEach(function (el) {
      el.hidden = loggedIn;
    });
    userEls.forEach(function (el) {
      el.hidden = !loggedIn;
    });
    try {
      localStorage.setItem(authStorageKey, loggedIn ? "user" : "guest");
    } catch (e) {}
  }

  var savedAuth;
  try {
    savedAuth = localStorage.getItem(authStorageKey);
  } catch (e) {}

  setAuthState(savedAuth === "user");

  document.querySelectorAll("[data-auth-toggle]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      if (el.dataset.authToggle === "login") {
        setAuthState(true);
      } else {
        setAuthState(false);
        closeAllDropdowns();
      }
    });
  });

})();

(function () {
  if (window.__siteAnimationsRequested) return;
  window.__siteAnimationsRequested = true;
  var script = document.createElement("script");
  script.src = "assets/js/site-animations.js";
  document.body.appendChild(script);
})();
