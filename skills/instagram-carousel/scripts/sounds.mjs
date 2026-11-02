#!/usr/bin/env node
// Credit-free sounds from Openverse (CC0 and Public Domain Mark licences only).
//   node sounds.mjs search "<terms>" [--type=sfx|music] [--n=10] [--max-sec=8] [--min-sec=20]
//   (sfx → ≤ 6 s by default; music → ≥ 20 s by default)
//   node sounds.mjs download <id> <destination-file.mp3>
// Before "download", show the picks to the user and ask for permission.
import fs from 'node:fs';
import path from 'node:path';

const API = 'https://api.openverse.org/v1/audio/';
const FREE = new Set(['cc0', 'pdm']);
const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => {
  const [k, v] = a.slice(2).split('='); return [k, v ?? true];
}));
const [cmd, a1, a2] = args.filter((a) => !a.startsWith('--'));

// The API is sometimes slow: 45 s timeout and one retry.
const get = async (url, tries = 2) => {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'instagram-carousel-skill' }, signal: AbortSignal.timeout(45000) });
    if (!r.ok) throw new Error(`Openverse returned ${r.status}`);
    return r.json();
  } catch (e) {
    if (tries > 1) return get(url, tries - 1);
    console.error(`Openverse unavailable (${e.name === 'TimeoutError' ? 'no response' : e.message}).\n` +
      'The keyless API is rate-limited: try again in a few minutes or use the built-in effects (--sfx=builtin).');
    process.exit(2);
  }
};
const secs = (ms) => (ms ? `${(ms / 1000).toFixed(1)}s` : '?');

if (cmd === 'search' && a1) {
  // Openverse categories are almost never filled in, so results are filtered by length.
  const n = Number(flags.n) || 10;
  const p = new URLSearchParams({ q: a1, license: 'cc0,pdm', page_size: String(Math.min(20, n * 2)) }); // keyless API allows at most 20
  const max = Number(flags['max-sec']) || (flags.type === 'sfx' ? 6 : Infinity);
  const min = Number(flags['min-sec']) || (flags.type === 'music' ? 20 : 0);
  const { results = [], result_count } = await get(`${API}?${p}`);
  const rows = results.filter((r) => FREE.has(r.license) && (!r.duration || (r.duration / 1000 <= max && r.duration / 1000 >= min))).slice(0, n);
  console.log(`${result_count} results (CC0/PDM). Showing ${rows.length}:\n`);
  for (const r of rows) {
    console.log(`${r.id}\n  ${r.title} · ${secs(r.duration)} · ${r.filetype || '?'} · ${r.license.toUpperCase()} · ${r.creator || 'anonymous'} (${r.source})\n  listen: ${r.foreign_landing_url}\n`);
  }
} else if (cmd === 'download' && a1 && a2) {
  const r = await get(`${API}${a1}/`);
  if (!FREE.has(r.license)) throw new Error(`Licence ${r.license} requires credit: do not use.`);
  const res = await fetch(r.url);
  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  const dest = path.resolve(a2);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  // Source log (credit is not required, but it is kept on record)
  fs.appendFileSync(path.join(path.dirname(dest), 'sound-sources.txt'),
    `${path.basename(dest)} · "${r.title}" · ${r.creator || 'anonymous'} · ${r.license.toUpperCase()} · ${r.foreign_landing_url}\n`);
  console.log(`Saved: ${dest} (${r.license.toUpperCase()}, ${secs(r.duration)})`);
} else {
  console.log('usage:\n  node sounds.mjs search "<terms>" [--type=sfx|music] [--n=10] [--max-sec=8] [--min-sec=20]\n  node sounds.mjs download <id> <destination.mp3>');
  process.exit(1);
}
