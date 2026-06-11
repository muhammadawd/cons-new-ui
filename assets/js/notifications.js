(function () {
  var filters = document.querySelectorAll("[data-notification-filter]");
  var items = document.querySelectorAll("[data-notification]");
  var emptyState = document.querySelector("[data-notifications-empty]");
  var list = document.querySelector(".notifications-list");

  if (!filters.length) return;

  if (!items.length) {
    if (emptyState) emptyState.hidden = false;
    if (list) list.hidden = true;
    return;
  }

  function updateEmptyState() {
    var hasVisible = Array.prototype.some.call(items, function (item) {
      return !item.hidden;
    });

    if (emptyState) {
      emptyState.hidden = hasVisible;
    }

    if (list) {
      list.hidden = !hasVisible;
    }
  }

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var category = btn.dataset.notificationFilter;

      filters.forEach(function (f) {
        f.classList.toggle("notifications-filter--active", f === btn);
        f.setAttribute("aria-selected", f === btn ? "true" : "false");
      });

      items.forEach(function (item) {
        var match = category === "all" || item.dataset.notificationCategory === category;
        item.hidden = !match;
      });

      updateEmptyState();
    });
  });

  updateEmptyState();
})();
