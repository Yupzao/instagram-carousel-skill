// Motor de animação "estilo After Effects" para um carrossel do kit.
// É injetado pelo video.mjs na página do carrossel. Expõe window.__video = { duration, seek(t) }.
// Coreografia automática por tipo de elemento; data-anim no HTML força o tipo:
//   data-anim="title|chars|wipe|text|pop|media|none"   data-delay="0.3" (segundos, somado)
(async () => {
  const W = 1080;
  const load = (src) => new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
  });
  if (!window.gsap) await load('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
  await document.fonts.ready;

  // Modo vídeo: um slide visível de cada vez; a "câmara" é o translate da faixa.
  const H = window.innerHeight;
  const css = document.createElement('style');
  css.textContent = `
    body.video { width: ${W}px; height: ${H}px; overflow: hidden; margin: 0; padding: 0; background: var(--bg); }
    body.video .carousel { zoom: 1; transform: none; margin-top: ${Math.max(0, (H - 1350) / 2)}px; }
    body.video .slide { box-shadow: none; }`;
  document.head.appendChild(css);
  document.body.classList.remove('render');
  document.body.classList.add('video');

  const car = document.querySelector('.carousel');
  const slides = [...car.querySelectorAll(':scope > .slide')];
  const spans = [...car.querySelectorAll(':scope > .span')];

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

  // Elementos animáveis de um contentor, sem animar filhos de algo já animado.
  const collect = (root) => {
    const picked = [];
    for (const el of root.querySelectorAll('*')) {
      if (picked.some((p) => p.contains(el))) continue;
      const k = kindOf(el);
      if (k && k !== 'none') picked.push(el);
      else if (k === 'none') picked.push(el); // bloqueia os filhos também
    }
    return picked.filter((el) => kindOf(el) !== 'none').map((el) => ({ el, kind: kindOf(el) }));
  };

  // Divide um título curto, só com texto, em letras (animador de texto do AE).
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
  const cues = []; // momentos para efeitos sonoros: { t, type: 'whoosh' | 'pop' | 'hit' }
  const delay = (el) => parseFloat(el.dataset.delay || 0);

  const animate = ({ el, kind }, t, i, slideDur) => {
    const at = t + delay(el);
    switch (kind) {
      case 'media':
        tl.fromTo(el, { scale: 1.14, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out' }, at);
        tl.to(el, { scale: 0.985, duration: slideDur, ease: 'none' }, at + 0.9); // Ken Burns lento
        break;
      case 'chars':
      case 'title':
        if (kind === 'chars' || canSplit(el)) {
          const chars = splitChars(el);
          tl.from(chars, { yPercent: 90, opacity: 0, rotate: 8, duration: 0.8, ease: 'expo.out', stagger: 0.035 }, at + i * 0.12);
        } else {
          tl.fromTo(el, { clipPath: 'inset(0 100% 0 0)', x: -30 },
            { clipPath: 'inset(0 0% 0 0)', x: 0, duration: 1, ease: 'power4.inOut' }, at + i * 0.12);
        }
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
  };

  // Tempo de leitura: mais palavras, mais tempo parado.
  const holdFor = (slide) => {
    const words = (slide.innerText || '').trim().split(/\s+/).filter(Boolean).length;
    return Math.min(3.6, Math.max(1.6, 1.2 + words * 0.06));
  };

  const ORDER = { media: 0, title: 0.15, chars: 0.15, wipe: 0.15, pop: 0.45, text: 0.55 };
  const PAN = 0.9;
  const spanSlide = (el) => Math.floor((el.offsetLeft + 1) / W);

  let t = 0.2;
  slides.forEach((slide, k) => {
    const hold = holdFor(slide);
    const items = [
      ...collect(slide),
      ...spans.filter((s) => spanSlide(s) === k).map((el) => ({ el, kind: kindOf(el) || (el.textContent.trim() ? 'wipe' : 'pop') })),
    ];
    const counters = {};
    items.forEach((it) => {
      const n = (counters[it.kind] = (counters[it.kind] ?? -1) + 1);
      const at = t + (ORDER[it.kind] ?? 0.3) + delay(it.el);
      animate(it, t + (ORDER[it.kind] ?? 0.3), n, hold + PAN);
      // um som de cada tipo por slide, para não saturar
      if (n === 0 && ['title', 'chars', 'wipe'].includes(it.kind)) cues.push({ t: at, type: 'hit' });
      if (n === 0 && it.kind === 'pop') cues.push({ t: at, type: 'pop' });
    });
    const panAt = t + 1.0 + hold;
    if (k < slides.length - 1) {
      tl.to(car, { x: -(k + 1) * W, duration: PAN, ease: 'power4.inOut' }, panAt);
      cues.push({ t: panAt, type: 'whoosh' });
      tl.to(car, { filter: 'blur(5px)', duration: PAN / 2, ease: 'power2.in', yoyo: true, repeat: 1 }, panAt);
      t = panAt + PAN * 0.55; // o slide seguinte começa a animar a meio do movimento
    } else {
      tl.to({}, { duration: 0.01 }, panAt + 0.6); // fecho: segura o último slide
    }
  });

  tl.seek(0);
  window.__video = {
    duration: tl.duration(),
    cues: cues.sort((a, b) => a.t - b.t),
    seek: (s) => { tl.seek(s, false); },
  };
  return tl.duration();
})();
