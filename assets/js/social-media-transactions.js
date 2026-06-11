(function () {
  var filters = document.querySelectorAll("[data-sm-filter]");
  var cards = document.querySelectorAll("[data-sm-card]");
  var searchInput = document.querySelector("[data-sm-search]");
  var searchBtn = document.querySelector("[data-sm-search-btn]");
  var grid = document.querySelector(".sm-grid");
  var emptyState = document.querySelector("[data-sm-empty]");
  var activeFilter = "all";
  var searchQuery = "";

  function initCarousels() {
    document.querySelectorAll("[data-sm-carousel]").forEach(function (carousel) {
      var track = carousel.querySelector(".sm-carousel__track");
      var slides = carousel.querySelectorAll(".sm-carousel__slide");
      var dots = carousel.querySelectorAll(".sm-carousel__dot");
      var prevBtn = carousel.querySelector("[data-sm-prev]");
      var nextBtn = carousel.querySelector("[data-sm-next]");
      if (!track || !slides.length) return;

      var index = 0;

      function goTo(nextIndex) {
        if (nextIndex < 0) nextIndex = slides.length - 1;
        if (nextIndex >= slides.length) nextIndex = 0;
        index = nextIndex;
        track.style.transform = "translateX(-" + index * 100 + "%)";
        dots.forEach(function (dot, i) {
          dot.classList.toggle("sm-carousel__dot--active", i === index);
          dot.setAttribute("aria-selected", i === index ? "true" : "false");
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener("click", function () {
          goTo(index - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          goTo(index + 1);
        });
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          goTo(i);
        });
      });
    });
  }

  function cardMatches(card) {
    var platform = card.dataset.smPlatform;
    var filterMatch = activeFilter === "all" || platform === activeFilter;
    var text = card.textContent.trim().toLowerCase();
    var searchMatch = !searchQuery || text.includes(searchQuery);
    return filterMatch && searchMatch;
  }

  function updateView() {
    var hasVisible = false;

    cards.forEach(function (card) {
      var match = cardMatches(card);
      card.hidden = !match;
      if (match) hasVisible = true;
    });

    if (emptyState) emptyState.hidden = hasVisible;
    if (grid) grid.hidden = !hasVisible;
  }

  function runSearch() {
    if (searchInput) {
      searchQuery = searchInput.value.trim().toLowerCase();
    }
    updateView();
  }

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activeFilter = btn.dataset.smFilter;

      filters.forEach(function (f) {
        f.classList.toggle("sm-filter--active", f === btn);
        f.setAttribute("aria-selected", f === btn ? "true" : "false");
      });

      updateView();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", runSearch);
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        runSearch();
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", runSearch);
  }

  if (!cards.length) {
    if (emptyState) emptyState.hidden = false;
    if (grid) grid.hidden = true;
  } else {
    updateView();
  }

  initCarousels();

  var followOverlay = document.querySelector("[data-sm-follow-overlay]");
  var followModal = followOverlay ? followOverlay.querySelector(".sm-follow-modal") : null;
  var followOpenBtns = document.querySelectorAll("[data-sm-follow-open]");
  var followCloseBtns = document.querySelectorAll("[data-sm-follow-close]");
  var followConfirmBtn = document.querySelector("[data-sm-follow-confirm]");
  var followOptions = document.querySelectorAll("[data-sm-follow-option]");
  var followDefaultBar = document.querySelector("[data-sm-follow-default]");
  var followSuccessBar = document.querySelector("[data-sm-follow-success]");
  var followTagsEl = document.querySelector("[data-sm-follow-tags]");

  function openFollowModal() {
    if (!followOverlay) return;
    followOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeFollowModal() {
    if (!followOverlay) return;
    followOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  function toggleFollowOption(option) {
    var isSelected = option.classList.toggle("sm-follow-option--selected");
    option.setAttribute("aria-pressed", isSelected ? "true" : "false");
    var mark = option.querySelector(".sm-follow-option__mark");
    if (!mark) return;

    if (isSelected) {
      mark.innerHTML =
        '<iconify-icon icon="icon-park-solid:check-one" class="icon icon--sm"></iconify-icon>';
    } else {
      mark.innerHTML = "";
    }
  }

  function getSelectedServices() {
    var selected = [];
    followOptions.forEach(function (option) {
      if (!option.classList.contains("sm-follow-option--selected")) return;
      var label = option.querySelector(".sm-follow-option__label");
      if (label) selected.push(label.textContent.trim());
    });
    return selected;
  }

  function applyFollowState(services) {
    if (!services.length) return;

    if (followDefaultBar) followDefaultBar.hidden = true;
    if (followSuccessBar) followSuccessBar.hidden = false;

    if (followTagsEl) {
      followTagsEl.innerHTML = services
        .map(function (name) {
          return '<span class="sm-follow__tag">' + name + "</span>";
        })
        .join("");
    }
  }

  followOpenBtns.forEach(function (btn) {
    btn.addEventListener("click", openFollowModal);
  });

  followCloseBtns.forEach(function (btn) {
    btn.addEventListener("click", closeFollowModal);
  });

  if (followConfirmBtn) {
    followConfirmBtn.addEventListener("click", function () {
      var selected = getSelectedServices();
      if (!selected.length) return;
      applyFollowState(selected);
      closeFollowModal();
    });
  }

  if (followOverlay) {
    followOverlay.addEventListener("click", function (e) {
      if (e.target === followOverlay) closeFollowModal();
    });
  }

  if (followModal) {
    followModal.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  followOptions.forEach(function (option) {
    option.addEventListener("click", function () {
      toggleFollowOption(option);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && followOverlay && !followOverlay.hidden) {
      closeFollowModal();
    }
  });
})();
