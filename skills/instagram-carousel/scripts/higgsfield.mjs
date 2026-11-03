#!/usr/bin/env node
// Higgsfield API client (https://docs.higgsfield.ai): AI images and image-to-video clips for carousels and reels.
// Credentials: create a key in the Higgsfield console and set it as an environment variable (never in the chat):
//   HIGGSFIELD_KEY="<key-id>:<key-secret>"
// Every generation spends Higgsfield credits: confirm each one with the user first.
//
//   node higgsfield.mjs check                                   → is the key set?
//   node higgsfield.mjs image "<prompt>" out.png [--model=higgsfield-ai/soul/v2/standard] [--params='{"…":…}']
//   node higgsfield.mjs video "<prompt>" out.mp4 --image=photo.jpg|https://… [--duration=5] [--aspect=9:16]
//                             [--model=higgsfield/cinema-studio/4.0] [--params='{"…":…}']
//   node higgsfield.mjs upload photo.jpg                        → prints a public URL usable as image input
//   node higgsfield.mjs run <model-path> '<json body>' out.ext  → any model from the Model API Reference
import fs from 'node:fs';
import path from 'node:path';

const API = 'https://api.higgsfield.ai';
const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => {
  const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)];
}));
const [cmd, a1, a2, a3] = args.filter((a) => !a.startsWith('--'));

const KEY = process.env.HIGGSFIELD_KEY
  || (process.env.HF_KEY_ID && process.env.HF_KEY_SECRET ? `${process.env.HF_KEY_ID}:${process.env.HF_KEY_SECRET}` : '');
const fail = (msg) => { console.error(msg); process.exit(1); };
const needKey = () => {
  if (!KEY || !KEY.includes(':')) {
    fail('HIGGSFIELD_KEY is not set. Create a key at the Higgsfield console and set it yourself, e.g.\n'
      + '  PowerShell:  [Environment]::SetEnvironmentVariable("HIGGSFIELD_KEY", "<key-id>:<key-secret>", "User")\n'
      + '  bash/zsh:    export HIGGSFIELD_KEY="<key-id>:<key-secret>"   (add it to ~/.bashrc or ~/.zshrc)\n'
      + 'Then open a new terminal/session.');
  }
};
const api = async (method, p, body) => {
  const r = await fetch(API + p, {
    method,
    headers: { Authorization: `Key ${KEY}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  let json; try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!r.ok) fail(`Higgsfield ${method} ${p} → ${r.status}: ${text.slice(0, 400)}`);
  return json;
};

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };
// Local file → presigned upload → public URL (inputs must be public URLs)
const upload = async (file) => {
  if (/^https?:\/\//.test(file)) return file;
  const type = MIME[path.extname(file).toLowerCase()] || fail(`Unsupported file type: ${file}`);
  const u = await api('POST', '/files/generate-upload-url', { content_type: type });
  const put = await fetch(u.upload_url, { method: 'PUT', headers: u.upload_headers || { 'Content-Type': type }, body: fs.readFileSync(file) });
  if (!put.ok) fail(`Upload failed (${put.status})`);
  return u.public_url;
};

// Submit, then poll the status URL until a terminal state; download the result.
const run = async (model, body, out) => {
  const sub = await api('POST', `/${model.replace(/^\/+/, '')}`, body);
  const id = sub.request_id || fail(`No request_id in response: ${JSON.stringify(sub).slice(0, 300)}`);
  console.log(`submitted ${model} · request ${id}`);
  const statusPath = (sub.status_url || `${API}/requests/${id}/status`).replace(API, '');
  const t0 = Date.now();
  for (;;) {
    await new Promise((r) => setTimeout(r, 4000));
    const s = await api('GET', statusPath);
    process.stdout.write(`\r  ${s.status} · ${Math.round((Date.now() - t0) / 1000)}s   `);
    if (s.status === 'completed') {
      const url = s.video?.url || s.images?.[0]?.url || s.image?.url || s.output?.url;
      if (!url) fail(`\nCompleted, but no output URL found: ${JSON.stringify(s).slice(0, 400)}`);
      const r = await fetch(url);
      fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
      fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
      console.log(`\nSaved: ${path.resolve(out)}`);
      return;
    }
    if (['failed', 'nsfw', 'canceled'].includes(s.status)) fail(`\nRequest ${s.status}${s.error ? `: ${s.error}` : ''}`);
    if (Date.now() - t0 > 15 * 60 * 1000) fail(`\nStill ${s.status} after 15 min. Check later: ${statusPath}`);
  }
};
const extra = () => (flags.params ? JSON.parse(flags.params) : {});

if (cmd === 'check') {
  needKey(); console.log('HIGGSFIELD_KEY is set.');
} else if (cmd === 'image' && a1 && a2) {
  needKey();
  await run(flags.model || 'higgsfield-ai/soul/v2/standard', { prompt: a1, ...extra() }, a2);
} else if (cmd === 'video' && a1 && a2) {
  needKey();
  if (!flags.image) fail('video needs --image=<file or URL> (the first frame / reference).');
  const imgs = String(flags.image).split(',');
  const urls = []; for (const f of imgs) urls.push(await upload(f));
  const body = { prompt: a1, image_urls: urls, duration: Number(flags.duration || 5), aspect_ratio: flags.aspect || '9:16', ...extra() };
  await run(flags.model || 'higgsfield/cinema-studio/4.0', body, a2);
} else if (cmd === 'upload' && a1) {
  needKey(); console.log(await upload(a1));
} else if (cmd === 'run' && a1 && a2 && a3) {
  needKey(); await run(a1, JSON.parse(a2), a3);
} else {
  console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n'));
  process.exit(1);
}
