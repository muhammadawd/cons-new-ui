document.addEventListener('DOMContentLoaded', () => {
  initSearchFilter();
});

(function () {
  if (window.__siteAnimationsRequested) return;
  window.__siteAnimationsRequested = true;
  var script = document.createElement("script");
  script.src = "assets/js/site-animations.js";
  document.body.appendChild(script);
})();

function initSearchFilter() {
  const searchInput = document.querySelector('[data-search]');
  const options = document.querySelectorAll('[data-option]');

  if (!searchInput || !options.length) {
    return;
  }

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();

    options.forEach((option) => {
      const label = option.querySelector('.option-link__label')?.textContent.trim().toLowerCase() ?? '';
      const isMatch = !query || label.includes(query);
      option.classList.toggle('hidden', !isMatch);
    });
  });
}
