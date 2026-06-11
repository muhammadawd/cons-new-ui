(function () {
  var DAY_NAMES_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  var daysContainer = document.querySelector("[data-wh-days]");
  var statusPanel = document.querySelector("[data-wh-status]");
  var startInput = document.querySelector("[data-wh-date-start]");
  var endInput = document.querySelector("[data-wh-date-end]");

  if (!daysContainer || !statusPanel || !startInput || !endInput) return;
  if (typeof flatpickr === "undefined") return;

  var statusDate = statusPanel.querySelector("[data-wh-status-date]");
  var statusMessage = statusPanel.querySelector("[data-wh-status-message]");
  var statusIcon = statusPanel.querySelector("[data-wh-status-icon]");

  var startPicker;
  var endPicker;
  var activeDayBtn = null;

  var WEEK_START = new Date(2026, 1, 21);
  var WEEK_END = new Date(2026, 1, 27);
  var DEFAULT_ACTIVE = new Date(2026, 1, 23);

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function formatDate(date) {
    return pad(date.getDate()) + "/" + pad(date.getMonth() + 1) + "/" + date.getFullYear();
  }

  function parseDate(str) {
    var parts = str.split("/");
    if (parts.length !== 3) return null;
    return new Date(+parts[2], +parts[1] - 1, +parts[0]);
  }

  function isOpenDay(date) {
    var dow = date.getDay();
    return dow >= 1 && dow <= 4;
  }

  function holidayLabel(date) {
    return date.getDay() === 5 ? "عطلة أسبوعية" : "مغلق";
  }

  function getLocale() {
    return window.flatpickr && window.flatpickr.l10ns && window.flatpickr.l10ns.ar
      ? window.flatpickr.l10ns.ar
      : null;
  }

  function basePickerOptions() {
    var opts = {
      dateFormat: "d/m/Y",
      disableMobile: true,
      clickOpens: true,
      allowInput: false,
    };
    var locale = getLocale();
    if (locale) opts.locale = locale;
    return opts;
  }

  function bindPickerOpen(input, getPicker) {
    var control = input.closest(".wh-date-field__control");
    if (!control) return;

    control.addEventListener("click", function (e) {
      var picker = getPicker();
      if (!picker) return;
      if (e.target === input) return;
      e.preventDefault();
      picker.open();
    });
  }

  function setActiveDay(dayBtn) {
    activeDayBtn = dayBtn;
    var dayBtns = daysContainer.querySelectorAll("[data-wh-day]");
    dayBtns.forEach(function (btn) {
      btn.classList.toggle("wh-day--active", btn === dayBtn);
      btn.setAttribute("aria-selected", btn === dayBtn ? "true" : "false");
    });

    var isOpen = dayBtn.dataset.whOpen === "true";
    var dayLabel = dayBtn.dataset.whLabel || "";
    var dateValue = dayBtn.dataset.whDate || "";

    if (statusDate) statusDate.textContent = dayLabel + " " + dateValue;

    if (statusMessage) {
      statusMessage.textContent = isOpen
        ? "مفتوح 9:00 ص - 3:00 م"
        : dayBtn.dataset.whHoliday || "عطلة أسبوعية";
      statusMessage.classList.toggle("wh-status__message--open", isOpen);
      statusMessage.classList.toggle("wh-status__message--closed", !isOpen);
    }

    if (statusIcon) {
      statusIcon.classList.toggle("wh-status__icon--open", isOpen);
      statusIcon.classList.toggle("wh-status__icon--closed", !isOpen);
      statusIcon.innerHTML = isOpen
        ? '<iconify-icon icon="icon-park-solid:check-one" class="icon icon--lg"></iconify-icon>'
        : '<iconify-icon icon="mdi:close" class="icon icon--lg"></iconify-icon>';
    }
  }

  function createDayButton(date, isActive) {
    var open = isOpenDay(date);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "wh-day" + (isActive ? " wh-day--active" : "");
    btn.setAttribute("data-wh-day", "");
    btn.setAttribute("data-wh-open", open ? "true" : "false");
    btn.setAttribute("data-wh-label", DAY_NAMES_AR[date.getDay()]);
    btn.setAttribute("data-wh-date", formatDate(date));
    if (!open) btn.setAttribute("data-wh-holiday", holidayLabel(date));
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", isActive ? "true" : "false");

    var name = document.createElement("span");
    name.className = "wh-day__name";
    name.textContent = DAY_NAMES_AR[date.getDay()];

    var num = document.createElement("span");
    num.className = "wh-day__num";
    num.textContent = String(date.getDate());

    btn.appendChild(name);
    btn.appendChild(num);
    btn.addEventListener("click", function () {
      setActiveDay(btn);
    });

    return btn;
  }

  function firstOpenDayInRange(start, end) {
    var cursor = new Date(start);
    while (cursor <= end) {
      if (isOpenDay(cursor)) return new Date(cursor);
      cursor.setDate(cursor.getDate() + 1);
    }
    return new Date(start);
  }

  function rebuildDaysStrip(preferredDate) {
    if (!startPicker || !endPicker) return;

    var start = startPicker.selectedDates[0];
    var end = endPicker.selectedDates[0];
    if (!start || !end) return;

    if (end < start) {
      end = new Date(start);
      endPicker.setDate(end, false);
    }

    var diff = Math.round((end - start) / 86400000);
    if (diff > 6) {
      end = new Date(start);
      end.setDate(end.getDate() + 6);
      endPicker.setDate(end, false);
    }

    daysContainer.innerHTML = "";
    var current = new Date(start);
    var previous = activeDayBtn ? parseDate(activeDayBtn.dataset.whDate) : null;
    var pickDate = preferredDate || previous;
    if (pickDate && (pickDate < start || pickDate > end)) {
      pickDate = null;
    }
    if (!pickDate) pickDate = firstOpenDayInRange(start, end);
    var activeBtn = null;

    while (current <= end) {
      var isActive = current.toDateString() === pickDate.toDateString();
      var btn = createDayButton(new Date(current), isActive);
      daysContainer.appendChild(btn);
      if (isActive) activeBtn = btn;
      current.setDate(current.getDate() + 1);
    }

    if (!activeBtn) {
      activeBtn = daysContainer.querySelector("[data-wh-day]");
    }
    if (activeBtn) setActiveDay(activeBtn);
  }

  function onStartChange(selectedDates) {
    if (!selectedDates[0] || !endPicker) return;
    endPicker.set("minDate", selectedDates[0]);
    var endDate = endPicker.selectedDates[0];
    if (!endDate || endDate < selectedDates[0]) {
      var next = new Date(selectedDates[0]);
      next.setDate(next.getDate() + 6);
      endPicker.setDate(next, false);
    }
    rebuildDaysStrip(selectedDates[0]);
  }

  function onEndChange(selectedDates) {
    if (!selectedDates[0] || !startPicker) return;
    startPicker.set("maxDate", selectedDates[0]);
    rebuildDaysStrip();
  }

  function initPickers() {
    var endOpts = Object.assign({}, basePickerOptions(), {
      defaultDate: WEEK_END,
      minDate: WEEK_START,
      onChange: onEndChange,
    });

    var startOpts = Object.assign({}, basePickerOptions(), {
      defaultDate: WEEK_START,
      maxDate: WEEK_END,
      onChange: onStartChange,
    });

    endPicker = flatpickr(endInput, endOpts);
    startPicker = flatpickr(startInput, startOpts);

    bindPickerOpen(startInput, function () {
      return startPicker;
    });
    bindPickerOpen(endInput, function () {
      return endPicker;
    });

    rebuildDaysStrip(DEFAULT_ACTIVE);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPickers);
  } else {
    initPickers();
  }
})();
