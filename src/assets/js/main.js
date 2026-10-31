/* NaturaFruct — site scripts (no dependencies). */
(() => {
  'use strict';
  const doc = document.documentElement;
  const LANG = document.body.dataset.lang || 'ro';
  const BASE = doc.dataset.base || '';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ------------------------------------------------------------
     Header: shadow on scroll + "juice" that sloshes with scroll
     velocity and shifts from apple gold to cherry red near the footer.
     The animation loop only runs while the liquid is moving.
     ------------------------------------------------------------ */
  const hdr = $('.hdr');
  const svg = hdr && $('.juice', hdr);
  if (hdr) {
    const back = svg && $('.juice__back', svg);
    const front = svg && $('.juice__front', svg);
    const shine = svg && $('.juice__shine', svg);
    const W = 1440, H = 26, BASE = 14, N = 48, REST = 1.5;
    const STOPS = [
      [0, [231, 180, 74]],
      [0.45, [236, 165, 62]],
      [0.7, [229, 128, 58]],
      [0.86, [200, 58, 53]],
      [1, [163, 22, 46]],
    ];
    let amp = REST, tilt = 0, tiltV = 0, phase = 0;
    let lastY = scrollY, lastT = 0, running = false, colorQueued = false;

    const colorAt = (p) => {
      for (let i = 1; i < STOPS.length; i++) {
        const [p1, c1] = STOPS[i];
        const [p0, c0] = STOPS[i - 1];
        if (p <= p1) {
          const t = (p - p0) / (p1 - p0 || 1);
          return `rgb(${c0.map((v, k) => Math.round(v + (c1[k] - v) * t)).join(',')})`;
        }
      }
      return 'rgb(163,22,46)';
    };
    const surface = (a, t, ph) => {
      const pts = [];
      for (let i = 0; i <= N; i++) {
        const x = i / N;
        const y = BASE - (a * Math.sin(x * Math.PI * 4 + ph) + a * 0.45 * Math.sin(x * Math.PI * 9 - ph * 1.6)) + t * (x - 0.5) * 2;
        pts.push(`${(x * W).toFixed(1)} ${y.toFixed(2)}`);
      }
      return pts;
    };
    const draw = () => {
      if (!front) return;
      const f = surface(amp, tilt, phase);
      const b = surface(amp * 0.8, -tilt * 0.6, phase + 1.9).map((s) => s.replace(/ ([\d.-]+)$/, (m, y) => ` ${(+y - 2.2).toFixed(2)}`));
      front.setAttribute('d', `M0 ${H} L${f.join(' L')} L${W} ${H}Z`);
      back.setAttribute('d', `M0 ${H} L${b.join(' L')} L${W} ${H}Z`);
      shine.setAttribute('d', `M${f.join(' L')}`);
    };
    const tick = (now) => {
      const dt = Math.min(0.05, (now - (lastT || now)) / 1000);
      lastT = now;
      tiltV += (-38 * tilt - 4.2 * tiltV) * dt;
      tilt = Math.max(-8, Math.min(8, tilt + tiltV * dt));
      amp += (REST - amp) * (1 - Math.exp(-dt * 1.5));
      phase += dt * (1.4 + amp * 0.4);
      draw();
      if (Math.abs(tilt) < 0.03 && Math.abs(tiltV) < 0.05 && Math.abs(amp - REST) < 0.04) { running = false; lastT = 0; return; }
      requestAnimationFrame(tick);
    };
    const updateColor = () => {
      colorQueued = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      doc.style.setProperty('--juice', colorAt(p));
    };
    const onScroll = () => {
      const y = scrollY;
      const dy = y - lastY;
      lastY = y;
      hdr.classList.toggle('is-scrolled', y > 8);
      if (!colorQueued) { colorQueued = true; requestAnimationFrame(updateColor); }
      if (reduceMotion || !front) return;
      amp = Math.min(6.5, amp + Math.abs(dy) * 0.035);
      tiltV = Math.max(-60, Math.min(60, tiltV + Math.max(-60, Math.min(60, dy)) * 0.9));
      if (!running) { running = true; requestAnimationFrame(tick); }
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', () => { if (!colorQueued) { colorQueued = true; requestAnimationFrame(updateColor); } }, { passive: true });
    updateColor();
    draw();
    hdr.classList.toggle('is-scrolled', scrollY > 8);
  }

  /* ------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------ */
  const burger = $('.burger');
  const setNav = (open) => {
    doc.classList.toggle('nav-open', open);
    burger && burger.setAttribute('aria-expanded', String(open));
  };
  burger && burger.addEventListener('click', () => setNav(!doc.classList.contains('nav-open')));
  $$('.nav a').forEach((a) => a.addEventListener('click', () => setNav(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && doc.classList.contains('nav-open')) { setNav(false); burger && burger.focus(); } });
  matchMedia('(min-width: 1025px)').addEventListener('change', (e) => e.matches && setNav(false));

  /* ------------------------------------------------------------
     Reveal on scroll (content is visible without JS)
     ------------------------------------------------------------ */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px 15% 0px', threshold: 0 });
    reveals.forEach((el) => {
      const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
      el.style.setProperty('--d', Math.min(sibs.indexOf(el), 4));
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ------------------------------------------------------------
     Product slider (arrows + mouse drag)
     ------------------------------------------------------------ */
  $$('[data-slider]').forEach((sl) => {
    const sec = sl.closest('section');
    const prev = sec && $('[data-slider-prev]', sec);
    const next = sec && $('[data-slider-next]', sec);
    const step = () => {
      const card = $('.pcard', sl);
      return card ? (card.getBoundingClientRect().width + 20) * (innerWidth > 900 ? 2 : 1) : 300;
    };
    const update = () => {
      if (prev) prev.disabled = sl.scrollLeft < 8;
      if (next) next.disabled = sl.scrollLeft > sl.scrollWidth - sl.clientWidth - 8;
    };
    prev && prev.addEventListener('click', () => sl.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next && next.addEventListener('click', () => sl.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    sl.addEventListener('scroll', update, { passive: true });
    update();

    let down = false, startX = 0, startLeft = 0, moved = false;
    sl.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = sl.scrollLeft;
    });
    addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) { moved = true; sl.style.scrollSnapType = 'none'; sl.style.cursor = 'grabbing'; }
      if (moved) sl.scrollLeft = startLeft - dx;
    });
    addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      sl.style.cursor = '';
      if (moved) {
        const left = sl.scrollLeft;
        sl.style.scrollSnapType = '';
        sl.scrollLeft = left;
      }
    });
    sl.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  });

  /* ------------------------------------------------------------
     Product filters
     ------------------------------------------------------------ */
  const grid = $('[data-grid]');
  if (grid) {
    const results = $('[data-results]');
    const label = (n) => (LANG === 'ro' ? `${n} ${n === 1 ? 'produs' : 'produse'}` : `${n} ${n === 1 ? 'product' : 'products'}`);
    $$('[data-filter]').forEach((btn) => btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      $$('[data-filter]').forEach((b) => { const on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
      let n = 0;
      $$('.pcard', grid).forEach((card) => {
        const show = f === 'all' || card.dataset.group === f;
        const wasHidden = card.classList.contains('is-hidden');
        card.classList.toggle('is-hidden', !show);
        if (show) {
          n++;
          card.classList.add('is-in');
          if (wasHidden && !reduceMotion) {
            card.classList.remove('is-entering');
            void card.offsetWidth;
            card.classList.add('is-entering');
          }
        }
      });
      results && (results.textContent = label(n));
    }));
  }

  /* ------------------------------------------------------------
     Product modal — each product also has its own indexable URL.
     Clicking a card loads that page's spec into a dialog and updates
     the address bar, so links stay shareable and Back closes the modal.
     ------------------------------------------------------------ */
  const modal = $('#pmodal');
  const mBody = $('#pmodal-body');
  const mPanel = modal && $('.pmodal__panel', modal);
  const cache = new Map();
  let opener = null, pushed = false, ignorePop = false, baseTitle = document.title;

  const load = (url) => {
    if (cache.has(url)) return cache.get(url);
    const pr = fetch(url, { credentials: 'same-origin' })
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then((html) => {
        const d = new DOMParser().parseFromString(html, 'text/html');
        const pd = d.querySelector('.pd');
        if (!pd) throw new Error('no content');
        return { html: pd.outerHTML, title: d.title };
      });
    cache.set(url, pr);
    pr.catch(() => cache.delete(url));
    return pr;
  };

  const openProduct = async (url, push) => {
    if (!modal || typeof modal.showModal !== 'function') { location.href = url; return; }
    if (!modal.open) {
      baseTitle = document.title;
      mBody.innerHTML = '<div class="pmodal__loading" aria-hidden="true"><span></span><span></span></div>';
      modal.showModal();
      doc.classList.add('modal-open');
    }
    if (push === 'push') { history.pushState({ pmodal: url }, '', url); pushed = true; }
    else if (push === 'replace') { history.replaceState({ pmodal: url }, '', url); }
    try {
      const { html, title } = await load(url);
      mBody.innerHTML = html;
      document.title = title;
      mPanel.scrollTop = 0;
      const h = $('h1', mBody);
      if (h) { h.id = 'pmodal-title'; modal.setAttribute('aria-labelledby', 'pmodal-title'); }
    } catch (err) {
      location.href = url;
    }
  };

  const finishClose = () => {
    modal.classList.remove('is-closing');
    if (modal.open) modal.close();
    doc.classList.remove('modal-open');
    mBody.innerHTML = '';
    document.title = baseTitle;
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
  };
  const closeModal = (fromHistory) => {
    if (!modal || !modal.open || modal.classList.contains('is-closing')) return;
    if (!fromHistory && pushed) { pushed = false; ignorePop = true; history.back(); }
    if (reduceMotion) { finishClose(); return; }
    modal.classList.add('is-closing');
    setTimeout(finishClose, 230);
  };

  if (modal) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-product]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      if (!modal.open) opener = a;
      openProduct(a.href, modal.open ? 'replace' : 'push');
    });
    const prefetch = (e) => { const a = e.target.closest && e.target.closest('a[data-product]'); if (a) load(a.href).catch(() => {}); };
    document.addEventListener('pointerover', prefetch, { passive: true });
    document.addEventListener('focusin', prefetch);
    modal.addEventListener('cancel', (e) => { e.preventDefault(); closeModal(false); });
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('[data-modal-close]')) closeModal(false); });
    addEventListener('popstate', (e) => {
      if (ignorePop) { ignorePop = false; return; }
      const st = e.state;
      if (st && st.pmodal) { pushed = true; openProduct(st.pmodal, null); }
      else if (modal.open) { pushed = false; closeModal(true); }
    });
  }

  /* ------------------------------------------------------------
     Reviews: show more
     ------------------------------------------------------------ */
  const moreBtn = $('[data-reviews-more]');
  moreBtn && moreBtn.addEventListener('click', () => {
    $$('.rcard[data-extra]').forEach((c) => { c.hidden = false; c.classList.add('is-in'); });
    moreBtn.remove();
  });

  /* ------------------------------------------------------------
     Contact form — validation, prefill, spam signals, AJAX submit
     ------------------------------------------------------------ */
  const form = $('[data-form]');
  if (form) {
    const el = (n) => form.elements.namedItem(n);
    const M = form.dataset;
    const status = $('[data-status]', form);
    const submit = $('button[type="submit"]', form);
    const done = $('[data-done]', form);
    el('ts').value = String(Date.now());
    const human = () => { if (!el('hk').value) el('hk').value = `h${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`; };
    ['pointerdown', 'keydown', 'touchstart', 'focusin'].forEach((ev) => form.addEventListener(ev, human, { once: true, passive: true }));

    const params = new URLSearchParams(location.search);
    const prod = params.get('product');
    if (prod) $$('input[name="products[]"]', form).forEach((cb) => { if (cb.value === prod) cb.checked = true; });
    const req = params.get('request');
    if (req) $$('input[name="request"]', form).forEach((r) => { if (r.value === req) r.checked = true; });
    // Result of a no-JS (classic) submission redirected back by contact.php
    if (params.get('sent') === '1') { form.classList.add('is-done'); done.hidden = false; }
    if (params.get('error') === '1') { status.classList.add('is-error'); status.innerHTML = `${M.msgError} <a href="mailto:${M.salesEmail}">${M.salesEmail}</a>`; }

    const setErr = (name, msg) => {
      const input = el(name);
      const wrap = input && (input.closest ? input.closest('.field') : null);
      const err = $(`#e-${name}`, form);
      wrap && wrap.classList.toggle('is-invalid', !!msg);
      if (input && input.setAttribute) { msg ? input.setAttribute('aria-invalid', 'true') : input.removeAttribute('aria-invalid'); if (err) input.setAttribute('aria-describedby', err.id); }
      if (err) err.textContent = msg || '';
      return !msg;
    };
    const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    const validate = () => {
      const checks = [
        setErr('name', el('name').value.trim() ? '' : M.msgRequired),
        setErr('company', el('company').value.trim() ? '' : M.msgRequired),
        setErr('email', !el('email').value.trim() ? M.msgRequired : emailOk(el('email').value.trim()) ? '' : M.msgEmail),
        setErr('message', el('message').value.trim() ? '' : M.msgRequired),
        setErr('consent', el('consent').checked ? '' : M.msgConsent),
      ];
      const first = $('[aria-invalid="true"]', form);
      first && first.focus();
      return checks.every(Boolean);
    };
    form.addEventListener('input', (e) => { const n = e.target.name; if (n && $(`#e-${n}`, form) && e.target.getAttribute('aria-invalid')) setErr(n, ''); });
    form.addEventListener('change', (e) => { if (e.target.name === 'consent' && e.target.checked) setErr('consent', ''); });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      status.classList.remove('is-error');
      if (!validate()) return;
      human();
      submit.disabled = true;
      submit.firstChild.textContent = submit.dataset.sending;
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        let data = {};
        try { data = await res.json(); } catch (_) { /* non-JSON */ }
        if (res.ok && data.ok) {
          form.classList.add('is-done');
          done.hidden = false;
          done.focus();
          form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        } else if (res.status === 429) {
          throw Object.assign(new Error('rate'), { rate: true });
        } else {
          if (data.field) setErr(data.field, data.message || M.msgRequired);
          throw new Error(data.error || 'send');
        }
      } catch (err) {
        status.classList.add('is-error');
        if (err.rate) status.textContent = M.msgRate;
        else status.innerHTML = `${M.msgError} <a href="mailto:${M.salesEmail}">${M.salesEmail}</a>`;
      } finally {
        submit.disabled = false;
        submit.firstChild.textContent = submit.dataset.label;
      }
    });
    const again = $('[data-again]', form);
    again && again.addEventListener('click', () => {
      form.reset();
      form.classList.remove('is-done');
      done.hidden = true;
      el('ts').value = String(Date.now());
      el('name').focus();
    });

    // Optional Cloudflare Turnstile (only if a site key is configured)
    if ($('.cf-turnstile', form)) {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      s.async = true; s.defer = true;
      document.head.appendChild(s);
    }
  }

  /* ------------------------------------------------------------
     Map — Leaflet (self-hosted) + OpenStreetMap, loaded on demand
     ------------------------------------------------------------ */
  const mapEl = $('#map');
  if (mapEl) {
    const init = () => {
      const L = window.L;
      if (!L) return;
      const lat = +mapEl.dataset.lat, lng = +mapEl.dataset.lng, z = +mapEl.dataset.zoom || 13;
      const wide = innerWidth > 760;
      const map = L.map(mapEl, { scrollWheelZoom: false, zoomControl: false }).setView([lat, wide ? lng - 0.035 : lng], z);
      L.control.zoom({ position: 'topright' }).addTo(map);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
      }).addTo(map);
      const icon = L.divIcon({ className: 'pin-wrap', html: '<span class="pin"><span class="pin__ring"></span><span class="pin__drop"></span></span>', iconSize: [46, 46], iconAnchor: [23, 52] });
      L.marker([lat, lng], { icon, title: mapEl.dataset.label, keyboard: false }).addTo(map);
      map.on('click focus', () => map.scrollWheelZoom.enable());
      map.on('mouseout', () => map.scrollWheelZoom.disable());
      const ph = $('.map__ph', mapEl);
      ph && ph.remove();
    };
    const loadMap = () => {
      if (mapEl.dataset.loaded) return;
      mapEl.dataset.loaded = '1';
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = `${BASE}/assets/vendor/leaflet/leaflet.css`;
      document.head.appendChild(css);
      const s = document.createElement('script');
      s.src = `${BASE}/assets/vendor/leaflet/leaflet.js`;
      s.onload = init;
      document.head.appendChild(s);
    };
    if ('IntersectionObserver' in window) {
      const mio = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { mio.disconnect(); loadMap(); } }, { rootMargin: '400px' });
      mio.observe(mapEl);
    } else loadMap();
  }
})();
