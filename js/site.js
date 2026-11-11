/*
  Elyrion — общий скрипт сайта.
  Что делает: собирает шапку и подвал, переключает тему и язык (RU/EN),
  выводит новости из js/news-data.js и оживляет главный знак на главной.

  Тексты: русский лежит прямо в HTML, английский — в js/en.js по ключу из data-i18n.
*/
(function () {
  'use strict';

  var root = document.documentElement;
  var EN = window.ELYRION_EN || {};
  var NEWS = window.ELYRION_NEWS || [];

  var LINKS = {
    app: 'https://elyon-ai-web.vercel.app/auth.html',
    download: 'https://elyon-ai-web.vercel.app/#download',
    privacy: 'https://elyon-ai-web.vercel.app/privacy.html',
    x: 'https://x.com/Elyon_AI',
    instagram: 'https://www.instagram.com/elyon_ai_/'
  };

  var STORE = { theme: 'elyrion-theme', lang: 'elyrion-lang' };

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { /* хранилище недоступно — работаем без запоминания */ }
    return null;
  }

  /* ---------- Шапка и подвал ---------- */

  var MARKS =
    '<img class="mark mark--for-light" src="assets/img/mark-for-light-theme.png" alt="" width="32" height="32">' +
    '<img class="mark mark--for-dark" src="assets/img/mark-for-dark-theme.png" alt="" width="32" height="32">';

  function headerHtml() {
    return '' +
      '<a class="skip-link" href="#main" data-i18n="chrome.skip">Перейти к содержимому</a>' +
      '<header class="site-header">' +
        '<div class="wrap header-inner">' +
          '<a class="brand" href="index.html" aria-label="Elyrion — на главную" data-i18n-attr="aria-label:chrome.home">' +
            MARKS + '<span class="brand-name">Elyrion</span>' +
          '</a>' +
          '<nav class="nav" id="site-nav" aria-label="Основная навигация" data-i18n-attr="aria-label:chrome.nav">' +
            '<ul class="nav-list">' +
              '<li><a class="nav-link" data-page="products" href="products.html" data-i18n="nav.products">Продукты</a></li>' +
              '<li class="has-menu">' +
                '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu-company" data-i18n="nav.company">Компания</button>' +
                '<ul class="menu" id="menu-company">' +
                  menuItem('about', 'nav.about', 'О нас', 'nav.about.d', 'Кто мы и как работаем') +
                  menuItem('principles', 'nav.principles', 'Принципы', 'nav.principles.d', 'Чем мы руководствуемся') +
                  menuItem('careers', 'nav.careers', 'Карьера', 'nav.careers.d', 'Как присоединиться к нам') +
                  menuItem('contact', 'nav.contact', 'Контакты', 'nav.contact.d', 'Связаться с командой') +
                '</ul>' +
              '</li>' +
              '<li><a class="nav-link" data-page="news" href="news.html" data-i18n="nav.news">Новости</a></li>' +
            '</ul>' +
          '</nav>' +
          '<div class="tools">' +
            '<div class="lang" role="group" aria-label="Язык" data-i18n-attr="aria-label:chrome.lang">' +
              '<button type="button" data-lang="ru" aria-pressed="false">RU</button>' +
              '<button type="button" data-lang="en" aria-pressed="false">EN</button>' +
            '</div>' +
            '<button class="icon-btn" type="button" id="theme-toggle" aria-label="Сменить тему" data-i18n-attr="aria-label:chrome.theme">' +
              '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z"/></svg>' +
              '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
            '</button>' +
            '<a class="btn btn--primary btn--small header-cta" href="' + LINKS.app + '" data-i18n="nav.open">Открыть Elyon AI</a>' +
            '<button class="icon-btn burger" type="button" id="burger" aria-expanded="false" aria-controls="site-nav" aria-label="Меню" data-i18n-attr="aria-label:chrome.menu">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</header>';
  }

  function menuItem(page, titleKey, title, descKey, desc) {
    return '<li><a class="menu-link" data-page="' + page + '" href="' + page + '.html">' +
      '<strong data-i18n="' + titleKey + '">' + title + '</strong>' +
      '<span data-i18n="' + descKey + '">' + desc + '</span></a></li>';
  }

  function footerHtml() {
    return '' +
      '<footer class="site-footer">' +
        '<div class="wrap">' +
          '<div class="footer-top">' +
            '<div>' +
              '<a class="brand" href="index.html" aria-label="Elyrion — на главную" data-i18n-attr="aria-label:chrome.home">' +
                MARKS + '<span class="brand-name">Elyrion</span>' +
              '</a>' +
              '<p class="footer-note" data-i18n="foot.note">Elyrion — бренд и команда, которая создаёт Elyon AI.</p>' +
            '</div>' +
            '<nav class="footer-cols" aria-label="Навигация внизу страницы" data-i18n-attr="aria-label:foot.nav">' +
              '<div>' +
                '<h2 class="footer-h" data-i18n="foot.products">Продукты</h2>' +
                '<ul class="footer-list">' +
                  '<li><a href="products.html">Elyon AI</a></li>' +
                  '<li><a href="' + LINKS.app + '" data-i18n="foot.webapp">Веб-приложение</a></li>' +
                  '<li><a href="' + LINKS.download + '" data-i18n="foot.download">Скачать приложение</a></li>' +
                '</ul>' +
              '</div>' +
              '<div>' +
                '<h2 class="footer-h" data-i18n="foot.company">Компания</h2>' +
                '<ul class="footer-list">' +
                  '<li><a href="about.html" data-i18n="nav.about">О нас</a></li>' +
                  '<li><a href="principles.html" data-i18n="nav.principles">Принципы</a></li>' +
                  '<li><a href="news.html" data-i18n="nav.news">Новости</a></li>' +
                  '<li><a href="careers.html" data-i18n="nav.careers">Карьера</a></li>' +
                  '<li><a href="contact.html" data-i18n="nav.contact">Контакты</a></li>' +
                '</ul>' +
              '</div>' +
              '<div>' +
                '<h2 class="footer-h" data-i18n="foot.follow">Мы в сети</h2>' +
                '<ul class="footer-list">' +
                  '<li><a href="' + LINKS.x + '" target="_blank" rel="noopener noreferrer">X</a></li>' +
                  '<li><a href="' + LINKS.instagram + '" target="_blank" rel="noopener noreferrer">Instagram</a></li>' +
                  '<li><a href="' + LINKS.privacy + '" data-i18n="foot.privacy">Приватность Elyon AI</a></li>' +
                '</ul>' +
              '</div>' +
            '</nav>' +
          '</div>' +
          '<p class="footer-bottom">© 2026 Elyrion</p>' +
        '</div>' +
      '</footer>';
  }

  function mountChrome() {
    var h = $('#site-header');
    var f = $('#site-footer');
    if (h) h.outerHTML = headerHtml();
    if (f) f.outerHTML = footerHtml();

    var page = (location.pathname.split('/').pop() || 'index').replace(/\.html$/, '') || 'index';
    $$('[data-page]').forEach(function (a) {
      if (a.getAttribute('data-page') === page) {
        a.setAttribute('aria-current', 'page');
        var menu = a.closest('.has-menu');
        if (menu) $('.menu-btn', menu).setAttribute('aria-current', 'true');
      }
    });
  }

  /* ---------- Язык ---------- */

  function currentLang() { return root.lang === 'en' ? 'en' : 'ru'; }

  function applyI18n(lang) {
    root.lang = lang;

    $$('[data-i18n]').forEach(function (el) {
      if (el.dataset.ru === undefined) el.dataset.ru = el.textContent;
      var key = el.dataset.i18n;
      if (lang === 'en') {
        if (EN[key] === undefined) { console.warn('[i18n] нет английского текста для ключа:', key); el.textContent = el.dataset.ru; }
        else el.textContent = EN[key];
      } else {
        el.textContent = el.dataset.ru;
      }
    });

    $$('[data-i18n-attr]').forEach(function (el) {
      el.dataset.i18nAttr.split(';').forEach(function (pair) {
        var parts = pair.split(':');
        var attr = parts[0].trim();
        var key = parts[1] && parts[1].trim();
        if (!attr || !key) return;
        var memo = 'ru' + attr.replace(/(^|-)(\w)/g, function (m, a, b) { return b.toUpperCase(); });
        if (el.dataset[memo] === undefined) el.dataset[memo] = el.getAttribute(attr) || '';
        el.setAttribute(attr, lang === 'en' && EN[key] !== undefined ? EN[key] : el.dataset[memo]);
      });
    });

    $$('[data-i18n-content]').forEach(function (el) {
      if (el.dataset.ru === undefined) el.dataset.ru = el.getAttribute('content') || '';
      var key = el.dataset.i18nContent;
      el.setAttribute('content', lang === 'en' && EN[key] !== undefined ? EN[key] : el.dataset.ru);
    });

    $$('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });

    renderNews(lang);
  }

  function setLang(lang) {
    store(STORE.lang, lang);
    applyI18n(lang);
  }

  /* ---------- Тема ---------- */

  function setTheme(theme) {
    root.dataset.theme = theme;
    store(STORE.theme, theme);
  }

  function effectiveTheme() {
    return root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  /* ---------- Новости ---------- */

  function renderNews(lang) {
    var list = $('#news-list');
    var empty = $('#news-empty');
    var homeSection = $('#home-news-section');
    var homeList = $('#home-news');

    var items = NEWS.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var fmt;
    try { fmt = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { fmt = null; }

    function pick(obj) { return (obj && (obj[lang] || obj.ru)) || ''; }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

    function itemHtml(n) {
      var title = esc(pick(n.title));
      var head = n.url ? '<a href="' + esc(n.url) + '">' + title + '</a>' : title;
      var d = new Date(n.date + 'T00:00:00');
      var dateText = fmt && !isNaN(d) ? fmt.format(d) : n.date;
      return '<li class="news-item"><time class="news-date" datetime="' + esc(n.date) + '">' + esc(dateText) + '</time>' +
        '<div><h3 class="news-title">' + head + '</h3><p class="news-summary">' + esc(pick(n.summary)) + '</p></div></li>';
    }

    if (list) {
      list.innerHTML = items.map(itemHtml).join('');
      list.hidden = items.length === 0;
      if (empty) empty.hidden = items.length !== 0;
    }
    if (homeSection && homeList) {
      homeList.innerHTML = items.slice(0, 3).map(itemHtml).join('');
      homeSection.hidden = items.length === 0;
    }
  }

  /* ---------- Взаимодействия ---------- */

  function bindChrome() {
    var header = $('.site-header');

    $$('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
    });

    var themeBtn = $('#theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', function () {
      setTheme(effectiveTheme() === 'dark' ? 'light' : 'dark');
    });

    // Выпадающее меню «Компания»
    var menuBtn = $('.menu-btn');
    var menu = $('#menu-company');
    function closeMenu() {
      if (!menuBtn) return;
      menuBtn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    }
    if (menuBtn && menu) {
      menuBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
        menu.classList.toggle('is-open', !open);
      });
      document.addEventListener('click', function (e) { if (!menu.contains(e.target)) closeMenu(); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) { closeMenu(); menuBtn.focus(); }
      });
    }

    // Мобильное меню
    var burger = $('#burger');
    function setNav(open) {
      document.body.classList.toggle('nav-open', open);
      root.classList.toggle('nav-locked', open);
      if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if (burger) burger.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-open')); });
    $$('.nav a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
    matchMedia('(min-width: 56.01rem)').addEventListener('change', function (e) { if (e.matches) setNav(false); });

    // Линия под шапкой после прокрутки
    function onScroll() { root.classList.toggle('is-scrolled', window.scrollY > 8); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    if (header) header.removeAttribute('hidden');
  }

  // Знак на главной слегка следует за курсором: единственное «живое» место страницы
  function bindHero() {
    var hero = $('.hero');
    var mark = $('.hero-mark');
    if (!hero || !mark) return;
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var raf = 0;
    hero.addEventListener('pointermove', function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var r = hero.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5;
        var ny = (e.clientY - r.top) / r.height - 0.5;
        mark.style.setProperty('--tx', (nx * 22).toFixed(1) + 'px');
        mark.style.setProperty('--ty', (ny * 16).toFixed(1) + 'px');
        mark.style.setProperty('--tr', (nx * 5).toFixed(2) + 'deg');
        hero.style.setProperty('--hx', ((nx + 0.5) * 100).toFixed(1) + '%');
        hero.style.setProperty('--hy', ((ny + 0.5) * 100).toFixed(1) + '%');
      });
    });
    hero.addEventListener('pointerleave', function () {
      mark.style.setProperty('--tx', '0px');
      mark.style.setProperty('--ty', '0px');
      mark.style.setProperty('--tr', '0deg');
      hero.style.removeProperty('--hx');
      hero.style.removeProperty('--hy');
    });
  }

  /* ---------- Запуск ---------- */

  mountChrome();
  bindChrome();
  bindHero();
  applyI18n(currentLang());
  root.classList.add('is-ready');

  // Если пользователь не выбирал тему сам, следуем за системной
  var mq = matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', function (e) {
    if (!store(STORE.theme)) root.dataset.theme = e.matches ? 'dark' : 'light';
  });
})();
