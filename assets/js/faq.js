(function () {
  var searchInput = document.querySelector("[data-faq-search]");
  var items = document.querySelectorAll("[data-faq-item]");

  items.forEach(function (item) {
    var trigger = item.querySelector(".faq-item__trigger");
    if (!trigger) return;

    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("faq-item--open");
      item.classList.toggle("faq-item--open", !isOpen);
      trigger.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });
  });

  if (!searchInput || !items.length) return;

  searchInput.addEventListener("input", function () {
    var query = searchInput.value.trim().toLowerCase();

    items.forEach(function (item) {
      var text = item.textContent.trim().toLowerCase();
      var match = !query || text.includes(query);
      item.hidden = !match;
    });
  });
})();
