// Carousel kit: builds the navigation footers and enables render mode (#render=k).
(function () {
  const slides = [...document.querySelectorAll('.carousel > .slide')];
  const n = slides.length;
  const pad = (x) => String(x).padStart(2, '0');

  slides.forEach((slide, i) => {
    slide.querySelectorAll('.nav[data-auto]').forEach((nav) => {
      const back = nav.dataset.back || 'BACK';
      const next = i === n - 1 ? (nav.dataset.end || 'END') : (nav.dataset.next || 'NEXT');
      const nums = slides.map((_, j) => `<span class="${j === i ? 'on' : ''}">${pad(j + 1)}</span>`).join('');
      nav.innerHTML = `<span class="end">${back}</span>${nums}<span class="end">${next}</span>`;
    });
    slide.querySelectorAll('[data-slide-num]').forEach((el) => { el.textContent = `${pad(i + 1)}/${pad(n)}`; });
  });

  // data-fit="group": shrinks the text until each line fits its width and applies the same
  // (smallest) size to every element in the group, so the slides match.
  const fit = () => {
    const groups = {};
    document.querySelectorAll('[data-fit]').forEach((el) => (groups[el.dataset.fit] ||= []).push(el));
    Object.values(groups).forEach((els) => {
      let min = Infinity;
      els.forEach((el) => {
        el.dataset.fs ||= getComputedStyle(el).fontSize; // original size, before fitting
        let size = parseFloat(el.dataset.fs);
        el.style.fontSize = `${size}px`;
        while (size > 20 && el.scrollWidth > el.clientWidth) el.style.fontSize = `${(size -= 2)}px`;
        min = Math.min(min, size);
      });
      els.forEach((el) => { el.style.fontSize = `${min}px`; });
    });
  };
  fit();
  if (document.fonts) document.fonts.ready.then(fit);

  const m = location.hash.match(/render=(\d+)/);
  if (m) {
    document.body.classList.add('render');
    document.documentElement.style.setProperty('--k', Number(m[1]) - 1);
  }
})();
