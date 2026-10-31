// shared.js: nav behaviour, scroll motion, FAQ, consent-gated analytics
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* NAV + PROGRESS */
  var nav = document.getElementById('main-nav');
  var bar = document.getElementById('progress');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      if (nav) nav.classList.toggle('scrolled', y > 40);
      if (bar) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = document.getElementById('nav-burger');
  var mobile = document.getElementById('nav-mobile');
  function setMenu(open) {
    if (!burger || !mobile) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobile.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    mobile.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* REVEAL (with optional stagger on containers) */
  document.querySelectorAll('[data-stagger]').forEach(function (box) {
    var step = parseFloat(box.getAttribute('data-stagger')) || 0.08;
    box.querySelectorAll(':scope > .reveal').forEach(function (el, i) { el.style.setProperty('--d', (i * step).toFixed(2) + 's'); });
  });
  var targets = document.querySelectorAll('.reveal, .proc-grid');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  /* COUNT UP */
  var counters = document.querySelectorAll('[data-count]');
  function runCount(el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = end + suffix; return; }
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(end * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* FAQ (accessible accordion) */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var open = item.classList.contains('open');
      var scope = btn.closest('.faq-wrap') || document;
      scope.querySelectorAll('.faq-item.open').forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!open) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });
  document.querySelectorAll('.cat-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var cat = tab.getAttribute('data-cat');
      document.querySelectorAll('.cat-tab').forEach(function (t) {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-pressed', t === tab ? 'true' : 'false');
      });
      document.querySelectorAll('.faq-cat').forEach(function (c) {
        c.hidden = !(cat === 'all' || c.getAttribute('data-cat') === cat);
      });
    });
  });

  /* FOOTER YEAR */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* CONSENT-GATED ANALYTICS (Google Tag Manager loads only after acceptance) */
  var GTM_ID = 'GTM-PT43JN3P';
  var KEY = 'kb-cookie-consent';
  function loadGTM() {
    if (window.__gtmLoaded) return;
    window.__gtmLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(s);
  }
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === 'granted') {
    loadGTM();
  } else if (saved !== 'denied') {
    var box = document.createElement('div');
    box.className = 'cookie';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Zgoda na pliki cookie');
    box.innerHTML =
      '<h2>Pliki cookie</h2>' +
      '<p>Ta strona korzysta z analityki (Google Tag Manager), aby sprawdzać, które podstrony działają najlepiej. Włączamy ją tylko za Twoją zgodą.</p>' +
      '<div class="row"><button class="btn btn-primary btn-sm" data-c="granted" type="button">Zgadzam się</button>' +
      '<button class="btn btn-ghost btn-sm" data-c="denied" type="button">Odrzucam</button></div>';
    document.body.appendChild(box);
    setTimeout(function () { box.classList.add('show'); }, 1200);
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-c]');
      if (!b) return;
      var v = b.getAttribute('data-c');
      try { localStorage.setItem(KEY, v); } catch (err) {}
      if (v === 'granted') loadGTM();
      box.classList.remove('show');
      setTimeout(function () { box.remove(); }, 800);
    });
  }
})();
