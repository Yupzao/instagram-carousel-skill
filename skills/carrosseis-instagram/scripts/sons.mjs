#!/usr/bin/env node
// Sons sem crédito obrigatório via Openverse (só licenças CC0 e Public Domain Mark).
//   node sons.mjs procurar "<termos>" [--tipo=sfx|musica] [--n=10] [--max-seg=8] [--min-seg=20]
//   (sfx → ≤ 6 s por defeito; musica → ≥ 20 s por defeito)
//   node sons.mjs baixar <id> <ficheiro-destino.mp3>
// Antes de "baixar", mostra as escolhas ao utilizador e pede autorização.
import fs from 'node:fs';
import path from 'node:path';

const API = 'https://api.openverse.org/v1/audio/';
const FREE = new Set(['cc0', 'pdm']);
const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => {
  const [k, v] = a.slice(2).split('='); return [k, v ?? true];
}));
const [cmd, a1, a2] = args.filter((a) => !a.startsWith('--'));

// A API às vezes demora: 45 s de limite e uma nova tentativa.
const get = async (url, tries = 2) => {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'carrosseis-instagram-skill' }, signal: AbortSignal.timeout(45000) });
    if (!r.ok) throw new Error(`Openverse respondeu ${r.status}`);
    return r.json();
  } catch (e) {
    if (tries > 1) return get(url, tries - 1);
    console.error(`Openverse indisponível (${e.name === 'TimeoutError' ? 'sem resposta' : e.message}).
` +
      'A API sem chave tem limite de pedidos: tenta daqui a alguns minutos ou usa os efeitos incluídos (--sfx=builtin).');
    process.exit(2);
  }
};
const secs = (ms) => (ms ? `${(ms / 1000).toFixed(1)}s` : '?');

if (cmd === 'procurar' && a1) {
  // As categorias do Openverse quase nunca estão preenchidas: filtra-se pela duração.
  const n = Number(flags.n) || 10;
  const p = new URLSearchParams({ q: a1, license: 'cc0,pdm', page_size: String(Math.min(20, n * 2)) }); // sem chave, a API aceita no máximo 20
  const max = Number(flags['max-seg']) || (flags.tipo === 'sfx' ? 6 : Infinity);
  const min = Number(flags['min-seg']) || (flags.tipo === 'musica' ? 20 : 0);
  const { results = [], result_count } = await get(`${API}?${p}`);
  const rows = results.filter((r) => FREE.has(r.license) && (!r.duration || (r.duration / 1000 <= max && r.duration / 1000 >= min))).slice(0, n);
  console.log(`${result_count} resultados (CC0/PDM). A mostrar ${rows.length}:\n`);
  for (const r of rows) {
    console.log(`${r.id}\n  ${r.title} · ${secs(r.duration)} · ${r.filetype || '?'} · ${r.license.toUpperCase()} · ${r.creator || 'anónimo'} (${r.source})\n  ouvir: ${r.foreign_landing_url}\n`);
  }
} else if (cmd === 'baixar' && a1 && a2) {
  const r = await get(`${API}${a1}/`);
  if (!FREE.has(r.license)) throw new Error(`Licença ${r.license} exige crédito: não usar.`);
  const res = await fetch(r.url);
  if (!res.ok) throw new Error(`Download falhou (${res.status})`);
  const dest = path.resolve(a2);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  // Registo de origem (o crédito não é obrigatório, mas fica guardado)
  fs.appendFileSync(path.join(path.dirname(dest), 'origem-sons.txt'),
    `${path.basename(dest)} · "${r.title}" · ${r.creator || 'anónimo'} · ${r.license.toUpperCase()} · ${r.foreign_landing_url}\n`);
  console.log(`Guardado: ${dest} (${r.license.toUpperCase()}, ${secs(r.duration)})`);
} else {
  console.log('uso:\n  node sons.mjs procurar "<termos>" [--tipo=sfx|musica] [--n=10] [--max-seg=8]\n  node sons.mjs baixar <id> <destino.mp3>');
  process.exit(1);
}
