(function () {
  var tabBtns = document.querySelectorAll("[data-rt-tab-btn]");
  var panels = document.querySelectorAll("[data-rt-panel]");
  var toggles = document.querySelectorAll("[data-rt-toggle]");
  var pastDeletes = document.querySelectorAll("[data-rt-past-delete]");

  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.dataset.rtTabBtn;
      tabBtns.forEach(function (b) {
        var isActive = b === btn;
        b.classList.toggle("rt-tabs__btn--active", isActive);
        b.setAttribute("aria-selected", isActive ? "true" : "false");
      });
      panels.forEach(function (panel) {
        panel.hidden = panel.dataset.rtPanel !== target;
      });
    });
  });

  toggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var card = toggle.closest("[data-rt-card]");
      if (!card) return;

      var details = card.querySelector("[data-rt-details]");
      var isOpen = card.classList.contains("rt-card--open");

      card.classList.toggle("rt-card--open", !isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "false" : "true");

      if (details) details.hidden = isOpen;

      var labelShow = toggle.dataset.rtLabelShow || "عرض التفاصيل";
      var labelHide = toggle.dataset.rtLabelHide || "إخفاء التفاصيل";
      var iconShow = toggle.dataset.rtIconShow || "solar:eye-linear";
      var iconHide = toggle.dataset.rtIconHide || "solar:eye-closed-linear";

      toggle.innerHTML =
        (isOpen ? labelShow : labelHide) +
        ' <iconify-icon icon="' +
        (isOpen ? iconShow : iconHide) +
        '" class="icon icon--sm"></iconify-icon>';
    });
  });

  pastDeletes.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest("[data-rt-past-card]");
      if (card) card.remove();
    });
  });
})();
