(function () {
  var MAX_SIZE = 1024 * 1024;
  var progressBar = document.querySelector("[data-afm-progress]");
  var steps = document.querySelectorAll("[data-afm-step]");
  var stepNext = document.querySelector("[data-afm-step-next]");
  var stepBack = document.querySelector("[data-afm-step-back]");
  var relationOptions = document.querySelectorAll("[data-afm-relation]");
  var docTrigger = document.querySelector("[data-afm-doc-trigger]");
  var docOverlay = document.querySelector("[data-afm-doc-overlay]");
  var docOptions = document.querySelectorAll("[data-afm-doc-option]");
  var docLabel = document.querySelector("[data-afm-doc-label]");
  var uploadPanels = document.querySelectorAll("[data-afm-upload-panel]");
  var uploadsRoot = document.querySelector("[data-afm-uploads]");

  var docLabels = {
    passport: "جواز سفر",
    birth: "شهادة ميلاد",
    "national-id": "بطاقة الرقم القومي",
    other: "أخرى",
  };

  function setStep(stepNum) {
    steps.forEach(function (step) {
      var show = step.dataset.afmStep === String(stepNum);
      step.hidden = !show;
    });
    if (progressBar) {
      progressBar.style.width = stepNum === 1 ? "50%" : "100%";
    }
  }

  relationOptions.forEach(function (btn) {
    btn.addEventListener("click", function () {
      relationOptions.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("afm-relation__option--active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
        var mark = b.querySelector(".afm-relation__mark");
        if (mark) {
          mark.innerHTML = active
            ? '<iconify-icon icon="icon-park-solid:check-one" class="icon icon--sm"></iconify-icon>'
            : "";
        }
      });
    });
  });

  if (stepNext) {
    stepNext.addEventListener("click", function () {
      setStep(2);
    });
  }

  if (stepBack) {
    stepBack.addEventListener("click", function () {
      setStep(1);
    });
  }

  function openDocModal() {
    if (docOverlay) docOverlay.hidden = false;
  }

  function closeDocModal() {
    if (docOverlay) docOverlay.hidden = true;
  }

  function selectDocType(type) {
    docOptions.forEach(function (opt) {
      var selected = opt.dataset.afmDocOption === type;
      opt.classList.toggle("afm-modal__option--selected", selected);
      var mark = opt.querySelector(".afm-modal__mark");
      if (mark) {
        mark.innerHTML = selected
          ? '<iconify-icon icon="icon-park-solid:check-one" class="icon icon--sm"></iconify-icon>'
          : "";
      }
    });

    if (docLabel) {
      docLabel.textContent = docLabels[type] || "نوع المستند";
      docLabel.classList.remove("afm-doc-trigger__placeholder");
    }

    uploadPanels.forEach(function (panel) {
      panel.hidden = panel.dataset.afmUploadPanel !== type;
    });

    if (uploadsRoot) uploadsRoot.hidden = !type;
    closeDocModal();
  }

  if (docTrigger) {
    docTrigger.addEventListener("click", openDocModal);
  }

  if (docOverlay) {
    docOverlay.addEventListener("click", function (e) {
      if (e.target === docOverlay) closeDocModal();
    });
  }

  docOptions.forEach(function (opt) {
    opt.addEventListener("click", function () {
      selectDocType(opt.dataset.afmDocOption);
    });
  });

  function resetUpload(upload) {
    upload.classList.remove("afm-upload--preview", "afm-upload--error", "afm-upload--loading", "afm-upload--drag");
    var input = upload.querySelector("[data-afm-upload-input]");
    var filename = upload.querySelector("[data-afm-upload-filename]");
    var thumb = upload.querySelector("[data-afm-upload-thumb]");
    var progressBarEl = upload.querySelector("[data-afm-upload-progress-bar]");
    if (input) input.value = "";
    if (filename) filename.textContent = "";
    if (thumb) {
      thumb.src = "";
      thumb.hidden = true;
    }
    if (progressBarEl) progressBarEl.style.width = "0%";
  }

  function setUploadError(upload, message) {
    upload.classList.remove("afm-upload--preview", "afm-upload--loading", "afm-upload--drag");
    upload.classList.add("afm-upload--error");
    var err = upload.querySelector("[data-afm-upload-error]");
    if (err) err.textContent = message;
  }

  function simulateUpload(upload, file) {
    upload.classList.remove("afm-upload--error", "afm-upload--preview", "afm-upload--drag");
    upload.classList.add("afm-upload--loading");

    var progressBarEl = upload.querySelector("[data-afm-upload-progress-bar]");
    var progress = 0;

    var timer = setInterval(function () {
      progress += 20;
      if (progressBarEl) progressBarEl.style.width = progress + "%";
      if (progress >= 100) {
        clearInterval(timer);
        upload.classList.remove("afm-upload--loading");
        upload.classList.add("afm-upload--preview");

        var filename = upload.querySelector("[data-afm-upload-filename]");
        var thumb = upload.querySelector("[data-afm-upload-thumb]");
        if (filename) filename.textContent = file.name;
        if (thumb && file.type.startsWith("image/")) {
          thumb.src = URL.createObjectURL(file);
          thumb.hidden = false;
        }
      }
    }, 120);
  }

  function bindUpload(upload) {
    var zone = upload.querySelector("[data-afm-upload-zone]");
    var input = upload.querySelector("[data-afm-upload-input]");
    var removeBtn = upload.querySelector("[data-afm-upload-remove]");
    if (!zone || !input) return;

    zone.addEventListener("click", function () {
      if (!upload.classList.contains("afm-upload--preview")) input.click();
    });

    zone.addEventListener("dragover", function (e) {
      e.preventDefault();
      upload.classList.add("afm-upload--drag");
    });

    zone.addEventListener("dragleave", function () {
      upload.classList.remove("afm-upload--drag");
    });

    zone.addEventListener("drop", function (e) {
      e.preventDefault();
      upload.classList.remove("afm-upload--drag");
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

  document.querySelectorAll("[data-afm-upload]").forEach(bindUpload);
})();
