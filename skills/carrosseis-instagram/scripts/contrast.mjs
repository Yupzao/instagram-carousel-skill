#!/usr/bin/env node
// Rácio de contraste WCAG entre duas cores hex.
// Uso: node contrast.mjs "#FFFFFF" "#3B5BFF" [tamanho-px] [bold]
const [, , a, b, sizeArg, boldArg] = process.argv;
if (!a || !b) {
  console.error('uso: node contrast.mjs <cor-texto> <cor-fundo> [tamanho-px] [bold]');
  process.exit(1);
}

const lum = (hex) => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  const [r, g, bl] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
};

const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
const ratio = (l1 + 0.05) / (l2 + 0.05);
const size = Number(sizeArg) || 0;
// 1080px de slide ≈ 390pt no feed: 18pt ≈ 50px. Texto grande ou bold precisa de 3:1.
const large = size >= 50 || boldArg === 'bold';
const need = size ? (large ? 3 : 4.5) : null;

let line = `${a} sobre ${b}: ${ratio.toFixed(2)}:1`;
if (need) line += ` — precisa de ${need}:1 → ${ratio >= need ? 'OK' : 'FALHA'}`;
else line += ` (4.5:1 texto normal · 3:1 texto ≥50px ou bold)`;
console.log(line);
process.exit(need && ratio < need ? 2 : 0);
