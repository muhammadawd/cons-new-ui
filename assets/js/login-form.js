(function () {
  var typeButtons = document.querySelectorAll("[data-login-type]");
  var panels = document.querySelectorAll("[data-login-panel]");
  var inputs = document.querySelectorAll("[data-login-input]");
  var submitBtn = document.querySelector("[data-login-submit]");
  var overlay = document.querySelector("[data-login-overlay]");
  var pendingModal = document.querySelector('[data-login-modal="pending"]');
  var errorModal = document.querySelector('[data-login-modal="error"]');
  var waitingEl = document.querySelector("[data-login-waiting]");
  var activeType = "egyptian";
  var verifyTimer = null;
  var activeModal = null;

  if (!typeButtons.length || !submitBtn) return;

  function getActiveInput() {
    return document.querySelector('[data-login-input="' + activeType + '"]');
  }

  function validateInput() {
    var input = getActiveInput();
    if (!input) {
      submitBtn.disabled = true;
      return;
    }

    var value = input.value.trim();
    if (activeType === "egyptian") {
      submitBtn.disabled = value.length !== 14 || !/^\d{14}$/.test(value);
    } else {
      submitBtn.disabled = value.length < 3;
    }
  }

  function switchType(type) {
    activeType = type;

    typeButtons.forEach(function (btn) {
      var isActive = btn.dataset.loginType === type;
      btn.classList.toggle("login-type-switch__option--active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    panels.forEach(function (panel) {
      panel.hidden = panel.dataset.loginPanel !== type;
    });

    validateInput();
  }

  function clearVerifyTimer() {
    if (verifyTimer) {
      window.clearTimeout(verifyTimer);
      verifyTimer = null;
    }
  }

  function shouldFailVerification() {
    var input = getActiveInput();
    if (!input) return false;
    var value = input.value.trim();
    return value.slice(-1) === "9";
  }

  function showModal(name) {
    if (!overlay) return;

    if (pendingModal) pendingModal.hidden = name !== "pending";
    if (errorModal) errorModal.hidden = name !== "error";
    activeModal = name;

    overlay.hidden = !name;
    document.body.style.overflow = name ? "hidden" : "";
  }

  function closeModals() {
    clearVerifyTimer();
    showModal(null);
  }

  function completeLogin() {
    try {
      localStorage.setItem("cons-ui-auth", "user");
    } catch (e) {}

    window.location.href = "home.html";
  }

  function showErrorState() {
    clearVerifyTimer();
    showModal("error");
  }

  function startVerificationWait() {
    clearVerifyTimer();
    if (waitingEl) waitingEl.hidden = false;

    verifyTimer = window.setTimeout(function () {
      if (shouldFailVerification()) {
        showErrorState();
      } else {
        completeLogin();
      }
    }, 5000);
  }

  function openPendingModal() {
    showModal("pending");
    startVerificationWait();
  }

  typeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      switchType(btn.dataset.loginType);
      var input = getActiveInput();
      if (input) input.focus();
    });
  });

  inputs.forEach(function (input) {
    input.addEventListener("input", function () {
      if (input.dataset.loginInput === "egyptian") {
        input.value = input.value.replace(/\D/g, "").slice(0, 14);
      }
      validateInput();
    });
  });

  submitBtn.addEventListener("click", function () {
    if (submitBtn.disabled) return;
    openPendingModal();
  });

  document.querySelectorAll("[data-login-modal-close], [data-login-cancel]").forEach(function (btn) {
    btn.addEventListener("click", closeModals);
  });

  var resendBtn = document.querySelector("[data-login-resend]");
  if (resendBtn) {
    resendBtn.addEventListener("click", startVerificationWait);
  }

  var retryBtn = document.querySelector("[data-login-retry]");
  if (retryBtn) {
    retryBtn.addEventListener("click", closeModals);
  }

  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModals();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && activeModal) closeModals();
  });

  var params = new URLSearchParams(window.location.search);
  var demoState = params.get("state");
  if (demoState === "pending") {
    showModal("pending");
    if (waitingEl) waitingEl.hidden = false;
  } else if (demoState === "error") {
    showModal("error");
  }

  validateInput();
})();
