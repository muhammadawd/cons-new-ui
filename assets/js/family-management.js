(function () {
  var grid = document.querySelector("[data-fm-grid]");
  var empty = document.querySelector("[data-fm-empty]");
  var overlay = document.querySelector("[data-fm-delete-overlay]");
  var deleteBtn = document.querySelector("[data-fm-delete-confirm]");
  var cancelBtns = document.querySelectorAll("[data-fm-delete-cancel]");
  var closeBtn = document.querySelector("[data-fm-delete-close]");
  var pendingCard = null;

  function updateEmptyState() {
    if (!grid || !empty) return;
    var hasCards = grid.querySelector("[data-fm-card]");
    grid.hidden = !hasCards;
    empty.hidden = !!hasCards;
  }

  function openDeleteModal(card) {
    pendingCard = card;
    if (overlay) overlay.hidden = false;
  }

  function closeDeleteModal() {
    pendingCard = null;
    if (overlay) overlay.hidden = true;
  }

  document.querySelectorAll("[data-fm-delete-open]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest("[data-fm-card]");
      if (card) openDeleteModal(card);
    });
  });

  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      if (pendingCard) {
        pendingCard.remove();
        updateEmptyState();
      }
      closeDeleteModal();
    });
  }

  cancelBtns.forEach(function (btn) {
    btn.addEventListener("click", closeDeleteModal);
  });

  if (closeBtn) closeBtn.addEventListener("click", closeDeleteModal);

  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeDeleteModal();
    });
  }
})();
