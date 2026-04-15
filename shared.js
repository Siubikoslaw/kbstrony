// shared.js — inject nav, footer, scroll reveal, mobile menu

function getPage() {
  const p = location.pathname.split('/').pop() || 'index.html';
  return p;
}

function injectNav() {
  const page = getPage();
  const links = [
    { href: 'index.html', label: 'Strona główna' },
    { href: 'uslugi.html', label: 'Usługi' },
    { href: 'portfolio.html', label: 'Portfolio' },
    { href: 'cennik.html', label: 'Cennik' },
    { href: 'o-mnie.html', label: 'O mnie' },
    { href: 'faq.html', label: 'FAQ' },
  ];

  const navHTML = `
  <nav id="main-nav">
    <div class="nav-inner">
      <a href="index.html" class="nav-logo">KB<em>.</em>WebDesign</a>
      <ul class="nav-links">
        ${links.map(l => `<li><a href="${l.href}" class="${page === l.href ? 'active' : ''}">${l.label}</a></li>`).join('')}
        <li class="nav-cta-wrap"><a href="kontakt.html" class="nav-cta">Bezpłatna wycena</a></li>
      </ul>
      <div class="nav-burger" onclick="toggleMenu()">
        <span></span><span></span><span></span>
      </div>
    </div>
  </nav>
  <div class="nav-mobile" id="nav-mobile">
    ${links.map(l => `<a href="${l.href}" onclick="toggleMenu()">${l.label}</a>`).join('')}
    <a href="kontakt.html" style="color:var(--accent2)!important;" onclick="toggleMenu()">→ Bezpłatna wycena</a>
  </div>`;

  document.body.insertAdjacentHTML('afterbegin', navHTML);

  window.addEventListener('scroll', () => {
    document.getElementById('main-nav').classList.toggle('scrolled', scrollY > 60);
  });
}

function toggleMenu() {
  document.getElementById('nav-mobile').classList.toggle('open');
}

function injectFooter() {
  const footerHTML = `
  <footer>
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="nav-logo" style="font-size:20px; font-family:var(--font-display); font-weight:800; letter-spacing:-0.05em; color:var(--text);">KB<em style="color:var(--accent2); font-style:normal;">.</em>WebDesign</div>
        <p>Tworzę strony internetowe, które wyglądają premium i realnie przyciągają klientów. Bezpośredni kontakt, szybka realizacja, gwarancja satysfakcji.</p>
      </div>
      <div class="footer-col">
        <h5>Usługi</h5>
        <a href="uslugi.html">Strony internetowe</a>
        <a href="uslugi.html">Redesign strony</a>
        <a href="uslugi.html">Landing Page</a>
        <a href="uslugi.html">Opieka techniczna</a>
      </div>
      <div class="footer-col">
        <h5>Firma</h5>
        <a href="o-mnie.html">O mnie</a>
        <a href="portfolio.html">Portfolio</a>
        <a href="cennik.html">Cennik</a>
        <a href="faq.html">FAQ</a>
      </div>
      <div class="footer-col">
        <h5>Kontakt</h5>
        <a href="mailto:kontakt@kbwebdesign.pl">kontakt@kbwebdesign.pl</a>
        <a href="tel:+48123456789">+48 123 456 789</a>
        <a href="kontakt.html">Formularz kontaktowy</a>
        <a href="kontakt.html" style="color:var(--accent2); margin-top:8px; display:block;">→ Bezpłatna wycena</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2025 KB WebDesign. Wszelkie prawa zastrzeżone.</span>
      <span>Zrealizowano z pasją w Polsce 🇵🇱</span>
    </div>
  </footer>`;
  document.body.insertAdjacentHTML('beforeend', footerHTML);
}

function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('up'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  injectNav();
  injectFooter();
  initReveal();
});
