// Joins <dir>/line-NN.wav into voice.wav with pauses, and writes timeline.js (window.TIMELINE: absolute line and word times)
// for a custom scene to sync captions and cuts to the voice. Usage: node join.mjs <dir> [--lead=0.6] [--gap=0.22]
import fs from 'node:fs';
import path from 'node:path';

const arg = (k, d) => Number((process.argv.find((a) => a.startsWith(`--${k}=`)) || '').split('=')[1] || d);
const here = path.resolve(process.argv.slice(2).find((a) => !a.startsWith('--')) || '.');
const LEAD = arg('lead', 0.6);  // silence before the first line (the hook lands first)
const GAP = arg('gap', 0.22);   // pause between lines
// extra pauses before some lines (scene changes): edit per project, e.g. { 8: 0.4 }
const EXTRA = {};

const words = JSON.parse(fs.readFileSync(path.join(here, 'words.json'), 'utf8').replace(/^﻿/, ''));
const readWav = (f) => {
  const b = fs.readFileSync(f);
  let o = 12, fmt, data;
  while (o < b.length) {
    const id = b.toString('ascii', o, o + 4), size = b.readUInt32LE(o + 4);
    if (id === 'fmt ') fmt = { ch: b.readUInt16LE(o + 10), sr: b.readUInt32LE(o + 12), bits: b.readUInt16LE(o + 22) };
    if (id === 'data') data = b.subarray(o + 8, o + 8 + size);
    o += 8 + size + (size % 2);
  }
  return { ...fmt, data };
};

const parts = [], timeline = [];
let fmt = null, t = LEAD;
for (const ln of words) {
  const w = readWav(path.join(here, ln.file));
  fmt ||= w;
  if (w.sr !== fmt.sr || w.ch !== fmt.ch || w.bits !== fmt.bits) throw new Error('format mismatch');
  t += EXTRA[ln.line] || 0;
  const bytesPerSec = w.sr * w.ch * (w.bits / 8);
  const dur = w.data.length / bytesPerSec;
  timeline.push({ line: ln.line, text: ln.text, start: +t.toFixed(3), end: +(t + dur).toFixed(3),
    words: [].concat(ln.words || []).map((x) => ({ w: x.w, t: +(t + x.t).toFixed(3) })) });
  parts.push({ at: t, data: w.data });
  t += dur + GAP;
}
const total = t + 0.8;
const bps = fmt.sr * fmt.ch * (fmt.bits / 8);
const pcm = Buffer.alloc(Math.ceil(total * bps / 2) * 2);
for (const p of parts) p.data.copy(pcm, Math.round(p.at * fmt.sr) * fmt.ch * (fmt.bits / 8));
const hdr = Buffer.alloc(44);
hdr.write('RIFF', 0); hdr.writeUInt32LE(36 + pcm.length, 4); hdr.write('WAVE', 8); hdr.write('fmt ', 12);
hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(fmt.ch, 22); hdr.writeUInt32LE(fmt.sr, 24);
hdr.writeUInt32LE(bps, 28); hdr.writeUInt16LE(fmt.ch * fmt.bits / 8, 32); hdr.writeUInt16LE(fmt.bits, 34);
hdr.write('data', 36); hdr.writeUInt32LE(pcm.length, 40);
fs.writeFileSync(path.join(here, 'voice.wav'), Buffer.concat([hdr, pcm]));
fs.writeFileSync(path.join(here, 'timeline.js'), `window.TIMELINE = ${JSON.stringify({ total: +total.toFixed(3), lines: timeline })};\n`);
console.log(`voice.wav ${total.toFixed(1)}s · ${fmt.sr} Hz · ${fmt.ch} ch`);
for (const l of timeline) console.log(`${l.start.toFixed(2).padStart(6)}–${l.end.toFixed(2).padStart(6)}  ${l.text}`);
