(function () {
  var MAX_SIZE = 1024 * 1024;
  var PROGRESS = { 1: "25%", 2: "50%", 3: "75%", 4: "100%" };

  var progressBar = document.querySelector("[data-er-progress]");
  var steps = document.querySelectorAll("[data-er-step]");

  function setStep(stepNum) {
    steps.forEach(function (step) {
      step.hidden = step.dataset.erStep !== String(stepNum);
    });
    if (progressBar) {
      progressBar.style.width = PROGRESS[stepNum] || "25%";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll("[data-er-next]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = parseInt(btn.dataset.erNext, 10);
      if (target) setStep(target);
    });
  });

  document.querySelectorAll("[data-er-back]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.dataset.erBack;
      if (target === "home") {
        window.location.href = "home.html";
        return;
      }
      var stepNum = parseInt(target, 10);
      if (stepNum) setStep(stepNum);
    });
  });

  function activateOption(btn, group) {
    group.querySelectorAll("[data-er-option]").forEach(function (option) {
      var active = option === btn;
      option.classList.toggle("er-option--active", active);
      option.setAttribute("aria-pressed", active ? "true" : "false");
      var mark = option.querySelector(".er-option__mark");
      if (mark) {
        mark.innerHTML = active
          ? '<iconify-icon icon="icon-park-solid:check-one" class="icon icon--sm"></iconify-icon>'
          : "";
      }
    });
  }

  document.querySelectorAll("[data-er-options]").forEach(function (group) {
    group.querySelectorAll("[data-er-option]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activateOption(btn, group);
      });
    });
  });

  document.querySelectorAll("[data-er-search]").forEach(function (input) {
    input.addEventListener("input", function () {
      var query = input.value.trim().toLowerCase();
      var step = input.closest("[data-er-step]");
      if (!step) return;
      step.querySelectorAll("[data-er-option]").forEach(function (option) {
        var text = option.textContent.trim().toLowerCase();
        option.hidden = query.length > 0 && text.indexOf(query) === -1;
      });
    });
  });

  function resetUpload(upload) {
    upload.classList.remove("er-upload--preview", "er-upload--error", "er-upload--loading", "er-upload--drag");
    var input = upload.querySelector("[data-er-upload-input]");
    var filename = upload.querySelector("[data-er-upload-filename]");
    var thumb = upload.querySelector("[data-er-upload-thumb]");
    var progressBarEl = upload.querySelector("[data-er-upload-progress-bar]");
    if (input) input.value = "";
    if (filename) filename.textContent = "";
    if (thumb) {
      thumb.src = "";
      thumb.hidden = true;
    }
    if (progressBarEl) progressBarEl.style.width = "0%";
  }

  function setUploadError(upload, message) {
    upload.classList.remove("er-upload--preview", "er-upload--loading", "er-upload--drag");
    upload.classList.add("er-upload--error");
    var err = upload.querySelector("[data-er-upload-error]");
    if (err) err.textContent = message;
  }

  function simulateUpload(upload, file) {
    upload.classList.remove("er-upload--error", "er-upload--preview", "er-upload--drag");
    upload.classList.add("er-upload--loading");

    var progressBarEl = upload.querySelector("[data-er-upload-progress-bar]");
    var progress = 0;

    var timer = setInterval(function () {
      progress += 20;
      if (progressBarEl) progressBarEl.style.width = progress + "%";
      if (progress >= 100) {
        clearInterval(timer);
        upload.classList.remove("er-upload--loading");
        upload.classList.add("er-upload--preview");

        var filename = upload.querySelector("[data-er-upload-filename]");
        var thumb = upload.querySelector("[data-er-upload-thumb]");
        if (filename) filename.textContent = file.name;
        if (thumb && file.type.startsWith("image/")) {
          thumb.src = URL.createObjectURL(file);
          thumb.hidden = false;
        }
      }
    }, 120);
  }

  function handleFile(upload, file) {
    if (!file.type.startsWith("image/")) {
      setUploadError(upload, "يرجى رفع صورة بصيغة JPG أو PNG");
      return;
    }
    if (file.size > MAX_SIZE) {
      setUploadError(upload, "أقصى حجم للصورة 1MB");
      return;
    }
    simulateUpload(upload, file);
  }

  function bindUpload(upload) {
    var zone = upload.querySelector("[data-er-upload-zone]");
    var input = upload.querySelector("[data-er-upload-input]");
    var removeBtn = upload.querySelector("[data-er-upload-remove]");
    if (!zone || !input) return;

    zone.addEventListener("click", function () {
      if (!upload.classList.contains("er-upload--preview")) input.click();
    });

    zone.addEventListener("dragover", function (e) {
      e.preventDefault();
      upload.classList.add("er-upload--drag");
    });

    zone.addEventListener("dragleave", function () {
      upload.classList.remove("er-upload--drag");
    });

    zone.addEventListener("drop", function (e) {
      e.preventDefault();
      upload.classList.remove("er-upload--drag");
      if (e.dataTransfer.files[0]) handleFile(upload, e.dataTransfer.files[0]);
    });

    input.addEventListener("change", function () {
      if (input.files[0]) handleFile(upload, input.files[0]);
    });

    if (removeBtn) {
      removeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        resetUpload(upload);
      });
    }
  }

  document.querySelectorAll("[data-er-upload]").forEach(bindUpload);

  var submitBtn = document.querySelector("[data-er-submit]");
  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      var checkbox = document.querySelector("[data-er-declaration]");
      if (checkbox && !checkbox.checked) {
        checkbox.focus();
        return;
      }
      window.location.href = "request-tracking.html";
    });
  }
})();
