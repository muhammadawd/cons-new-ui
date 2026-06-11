(function () {
  var filters = document.querySelectorAll("[data-news-filter]");
  var cards = document.querySelectorAll("[data-news-card]");
  var emptyState = document.querySelector("[data-news-empty]");
  var grid = document.querySelector(".news-grid");

  if (!filters.length) return;

  if (!cards.length) {
    if (emptyState) emptyState.hidden = false;
    if (grid) grid.hidden = true;
    return;
  }

  function updateEmptyState() {
    var hasVisible = Array.prototype.some.call(cards, function (card) {
      return !card.hidden;
    });

    if (emptyState) {
      emptyState.hidden = hasVisible;
    }

    if (grid) {
      grid.hidden = !hasVisible;
    }
  }

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var category = btn.dataset.newsFilter;

      filters.forEach(function (f) {
        f.classList.toggle("news-filter--active", f === btn);
        f.setAttribute("aria-selected", f === btn ? "true" : "false");
      });

      cards.forEach(function (card) {
        var match = category === "all" || card.dataset.newsCategory === category;
        card.hidden = !match;
      });

      updateEmptyState();
    });
  });

  updateEmptyState();
})();
