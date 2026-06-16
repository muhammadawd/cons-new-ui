(function () {
  var openDropdown = null;
  var switchOverlay = null;
  var loginAppOverlay = null;
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
      if (switchOverlay && !switchOverlay.hidden) {
        closeSwitchAccountModal();
      }
      if (loginAppOverlay && !loginAppOverlay.hidden) {
        closeLoginAppModal();
      }
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

  var switchAccounts = [
    { id: "primary", name: "محمود محمد احمد", role: "الحساب الرئيسي" },
    { id: "ahmed", name: "احمد محمود محمد احمد", role: "" },
    { id: "marwa", name: "مروه محمود محمد احمد", role: "" },
  ];
  var activeAccountKey = "cons-ui-active-account";
  switchOverlay = document.querySelector("[data-switch-account-overlay]");
  var switchList = switchOverlay ? switchOverlay.querySelector("[data-switch-account-list]") : null;
  var switchOpenBtns = document.querySelectorAll("[data-switch-account-open]");
  var switchCloseBtns = document.querySelectorAll("[data-switch-account-close]");

  function getActiveAccountId() {
    try {
      var saved = localStorage.getItem(activeAccountKey);
      if (saved && switchAccounts.some(function (account) { return account.id === saved; })) {
        return saved;
      }
    } catch (e) {}
    return "primary";
  }

  function getActiveAccount() {
    var activeId = getActiveAccountId();
    return switchAccounts.find(function (account) { return account.id === activeId; }) || switchAccounts[0];
  }

  function updateHeaderAccountName() {
    var activeAccount = getActiveAccount();
    document.querySelectorAll(".user-dropdown__name").forEach(function (el) {
      el.textContent = activeAccount.name;
    });
  }

  function renderSwitchAccountOptions() {
    if (!switchList) return;
    var activeId = getActiveAccountId();

    switchList.innerHTML = switchAccounts
      .map(function (account) {
        var isActive = account.id === activeId;
        var roleMarkup = account.role
          ? '<span class="switch-account-option__role">' + account.role + "</span>"
          : "";

        return (
          '<li>' +
          '<button type="button" class="switch-account-option' +
          (isActive ? " switch-account-option--active" : "") +
          '" data-switch-account-id="' +
          account.id +
          '" aria-current="' +
          (isActive ? "true" : "false") +
          '">' +
          '<span class="switch-account-option__icon" aria-hidden="true">' +
          '<iconify-icon icon="solar:user-bold" class="icon"></iconify-icon>' +
          "</span>" +
          '<span class="switch-account-option__content">' +
          '<span class="switch-account-option__name">' +
          account.name +
          "</span>" +
          roleMarkup +
          "</span>" +
          "</button>" +
          "</li>"
        );
      })
      .join("");

    switchList.querySelectorAll("[data-switch-account-id]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        selectSwitchAccount(btn.dataset.switchAccountId);
      });
    });
  }

  function selectSwitchAccount(accountId) {
    var account = switchAccounts.find(function (item) { return item.id === accountId; });
    if (!account) return;

    try {
      localStorage.setItem(activeAccountKey, accountId);
    } catch (e) {}

    updateHeaderAccountName();
    closeSwitchAccountModal();
  }

  function openSwitchAccountModal() {
    if (!switchOverlay) return;
    closeAllDropdowns();
    renderSwitchAccountOptions();
    switchOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    var activeOption = switchOverlay.querySelector(
      '[data-switch-account-id="' + getActiveAccountId() + '"]'
    );
    if (activeOption) activeOption.focus();
  }

  function closeSwitchAccountModal() {
    if (!switchOverlay) return;
    switchOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  if (!switchOverlay) {
    switchOverlay = document.createElement("div");
    switchOverlay.className = "switch-account-overlay";
    switchOverlay.setAttribute("data-switch-account-overlay", "");
    switchOverlay.setAttribute("hidden", "");
    switchOverlay.innerHTML =
      '<div class="switch-account-modal" role="dialog" aria-modal="true" aria-labelledby="switch-account-title">' +
      '<h2 id="switch-account-title" class="switch-account-modal__title">تبديل الحساب</h2>' +
      '<p class="switch-account-modal__subtitle">اختر الحساب الذي تريد التبديل إليه</p>' +
      '<ul class="switch-account-list" data-switch-account-list></ul>' +
      '<button type="button" class="switch-account-modal__cancel" data-switch-account-close>إلغاء</button>' +
      "</div>";
    document.body.appendChild(switchOverlay);
    switchList = switchOverlay.querySelector("[data-switch-account-list]");
    switchCloseBtns = switchOverlay.querySelectorAll("[data-switch-account-close]");

    switchOverlay.addEventListener("click", function (e) {
      if (e.target === switchOverlay) closeSwitchAccountModal();
    });
  }

  switchOpenBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      openSwitchAccountModal();
    });
  });

  switchCloseBtns.forEach(function (btn) {
    btn.addEventListener("click", closeSwitchAccountModal);
  });

  updateHeaderAccountName();

  var loginAppDismissKey = "cons-ui-login-popup-dismissed";
  var loginAppTimer = null;
  loginAppOverlay = document.querySelector("[data-login-app-overlay]");

  function isUserLoggedIn() {
    try {
      return localStorage.getItem(authStorageKey) === "user";
    } catch (e) {
      return false;
    }
  }

  function wasLoginPopupDismissed() {
    try {
      return sessionStorage.getItem(loginAppDismissKey) === "1";
    } catch (e) {
      return false;
    }
  }

  function markLoginPopupDismissed() {
    try {
      sessionStorage.setItem(loginAppDismissKey, "1");
    } catch (e) {}
  }

  function openLoginAppModal() {
    if (!loginAppOverlay || isUserLoggedIn()) return;
    loginAppOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    var closeBtn = loginAppOverlay.querySelector("[data-login-app-close]");
    if (closeBtn) closeBtn.focus();
  }

  function closeLoginAppModal() {
    if (!loginAppOverlay) return;
    loginAppOverlay.hidden = true;
    document.body.style.overflow = "";
    markLoginPopupDismissed();
  }

  if (loginAppOverlay) {
    loginAppOverlay.querySelectorAll("[data-login-app-close]").forEach(function (btn) {
      btn.addEventListener("click", closeLoginAppModal);
    });

    loginAppOverlay.addEventListener("click", function (e) {
      if (e.target === loginAppOverlay) closeLoginAppModal();
    });

    var loginAppSubmit = loginAppOverlay.querySelector("[data-login-app-submit]");
    if (loginAppSubmit) {
      loginAppSubmit.addEventListener("click", function () {
        window.location.href = "login-form.html";
      });
    }

    var loginAppDownload = loginAppOverlay.querySelector("[data-login-app-download]");
    if (loginAppDownload) {
      loginAppDownload.addEventListener("click", function () {
        closeLoginAppModal();
      });
    }

    if (!isUserLoggedIn() && !wasLoginPopupDismissed()) {
      loginAppTimer = window.setTimeout(openLoginAppModal, 10000);
    }
  }

})();

(function () {
  if (window.__siteAnimationsRequested) return;
  window.__siteAnimationsRequested = true;
  var script = document.createElement("script");
  script.src = "assets/js/site-animations.js";
  document.body.appendChild(script);
})();
