// "After Effects style" animation engine for a kit carousel.
// Injected by video.mjs into the carousel page. Exposes window.__video = { duration, cues, seek(t) }.
// Automatic choreography by element type; data-anim in the HTML forces the type:
//   data-anim="title|chars|wipe|text|pop|media|none"   data-delay="0.3" (seconds, added)
// Per-slide transition (leaving that slide): data-transition="pan|whip|zoom|cut"
// Options come from window.__videoOpts (set by video.mjs):
//   { transitions: 'auto'|'pan'|'whip'|'zoom'|'cut', stutter: bool, bpm: number, header: 'small|big', bgfill: bool }
(async () => {
  const W = 1080, SH = 1350;
  const opts = { transitions: 'auto', stutter: true, bgfill: true, ...(window.__videoOpts || {}) };
  const load = (src) => new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
  });
  if (!window.gsap) await load('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
  await document.fonts.ready;

  // Video mode: one slide visible at a time. Layers, back to front:
  //   .bgfill (blurred, enlarged copy, only when the frame is taller than the slide)
  //   .cam    (camera: zoom, punch-in, shake, motion blur) > .carousel (pan between slides)
  //   .vheader (fixed title band) · .flash (white flash frames)
  const H = window.innerHeight;
  const top = Math.max(0, (H - SH) / 2);
  const css = document.createElement('style');
  css.textContent = `
    body.video { width: ${W}px; height: ${H}px; overflow: hidden; margin: 0; padding: 0; background: var(--bg); position: relative; }
    body.video .cam { position: absolute; left: 0; top: ${top}px; width: ${W}px; height: ${SH}px; overflow: hidden; transform-origin: 50% 50%; }
    body.video .cam > .carousel { zoom: 1; transform: none; }
    body.video .slide { box-shadow: none; }
    body.video .bgfill { position: absolute; left: 0; top: ${top}px; width: ${W}px; height: ${SH}px; overflow: visible;
      transform: scale(${(H / SH * 1.08).toFixed(3)}); transform-origin: 50% 50%; filter: blur(34px) brightness(.5) saturate(1.25); }
    body.video .vheader { position: absolute; left: 0; right: 0; top: 0; height: ${top}px; z-index: 20; display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 10px; color: #fff; text-align: center; text-shadow: 0 2px 18px rgba(0,0,0,.45); }
    body.video .vheader .s { font: 600 34px/1 var(--f-body); opacity: .9; }
    body.video .vheader .b { font: 800 58px/1.05 var(--f-display); letter-spacing: -.02em; }
    body.video .flash { position: absolute; inset: 0; background: #fff; opacity: 0; z-index: 30; pointer-events: none; }`;
  document.head.appendChild(css);
  document.body.classList.remove('render');
  document.body.classList.add('video');

  const car = document.querySelector('.carousel');
  const slides = [...car.querySelectorAll(':scope > .slide')];
  const spans = [...car.querySelectorAll(':scope > .span')];

  // Blurred background fill (the classic way to put a 4:5 piece into a 9:16 frame): a static copy of the
  // strip, enlarged and blurred, that pans together with the real one.
  let bgCar = null;
  if (opts.bgfill && H > SH + 40) {
    const bg = document.createElement('div'); bg.className = 'bgfill';
    bgCar = car.cloneNode(true); bgCar.querySelectorAll('script').forEach((s) => s.remove());
    bg.appendChild(bgCar); document.body.appendChild(bg);
  }
  const cam = document.createElement('div'); cam.className = 'cam';
  car.parentNode.insertBefore(cam, car); cam.appendChild(car);
  if (opts.header && top > 120) {
    const [small, big] = String(opts.header).includes('|') ? String(opts.header).split('|') : ['', opts.header];
    const h = document.createElement('div'); h.className = 'vheader';
    h.innerHTML = (small ? `<div class="s"></div>` : '') + `<div class="b"></div>`;
    if (small) h.querySelector('.s').textContent = small.trim();
    h.querySelector('.b').textContent = big.trim();
    document.body.appendChild(h);
  }
  const flash = document.createElement('div'); flash.className = 'flash'; document.body.appendChild(flash);

  const SEL = {
    media: '.bleed, .media, .frame, .collage > *, .photo, .product',
    title: '.t-xl, .t-l, .t-m, .t-serif, .t-cond, .t-mega, .t-script, .big, .name, .bodoni, .italic, .title, .outline',
    pop: '.pill, .num-grid > div, .stats > div, .card, .crest, .disc',
    text: 'p, .lead, .small, .body, .desc, .cap, .eyebrow, .tag, .meta, .hdr',
  };
  const kindOf = (el) => {
    if (el.dataset.anim) return el.dataset.anim;
    for (const [k, s] of Object.entries(SEL)) if (el.matches(s)) return k;
    return null;
  };

  // Animatable elements of a container, without animating children of something already animated.
  const collect = (root) => {
    const picked = [];
    for (const el of root.querySelectorAll('*')) {
      if (picked.some((p) => p.contains(el))) continue;
      const k = kindOf(el);
      if (k && k !== 'none') picked.push(el);
      else if (k === 'none') picked.push(el); // blocks the children too
    }
    return picked.filter((el) => kindOf(el) !== 'none').map((el) => ({ el, kind: kindOf(el) }));
  };

  // Splits a short, text-only title into letters (like an AE text animator).
  const splitChars = (el) => {
    const text = el.textContent;
    el.textContent = '';
    return [...text].map((ch) => {
      const s = document.createElement('span');
      s.textContent = ch;
      s.style.display = 'inline-block';
      if (ch === ' ') s.style.whiteSpace = 'pre';
      el.appendChild(s);
      return s;
    });
  };
  const canSplit = (el) => el.children.length === 0 && el.textContent.trim().length <= 16 && !el.dataset.fit;

  const tl = gsap.timeline({ paused: true });
  const cues = []; // sound moments: { t, type: 'whoosh'|'pop'|'hit'|'impact'|'stutter'|'tick'|'type'|'riser'|'shimmer', len? }
  const cue = (t, type, extra = {}) => cues.push({ t: Math.max(0, t), type, ...extra });
  const delay = (el) => parseFloat(el.dataset.delay || 0);

  const animate = ({ el, kind }, t, i, slideDur) => {
    const at = t + delay(el);
    switch (kind) {
      case 'media':
        tl.fromTo(el, { scale: 1.14, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out' }, at);
        tl.to(el, { scale: 0.985, duration: slideDur, ease: 'none' }, at + 0.9); // slow Ken Burns
        break;
      case 'chars':
      case 'title':
        if (kind === 'chars' || canSplit(el)) {
          const chars = splitChars(el);
          const start = at + i * 0.12;
          tl.from(chars, { yPercent: 90, opacity: 0, rotate: 8, duration: 0.8, ease: 'expo.out', stagger: 0.035 }, start);
          // keystrokes: one every two letters, like a typing animator
          chars.forEach((c, j) => { if (j % 2 === 0 && c.textContent.trim()) cue(start + j * 0.035, 'type'); });
          return 'typed';
        }
        tl.fromTo(el, { clipPath: 'inset(0 100% 0 0)', x: -30 },
          { clipPath: 'inset(0 0% 0 0)', x: 0, duration: 1, ease: 'power4.inOut' }, at + i * 0.12);
        break;
      case 'wipe':
        tl.fromTo(el, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power4.inOut' }, at + i * 0.12);
        break;
      case 'pop':
        tl.from(el, { scale: 0.4, opacity: 0, duration: 0.6, ease: 'back.out(2.2)' }, at + i * 0.06);
        break;
      default: // text
        tl.from(el, { y: 34, opacity: 0, duration: 0.7, ease: 'power3.out' }, at + i * 0.09);
    }
    return null;
  };

  // ---- camera moves ----
  const shake = (at, amp = 9, dur = 0.22) => {
    const steps = 6;
    for (let i = 0; i < steps; i++) {
      const k = 1 - i / steps;
      tl.to(cam, { x: (i % 2 ? -1 : 1) * amp * k, y: (i % 3 - 1) * amp * 0.6 * k, duration: dur / steps, ease: 'none' }, at + (i * dur) / steps);
    }
    tl.to(cam, { x: 0, y: 0, duration: 0.04 }, at + dur);
  };
  const flashAt = (at, peak = 0.75) => {
    tl.fromTo(flash, { opacity: peak }, { opacity: 0, duration: 0.14, ease: 'power2.out', immediateRender: false }, at);
  };
  const pan = (k, at, dur, ease, blur) => {
    tl.to(car, { x: -(k + 1) * W, duration: dur, ease }, at);
    if (bgCar) tl.to(bgCar, { x: -(k + 1) * W, duration: dur, ease }, at);
    tl.to(cam, { filter: `blur(${blur}px)`, duration: dur / 2, ease: 'power2.in', yoyo: true, repeat: 1 }, at);
  };
  const jump = (k, at) => {
    tl.set(car, { x: -(k + 1) * W }, at);
    if (bgCar) tl.set(bgCar, { x: -(k + 1) * W }, at);
  };

  // Transition leaving slide k. Returns [time the camera starts, time the next slide is "in"].
  const TRANSITIONS = {
    pan(k, at) { pan(k, at, 0.9, 'power4.inOut', 5); cue(at, 'whoosh'); return 0.9; },
    whip(k, at) { pan(k, at, 0.5, 'expo.inOut', 16); cue(at - 0.05, 'whoosh'); return 0.5; },
    zoom(k, at) { // zoom-through: push into the current slide, cut, keep pushing as the next one settles
      tl.to(cam, { scale: 1.35, filter: 'blur(12px)', duration: 0.28, ease: 'power3.in' }, at);
      jump(k, at + 0.28);
      tl.fromTo(cam, { scale: 1.25 }, { scale: 1, filter: 'blur(0px)', duration: 0.4, ease: 'power3.out', immediateRender: false }, at + 0.28);
      cue(at - 0.1, 'whoosh'); cue(at + 0.28, 'impact');
      return 0.68;
    },
    cut(k, at) { // hard cut on the hit: flash + punch-in + shake
      jump(k, at);
      flashAt(at);
      tl.fromTo(cam, { scale: 1.07 }, { scale: 1, duration: 0.35, ease: 'power3.out', immediateRender: false }, at);
      shake(at);
      cue(at, 'impact');
      return 0.35;
    },
  };
  // When each transition "lands" (seconds after it starts): the moment that goes on the beat
  const LAND = { cut: 0, zoom: 0.28, whip: 0.25, pan: 0.45 };
  // Continuity first: if something crosses the k→k+1 seam (or the background is continuous),
  // the camera must travel so the link is seen. Otherwise vary the edit like a reel.
  const hasBackdrop = !!car.querySelector(':scope > .backdrop');
  const crossesSeam = (k) => hasBackdrop || spans.some((s) => s.offsetLeft < (k + 1) * W && s.offsetLeft + s.offsetWidth > (k + 1) * W);
  const AUTO = ['cut', 'whip', 'zoom', 'pan'];
  let autoI = 0;
  const transitionFor = (slide, k) => {
    if (slide.dataset.transition) return slide.dataset.transition;
    if (opts.transitions && opts.transitions !== 'auto') return opts.transitions;
    if (crossesSeam(k)) return autoI++ % 2 ? 'whip' : 'pan';
    return AUTO[autoI++ % AUTO.length];
  };

  // Reading time: more words, longer hold.
  const holdFor = (slide) => {
    const words = (slide.innerText || '').trim().split(/\s+/).filter(Boolean).length;
    return Math.min(3.6, Math.max(1.6, 1.2 + words * 0.06));
  };
  // Optional beat grid: transitions snap to the next beat of the music
  const beat = opts.bpm ? 60 / Number(opts.bpm) : 0;
  const snap = (x) => (beat ? Math.ceil(x / beat) * beat : x);

  const ORDER = { media: 0, title: 0.15, chars: 0.15, wipe: 0.15, pop: 0.45, text: 0.55 };
  const spanSlide = (el) => Math.floor((el.offsetLeft + 1) / W);

  let t = 0.2;
  // Stutter intro: the cover is visible from frame 0 and slams in with three hard zoom steps,
  // each on a tight hit (the cover's own entrances are skipped: the stutter IS the entrance).
  if (opts.stutter) {
    const step = beat ? beat / 2 : 0.3;
    gsap.set(cam, { scale: 1.32 }); // frame 0 already shows the first zoom step
    [1.32, 1.15, 1].forEach((s, i) => {
      const at = i * step;
      tl.set(cam, { scale: s }, at);
      if (i) flashAt(at, 0.35);
      cue(at, i < 2 ? 'stutter' : 'impact');
    });
    shake(2 * step, 7);
    t = 2 * step + 0.1;
  }
  const edit = []; // chosen transitions, reported by video.mjs

  slides.forEach((slide, k) => {
    const hold = holdFor(slide);
    const isLast = k === slides.length - 1;
    const items = [
      ...collect(slide),
      ...spans.filter((s) => spanSlide(s) === k).map((el) => ({ el, kind: kindOf(el) || (el.textContent.trim() ? 'wipe' : 'pop') })),
    ];
    const counters = {};
    let ticks = 0;
    if (k === 0 && opts.stutter) {
      // keep the cover static (already visible); only the photos keep a slow Ken Burns
      items.filter((it) => it.kind === 'media').forEach((it) => tl.to(it.el, { scale: 0.985, duration: hold + 1, ease: 'none' }, 0));
      items.length = 0;
    }
    items.forEach((it) => {
      const n = (counters[it.kind] = (counters[it.kind] ?? -1) + 1);
      const at = t + (ORDER[it.kind] ?? 0.3) + delay(it.el);
      const res = animate(it, t + (ORDER[it.kind] ?? 0.3), n, hold + 1);
      // sound: one main sound per element type per slide, UI ticks for the rest (capped)
      if (n === 0 && ['title', 'wipe'].includes(it.kind) && res !== 'typed') cue(at, 'hit');
      if (it.kind === 'pop') { if (n === 0) cue(at, 'pop'); else if (ticks++ < 4) cue(at + n * 0.06, 'tick'); }
      if (it.kind === 'text' && n === 0 && ticks++ < 4) cue(at, 'tick');
    });
    if (isLast) cue(t + 0.2, 'shimmer');
    if (!isLast) {
      const chosen = transitionFor(slide, k);
      const kind = TRANSITIONS[chosen] ? chosen : 'pan';
      const fn = TRANSITIONS[kind];
      edit.push(`${k + 1}→${k + 2} ${kind}`);
      // The "landing" (the cut, or the moment the next slide arrives) is what falls on the beat
      const landOffset = LAND[kind];
      const leaveAt = snap(t + 1.0 + hold + landOffset) - landOffset;
      const d = fn(k, leaveAt);
      if (k === slides.length - 2) {
        // riser → impact into the final slide: the riser ends exactly on the reveal
        const land = leaveAt + landOffset;
        cue(land, 'riser', { len: 1.8 });
        if (kind === 'pan' || kind === 'whip') { cue(land, 'impact'); shake(land, 6); }
      }
      t = leaveAt + d * 0.55; // the next slide starts animating during the move
    } else {
      tl.to({}, { duration: 0.01 }, t + 1.0 + hold + 0.6); // ending: hold the last slide
    }
  });

  tl.seek(0);
  window.__video = {
    duration: tl.duration(),
    cues: cues.sort((a, b) => a.t - b.t),
    edit,
    seek: (s) => { tl.seek(s, false); },
  };
  return tl.duration();
})();
