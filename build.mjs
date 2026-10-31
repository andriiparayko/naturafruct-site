// NaturaFruct static site generator — zero dependencies.
// Usage: node build.mjs   → writes the complete site to ./dist
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import config from './src/config.mjs';
import { products, categories, groups, applications } from './src/data/products.mjs';
import reviews from './src/data/reviews.mjs';
import ro from './src/i18n/ro.mjs';
import en from './src/i18n/en.mjs';
import { fruitIcon, icon, whatsappIcon } from './src/icons.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const T = { ro, en };
const LANGS = ['ro', 'en'];
const YEAR = new Date().getFullYear();
// Preview builds (e.g. GitHub Pages): BASE_PATH=/repo SITE_URL=https://user.github.io NOINDEX=1 node build.mjs
const BASE = (process.env.BASE_PATH || '').replace(/\/+$/, '');
const SITE_URL = (process.env.SITE_URL || config.siteUrl).replace(/\/+$/, '');
const NOINDEX = process.env.NOINDEX === '1';
const PREVIEW = !!BASE || NOINDEX;
const TODAY = new Date().toISOString().slice(0, 10);

const routes = {
  home: { ro: '/', en: '/en/' },
  about: { ro: '/despre-noi/', en: '/en/about-us/' },
  products: { ro: '/produse/', en: '/en/products/' },
  applications: { ro: '/aplicatii/', en: '/en/applications/' },
  contact: { ro: '/contact/', en: '/en/contact/' },
  privacy: { ro: '/politica-de-confidentialitate/', en: '/en/privacy-policy/' },
};
const NAV = ['home', 'about', 'products', 'applications', 'contact'];
const productUrl = (p, lang) => (lang === 'ro' ? `/produse/${p.slug.ro}/` : `/en/products/${p.slug.en}/`);
const productAlternates = (p) => ({ ro: productUrl(p, 'ro'), en: productUrl(p, 'en') });
const contactHref = (lang, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return `${routes.contact[lang]}${q ? `?${q}` : ''}#form`;
};

// ---------- helpers ----------
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const abs = (p) => SITE_URL + BASE + p;
// Localised number formatting: RO uses decimal comma and dot as thousands separator.
const fmt = (v, lang) => {
  if (v && typeof v === 'object') return v[lang];
  const s = String(v);
  if (lang !== 'ro') return s;
  return s.replace(/(\d),(\d{3})/g, '$1\u0000$2').replace(/(\d)\.(\d)/g, '$1,$2').replace(/\u0000/g, '.');
};
const hash = (file) => crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 8);
const ldJson = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const fullAddress = (lang) => {
  const a = config.company.address;
  return `${a.locality}, ${a.street}, ${a.commune}, ${a.county}, ${a.country[lang]}`;
};
const phoneLinks = (cls = '') => config.phones.map((p) => `<a class="${cls}" href="tel:${p.e164}">${p.display}</a>`).join('');
const waHref = (lang) => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(T[lang].ui.whatsappText)}`;

// Prefix root-relative URLs with BASE (no-op for the production build)
const withBase = (html) => (BASE
  ? html.replace(/(href|src|action|srcset)="\/(?!\/)/g, `$1="${BASE}/`).replace(/, \/assets\//g, `, ${BASE}/assets/`)
  : html);
function write(rel, content) {
  if (rel.endsWith('.html')) content = withBase(content);
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}
function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, e.name);
    const d = path.join(to, e.name);
    e.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

// ---------- clean + static assets ----------
fs.rmSync(DIST, { recursive: true, force: true });
copyDir(path.join(SRC, 'assets'), path.join(DIST, 'assets'));
copyDir(path.join(SRC, 'static'), DIST);
if (!PREVIEW) for (const f of ['contact.php', 'contact-config.php']) fs.copyFileSync(path.join(SRC, 'php', f), path.join(DIST, f));
const VER = { css: hash(path.join(SRC, 'assets/css/main.css')), js: hash(path.join(SRC, 'assets/js/main.js')) };

// Inline script (marks JS available before first paint, avoids flash of hidden reveal content)
const INLINE_JS = "document.documentElement.classList.replace('no-js','js')";
const INLINE_JS_HASH = crypto.createHash('sha256').update(INLINE_JS).digest('base64');

// ---------- structured data ----------
const orgId = abs('/#organization');
function orgLd(lang) {
  const a = config.company.address;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId,
    name: config.brand,
    legalName: config.company.legalName,
    url: abs(routes.home[lang]),
    logo: abs('/assets/img/logo-480.png'),
    image: abs('/assets/img/og-image.jpg'),
    slogan: config.slogan,
    description: T[lang].footer.about,
    foundingDate: config.company.founded,
    taxID: config.company.cui,
    identifier: config.company.regCom,
    email: config.emails.office,
    telephone: config.phones[0].e164,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${a.street}, ${a.locality}`,
      addressLocality: 'Berchișești',
      addressRegion: 'Suceava',
      postalCode: a.postalCode,
      addressCountry: a.countryCode,
    },
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'sales', email: config.emails.sales, telephone: config.phones[1].e164, availableLanguage: ['ro', 'en'], areaServed: 'EU' },
      { '@type': 'ContactPoint', contactType: 'customer service', email: config.emails.office, telephone: config.phones[0].e164, availableLanguage: ['ro', 'en'] },
    ],
  };
}
function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.url) })),
  };
}

// ---------- partials ----------
function logo(cls = '') {
  return `<picture class="${cls}"><source type="image/webp" srcset="/assets/img/logo-240.webp 240w, /assets/img/logo-480.webp 480w" sizes="140px"><img src="/assets/img/logo-240.png" srcset="/assets/img/logo-240.png 240w, /assets/img/logo-480.png 480w" sizes="140px" width="240" height="99" alt="NaturaFruct — ${esc(config.slogan)}"></picture>`;
}

function header(lang, page, alternates) {
  const t = T[lang];
  const other = t.otherLang;
  const links = NAV.map((k) => `<li><a class="nav__link" href="${routes[k][lang]}"${page === k ? ' aria-current="page"' : ''}>${t.ui.nav[k]}</a></li>`).join('');
  return `<header class="hdr" id="top">
  <div class="hdr__bar container">
    <a class="hdr__logo" href="${routes.home[lang]}">${logo()}</a>
    <nav class="nav" id="site-nav" aria-label="${t.ui.menu}">
      <ul class="nav__list">${links}</ul>
      <div class="nav__mobile-extra">
        <a class="btn btn--primary btn--block" href="${contactHref(lang)}">${t.ui.cta}</a>
        <div class="nav__contacts">${phoneLinks()}<a href="mailto:${config.emails.sales}">${config.emails.sales}</a></div>
      </div>
    </nav>
    <div class="hdr__actions">
      <a class="lang" href="${alternates[other]}" hreflang="${other}" lang="${other}" title="${esc(t.ui.switchLang)}">
        <span class="lang__opt${lang === 'ro' ? ' is-on' : ''}" aria-hidden="true">RO</span><span class="lang__opt${lang === 'en' ? ' is-on' : ''}" aria-hidden="true">EN</span><span class="sr-only">${esc(t.ui.switchLang)}</span>
      </a>
      <a class="btn btn--primary btn--sm hdr__cta" href="${contactHref(lang)}">${t.ui.cta}</a>
      <button class="burger" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="${t.ui.menu}"><span></span><span></span><span></span></button>
    </div>
  </div>
  <svg class="juice" viewBox="0 0 1440 26" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path class="juice__back" d="M0 12 H1440 V26 H0Z"/>
    <path class="juice__front" d="M0 14 H1440 V26 H0Z"/>
    <path class="juice__shine" d="M0 14 H1440"/>
  </svg>
</header>`;
}

function footer(lang, alternates) {
  const t = T[lang];
  const c = config.company;
  const nav = NAV.map((k) => `<li><a href="${routes[k][lang]}">${t.ui.nav[k]}</a></li>`).join('');
  const prods = products.map((p) => `<li><a href="${productUrl(p, lang)}">${esc(p.fruit[lang])}</a></li>`).join('');
  return `<footer class="ftr">
  <div class="ftr__wave" aria-hidden="true"></div>
  <div class="container ftr__grid">
    <div class="ftr__brand">
      <a href="${routes.home[lang]}" class="ftr__logo">${logo()}</a>
      <p>${t.footer.about}</p>
      <a class="ftr__wa" href="${waHref(lang)}" target="_blank" rel="noopener">${whatsappIcon}<span>${t.ui.whatsapp}</span></a>
    </div>
    <div>
      <p class="ftr__h">${t.footer.nav}</p>
      <ul class="ftr__list">${nav}<li><a href="${routes.privacy[lang]}">${t.footer.privacy}</a></li></ul>
    </div>
    <div>
      <p class="ftr__h">${t.footer.products}</p>
      <ul class="ftr__list ftr__list--cols">${prods}</ul>
    </div>
    <div>
      <p class="ftr__h">${t.footer.contact}</p>
      <address class="ftr__contact">
        <p>${icon('pin')}<span>${esc(fullAddress(lang))}</span></p>
        <p>${icon('phone')}<span class="ftr__phones">${phoneLinks()}</span></p>
        <p>${icon('mail')}<span class="ftr__mails"><a href="mailto:${config.emails.office}">${config.emails.office}</a><a href="mailto:${config.emails.sales}">${config.emails.sales}</a></span></p>
      </address>
    </div>
  </div>
  <div class="container ftr__legal">
    <p>© ${YEAR} ${c.legalName} · ${t.about.company.labels.reg} ${c.regCom} · CUI ${c.cui}</p>
    <p><a href="${routes.privacy[lang]}">${t.footer.privacy}</a> · <a href="${alternates[t.otherLang]}" hreflang="${t.otherLang}">${T[t.otherLang].langName}</a></p>
  </div>
</footer>`;
}

function waButton(lang) {
  const t = T[lang];
  return `<a class="wa" href="${waHref(lang)}" target="_blank" rel="noopener" aria-label="${esc(t.ui.whatsapp)}"><span class="wa__label">${t.ui.whatsapp}</span><span class="wa__icon">${whatsappIcon}</span></a>`;
}

function productModal(lang) {
  return `<dialog class="pmodal" id="pmodal" aria-label="${esc(T[lang].ui.details)}">
  <div class="pmodal__panel">
    <button class="pmodal__close" type="button" data-modal-close aria-label="${esc(T[lang].ui.close)}">${icon('close')}</button>
    <div class="pmodal__body" id="pmodal-body"></div>
  </div>
</dialog>`;
}

const secHead = ({ eyebrow, title, lead, align = 'left', h = 'h2', id }) =>
  `<div class="sechead sechead--${align} reveal">${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}<${h} class="sechead__title"${id ? ` id="${id}"` : ''}>${title}</${h}>${lead ? `<p class="sechead__lead">${lead}</p>` : ''}</div>`;

function breadcrumbs(lang, items) {
  const t = T[lang];
  return `<nav class="crumbs" aria-label="${t.ui.breadcrumb}"><ol>${items
    .map((it, i) => (i < items.length - 1 ? `<li><a href="${it.url}">${esc(it.name)}</a></li>` : `<li aria-current="page">${esc(it.name)}</li>`))
    .join('')}</ol></nav>`;
}

function pageHero(lang, { eyebrow, h1, lead, crumbs, extra = '', cls = '' }) {
  return `<section class="phero ${cls}">
  <div class="container">
    ${crumbs ? breadcrumbs(lang, crumbs) : ''}
    <div class="phero__inner">
      <p class="eyebrow">${eyebrow}</p>
      <h1 class="phero__title">${h1}</h1>
      ${lead ? `<p class="phero__lead">${lead}</p>` : ''}
      ${extra}
    </div>
  </div>
</section>`;
}

// ---------- product visuals ----------
function productMedia(p, lang, cls) {
  if (p.image) {
    return `<div class="${cls} media-photo"><img src="${p.image}" alt="${esc(p.name[lang])}" loading="lazy" decoding="async" width="800" height="600"></div>`;
  }
  return `<div class="${cls} jart" role="img" aria-label="${esc(p.name[lang])}" style="--c1:${p.colors[0]};--c2:${p.colors[1]}">
    <svg class="jart__waves" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 205C70 185 130 232 200 212S330 186 400 204V300H0Z"/><path d="M0 236C80 220 140 258 220 242S340 224 400 238V300H0Z"/></svg>
    <span class="jart__bubbles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
    ${fruitIcon(p.icon, 'jart__icon')}
  </div>`;
}

function productCard(p, lang, { h = 'h3', reveal = true } = {}) {
  const t = T[lang];
  return `<article class="pcard${reveal ? ' reveal' : ''}" data-group="${p.group}" style="--c1:${p.colors[0]};--c2:${p.colors[1]}">
  <a class="pcard__link" href="${productUrl(p, lang)}" data-product="${p.id}">
    ${productMedia(p, lang, 'pcard__media')}
    <div class="pcard__body">
      <p class="pcard__group">${t.groups[p.group]}</p>
      <${h} class="pcard__title">${esc(p.name[lang])}</${h}>
      <dl class="pcard__specs">
        <div><dt>°Brix</dt><dd>${fmt(p.brix, lang)}</dd></div>
        <div><dt>${t.spec.keyFacts.acidity}</dt><dd>${fmt(p.acidity.value, lang)}%</dd></div>
      </dl>
      <span class="pcard__more">${t.ui.details}${icon('arrow')}</span>
    </div>
  </a>
</article>`;
}

function soonCard(kind, lang, i) {
  const t = T[lang];
  return `<div class="pcard pcard--soon reveal" aria-hidden="true" data-i="${i}">
  <div class="pcard__media jart jart--soon">${fruitIcon(kind === 'tea' ? 'tea' : 'bottle', 'jart__icon')}</div>
  <div class="pcard__body"><p class="pcard__group">${t.ui.soon}</p><p class="pcard__title">${t.products.soon.placeholder}</p></div>
</div>`;
}

// Full product specification (used on product pages and loaded into the modal)
function productDetail(p, lang) {
  const t = T[lang];
  const s = t.spec;
  const name = esc(p.name[lang]);
  const o = p.organoleptic;
  const acidAs = s.acidAs[p.acidity.acid];
  const params = { product: p.id };
  const tdsBtn = p.pdf
    ? `<a class="btn btn--text" href="${p.pdf}" download>${icon('download')}${s.ctaTds}</a>`
    : `<a class="btn btn--text" href="${contactHref(lang, { ...params, request: 'tds' })}">${icon('doc')}${s.ctaTdsRequest}</a>`;
  const extraRow = p.extra
    ? `<tr><th scope="row">${esc(p.extra.name[lang])}</th><td>${p.extra.unit}</td><td><strong>${esc(fmt(p.extra.value, lang))}</strong></td><td>${s.methods.spectro}</td></tr>`
    : '';
  const micro = [
    ['yeasts', 'CFU/g or CFU/mL', '≤ 100', 'ISO 21527'],
    ['moulds', 'CFU/g or CFU/mL', '≤ 100', 'ISO 21527'],
    ['tvc', 'CFU/g or CFU/mL', fmt('≤ 1,000', lang), 'ISO 4833-1'],
    ['ecoli', 'CFU/g', s.nd1g, 'ISO 16649-2'],
  ];
  const appChips = p.apps.map((a) => `<li><a class="chip" href="${routes.applications[lang]}#${a}">${icon(a)}${t.apps[a].t}</a></li>`).join('');
  return `<article class="pd" data-product-id="${p.id}" style="--c1:${p.colors[0]};--c2:${p.colors[1]}">
  <header class="pd__head">
    ${productMedia(p, lang, 'pd__media')}
    <div class="pd__intro">
      <p class="eyebrow">${t.groups[p.group]} · <span class="pd__doc">${s.doc} ${p.doc} · ${p.rev}</span></p>
      <h1 class="pd__title">${name}</h1>
      <ul class="pd__facts">
        <li><span>${s.keyFacts.brix}</span><strong>${fmt(p.brix, lang)}</strong></li>
        <li><span>${s.keyFacts.acidity}</span><strong>${fmt(p.acidity.value, lang)}%</strong><small>${acidAs}</small></li>
        <li><span>${s.keyFacts.ph}</span><strong>${fmt('≤ 3.5', lang)}</strong></li>
        <li><span>${s.keyFacts.shelf}</span><strong>${s.keyFacts.shelfV}</strong></li>
      </ul>
      <p class="pd__desc">${esc(p.desc[lang])}</p>
      <div class="pd__cta">
        <a class="btn btn--primary" href="${contactHref(lang, { ...params, request: 'offer' })}">${s.ctaOffer}</a>
        <a class="btn btn--ghost" href="${contactHref(lang, { ...params, request: 'sample' })}">${s.ctaSample}</a>
        ${tdsBtn}
      </div>
      ${p.image ? '' : `<p class="pd__note">${s.placeholderNote}</p>`}
    </div>
  </header>

  <div class="pd__grid">
    <section class="pd__sec">
      <h2 class="pd__h">${icon('apple')}${s.sections.organoleptic}</h2>
      <table class="spec spec--2">
        <tbody>
          <tr><th scope="row">${s.organoleptic.appearance}</th><td>${esc(o.appearance[lang])}</td></tr>
          <tr><th scope="row">${s.organoleptic.colour}</th><td>${esc(o.colour[lang])}</td></tr>
          <tr><th scope="row">${s.organoleptic.taste}</th><td>${esc(o.taste[lang])}</td></tr>
          <tr><th scope="row">${s.organoleptic.clarity}</th><td>${esc(o.clarity[lang])}</td></tr>
        </tbody>
      </table>
      <dl class="pd__kv">
        <div><dt>${s.composition}</dt><dd>${esc(s.compositionValue(p.name[lang]))}</dd></div>
        <div><dt>${s.intended}</dt><dd>${s.intendedValue}</dd></div>
      </dl>
    </section>

    <section class="pd__sec">
      <h2 class="pd__h">${icon('thermo')}${s.sections.storage}</h2>
      <ul class="tiles">
        <li>${icon('thermo')}<strong>${s.storage.storage}</strong><span>${s.storage.storageV}</span></li>
        <li>${icon('truck')}<strong>${s.storage.transport}</strong><span>${s.storage.transportV}</span></li>
        <li>${icon('clock')}<strong>${s.storage.shelf}</strong><span>${s.storage.shelfV}</span></li>
        <li>${icon('check')}<strong>${s.storage.delivery}</strong><span>${s.storage.deliveryV}</span></li>
      </ul>
      <h3 class="pd__h pd__h--sub">${icon('box')}${s.sections.packaging}</h3>
      <dl class="pd__kv pd__kv--row">
        <div><dt>${s.packaging.filling}</dt><dd>${s.packaging.fillingV}</dd></div>
        <div><dt>${s.packaging.qty}</dt><dd>${s.packaging.qtyV}</dd></div>
        <div><dt>${s.packaging.format}</dt><dd>${s.packaging.formatV}</dd></div>
      </dl>
    </section>

    <section class="pd__sec pd__sec--wide">
      <h2 class="pd__h">${icon('flask')}${s.sections.physchem}</h2>
      <div class="table-scroll"><table class="spec">
        <thead><tr><th scope="col">${s.cols.param}</th><th scope="col">${s.cols.unit}</th><th scope="col">${s.cols.value}</th><th scope="col">${s.cols.method}</th></tr></thead>
        <tbody>
          <tr><th scope="row">${s.brix}</th><td>°Bx</td><td><strong>${fmt(p.brix, lang)}</strong></td><td>${s.methods.refracto}</td></tr>
          <tr><th scope="row">${s.acidity} <small>(${acidAs})</small></th><td>%</td><td><strong>${fmt(p.acidity.value, lang)}</strong></td><td>${s.methods.titri}</td></tr>
          <tr><th scope="row">${s.ph}</th><td>—</td><td><strong>${fmt('≤ 3.5', lang)}</strong></td><td>${s.methods.potentio}</td></tr>
          ${extraRow}
        </tbody>
      </table></div>
    </section>

    <section class="pd__sec pd__sec--wide">
      <h2 class="pd__h">${icon('shield')}${s.sections.micro}</h2>
      <div class="table-scroll"><table class="spec">
        <thead><tr><th scope="col">${s.cols.param}</th><th scope="col">${s.cols.unit}</th><th scope="col">${s.cols.limit}</th><th scope="col">${s.cols.method}</th></tr></thead>
        <tbody>${micro.map(([k, u, l, m]) => `<tr><th scope="row">${s.micro[k]}</th><td>${s.cfu[u]}</td><td><strong>${l}</strong></td><td>${m}</td></tr>`).join('')}</tbody>
      </table></div>
    </section>

    <section class="pd__sec pd__sec--wide">
      <h2 class="pd__h">${icon('leaf')}${s.sections.regulatory}</h2>
      <dl class="reglist">${s.regulatory.map(([k, v]) => `<div><dt>${icon('check')}${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
      <h3 class="pd__h pd__h--sub">${icon('trace')}${s.sections.qa}</h3>
      <p class="pd__qa">${s.qa}</p>
    </section>

    <section class="pd__sec pd__sec--wide">
      <h2 class="pd__h">${icon('beverages')}${s.sections.apps}</h2>
      <ul class="chips">${appChips}</ul>
    </section>
  </div>
</article>`;
}

// ---------- reusable sections ----------
function reviewsBlock(lang) {
  if (!reviews.length) return '';
  const t = T[lang].reviews;
  const n = reviews.length;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / n;
  const avgTxt = fmt(avg.toFixed(1), lang);
  const dist = [5, 4, 3, 2, 1].map((s) => ({ s, c: reviews.filter((r) => r.rating === s).length }));
  const hasSample = reviews.some((r) => r.sample);
  const dateFmt = new Intl.DateTimeFormat(lang === 'ro' ? 'ro-RO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const stars = (r) => `<span class="stars" role="img" aria-label="${esc(t.stars(fmt(r, lang)))}">${[1, 2, 3, 4, 5].map((i) => `<span class="star${i <= Math.round(r) ? ' is-on' : ''}">${icon('star')}</span>`).join('')}</span>`;
  const initials = (name) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const sorted = [...reviews].sort((a, b) => b.date.localeCompare(a.date));
  const VISIBLE = 6;
  const cards = sorted
    .map((r, i) => {
      const p = r.product && products.find((x) => x.id === r.product);
      return `<article class="rcard reveal${r.sample ? ' rcard--sample' : ''}"${i >= VISIBLE ? ' hidden data-extra' : ''}${r.lang !== lang ? ` lang="${r.lang}"` : ''}>
  <header class="rcard__head">
    <span class="rcard__avatar" aria-hidden="true">${esc(initials(r.name))}</span>
    <div><p class="rcard__name">${esc(r.name)} <span class="cc">${esc(r.country)}</span></p>${r.company ? `<p class="rcard__company">${esc(r.company)}</p>` : ''}</div>
    ${r.sample ? `<span class="badge badge--sample">${t.sample}</span>` : `<span class="badge">${icon('check')}${t.sources[r.source] || t.sources.other}</span>`}
  </header>
  ${stars(r.rating)}
  <p class="rcard__text">${esc(r.text)}</p>
  <footer class="rcard__foot">${p ? `<a href="${productUrl(p, lang)}" data-product="${p.id}">${esc(p.fruit[lang])}</a><span aria-hidden="true">·</span>` : ''}<time datetime="${r.date}">${dateFmt.format(new Date(r.date))}</time></footer>
</article>`;
    })
    .join('');
  return `<section class="section reviews" aria-labelledby="reviews-title">
  <div class="container">
    ${secHead({ eyebrow: t.eyebrow, title: t.title, id: 'reviews-title' })}
    ${hasSample ? `<p class="notice">${icon('flask')}${t.sampleNote}</p>` : ''}
    <div class="reviews__layout">
      <aside class="reviews__summary reveal">
        <p class="reviews__score">${avgTxt}</p>
        ${stars(avg)}
        <p class="reviews__count">${t.basedOn(n)}</p>
        <ul class="reviews__dist">${dist.map((d) => `<li><span>${d.s}${icon('star')}</span><span class="bar"><span style="width:${n ? Math.round((d.c / n) * 100) : 0}%"></span></span><span>${d.c}</span></li>`).join('')}</ul>
        <a class="btn btn--ghost btn--block" href="${contactHref(lang, { request: 'other' })}">${t.write}</a>
      </aside>
      <div class="reviews__list">
        ${cards}
        ${n > VISIBLE ? `<button class="btn btn--ghost reviews__more" type="button" data-reviews-more>${t.more}</button>` : ''}
      </div>
    </div>
  </div>
</section>`;
}

function processBlock(lang, steps, head) {
  return `<section class="section process">
  <div class="container">
    ${secHead(head)}
    <ol class="steps">${steps.map((s, i) => `<li class="step reveal" style="--i:${i}"><span class="step__n">${String(i + 1).padStart(2, '0')}</span><h3 class="step__t">${s.t}</h3><p class="step__d">${s.d}</p></li>`).join('')}</ol>
  </div>
</section>`;
}

function ctaBand(lang, { title, lead, primary, secondary }) {
  return `<section class="section section--tight">
  <div class="container">
    <div class="ctaband reveal">
      <div class="ctaband__text"><h2>${title}</h2><p>${lead}</p></div>
      <div class="ctaband__actions">
        <a class="btn btn--light" href="${contactHref(lang)}">${primary}${icon('arrow')}</a>
        ${secondary ? `<a class="btn btn--outline-light" href="tel:${config.phones[0].e164}">${icon('phone')}${secondary}</a>` : ''}
      </div>
      <svg class="ctaband__wave" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70C150 40 300 100 450 75S750 30 900 60s220 30 300 10V120H0Z"/></svg>
    </div>
  </div>
</section>`;
}

function photo({ src, alt, w = 700, h = 269, cls = '', caption, eager = false }) {
  const base = src.replace(/\.(webp|jpg)$/, '');
  const img = `<picture><source type="image/webp" srcset="${base}.webp"><img src="${base}.jpg" alt="${esc(alt)}" width="${w}" height="${h}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></picture>`;
  return caption ? `<figure class="photo ${cls}">${img}<figcaption>${caption}</figcaption></figure>` : `<div class="photo ${cls}">${img}</div>`;
}

// ---------- layout ----------
function layout({ lang, page, title, description, urlPath, alternates, body, jsonld = [], bodyClass = '', noindex = NOINDEX }) {
  const t = T[lang];
  const other = t.otherLang;
  const alt = alternates
    ? `<link rel="alternate" hreflang="ro" href="${abs(alternates.ro)}"><link rel="alternate" hreflang="en" href="${abs(alternates.en)}"><link rel="alternate" hreflang="x-default" href="${abs(alternates.ro)}">`
    : '';
  const alternatesSafe = alternates || { ro: routes.home.ro, en: routes.home.en };
  return `<!doctype html>
<html lang="${lang}" class="no-js" data-base="${BASE}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? `<meta name="robots" content="noindex, ${NOINDEX ? 'nofollow' : 'follow'}">` : `<link rel="canonical" href="${abs(urlPath)}">\n${alt}`}
<meta name="theme-color" content="#1A6840">
<meta property="og:type" content="website">
<meta property="og:site_name" content="NaturaFruct">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(urlPath)}">
<meta property="og:image" content="${abs('/assets/img/og-image.jpg')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${t.locale}">
<meta property="og:locale:alternate" content="${T[other].locale}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/fraunces-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/main.css?v=${VER.css}">
<script>${INLINE_JS}</script>
${[orgLd(lang), ...jsonld].map(ldJson).join('\n')}
</head>
<body class="page-${page} ${bodyClass}" data-lang="${lang}">
<a class="skip" href="#main">${t.ui.skip}</a>
${header(lang, page, alternatesSafe)}
<main id="main" tabindex="-1">
${body}
</main>
${footer(lang, alternatesSafe)}
${waButton(lang)}
${productModal(lang)}
<script src="/assets/js/main.js?v=${VER.js}" defer></script>
</body>
</html>
`;
}

// =====================================================================
// PAGES
// =====================================================================
const pages = [];
const addPage = (urlPath, html) => {
  pages.push(urlPath);
  write(urlPath.endsWith('/') ? `${urlPath}index.html` : urlPath, html);
};

// ---------- HOME ----------
function homePage(lang) {
  const t = T[lang];
  const h = t.home;
  const hero = `<section class="hero">
  <div class="hero__bg" aria-hidden="true"><span></span><span></span></div>
  <div class="container hero__grid">
    <div class="hero__text">
      <p class="eyebrow eyebrow--pill">${icon('pin')}${h.hero.eyebrow}</p>
      <h1 class="hero__title">${h.hero.h1}</h1>
      <p class="hero__lead">${h.hero.lead}</p>
      <div class="hero__cta">
        <a class="btn btn--primary btn--lg" href="${contactHref(lang)}">${h.hero.primary}${icon('arrow')}</a>
        <a class="btn btn--ghost btn--lg" href="${routes.products[lang]}">${h.hero.secondary}</a>
      </div>
      <ul class="stats">${h.hero.stats.map((s) => `<li><strong>${s.v}</strong><span>${s.l}</span></li>`).join('')}</ul>
    </div>
    <div class="hero__media">
      ${photo({ src: '/assets/img/equipment.webp', alt: h.hero.photoAlt, cls: 'hero__photo hero__photo--a', eager: true })}
      ${photo({ src: '/assets/img/factory.webp', alt: h.about.photoAlt, cls: 'hero__photo hero__photo--b', eager: true })}
      <p class="hero__badge">${icon('factory')}<span>${h.hero.badge}</span></p>
      <div class="hero__drops" aria-hidden="true">${products.slice(0, 6).map((p) => `<i style="--c1:${p.colors[0]};--c2:${p.colors[1]}"></i>`).join('')}</div>
    </div>
  </div>
</section>`;

  const usp = `<section class="section section--tight usp-wrap">
  <div class="container">
    <ul class="usp">${h.usp.map((u) => `<li class="usp__item reveal"><span class="usp__icon">${icon(u.icon)}</span><div><h2 class="usp__t">${u.t}</h2><p class="usp__d">${u.d}</p></div></li>`).join('')}</ul>
  </div>
</section>`;

  const catCard = (c) => {
    const ct = t.categories[c.id];
    const soon = c.status === 'soon';
    const href = soon ? `${routes.products[lang]}#${c.id}` : `${routes.products[lang]}#concentrates`;
    const visual = c.id === 'concentrates'
      ? `<div class="cat__mosaic" aria-hidden="true">${products.map((p) => `<i style="--c1:${p.colors[0]};--c2:${p.colors[1]}"></i>`).join('')}</div>`
      : `<div class="cat__icon" aria-hidden="true">${fruitIcon(c.id === 'tea' ? 'tea' : 'bottle')}</div>`;
    return `<a class="cat reveal${soon ? ' cat--soon' : ''}" href="${href}">
  ${visual}
  <div class="cat__body">
    ${soon ? `<span class="badge badge--soon">${t.ui.soon}</span>` : `<span class="badge">${t.products.count(products.length)}</span>`}
    <h3 class="cat__t">${ct.t}</h3>
    <p class="cat__d">${ct.d}</p>
    <span class="cat__more">${soon ? t.ui.learnMore : t.ui.viewAll}${icon('arrow')}</span>
  </div>
</a>`;
  };
  const range = `<section class="section">
  <div class="container">
    ${secHead({ eyebrow: h.range.eyebrow, title: h.range.title })}
    <div class="cats">${categories.map(catCard).join('')}</div>
  </div>
</section>`;

  const featured = `<section class="section section--cream featured">
  <div class="container">
    <div class="featured__head">
      ${secHead({ eyebrow: h.featured.eyebrow, title: h.featured.title, lead: h.featured.lead })}
      <div class="slider-nav">
        <button class="iconbtn" type="button" data-slider-prev aria-label="${t.ui.prev}">${icon('arrow-left')}</button>
        <button class="iconbtn" type="button" data-slider-next aria-label="${t.ui.next}">${icon('arrow')}</button>
      </div>
    </div>
  </div>
  <div class="slider" data-slider tabindex="0" aria-label="${esc(h.featured.title)}">
    <div class="slider__track">${products.map((p) => productCard(p, lang, { reveal: false })).join('')}</div>
  </div>
  <div class="container featured__foot"><a class="btn btn--ghost" href="${routes.products[lang]}">${t.ui.viewAll}${icon('arrow')}</a></div>
</section>`;

  const about = `<section class="section about-teaser">
  <div class="container split">
    <div class="split__media reveal">
      ${photo({ src: '/assets/img/factory.webp', alt: h.about.photoAlt, cls: 'photo--tall' })}
      ${photo({ src: '/assets/img/bag-in-box.webp', alt: t.about.packaging.caption, cls: 'photo--float' })}
    </div>
    <div class="split__text reveal">
      <p class="eyebrow">${h.about.eyebrow}</p>
      <h2 class="sechead__title">${h.about.title}</h2>
      <p>${h.about.p1}</p>
      <p>${h.about.p2}</p>
      <ul class="checks">${h.about.bullets.map((b) => `<li>${icon('check')}${b}</li>`).join('')}</ul>
      <a class="btn btn--ghost" href="${routes.about[lang]}">${h.about.cta}${icon('arrow')}</a>
    </div>
  </div>
</section>`;

  const appsTeaser = `<section class="section section--sage">
  <div class="container">
    <div class="featured__head">
      ${secHead({ eyebrow: h.apps.eyebrow, title: h.apps.title, lead: h.apps.lead })}
      <a class="btn btn--ghost" href="${routes.applications[lang]}">${h.apps.cta}${icon('arrow')}</a>
    </div>
    <ul class="apps-mini">${applications.map((a) => `<li class="reveal"><a href="${routes.applications[lang]}#${a}"><span class="apps-mini__icon">${icon(a)}</span><span>${t.apps[a].t}</span></a></li>`).join('')}</ul>
  </div>
</section>`;

  const faq = `<section class="section faq-wrap">
  <div class="container faq-grid">
    ${secHead({ eyebrow: h.faq.eyebrow, title: h.faq.title })}
    <div class="faq">${h.faq.items.map((f, i) => `<details class="faq__item reveal"${i === 0 ? ' open' : ''}><summary><span>${f.q}</span>${icon('chevron-down', 'faq__chev')}</summary><div class="faq__a"><p>${f.a}</p></div></details>`).join('')}</div>
  </div>
</section>`;

  const body = [hero, usp, range, featured, about, processBlock(lang, h.process.steps, { eyebrow: h.process.eyebrow, title: h.process.title, lead: h.process.lead }), appsTeaser, reviewsBlock(lang), faq, ctaBand(lang, h.cta)].join('\n');

  const jsonld = [
    { '@context': 'https://schema.org', '@type': 'WebSite', '@id': abs('/#website'), url: abs(routes.home[lang]), name: 'NaturaFruct', inLanguage: lang, publisher: { '@id': orgId } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: h.faq.items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ];
  return layout({ lang, page: 'home', ...t.meta.home, urlPath: routes.home[lang], alternates: routes.home, body, jsonld });
}

// ---------- ABOUT ----------
function aboutPage(lang) {
  const t = T[lang];
  const a = t.about;
  const c = config.company;
  const crumbs = [{ name: t.ui.home, url: routes.home[lang] }, { name: t.ui.nav.about, url: routes.about[lang] }];
  const hero = pageHero(lang, { ...a.hero, crumbs, cls: 'phero--photo', extra: '' });
  const story = `<section class="section">
  <div class="container split split--top">
    <div class="split__text reveal">
      <p class="eyebrow">${a.story.eyebrow}</p>
      <h2 class="sechead__title">${a.story.title}</h2>
      ${a.story.paras.map((p) => `<p>${p}</p>`).join('')}
    </div>
    <ol class="timeline reveal">${a.timeline.map((x) => `<li><span class="timeline__y">${x.y}</span><div><h3>${x.t}</h3><p>${x.d}</p></div></li>`).join('')}</ol>
  </div>
</section>`;
  const plant = `<section class="section section--cream" id="fabrica">
  <div class="container">
    ${secHead({ eyebrow: a.plant.eyebrow, title: a.plant.title })}
    <div class="plant">
      <div class="plant__text reveal">${a.plant.paras.map((p) => `<p>${p}</p>`).join('')}</div>
      <div class="plant__photos">
        ${photo({ src: '/assets/img/factory.webp', alt: a.plant.captionPlant, caption: a.plant.captionPlant, cls: 'reveal' })}
        ${photo({ src: '/assets/img/equipment.webp', alt: a.plant.captionLine, caption: a.plant.captionLine, cls: 'reveal' })}
      </div>
    </div>
  </div>
</section>`;
  const quality = `<section class="section" id="calitate">
  <div class="container">
    ${secHead({ eyebrow: a.quality.eyebrow, title: a.quality.title, lead: a.quality.lead })}
    <div class="qgrid">${a.quality.cards.map((q) => `<article class="qcard reveal"><span class="qcard__icon">${icon(q.icon)}</span><h3>${q.t}</h3><ul>${q.items.map((i) => `<li>${i}</li>`).join('')}</ul></article>`).join('')}</div>
  </div>
</section>`;
  const pack = `<section class="section section--sage" id="ambalare">
  <div class="container split">
    <div class="split__media reveal">${photo({ src: '/assets/img/bag-in-box.webp', alt: a.packaging.caption, caption: a.packaging.caption })}${photo({ src: '/assets/img/bag-in-box-detail.webp', alt: a.packaging.caption, cls: 'photo--float photo--float-r' })}</div>
    <div class="split__text reveal">
      <p class="eyebrow">${a.packaging.eyebrow}</p>
      <h2 class="sechead__title">${a.packaging.title}</h2>
      ${a.packaging.paras.map((p) => `<p>${p}</p>`).join('')}
      <ul class="facts">${a.packaging.facts.map((f) => `<li>${icon(f.icon)}<strong>${f.t}</strong><span>${f.d}</span></li>`).join('')}</ul>
    </div>
  </div>
</section>`;
  const company = `<section class="section" id="date-firma">
  <div class="container">
    ${secHead({ eyebrow: a.company.eyebrow, title: a.company.title })}
    <dl class="company reveal">
      <div><dt>${a.company.labels.legal}</dt><dd>${c.legalName}</dd></div>
      <div><dt>${a.company.labels.trade}</dt><dd>${c.tradeName}</dd></div>
      <div><dt>${a.company.labels.address}</dt><dd>${esc(fullAddress(lang))}</dd></div>
      <div><dt>${a.company.labels.reg}</dt><dd>${c.regCom}</dd></div>
      <div><dt>${a.company.labels.cui}</dt><dd>${c.cui}</dd></div>
    </dl>
  </div>
</section>`;
  const body = [hero, story, plant, processBlock(lang, t.home.process.steps, { eyebrow: t.home.process.eyebrow, title: t.home.process.title, lead: t.home.process.lead }), quality, pack, company, ctaBand(lang, t.home.cta)].join('\n');
  return layout({ lang, page: 'about', ...t.meta.about, urlPath: routes.about[lang], alternates: routes.about, body, jsonld: [breadcrumbLd(crumbs)] });
}

// ---------- PRODUCTS ----------
function productsPage(lang) {
  const t = T[lang];
  const pp = t.products;
  const crumbs = [{ name: t.ui.home, url: routes.home[lang] }, { name: t.ui.nav.products, url: routes.products[lang] }];
  const catNav = `<ul class="catnav">${categories
    .map((c) => `<li><a class="catnav__link${c.status === 'soon' ? ' is-soon' : ''}" href="#${c.id}">${t.categories[c.id].t}<span>${c.status === 'soon' ? t.ui.soon : products.length}</span></a></li>`)
    .join('')}</ul>`;
  const hero = pageHero(lang, { ...pp.hero, crumbs, extra: catNav });
  const counts = Object.fromEntries(groups.map((g) => [g, products.filter((p) => p.group === g).length]));
  const filters = `<div class="filters" role="group" aria-label="${pp.filterLabel}">
    <button type="button" class="filter is-on" data-filter="all" aria-pressed="true">${t.groups.all}<span>${products.length}</span></button>
    ${groups.map((g) => `<button type="button" class="filter" data-filter="${g}" aria-pressed="false">${t.groups[g]}<span>${counts[g]}</span></button>`).join('')}
  </div>`;
  const conc = `<section class="section section--first" id="concentrates" aria-labelledby="conc-title">
  <div class="container">
    <div class="featured__head">
      ${secHead({ title: t.categories.concentrates.t, lead: t.categories.concentrates.d, id: 'conc-title' })}
      <p class="results" aria-live="polite" data-results>${pp.count(products.length)}</p>
    </div>
    ${filters}
    <div class="pgrid" data-grid>${products.map((p) => productCard(p, lang, { h: 'h3' })).join('')}</div>
  </div>
</section>`;
  const soonSection = (id) => `<section class="section section--cream soon" id="${id}" aria-labelledby="${id}-title">
  <div class="container">
    <div class="featured__head">
      ${secHead({ eyebrow: t.ui.soon, title: t.categories[id].t, lead: `${t.categories[id].d} ${pp.soon.lead}`, id: `${id}-title` })}
      <a class="btn btn--ghost" href="${contactHref(lang, { product: id, request: 'other' })}">${pp.soon.cta}${icon('arrow')}</a>
    </div>
    <div class="pgrid pgrid--soon">${[0, 1, 2, 3].map((i) => soonCard(id, lang, i)).join('')}</div>
  </div>
</section>`;
  const seo = `<section class="section">
  <div class="container narrow reveal">
    <h2 class="sechead__title sechead__title--sm">${pp.seo.title}</h2>
    ${pp.seo.paras.map((p) => `<p>${p}</p>`).join('')}
  </div>
</section>`;
  const body = [hero, conc, soonSection('nectars'), soonSection('tea'), seo, ctaBand(lang, t.home.cta)].join('\n');
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t.categories.concentrates.t,
    itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(productUrl(p, lang)), name: p.name[lang] })),
  };
  return layout({ lang, page: 'products', ...t.meta.products, urlPath: routes.products[lang], alternates: routes.products, body, jsonld: [breadcrumbLd(crumbs), itemList] });
}

// ---------- PRODUCT DETAIL ----------
function productPage(p, lang) {
  const t = T[lang];
  const crumbs = [
    { name: t.ui.home, url: routes.home[lang] },
    { name: t.ui.nav.products, url: routes.products[lang] },
    { name: p.name[lang], url: productUrl(p, lang) },
  ];
  const related = products.filter((x) => x.id !== p.id && x.group === p.group).concat(products.filter((x) => x.id !== p.id && x.group !== p.group)).slice(0, 4);
  const body = `<section class="section section--first pd-page">
  <div class="container">
    ${breadcrumbs(lang, crumbs)}
    ${productDetail(p, lang)}
  </div>
</section>
<section class="section section--cream">
  <div class="container">
    <div class="featured__head">
      ${secHead({ title: t.spec.related })}
      <a class="btn btn--ghost" href="${routes.products[lang]}">${t.ui.backToProducts}${icon('arrow')}</a>
    </div>
    <div class="pgrid">${related.map((r) => productCard(r, lang)).join('')}</div>
  </div>
</section>
${ctaBand(lang, t.home.cta)}`;
  const title = t.meta.productTitle({ name: p.name[lang], brix: fmt(p.brix, lang) });
  const description = t.meta.productDescription({ name: p.name[lang], brix: fmt(p.brix, lang) });
  return layout({ lang, page: 'product', title, description, urlPath: productUrl(p, lang), alternates: productAlternates(p), body, jsonld: [breadcrumbLd(crumbs)] });
}

// ---------- APPLICATIONS ----------
function applicationsPage(lang) {
  const t = T[lang];
  const ap = t.applications;
  const crumbs = [{ name: t.ui.home, url: routes.home[lang] }, { name: t.ui.nav.applications, url: routes.applications[lang] }];
  const hero = pageHero(lang, { ...ap.hero, crumbs });
  const cards = `<section class="section section--first">
  <div class="container">
    <div class="appgrid">${applications
      .map((a) => {
        const recs = products.filter((p) => p.apps.includes(a));
        return `<article class="appcard reveal" id="${a}">
  <span class="appcard__icon">${icon(a, '', 28)}</span>
  <h2 class="appcard__t">${t.apps[a].t}</h2>
  <p class="appcard__d">${t.apps[a].d}</p>
  <p class="appcard__label">${ap.recommended}</p>
  <ul class="dots">${recs.map((p) => `<li><a href="${productUrl(p, lang)}" data-product="${p.id}" style="--c1:${p.colors[0]};--c2:${p.colors[1]}"><i aria-hidden="true"></i>${esc(p.fruit[lang])}</a></li>`).join('')}</ul>
</article>`;
      })
      .join('')}</div>
  </div>
</section>`;
  const choose = `<section class="section section--cream">
  <div class="container">
    ${secHead({ eyebrow: ap.choose.eyebrow, title: ap.choose.title })}
    <ul class="usp usp--4">${ap.choose.items.map((u) => `<li class="usp__item reveal"><span class="usp__icon">${icon(u.icon)}</span><div><h3 class="usp__t">${u.t}</h3><p class="usp__d">${u.d}</p></div></li>`).join('')}</ul>
  </div>
</section>`;
  const d = ap.dilution;
  const dilution = `<section class="section">
  <div class="container split split--top">
    <div class="split__text reveal">
      <p class="eyebrow">${d.eyebrow}</p>
      <h2 class="sechead__title">${d.title}</h2>
      ${d.paras.map((p) => `<p>${p}</p>`).join('')}
      <p class="formula"><span>${d.formulaLabel}</span>${d.formula}</p>
    </div>
    <div class="recipe reveal">
      <p class="recipe__label">${d.exampleLabel}</p>
      <table class="spec spec--recipe"><tbody>${d.example.map(([k, v], i) => `<tr${i === d.example.length - 1 ? ' class="is-total"' : ''}><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}</tbody></table>
      <div class="recipe__glass" aria-hidden="true"><span class="recipe__conc"></span><span class="recipe__water"></span></div>
      <p class="recipe__note">${d.note}</p>
    </div>
  </div>
</section>`;
  const body = [hero, cards, choose, dilution, ctaBand(lang, { title: ap.cta.title, lead: ap.cta.lead, primary: ap.cta.primary })].join('\n');
  return layout({ lang, page: 'applications', ...t.meta.applications, urlPath: routes.applications[lang], alternates: routes.applications, body, jsonld: [breadcrumbLd(crumbs)] });
}

// ---------- CONTACT ----------
function contactPage(lang) {
  const t = T[lang];
  const ct = t.contact;
  const f = ct.form;
  const c = config.company;
  const crumbs = [{ name: t.ui.home, url: routes.home[lang] }, { name: t.ui.nav.contact, url: routes.contact[lang] }];
  const hero = pageHero(lang, { ...ct.hero, crumbs });
  const a = config.company.address;
  const gmaps = `https://www.google.com/maps/dir/?api=1&destination=${a.lat},${a.lng}`;
  const waze = `https://waze.com/ul?ll=${a.lat},${a.lng}&navigate=yes`;
  const field = (name, label, { type = 'text', required = false, auto = '', ph = '' } = {}) =>
    `<div class="field"><label for="f-${name}">${label}${required ? ' <span aria-hidden="true">*</span>' : ''}</label><input id="f-${name}" name="${name}" type="${type}"${required ? ' required' : ''}${auto ? ` autocomplete="${auto}"` : ''}${ph ? ` placeholder="${esc(ph)}"` : ''} maxlength="${type === 'email' ? 120 : 100}"><p class="field__err" id="e-${name}"></p></div>`;
  const productChips = products
    .map((p) => `<label class="pick" style="--c1:${p.colors[0]};--c2:${p.colors[1]}"><input type="checkbox" name="products[]" value="${p.id}"><span><i aria-hidden="true"></i>${esc(p.fruit[lang])}</span></label>`)
    .concat(['nectars', 'tea'].map((k) => `<label class="pick pick--soon"><input type="checkbox" name="products[]" value="${k}"><span>${f[k]}</span></label>`))
    .join('');
  const form = `<form class="cform" id="form" action="${config.formEndpoint}" method="post" novalidate data-form data-msg-required="${esc(f.required)}" data-msg-email="${esc(f.invalidEmail)}" data-msg-consent="${esc(f.consentRequired)}" data-msg-error="${esc(f.error)}" data-msg-rate="${esc(f.rate)}" data-sales-email="${config.emails.sales}">
  <h2 class="cform__title">${f.title}</h2>
  <p class="cform__lead">${f.lead}</p>
  <input type="hidden" name="lang" value="${lang}">
  <input type="hidden" name="ts" value="">
  <input type="hidden" name="hk" value="">
  <div class="hp" aria-hidden="true"><label for="f-website">Website</label><input id="f-website" type="text" name="website" tabindex="-1" autocomplete="off"></div>
  <div class="cform__grid">
    ${field('name', f.name, { required: true, auto: 'name' })}
    ${field('company', f.company, { required: true, auto: 'organization' })}
    ${field('email', f.email, { type: 'email', required: true, auto: 'email' })}
    ${field('phone', f.phone, { type: 'tel', auto: 'tel' })}
    <div class="field"><label for="f-country">${f.country}</label><select id="f-country" name="country" autocomplete="country"><option value="">${f.countryPlaceholder}</option>${ct.countries.map(([code, n]) => `<option value="${code}">${n}</option>`).join('')}</select></div>
    <div class="field"><label for="f-type">${f.type}</label><select id="f-type" name="type"><option value="">${f.volumes['']}</option>${Object.entries(f.types).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></div>
    <fieldset class="field field--full"><legend>${f.request}</legend><div class="seg">${Object.entries(f.requests).map(([k, v], i) => `<label class="seg__opt"><input type="radio" name="request" value="${k}"${i === 0 ? ' checked' : ''}><span>${v}</span></label>`).join('')}</div></fieldset>
    <fieldset class="field field--full"><legend>${f.products}</legend><div class="picks">${productChips}</div></fieldset>
    <div class="field"><label for="f-volume">${f.volume}</label><select id="f-volume" name="volume">${Object.entries(f.volumes).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></div>
    <div class="field field--full"><label for="f-message">${f.message} <span aria-hidden="true">*</span></label><textarea id="f-message" name="message" rows="5" required maxlength="3000" placeholder="${esc(f.messagePlaceholder)}"></textarea><p class="field__err" id="e-message"></p></div>
    <div class="field field--full"><label class="consent"><input type="checkbox" name="consent" value="1" required><span>${f.consent.replace('{privacy}', routes.privacy[lang])}</span></label><p class="field__err" id="e-consent"></p></div>
    ${config.turnstileSiteKey ? `<div class="field field--full"><div class="cf-turnstile" data-sitekey="${config.turnstileSiteKey}" data-language="${lang}"></div></div>` : ''}
  </div>
  <div class="cform__foot">
    <button class="btn btn--primary btn--lg" type="submit" data-label="${esc(f.submit)}" data-sending="${esc(f.sending)}">${f.submit}${icon('arrow')}</button>
    <p class="cform__status" role="status" aria-live="polite" data-status></p>
  </div>
  <div class="cform__done" hidden data-done tabindex="-1">
    <span class="cform__done-icon">${icon('check', '', 32)}</span>
    <h2>${f.successTitle}</h2>
    <p>${f.successText}</p>
    <button class="btn btn--ghost" type="button" data-again>${f.again}</button>
  </div>
  <noscript><p class="notice">${f.error} <a href="mailto:${config.emails.sales}">${config.emails.sales}</a></p></noscript>
</form>`;
  const info = `<aside class="cinfo">
  <div class="cinfo__card reveal">
    <span class="cinfo__icon">${icon('pin')}</span>
    <div><h2>${ct.info.address}</h2><p>${esc(fullAddress(lang))}</p><p class="cinfo__links"><a href="${gmaps}" target="_blank" rel="noopener">${ct.map.google}</a><a href="${waze}" target="_blank" rel="noopener">${ct.map.waze}</a></p></div>
  </div>
  <div class="cinfo__card reveal">
    <span class="cinfo__icon">${icon('phone')}</span>
    <div><h2>${ct.info.phone}</h2><p class="cinfo__stack">${phoneLinks()}</p></div>
  </div>
  <div class="cinfo__card reveal">
    <span class="cinfo__icon">${icon('mail')}</span>
    <div><h2>${ct.info.email}</h2><p class="cinfo__stack"><a href="mailto:${config.emails.sales}">${config.emails.sales}</a><small>${ct.info.emailSales}</small><a href="mailto:${config.emails.office}">${config.emails.office}</a><small>${ct.info.emailOffice}</small></p></div>
  </div>
  <a class="cinfo__card cinfo__card--wa reveal" href="${waHref(lang)}" target="_blank" rel="noopener">
    <span class="cinfo__icon">${whatsappIcon}</span>
    <div><h2>${ct.info.whatsapp}</h2><p>${ct.info.whatsappCta} →</p></div>
  </a>
  <div class="cinfo__card cinfo__card--legal reveal">
    <span class="cinfo__icon">${icon('building')}</span>
    <div><h2>${ct.info.company}</h2><p><strong>${c.legalName}</strong><br>${t.about.company.labels.reg}: ${c.regCom}<br>CUI: ${c.cui}</p></div>
  </div>
</aside>`;
  const main = `<section class="section section--first">
  <div class="container contact-grid">${form}${info}</div>
</section>`;
  const map = `<section class="section section--tight" aria-labelledby="map-title">
  <div class="container">
    <div class="mapbox reveal">
      <div class="map" id="map" data-lat="${a.lat}" data-lng="${a.lng}" data-zoom="13" data-label="NaturaFruct" aria-label="${esc(ct.map.title)}">
        <div class="map__ph" aria-hidden="true"></div>
      </div>
      <div class="mapcard">
        <p class="eyebrow">${ct.map.directions}</p>
        <h2 id="map-title">${ct.map.title}</h2>
        <p>${esc(fullAddress(lang))}</p>
        <div class="mapcard__btns"><a class="btn btn--primary btn--sm" href="${gmaps}" target="_blank" rel="noopener">${icon('pin')}${ct.map.google}</a><a class="btn btn--ghost btn--sm" href="${waze}" target="_blank" rel="noopener">${ct.map.waze}</a></div>
      </div>
    </div>
  </div>
</section>`;
  const body = [hero, main, map].join('\n');
  return layout({ lang, page: 'contact', ...t.meta.contact, urlPath: routes.contact[lang], alternates: routes.contact, body, jsonld: [breadcrumbLd(crumbs)] });
}

// ---------- PRIVACY ----------
function privacyPage(lang) {
  const t = T[lang];
  const pv = t.privacy;
  const crumbs = [{ name: t.ui.home, url: routes.home[lang] }, { name: pv.h1, url: routes.privacy[lang] }];
  const body = `${pageHero(lang, { eyebrow: 'GDPR', h1: pv.h1, lead: pv.updated, crumbs })}
<section class="section section--first">
  <div class="container narrow prose">${pv.sections.map((s) => `<h2>${s.h}</h2><p>${s.p}</p>`).join('')}</div>
</section>`;
  return layout({ lang, page: 'privacy', ...t.meta.privacy, urlPath: routes.privacy[lang], alternates: routes.privacy, body, jsonld: [breadcrumbLd(crumbs)] });
}

// ---------- 404 ----------
function notFoundPage(lang) {
  const t = T[lang];
  const nf = t.notFound;
  const body = `<section class="section nf">
  <div class="container narrow nf__inner">
    <p class="nf__code" aria-hidden="true">404</p>
    <h1 class="phero__title">${nf.h1}</h1>
    <p>${nf.text}</p>
    <div class="hero__cta"><a class="btn btn--primary" href="${routes.home[lang]}">${nf.home}</a><a class="btn btn--ghost" href="${routes.products[lang]}">${nf.products}</a></div>
  </div>
</section>`;
  return layout({ lang, page: 'notfound', ...t.meta.notFound, urlPath: lang === 'ro' ? '/404.html' : '/en/404.html', alternates: { ro: '/404.html', en: '/en/404.html' }, body, noindex: true });
}

// =====================================================================
// BUILD
// =====================================================================
for (const lang of LANGS) {
  addPage(routes.home[lang], homePage(lang));
  addPage(routes.about[lang], aboutPage(lang));
  addPage(routes.products[lang], productsPage(lang));
  addPage(routes.applications[lang], applicationsPage(lang));
  addPage(routes.contact[lang], contactPage(lang));
  addPage(routes.privacy[lang], privacyPage(lang));
  for (const p of products) addPage(productUrl(p, lang), productPage(p, lang));
}
write('404.html', notFoundPage('ro'));
write('en/404.html', notFoundPage('en'));

// ---------- sitemap.xml (with hreflang alternates) ----------
const sitemapEntries = [];
const pushAlt = (alts, prio) => {
  for (const lang of LANGS) {
    sitemapEntries.push(`  <url>
    <loc>${abs(alts[lang])}</loc>
    <lastmod>${TODAY}</lastmod>
    <priority>${prio}</priority>
    <xhtml:link rel="alternate" hreflang="ro" href="${abs(alts.ro)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${abs(alts.en)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(alts.ro)}"/>
  </url>`);
  }
};
pushAlt(routes.home, '1.0');
pushAlt(routes.products, '0.9');
for (const p of products) pushAlt(productAlternates(p), '0.8');
pushAlt(routes.applications, '0.7');
pushAlt(routes.about, '0.7');
pushAlt(routes.contact, '0.7');
pushAlt(routes.privacy, '0.2');
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries.join('\n')}
</urlset>
`);

write('robots.txt', NOINDEX ? 'User-agent: *\nDisallow: /\n' : `User-agent: *
Allow: /
Disallow: /contact.php
Disallow: /contact-config.php

Sitemap: ${abs('/sitemap.xml')}
`);

write('site.webmanifest', JSON.stringify({
  name: 'NaturaFruct',
  short_name: 'NaturaFruct',
  start_url: `${BASE}/`,
  display: 'browser',
  background_color: '#ffffff',
  theme_color: '#1A6840',
  icons: [{ src: `${BASE}/assets/img/apple-touch-icon.png`, sizes: '180x180', type: 'image/png' }],
}, null, 2));

// Labels used by contact.php to build the notification e-mail (Romanian, for the sales team)
write('contact-labels.json', JSON.stringify({
  products: { ...Object.fromEntries(products.map((p) => [p.id, p.name.ro])), nectars: ro.contact.form.nectars, tea: ro.contact.form.tea },
  requests: ro.contact.form.requests,
  types: ro.contact.form.types,
  volumes: Object.fromEntries(Object.entries(ro.contact.form.volumes).filter(([k]) => k)),
  countries: Object.fromEntries(ro.contact.countries),
}, null, 2));

// .htaccess — inject CSP hash for the inline script
const htaccessTpl = fs.readFileSync(path.join(SRC, 'htaccess.txt'), 'utf8');
const turnstile = config.turnstileSiteKey ? ' https://challenges.cloudflare.com' : '';
write('.htaccess', htaccessTpl.replace('{{SCRIPT_HASH}}', `'sha256-${INLINE_JS_HASH}'`).replaceAll('{{TURNSTILE}}', turnstile));

const sampleCount = reviews.filter((r) => r.sample).length;
if (PREVIEW) write('.nojekyll', '');
console.log(`✓ Built ${pages.length} pages + 404 → dist/${BASE ? ` (base ${BASE})` : ''}${NOINDEX ? ' [noindex]' : ''}`);
if (sampleCount) console.warn(`! ${sampleCount} sample review(s) in src/data/reviews.mjs — replace them with real reviews before launch.`);
