/*
 * Estalvia design proposal helpers (static prototype only).
 * - Theme switch (light default, optional dark) persisted in localStorage.
 * - Shared app/admin navigation injected so every screen stays in sync.
 * - ApexCharts defaults using the Estalvia palette from estalvia-theme.css.
 * In the real application the layout is rendered by PHP views.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'estalvia-theme';
  var root = document.documentElement;

  function storedTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function applyTheme(theme) {
    root.setAttribute('data-bs-theme', theme === 'dark' ? 'dark' : 'light');
  }
  // Light is the default; dark only when the user picked it (or ?theme=dark).
  var param = new URLSearchParams(location.search).get('theme');
  applyTheme(param || storedTheme() || 'light');

  function toggleTheme() {
    var next = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
    document.dispatchEvent(new CustomEvent('estalvia:themechange', { detail: next }));
  }
  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest('[data-est-theme-toggle]');
    if (btn) { ev.preventDefault(); toggleTheme(); }
  });

  /* ---------------------------------------------------------------- */
  /* Logo                                                              */
  /* ---------------------------------------------------------------- */
  var MARKS = {
    // A: savings pyramid (three tiers) — the methodology of the product.
    pyramid: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect class="est-logo-mark-bg" width="32" height="32" rx="8"/><rect class="est-logo-mark-fg" x="13" y="7.5" width="6" height="4.5" rx="1.5"/><rect class="est-logo-mark-fg" x="9.5" y="13.75" width="13" height="4.5" rx="1.5"/><rect class="est-logo-mark-fg" x="6" y="20" width="20" height="4.5" rx="1.5"/></svg>',
    // B: coin dropping into a slot.
    coin: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect class="est-logo-mark-bg" width="32" height="32" rx="8"/><circle class="est-logo-mark-fg" cx="16" cy="12.5" r="5.5"/><rect class="est-logo-mark-fg" x="7" y="21" width="18" height="3.5" rx="1.75"/></svg>',
    // C: rising steps.
    steps: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect class="est-logo-mark-bg" width="32" height="32" rx="16"/><rect class="est-logo-mark-fg" x="8" y="18" width="4.5" height="6" rx="1.5"/><rect class="est-logo-mark-fg" x="13.75" y="13" width="4.5" height="11" rx="1.5"/><rect class="est-logo-mark-fg" x="19.5" y="8" width="4.5" height="16" rx="1.5"/></svg>'
  };
  function logo(opts) {
    opts = opts || {};
    var cls = 'est-logo' + (opts.size === 'lg' ? ' est-logo-lg' : '');
    return '<a href="' + (opts.href || 'index.html') + '" class="' + cls + '" aria-label="Estalvia">' +
      MARKS[opts.mark || 'pyramid'] + '<span>estalvia</span></a>';
  }

  /* ---------------------------------------------------------------- */
  /* Navigation                                                        */
  /* ---------------------------------------------------------------- */
  var APP_NAV = [
    { id: 'dashboard', label: 'Inici', icon: 'home', href: 'dashboard.html' },
    { id: 'accounts', label: 'Comptes', icon: 'building-bank', href: 'accounts.html' },
    { id: 'transactions', label: 'Moviments', icon: 'arrows-exchange', href: 'transactions.html', badge: '7' },
    { id: 'import', label: 'Importa', icon: 'file-import', href: 'import.html' },
    { heading: 'Estalviar' },
    { id: 'diagnosis', label: 'Diagnòstic', icon: 'heart-rate-monitor', href: 'diagnosis.html' },
    { id: 'advisor-plan', label: 'Pla d\'acció', icon: 'list-check', href: 'advisor-plan.html' },
    { id: 'advisor-chat', label: 'Assessor', icon: 'message-chatbot', href: 'advisor-chat.html' },
    { id: 'budgets-goals', label: 'Pressupostos i objectius', icon: 'target-arrow', href: 'budgets-goals.html' },
    { id: 'simulators', label: 'Simuladors', icon: 'calculator', href: 'simulators.html' },
    { heading: 'Compte' },
    { id: 'billing', label: 'Subscripció', icon: 'credit-card', href: 'billing.html' }
  ];
  var ADMIN_NAV = [
    { id: 'admin-dashboard', label: 'Tauler', icon: 'layout-dashboard', href: 'admin-dashboard.html' },
    { id: 'admin-users', label: 'Usuaris', icon: 'users', href: 'admin-dashboard.html#users' },
    { id: 'admin-ai', label: 'Consum d\'IA', icon: 'sparkles', href: 'admin-dashboard.html#ai' },
    { id: 'admin-plans', label: 'Plans i límits', icon: 'adjustments', href: '#' },
    { id: 'admin-taxonomy', label: 'Taxonomia i regles', icon: 'category', href: '#' },
    { id: 'admin-validator', label: 'Validador de l\'assessor', icon: 'shield-check', href: '#', badge: '3' },
    { id: 'admin-jobs', label: 'Jobs i auditoria', icon: 'activity', href: '#' },
    { id: 'admin-ota', label: 'Actualitzacions', icon: 'cloud-download', href: 'admin-dashboard.html#ota' },
    { heading: 'Aplicació' },
    { id: 'back', label: 'Torna a l\'aplicació', icon: 'arrow-back-up', href: 'dashboard.html' }
  ];
  var BOTTOM_NAV = [
    { id: 'dashboard', label: 'Inici', icon: 'home', href: 'dashboard.html' },
    { id: 'transactions', label: 'Moviments', icon: 'arrows-exchange', href: 'transactions.html' },
    { id: 'import', label: 'Importa', icon: 'plus', href: 'import.html', main: true },
    { id: 'advisor-plan', label: 'Pla', icon: 'list-check', href: 'advisor-plan.html' }
  ];

  function navItems(items, current) {
    return items.map(function (it) {
      if (it.heading) {
        return '<li class="nav-item mt-3 mb-1 px-3 d-none d-lg-block"><span class="text-uppercase text-secondary fw-medium" style="font-size:.6875rem;letter-spacing:.04em">' + it.heading + '</span></li>';
      }
      var active = it.id === current;
      return '<li class="nav-item' + (active ? ' active' : '') + '">' +
        '<a class="nav-link" href="' + it.href + '"' + (active ? ' aria-current="page"' : '') + '>' +
        '<span class="nav-link-icon d-md-none d-lg-inline-block"><i class="ti ti-' + it.icon + '" aria-hidden="true"></i></span>' +
        '<span class="nav-link-title">' + it.label + '</span>' +
        (it.badge ? '<span class="badge bg-primary-lt ms-auto me-lg-3">' + it.badge + '<span class="visually-hidden"> pendents</span></span>' : '') +
        '</a></li>';
    }).join('');
  }

  function themeButton(extra) {
    return '<button type="button" class="nav-link px-0 btn btn-icon btn-ghost-secondary ' + (extra || '') + '" data-est-theme-toggle aria-label="Canvia entre mode clar i fosc" title="Mode clar / fosc">' +
      '<i class="ti ti-moon hide-theme-dark" aria-hidden="true"></i><i class="ti ti-sun hide-theme-light" aria-hidden="true"></i></button>';
  }

  function userMenu(isAdmin) {
    var name = isAdmin ? 'Octavi R.' : 'Marta Vila';
    var sub = isAdmin ? 'Administrador' : 'Pla Premium';
    var initials = isAdmin ? 'OR' : 'MV';
    return '<div class="nav-item dropdown">' +
      '<a href="#" class="nav-link d-flex lh-1 p-0 px-2" data-bs-toggle="dropdown" aria-label="Obre el menú d\'usuari">' +
      '<span class="avatar avatar-sm bg-primary-lt">' + initials + '</span>' +
      '<div class="d-none d-xl-block ps-2"><div>' + name + '</div><div class="mt-1 small text-secondary">' + sub + '</div></div></a>' +
      '<div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">' +
      '<a href="onboarding.html" class="dropdown-item"><i class="ti ti-user dropdown-item-icon"></i>Perfil i llar</a>' +
      '<a href="auth-2fa.html" class="dropdown-item"><i class="ti ti-shield-lock dropdown-item-icon"></i>Seguretat i 2FA</a>' +
      '<a href="billing.html" class="dropdown-item"><i class="ti ti-credit-card dropdown-item-icon"></i>Subscripció</a>' +
      '<a href="#" class="dropdown-item"><i class="ti ti-language dropdown-item-icon"></i>Idioma: Català</a>' +
      '<div class="dropdown-divider"></div>' +
      '<a href="admin-dashboard.html" class="dropdown-item"><i class="ti ti-settings dropdown-item-icon"></i>Administració</a>' +
      '<a href="index.html" class="dropdown-item"><i class="ti ti-layout-grid dropdown-item-icon"></i>Índex de la proposta</a>' +
      '<a href="auth-login.html" class="dropdown-item"><i class="ti ti-logout dropdown-item-icon"></i>Tanca la sessió</a>' +
      '</div></div>';
  }

  function notifications() {
    return '<div class="nav-item dropdown">' +
      '<a href="#" class="nav-link px-0 btn btn-icon btn-ghost-secondary position-relative" data-bs-toggle="dropdown" aria-label="Alertes (3 sense llegir)">' +
      '<i class="ti ti-bell" aria-hidden="true"></i><span class="badge bg-red badge-notification badge-blink"></span></a>' +
      '<div class="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card"><div class="card" style="min-width:20rem">' +
      '<div class="card-header"><h3 class="card-title">Alertes</h3></div>' +
      '<div class="list-group list-group-flush">' +
      '<div class="list-group-item"><div class="d-flex gap-2"><span class="status-dot status-dot-animated bg-red mt-2"></span><div><div class="fw-medium">Pujada de preu: Netflix</div><div class="text-secondary small">De 13,99 € a 14,99 € al mes</div></div></div></div>' +
      '<div class="list-group-item"><div class="d-flex gap-2"><span class="status-dot bg-yellow mt-2"></span><div><div class="fw-medium">Pressupost de restauració al 86 %</div><div class="text-secondary small">Queden 12 dies de mes</div></div></div></div>' +
      '<div class="list-group-item"><div class="d-flex gap-2"><span class="status-dot bg-azure mt-2"></span><div><div class="fw-medium">Fa 16 dies que no importes dades</div><div class="text-secondary small">Importa l\'extracte de novembre</div></div></div></div>' +
      '</div></div></div></div>';
  }

  /**
   * Renders sidebar + top bar + mobile bottom navigation.
   * Call inline as the first child of <div class="page">.
   */
  function renderNav() {
    var body = document.body;
    var current = body.getAttribute('data-page') || '';
    var isAdmin = body.getAttribute('data-layout') === 'admin';
    var items = isAdmin ? ADMIN_NAV : APP_NAV;

    var planCard = isAdmin ? '' :
      '<div class="d-none d-lg-block mt-auto p-3"><div class="card card-sm bg-primary-lt border-0"><div class="card-body">' +
      '<div class="fw-semibold mb-1">Pla Premium</div>' +
      '<div class="small mb-2">Xat amb l\'assessor: 37 de 100 missatges</div>' +
      '<div class="est-meter"><span style="width:37%"></span></div>' +
      '</div></div></div>';

    var html =
      '<a href="#content" class="visually-hidden-focusable btn btn-primary m-2">Salta al contingut</a>' +
      '<aside class="navbar navbar-vertical navbar-expand-lg">' +
      '<div class="container-fluid">' +
      '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sidebar-menu" aria-controls="sidebar-menu" aria-expanded="false" aria-label="Obre el menú"><span class="navbar-toggler-icon"></span></button>' +
      '<div class="navbar-brand navbar-brand-autodark py-lg-3">' + logo({ href: isAdmin ? 'admin-dashboard.html' : 'dashboard.html' }) +
      (isAdmin ? '<span class="badge bg-primary-lt ms-2">Admin</span>' : '') + '</div>' +
      '<div class="navbar-nav flex-row d-lg-none align-items-center">' + themeButton() + notifications() + userMenu(isAdmin) + '</div>' +
      '<div class="collapse navbar-collapse" id="sidebar-menu">' +
      '<ul class="navbar-nav pt-lg-2">' + navItems(items, current) + '</ul>' + planCard +
      '</div></div></aside>' +
      '<header class="navbar navbar-expand-md d-none d-lg-flex d-print-none">' +
      '<div class="container-xl">' +
      '<div class="flex-fill" style="max-width:26rem"><div class="input-icon">' +
      '<span class="input-icon-addon"><i class="ti ti-search" aria-hidden="true"></i></span>' +
      '<input type="search" class="form-control" placeholder="' + (isAdmin ? 'Cerca usuaris, jobs…' : 'Cerca moviments, comerços…') + '" aria-label="Cerca"></div></div>' +
      '<div class="navbar-nav flex-row align-items-center ms-auto gap-1">' + themeButton() + notifications() + userMenu(isAdmin) + '</div>' +
      '</div></header>';

    var script = document.currentScript;
    script.insertAdjacentHTML('beforebegin', html);

    if (!isAdmin) {
      body.classList.add('est-has-bottom-nav');
      var bottom = '<nav class="est-bottom-nav d-print-none" aria-label="Navegació principal">' +
        BOTTOM_NAV.map(function (it) {
          return '<a href="' + it.href + '" class="' + (it.main ? 'est-bottom-nav-main ' : '') + (it.id === current ? 'is-active' : '') + '"' +
            (it.id === current ? ' aria-current="page"' : '') + '><i class="ti ti-' + it.icon + '" aria-hidden="true"></i><span>' + it.label + '</span></a>';
        }).join('') +
        '<button type="button" data-bs-toggle="collapse" data-bs-target="#sidebar-menu" aria-controls="sidebar-menu" data-est-scroll-top><i class="ti ti-menu-2" aria-hidden="true"></i><span>Més</span></button>' +
        '</nav>';
      document.addEventListener('DOMContentLoaded', function () {
        document.body.insertAdjacentHTML('beforeend', bottom);
      });
      document.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-est-scroll-top]')) { window.scrollTo({ top: 0, behavior: 'smooth' }); }
      });
    }
  }

  /* ---------------------------------------------------------------- */
  /* Formatting (es-ES conventions: 1.234,56 €, dd/mm/yyyy)            */
  /* ---------------------------------------------------------------- */
  function num(value, decimals) {
    var d = decimals || 0;
    var parts = Number(value).toFixed(d).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
  }
  function eur(value, decimals) { return num(value, decimals === undefined ? 2 : decimals) + ' €'; }

  /* ---------------------------------------------------------------- */
  /* Charts                                                            */
  /* ---------------------------------------------------------------- */
  function cssVar(name) {
    return getComputedStyle(root).getPropertyValue(name).trim();
  }
  function palette() {
    return [1, 2, 3, 4, 5, 6].map(function (i) { return cssVar('--est-chart-' + i); });
  }
  function merge(a, b) {
    Object.keys(b || {}).forEach(function (k) {
      if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) {
        a[k] = merge(a[k] && typeof a[k] === 'object' ? a[k] : {}, b[k]);
      } else { a[k] = b[k]; }
    });
    return a;
  }
  function chartDefaults() {
    var text = cssVar('--est-chart-text');
    var grid = cssVar('--est-chart-grid');
    var surface = cssVar('--tblr-bg-surface') || '#fff';
    return {
      chart: {
        fontFamily: 'inherit', toolbar: { show: false }, zoom: { enabled: false },
        animations: { enabled: false }, background: 'transparent', parentHeightOffset: 0
      },
      theme: { mode: root.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light' },
      colors: palette(),
      dataLabels: { enabled: false },
      stroke: { width: 2, curve: 'straight', lineCap: 'round' },
      grid: { borderColor: grid, strokeDashArray: 0, padding: { top: -8, right: 4, bottom: 0, left: 8 }, xaxis: { lines: { show: false } } },
      xaxis: {
        labels: { style: { colors: text, fontSize: '12px' } },
        axisBorder: { show: false }, axisTicks: { show: false }, tooltip: { enabled: false }
      },
      yaxis: { labels: { style: { colors: text, fontSize: '12px' }, formatter: function (v) { return typeof v === 'number' ? num(v) : v; } } },
      legend: {
        position: 'top', horizontalAlign: 'left', fontSize: '13px',
        labels: { colors: cssVar('--tblr-body-color') }, markers: { size: 6, shape: 'circle' },
        itemMargin: { horizontal: 10, vertical: 4 }
      },
      tooltip: { y: { formatter: function (v) { return eur(v, 0); } } },
      plotOptions: { bar: { borderRadius: 4, borderRadiusApplication: 'end', columnWidth: '56%', barHeight: '62%' } },
      states: { hover: { filter: { type: 'darken', value: 0.9 } }, active: { filter: { type: 'none' } } },
      markers: { strokeColors: surface, strokeWidth: 2, hover: { size: 5 } },
      fill: { opacity: 1 }
    };
  }

  var charts = [];
  /**
   * Estalvia.chart('#el', function (c) { return {...apex options}; })
   * `c` exposes the palette and theme tokens. Re-rendered on theme change.
   */
  function chart(selector, factory) {
    var el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el || !window.ApexCharts) { return; }
    var entry = { el: el, factory: factory, instance: null };
    function draw() {
      if (entry.instance) { entry.instance.destroy(); }
      var tokens = {
        colors: palette(),
        success: cssVar('--tblr-success'), warning: cssVar('--tblr-warning'),
        danger: cssVar('--tblr-danger'), info: cssVar('--tblr-info'),
        primary: cssVar('--tblr-primary'), neutral: cssVar('--est-chart-neutral'),
        text: cssVar('--est-chart-text'), grid: cssVar('--est-chart-grid'),
        surface: cssVar('--tblr-bg-surface'), eur: eur, num: num
      };
      entry.instance = new ApexCharts(el, merge(chartDefaults(), factory(tokens)));
      entry.instance.render();
    }
    entry.draw = draw;
    charts.push(entry);
    draw();
    return { redraw: draw };
  }
  document.addEventListener('estalvia:themechange', function () {
    charts.forEach(function (c) { c.draw(); });
  });

  window.Estalvia = {
    renderNav: renderNav, logo: logo, marks: MARKS, toggleTheme: toggleTheme,
    themeButton: themeButton, chart: chart, eur: eur, num: num, cssVar: cssVar
  };
})();
