document.addEventListener('DOMContentLoaded', () => {
  initSearchFilter();
  initOptionSelection();
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

function initOptionSelection() {
  const options = document.querySelectorAll('[data-option]');
  const submitBtn = document.querySelector('[data-selection-submit]');

  if (!options.length || !submitBtn) {
    return;
  }

  function selectOption(option) {
    options.forEach((opt) => {
      const isSelected = opt === option;
      if (isSelected) {
        opt.setAttribute('aria-current', 'page');
      } else {
        opt.removeAttribute('aria-current');
      }

      const radio = opt.querySelector('.option-radio');
      if (radio) {
        radio.innerHTML = isSelected
          ? '<iconify-icon icon="mdi:check" class="icon icon--sm"></iconify-icon>'
          : '';
      }
    });

    submitBtn.dataset.target = option.dataset.optionTarget || '';
    submitBtn.disabled = !submitBtn.dataset.target;
  }

  options.forEach((option) => {
    option.addEventListener('click', () => {
      selectOption(option);
    });
  });

  submitBtn.addEventListener('click', () => {
    const target = submitBtn.dataset.target;
    if (target) {
      window.location.href = target;
    }
  });

  const preselected = document.querySelector('[data-option][aria-current="page"]');
  if (preselected) {
    selectOption(preselected);
  } else {
    submitBtn.disabled = true;
  }
}
