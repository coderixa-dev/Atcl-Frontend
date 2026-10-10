document.addEventListener('DOMContentLoaded', function () {

  // Hero Slider
  let heroSlider = new Swiper(".heroSwiper", {
    loop: true,
    speed: 900,
    effect: "fade",
    fadeEffect: { crossFade: true },
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".heroSwiper .swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".heroSwiper .swiper-button-next",
      prevEl: ".heroSwiper .swiper-button-prev",
    },
  });

  // Team slider

  var teamSwiper = new Swiper(".teamSwiper", {
    slidesPerView: 5,
    spaceBetween: 40,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    }, breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 5,
        spaceBetween: 30,
      },
    }
  });

  // service

  var serviceSwiper = new Swiper(".serviceSwiper", {
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
    }
  });


  // Product Details Swiper

  var productDetailsSwiper = new Swiper(".product-detailsSwiper", {
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    }
  });


  // Header: add "scrolled" class after scrolling
  const header = document.getElementById("header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Inquiry badge: reads the saved list from localStorage
  updateInquiryCount();

});

// Toggle grid

let grid = document.getElementById('grid') ? document.getElementById('grid').childNodes : [];
let bar3 = document.querySelector('.bar-3');
let bar4 = document.querySelector('.bar-4');



const grid3 = () => {
  grid.forEach(item => {
    if (item.nodeType === Node.ELEMENT_NODE && item.tagName === 'DIV') {
      item.classList.remove('col-lg-3');
      item.classList.add('col-lg-4');
      bar3.classList.add('active');
      bar4.classList.remove('active');
    }
  });
}

const grid4 = () => {
  grid.forEach(item => {
    if (item.nodeType === Node.ELEMENT_NODE && item.tagName === 'DIV') {
      item.classList.remove('col-lg-4');
      item.classList.add('col-lg-3');
      bar4.classList.add('active');
      bar3.classList.remove('active');
    }
  });
}




// Inquiry count (header badge). Items are stored as an array under "inquiryItems".
function updateInquiryCount() {
  const badge = document.getElementById("inquiryCount");
  if (!badge) return;
  let count = 0;
  try {
    count = JSON.parse(localStorage.getItem("inquiryItems") || "[]").length;
  } catch (e) { count = 0; }
  badge.textContent = count;
  badge.style.display = count ? "block" : "none";
}



// Counter animation (elements with class "counter" and data-count)
const counters = document.querySelectorAll(".counter");
if (counters.length && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const step = Math.max(1, Math.ceil(target / 80));
      let n = 0;
      const t = setInterval(() => {
        n = Math.min(n + step, target);
        el.textContent = n.toLocaleString();
        if (n >= target) clearInterval(t);
      }, 20);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach((c) => io.observe(c));
}



// Testimonials slider
new Swiper(".testimonialSwiper", {
  loop: true,
  speed: 700,
  spaceBetween: 24,
  slidesPerView: 1,
  autoplay: { delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true },
  pagination: { el: ".testi-pagination", clickable: true },
  navigation: { nextEl: ".testi-next", prevEl: ".testi-prev" },
  breakpoints: {
    768: { slidesPerView: 2 },
    1100: { slidesPerView: 3 },
  },
});



// Contact form (demo: validates and shows a success message)
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.classList.add("was-validated");
      return;
    }
    contactForm.reset();
    contactForm.classList.remove("was-validated");
    const ok = document.getElementById("formSuccess");
    ok.classList.remove("d-none");
    setTimeout(() => ok.classList.add("d-none"), 5000);
  });
}


// Footer: current year + back-to-top button
const footerYear = document.getElementById("footerYear");
if (footerYear) footerYear.textContent = new Date().getFullYear();

const backToTop = document.getElementById("backToTop");
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 400);
  }, { passive: true });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}



// Brands page: search + category filter
(function () {
  const brandGrid = document.getElementById("brandGrid");
  if (!brandGrid) return;

  const brandItems = brandGrid.querySelectorAll(".brand-item");
  const brandPills = document.querySelectorAll(".brand-pill");
  const brandSearch = document.getElementById("brandSearch");
  const brandEmpty = document.getElementById("brandEmpty");
  const brandCount = document.getElementById("brandCount");
  let activeCategory = "all";

  function applyBrandFilter() {
    const term = brandSearch.value.trim().toLowerCase();
    let visible = 0;

    brandItems.forEach((item) => {
      const matchCategory = activeCategory === "all" || item.dataset.category === activeCategory;
      const matchName = item.dataset.name.toLowerCase().includes(term);
      const show = matchCategory && matchName;
      item.classList.toggle("d-none", !show);
      if (show) visible++;
    });

    brandCount.textContent = visible;
    brandEmpty.classList.toggle("d-none", visible !== 0);
  }

  brandPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      brandPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      activeCategory = pill.dataset.filter;
      applyBrandFilter();
    });
  });

  brandSearch.addEventListener("input", applyBrandFilter);
})();



// News page: search + category filter, newsletter form
(function () {
  const newsGrid = document.getElementById("newsGrid");
  if (newsGrid) {
    const newsItems = newsGrid.querySelectorAll(".news-item");
    const newsPills = document.querySelectorAll(".nw-pill");
    const newsSearch = document.getElementById("newsSearch");
    const newsEmpty = document.getElementById("newsEmpty");
    let activeNewsCategory = "all";

    function applyNewsFilter() {
      const term = newsSearch.value.trim().toLowerCase();
      let visible = 0;

      newsItems.forEach((item) => {
        const matchCategory = activeNewsCategory === "all" || item.dataset.category === activeNewsCategory;
        const matchTitle = item.dataset.title.toLowerCase().includes(term);
        const show = matchCategory && matchTitle;
        item.classList.toggle("d-none", !show);
        if (show) visible++;
      });

      newsEmpty.classList.toggle("d-none", visible !== 0);
    }

    newsPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        newsPills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        activeNewsCategory = pill.dataset.filter;
        applyNewsFilter();
      });
    });

    newsSearch.addEventListener("input", applyNewsFilter);
  }

  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    const emailInput = document.getElementById("newsletterEmail");
    const msg = document.getElementById("newsletterMsg");

    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!emailInput.checkValidity()) {
        msg.textContent = "Please enter a valid email address.";
        msg.classList.add("error");
        return;
      }
      msg.textContent = "Thank you for subscribing!";
      msg.classList.remove("error");
      newsletterForm.reset();
    });
  }
})();




// News details page: reading progress bar + copy link
(function () {
  const ndProgress = document.getElementById("ndProgress");
  if (ndProgress) {
    const ndArticle = document.querySelector(".nd-article");
    function updateProgress() {
      if (!ndArticle) return;
      const rect = ndArticle.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.5;
      const done = Math.min(Math.max(-rect.top + window.innerHeight * 0.3, 0), total);
      ndProgress.style.width = (total > 0 ? (done / total) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  const ndCopy = document.getElementById("ndCopy");
  if (ndCopy) {
    const label = ndCopy.querySelector("span");
    ndCopy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        ndCopy.classList.add("copied");
        label.textContent = "Copied!";
        setTimeout(() => {
          ndCopy.classList.remove("copied");
          label.textContent = "Copy link";
        }, 2000);
      } catch (err) {
        window.prompt("Copy this link:", window.location.href);
      }
    });
  }
})();



// Career details page: deadline countdown, copy link, CV upload, application form
(function () {
  const form = document.getElementById("careerForm");
  if (!form) return;

  // 1. Days left (reads data-deadline="YYYY-MM-DD" on #cdDeadline)
  const deadlineBox = document.getElementById("cdDeadline");
  const daysEl = document.getElementById("cdDays");
  const daysLabel = document.getElementById("cdDaysLabel");
  const mobileDays = document.getElementById("cdMobileDays");
  if (deadlineBox && daysEl) {
    const [y, m, d] = deadlineBox.dataset.deadline.split("-").map(Number);
    const end = new Date(y, m - 1, d, 23, 59, 59);
    const days = Math.ceil((end - new Date()) / 86400000);
    if (days < 0) {
      deadlineBox.classList.add("is-closed");
      daysEl.textContent = "Closed";
      daysLabel.textContent = "Applications are no longer open";
      if (mobileDays) mobileDays.textContent = "Applications closed";
    } else {
      daysEl.textContent = days;
      daysLabel.textContent = days === 1 ? "day left to apply" : "days left to apply";
      deadlineBox.classList.toggle("is-urgent", days <= 7);
      if (mobileDays) mobileDays.textContent = days + (days === 1 ? " day left" : " days left");
    }
  }

  // 2. Copy job link
  const copyBtn = document.getElementById("cdCopy");
  if (copyBtn) {
    const label = copyBtn.querySelector("span");
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        copyBtn.classList.add("copied");
        label.textContent = "Link copied";
        setTimeout(() => {
          copyBtn.classList.remove("copied");
          label.textContent = "Copy job link";
        }, 2000);
      } catch (err) {
        window.prompt("Copy this link:", window.location.href);
      }
    });
  }

  // 3. CV upload (type + size check, drag and drop)
  const cv = document.getElementById("cfCv");
  const drop = document.getElementById("cdDrop");
  const dropText = document.getElementById("cdDropText");
  const dropDefault = dropText.innerHTML;
  const MAX_SIZE = 5 * 1024 * 1024;
  const okExt = /\.(pdf|docx?)$/i;

  function cvIsValid(file) {
    return !!file && okExt.test(file.name) && file.size <= MAX_SIZE;
  }

  function showCv() {
    const file = cv.files[0];
    drop.classList.remove("is-invalid", "has-file");
    if (!file) { dropText.innerHTML = dropDefault; return; }
    if (cvIsValid(file)) {
      drop.classList.add("has-file");
      dropText.textContent = file.name + " (" + (file.size / 1024 / 1024).toFixed(2) + " MB)";
    } else {
      drop.classList.add("is-invalid");
      dropText.innerHTML = dropDefault;
      cv.value = "";
    }
  }

  cv.addEventListener("change", showCv);
  ["dragenter", "dragover"].forEach((ev) =>
    drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("is-drag"); }));
  ["dragleave", "drop"].forEach((ev) =>
    drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("is-drag"); }));
  drop.addEventListener("drop", (e) => {
    if (e.dataTransfer.files.length) {
      cv.files = e.dataTransfer.files;
      showCv();
    }
  });

  // 4. Submit (demo: validates, then shows a success message. Replace with a POST to Laravel later)
  const msg = document.getElementById("careerMsg");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^\+?[0-9\s-]{8,16}$/;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll("input.form-control, select.form-control").forEach((field) => {
      const v = field.value.trim();
      let ok = field.required ? v !== "" : true;
      if (ok && field.type === "email") ok = emailRe.test(v);
      if (ok && field.type === "tel") ok = phoneRe.test(v);
      field.classList.toggle("is-invalid", !ok);
      if (!ok) valid = false;
    });

    if (!cvIsValid(cv.files[0])) {
      drop.classList.add("is-invalid");
      valid = false;
    }

    if (!valid) {
      msg.className = "cd-form-msg err";
      msg.textContent = "Please fix the highlighted fields.";
      const first = form.querySelector(".is-invalid");
      if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    msg.className = "cd-form-msg ok";
    msg.textContent = "Application sent. We will reply within 5 working days.";
    form.reset();
    drop.classList.remove("has-file", "is-invalid");
    dropText.innerHTML = dropDefault;
  });

  form.addEventListener("input", (e) => e.target.classList.remove("is-invalid"));

  // 5. Mobile apply bar: hide it while the form is on screen
  const bar = document.getElementById("cdMobileBar");
  const applyBox = document.getElementById("apply");
  if (bar && applyBox && "IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      bar.classList.toggle("is-hidden", entries[0].isIntersecting);
    }, { threshold: 0.1 }).observe(applyBox);
  }
})();


// Careers page: live search + filters, per-card days left
(function () {
  const grid = document.getElementById("crGrid");
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll(".cr-item"));
  const keyword = document.getElementById("crKeyword");
  const typeSel = document.getElementById("crType");
  const locSel = document.getElementById("crLocation");
  const chipsBox = document.getElementById("crChips");
  const chips = Array.from(chipsBox.querySelectorAll(".cr-chip"));
  const countEl = document.getElementById("crCount");
  const emptyEl = document.getElementById("crEmpty");
  let dept = "";

  // Days left on each card (reads data-deadline="YYYY-MM-DD")
  items.forEach((item) => {
    const card = item.querySelector(".cr-card");
    const label = item.querySelector(".cr-days");
    const [y, m, d] = card.dataset.deadline.split("-").map(Number);
    const days = Math.ceil((new Date(y, m - 1, d, 23, 59, 59) - new Date()) / 86400000);
    if (days < 0) {
      card.classList.add("is-closed");
      label.textContent = "Closed";
    } else if (days === 0) {
      label.textContent = "Last day";
      label.classList.add("is-urgent");
    } else {
      label.textContent = days + (days === 1 ? " day left" : " days left");
      label.classList.toggle("is-urgent", days <= 7);
    }
  });

  // Department counts come from the cards, so the chips always match the list
  chips.forEach((chip) => {
    const n = chip.dataset.dept
      ? items.filter((i) => i.dataset.dept === chip.dataset.dept).length
      : items.length;
    chip.querySelector("span").textContent = n;
  });

  function applyFilters() {
    const q = keyword.value.trim().toLowerCase();
    let shown = 0;
    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      const ok =
        (!q || text.includes(q)) &&
        (!dept || item.dataset.dept === dept) &&
        (!typeSel.value || item.dataset.type === typeSel.value) &&
        (!locSel.value || item.dataset.location === locSel.value);
      item.hidden = !ok;
      if (ok) shown++;
    });
    countEl.textContent = "Showing " + shown + " of " + items.length + " positions";
    emptyEl.hidden = shown !== 0;
  }

  keyword.addEventListener("input", applyFilters);
  typeSel.addEventListener("change", applyFilters);
  locSel.addEventListener("change", applyFilters);

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      dept = chip.dataset.dept;
      chips.forEach((c) => c.classList.toggle("active", c === chip));
      applyFilters();
    });
  });

  document.getElementById("crReset").addEventListener("click", () => {
    keyword.value = "";
    typeSel.value = "";
    locSel.value = "";
    dept = "";
    chips.forEach((c) => c.classList.toggle("active", !c.dataset.dept));
    applyFilters();
  });

  applyFilters();
})();





(function () {
  var KEY = 'inquiryItems';
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function qtyOf() {
    var q = document.getElementById('pdQty');
    return q ? (parseInt(q.value, 10) || 1) : 1;
  }
  function mark(btn, on) {
    btn.classList.toggle('added', on);
    btn.querySelector('i').className = on ? 'fa-solid fa-check' : 'fa-solid fa-plus';
    btn.querySelector('span').textContent = on ? 'Added' : 'Add to Inquiry';
  }
  var list = read().map(function (x) { return typeof x === 'string' ? x : x.name; });
  document.querySelectorAll('.cat-add').forEach(function (btn) {
    mark(btn, list.indexOf(btn.dataset.name) > -1);
    btn.addEventListener('click', function () {
      var items = read(), i = items.findIndex(function (x) { return (x.name || x) === btn.dataset.name; });
      if (i > -1) items.splice(i, 1); else items.push({ name: btn.dataset.name, qty: qtyOf() });
      try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { }
      mark(btn, i === -1);
      if (typeof updateInquiryCount === 'function') updateInquiryCount();
    });
  });
  var links = document.querySelectorAll('#catBar a');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    links.forEach(function (l) { var t = document.querySelector(l.getAttribute('href')); if (t) io.observe(t); });
  }
})();


(function () {
  var PER = 9;
  var grid = document.getElementById('plGrid');
  if (!grid) return; // not the product list page
  var items = Array.prototype.slice.call(grid.querySelectorAll('.pl-item'));
  var st = { cat: 'all', brands: [], q: '', sort: 'default', page: 1 };
  var catLabels = {};
  document.querySelectorAll('.pl-cat').forEach(function (b) { catLabels[b.dataset.cat] = b.querySelector('span').textContent; });

  function render() {
    var list = items.filter(function (el) {
      var n = el.dataset.name.toLowerCase();
      return (st.cat === 'all' || el.dataset.cat === st.cat || el.dataset.sub === st.cat) &&
        (!st.brands.length || st.brands.indexOf(el.dataset.brand) > -1) &&
        (!st.q || n.indexOf(st.q) > -1);
    });
    if (st.sort !== 'default') {
      list.sort(function (a, b) { return a.dataset.name.localeCompare(b.dataset.name) * (st.sort === 'za' ? -1 : 1); });
    } else {
      list.sort(function (a, b) { return items.indexOf(a) - items.indexOf(b); });
    }
    var pages = Math.max(1, Math.ceil(list.length / PER));
    if (st.page > pages) st.page = pages;
    var start = (st.page - 1) * PER, end = start + PER;
    items.forEach(function (el) { el.classList.add('d-none'); });
    list.forEach(function (el, i) { grid.appendChild(el); el.classList.toggle('d-none', i < start || i >= end); });

    document.getElementById('plCount').textContent = list.length
      ? 'Showing ' + (start + 1) + ' to ' + Math.min(end, list.length) + ' of ' + list.length + ' products'
      : 'No products found';
    document.getElementById('plEmpty').classList.toggle('d-none', list.length > 0);

    var pg = document.getElementById('plPager'); pg.innerHTML = '';
    if (pages > 1) {
      var h = '<button type="button" data-p="' + (st.page - 1) + '"' + (st.page === 1 ? ' disabled' : '') + ' aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button>';
      for (var p = 1; p <= pages; p++) h += '<button type="button" data-p="' + p + '"' + (p === st.page ? ' class="active"' : '') + '>' + p + '</button>';
      h += '<button type="button" data-p="' + (st.page + 1) + '"' + (st.page === pages ? ' disabled' : '') + ' aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>';
      pg.innerHTML = h;
    }

    var chips = document.getElementById('plChips'); chips.innerHTML = '';
    if (st.cat !== 'all') chips.innerHTML += '<span class="pl-chip">' + catLabels[st.cat] + '<button type="button" data-rm="cat" aria-label="Remove">&times;</button></span>';
    st.brands.forEach(function (b) { chips.innerHTML += '<span class="pl-chip">' + b + '<button type="button" data-rm="' + b + '" aria-label="Remove">&times;</button></span>'; });

    document.querySelectorAll('.pl-cat').forEach(function (b) { b.classList.toggle('active', b.dataset.cat === st.cat); });
    document.querySelectorAll('.pl-node').forEach(function (n) {
      var key = n.querySelector('.pl-cat').dataset.cat;
      var kidOn = !!n.querySelector('.pl-child.active');
      n.querySelector('.pl-cat').classList.toggle('parent-active', kidOn);
      if (kidOn || st.cat === key) n.classList.add('open');
    });
    document.querySelectorAll('.pl-brand input').forEach(function (c) { c.checked = st.brands.indexOf(c.value) > -1; });
  }
  function reset() { st = { cat: 'all', brands: [], q: '', sort: st.sort, page: 1 }; document.getElementById('plSearch').value = ''; render(); }

  document.querySelectorAll('.pl-toggle').forEach(function (t) { t.addEventListener('click', function () { t.closest('.pl-node').classList.toggle('open'); }); });
  document.querySelectorAll('.pl-cat').forEach(function (b) { b.addEventListener('click', function () { st.cat = b.dataset.cat; st.page = 1; render(); }); });
  document.querySelectorAll('.pl-brand input').forEach(function (c) {
    c.addEventListener('change', function () {
      st.brands = Array.prototype.filter.call(document.querySelectorAll('.pl-brand input'), function (x) { return x.checked; }).map(function (x) { return x.value; });
      st.page = 1; render();
    });
  });
  document.getElementById('plSearch').addEventListener('input', function (e) { st.q = e.target.value.trim().toLowerCase(); st.page = 1; render(); });
  document.getElementById('plSort').addEventListener('change', function (e) { st.sort = e.target.value; render(); });
  document.getElementById('plReset').addEventListener('click', reset);
  document.getElementById('plEmptyReset').addEventListener('click', reset);
  document.getElementById('plPager').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-p]'); if (!b || b.disabled) return;
    st.page = +b.dataset.p; render(); document.getElementById('plGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.getElementById('plChips').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-rm]'); if (!b) return;
    if (b.dataset.rm === 'cat') st.cat = 'all'; else st.brands = st.brands.filter(function (x) { return x !== b.dataset.rm; });
    st.page = 1; render();
  });
  document.querySelectorAll('.pl-view button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.pl-view button').forEach(function (x) { x.classList.toggle('active', x === b); });
      grid.classList.toggle('pl-list', b.dataset.view === 'list');
    });
  });

})();




// Product details: gallery (thumbnails, arrows, keyboard)
(function () {
  var main = document.getElementById('pdMain');
  var stage = document.getElementById('pdStage');
  var box = document.querySelector('.pd-thumbs');
  if (!main || !box) return; // not the product details page

  var thumbs = Array.prototype.slice.call(box.querySelectorAll('.pd-thumb'));

  function show(i) {
    i = (i + thumbs.length) % thumbs.length;
    main.style.display = '';
    main.src = thumbs[i].dataset.src;
    thumbs.forEach(function (t, n) { t.classList.toggle('active', n === i); });
  }
  function current() {
    return thumbs.findIndex(function (t) { return t.classList.contains('active'); });
  }

  // click on a small image
  box.addEventListener('click', function (e) {
    var btn = e.target.closest('.pd-thumb');
    if (btn) show(thumbs.indexOf(btn));
  });

  // arrows + keyboard
  var prev = document.querySelector('.pd-prev'), next = document.querySelector('.pd-next');
  if (prev) prev.addEventListener('click', function () { show(current() - 1); });
  if (next) next.addEventListener('click', function () { show(current() + 1); });
  if (stage) stage.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(current() - 1);
    if (e.key === 'ArrowRight') show(current() + 1);
  });
})();

/* ===== Product details: Qty stepper ===== */
(function () {
  var input = document.getElementById('pdQty');
  if (!input) return;
  var MIN = 1, MAX = 999;

  function clamp(v) {
    v = parseInt(v, 10);
    if (isNaN(v) || v < MIN) v = MIN;
    if (v > MAX) v = MAX;
    return v;
  }

  function sync() {
    var v = clamp(input.value);
    input.value = v;
    var btn = document.querySelector('.pd-add.added');
    if (!btn) return;
    var items;
    try { items = JSON.parse(localStorage.getItem('inquiryItems') || '[]'); } catch (e) { return; }
    items.forEach(function (x) { if (x.name === btn.dataset.name) x.qty = v; });
    try { localStorage.setItem('inquiryItems', JSON.stringify(items)); } catch (e) { }
  }

  document.querySelectorAll('.pd-qty-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      input.value = clamp((parseInt(input.value, 10) || MIN) + parseInt(b.dataset.qty, 10));
      sync();
    });
  });

  input.addEventListener('change', sync);
  input.addEventListener('keydown', function (e) {
    if (['e', 'E', '+', '-', '.'].indexOf(e.key) > -1) e.preventDefault();
  });
})();


/* ===== Inquiry page ===== */
(function () {
  var list = document.getElementById('iqList');
  if (!list) return;                         // only on inquiry.html

  var KEY = 'inquiryItems', MAX = 999;
  var content = document.getElementById('iqContent'), empty = document.getElementById('iqEmpty');
  var countEl = document.getElementById('iqCount'), totItems = document.getElementById('iqTotalItems'), totQty = document.getElementById('iqTotalQty');

  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]').map(function (x) {
        return typeof x === 'string' ? { name: x, qty: 1 } : { name: x.name, qty: Math.max(1, parseInt(x.qty, 10) || 1) };
      });
    } catch (e) { return []; }
  }
  function save(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { }
    if (typeof updateInquiryCount === 'function') updateInquiryCount();
  }
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function clamp(v) { v = parseInt(v, 10); return isNaN(v) || v < 1 ? 1 : Math.min(v, MAX); }

  function totals(items) {
    countEl.textContent = items.length;
    totItems.textContent = items.length;
    totQty.textContent = items.reduce(function (s, x) { return s + x.qty; }, 0);
  }

  function render() {
    var items = read();
    content.hidden = !items.length;
    empty.hidden = items.length > 0;
    list.innerHTML = items.map(function (x, i) {
      return '<li class="iq-item" data-i="' + i + '">' +
        '<span class="iq-thumb"><i class="fa-solid fa-cube"></i></span>' +
        '<div><h3 class="iq-name">' + esc(x.name) + '</h3><span class="iq-meta">Quotation on request</span></div>' +
        '<div class="iq-qty"><button type="button" data-act="dec" aria-label="Decrease"><i class="fa-solid fa-minus"></i></button>' +
        '<input type="number" min="1" max="' + MAX + '" value="' + x.qty + '" aria-label="Quantity">' +
        '<button type="button" data-act="inc" aria-label="Increase"><i class="fa-solid fa-plus"></i></button></div>' +
        '<button type="button" class="iq-remove" data-act="rm" aria-label="Remove"><i class="fa-regular fa-trash-can"></i></button></li>';
    }).join('');
    totals(items);
  }

  function setQty(i, v) {
    var items = read(); if (!items[i]) return;
    items[i].qty = clamp(v); save(items); totals(items);
    return items[i].qty;
  }

  list.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var li = b.closest('.iq-item'), i = +li.dataset.i, input = li.querySelector('input');
    if (b.dataset.act === 'rm') {
      li.classList.add('removing');
      setTimeout(function () { var items = read(); items.splice(i, 1); save(items); render(); }, 250);
    } else {
      input.value = setQty(i, clamp(input.value) + (b.dataset.act === 'inc' ? 1 : -1));
    }
  });
  list.addEventListener('change', function (e) {
    if (e.target.tagName !== 'INPUT') return;
    var li = e.target.closest('.iq-item');
    e.target.value = setQty(+li.dataset.i, e.target.value);
  });
  list.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' && ['e', 'E', '+', '-', '.'].indexOf(e.key) > -1) e.preventDefault();
  });

  document.getElementById('iqClear').addEventListener('click', function () {
    if (confirm('Remove all products from your inquiry list?')) { save([]); render(); }
  });

  // form
  var form = document.getElementById('iqForm'), ok = document.getElementById('iqSuccess');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = false;
    form.querySelectorAll('[required]').forEach(function (f) {
      var v = f.value.trim(), invalid = !v || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(v));
      f.classList.toggle('invalid', invalid); if (invalid) bad = true;
    });
    if (bad) return;
    // TODO: send { fields, items: read() } to backend
    form.hidden = true; ok.hidden = false;
    document.querySelector('.iq-side-sub').hidden = true;
    save([]);
    document.querySelectorAll('.cat-add.added').forEach(function (b) { b.classList.remove('added'); });
  });
  form.addEventListener('input', function (e) { e.target.classList.remove('invalid'); });

  render();
})();