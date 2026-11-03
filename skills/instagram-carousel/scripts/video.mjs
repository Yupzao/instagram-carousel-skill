#!/usr/bin/env node
// Turns a kit HTML carousel into an MP4 animation (H.264), no ffmpeg:
// headless Chrome animates it with GSAP, captures it frame by frame and encodes with WebCodecs.
// Usage: node video.mjs <carousel.html> [output.mp4] [options]
//   --reels               1080×1920 (carousel centred); default 1080×1350 (4:5 feed)
//   --landscape           1920×1080 (16:9); only with a custom choreography (window.__scene)
//   --fps=30 --bitrate=12 (Mbps)
//   --sfx=builtin|<folder> effects: 'builtin' (synthesised, default) or a folder with whoosh*.*, pop*.*, hit*.* (mp3/wav/ogg).
//                         Several per type (whoosh-1.mp3, whoosh-2.wav…) rotate without back-to-back repeats.
//   --seed=42             fixes the random sound variation (without a seed, every render sounds different)
//   --music=<file>        background music (fade in/out; loops if short)
//   --sfx-volume=0.8 --music-volume=0.35   --mute (no audio)
//   --voice=<file>        voiceover track from t=0 (or --voice-at=seconds); lowers effects/music defaults under it
//   --stills=1,3.5,6      only grabs JPEGs at those seconds, for checking
// Editing (motion-design reel techniques):
//   --transitions=auto|pan|whip|zoom|cut   default auto: varies the edit, keeps pan/whip where something crosses a seam
//   --header="Small line|Big line"         fixed title in the top band (Reels format)
//   --bpm=120             snaps transitions to the music's beat grid
//   --beat=120            no music? adds a minimal synthesised beat bed (kick/hat/snare) and snaps the edit to it
//   --no-stutter          no stutter-zoom intro   --no-bgfill   no blurred background fill in Reels   --dry   no reverb
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => {
  const [k, v] = a.slice(2).split('='); return [k, v ?? true];
}));
const [input, outArg] = args.filter((a) => !a.startsWith('--'));
if (!input) {
  console.error('usage: node video.mjs <carousel.html> [output.mp4] [--fps=30] [--reels] [--bitrate=12]');
  process.exit(1);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(input);
const outPath = path.resolve(outArg || htmlPath.replace(/\.html?$/i, '') + '.mp4');
const FPS = Number(flags.fps) || 30;
const W = flags.landscape ? 1920 : 1080;
const H = flags.landscape ? 1080 : flags.reels ? 1920 : 1350;
const BITRATE = (Number(flags.bitrate) || 12) * 1_000_000;

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const c = {
    win32: [
      'C:/Program Files/Google/Chrome/Application/chrome.exe',
      'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
      path.join(os.homedir(), 'AppData/Local/Google/Chrome/Application/chrome.exe'),
      'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
      'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    ],
    darwin: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'],
    linux: ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'],
  }[process.platform] || [];
  const f = c.find((p) => fs.existsSync(p));
  if (!f) { console.error('Chrome/Edge not found. Set CHROME_PATH.'); process.exit(1); }
  return f;
}

// Minimal CDP client (Node ≥ 22 native WebSocket).
async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) {
      const { res, rej } = pending.get(msg.id); pending.delete(msg.id);
      msg.error ? rej(new Error(msg.error.message)) : res(msg.result);
    }
  };
  const send = (method, params = {}) => new Promise((res, rej) => {
    const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params }));
  });
  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  return { send, evaluate, close: () => ws.close() };
}

const log = (...m) => { if (flags.debug) console.log('[debug]', ...m); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'carousel-video-'));
const chrome = spawn(findChrome(), [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  '--hide-scrollbars', '--force-device-scale-factor=1', '--allow-file-access-from-files', '--no-first-run',
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows',
  `--window-size=${W},${H}`, 'about:blank',
], { stdio: 'ignore' });

let exitCode = 0;
try {
  // DevTools port
  const portFile = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 100 && !fs.existsSync(portFile); i++) await sleep(100);
  log('chrome running');
  const port = fs.readFileSync(portFile, 'utf8').split('\n')[0].trim();
  const base = `http://127.0.0.1:${port}`;
  const open = async (url) => (await (await fetch(`${base}/json/new?${encodeURI(url)}`, { method: 'PUT' })).json()).webSocketDebuggerUrl;

  // Carousel page
  const page = await connect(await open(pathToFileURL(htmlPath).href));
  await page.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  for (let i = 0; i < 100 && (await page.evaluate('document.readyState')) !== 'complete'; i++) await sleep(100);
  log('page loaded');
  // Options for the automatic reel-style edit (animate.js); custom scenes may read them too.
  await page.evaluate(`window.__videoOpts = ${JSON.stringify({
    transitions: flags.transitions || 'auto',
    stutter: !flags['no-stutter'],
    bgfill: !flags['no-bgfill'],
    bpm: flags.bpm ? Number(flags.bpm) : flags.beat ? Number(flags.beat === true ? 120 : flags.beat) : undefined,
    header: typeof flags.header === 'string' ? flags.header : undefined,
  })}`);
  // Custom choreography (motion graphics): if the page defines window.__scene(), use it instead of the automatic animate.js.
  const custom = await page.evaluate("typeof window.__scene === 'function'");
  const duration = custom
    ? await page.evaluate('window.__scene()')
    : await page.evaluate(fs.readFileSync(path.join(here, 'video', 'animate.js'), 'utf8'));
  const frames = Math.min(Math.ceil(duration * FPS), Number(flags['max-frames']) || Infinity);
  console.log(`Animation: ${duration.toFixed(1)}s · ${frames} frames · ${W}×${H} @ ${FPS}fps`);
  const editList = await page.evaluate('(window.__video && window.__video.edit) || []');
  if (editList.length) console.log(`  edit: ${editList.join(' · ')}`);
  log('cues:', (await page.evaluate('(window.__video && window.__video.cues) || []')).map((c) => `${c.t.toFixed(2)} ${c.type}`).join(', '));

  // Audio
  let audioSpec = null;
  if (!flags.mute) {
    const b64 = (f) => fs.readFileSync(f).toString('base64');
    let sfx = flags.sfx === undefined || flags.sfx === true || flags.sfx === 'builtin' ? 'builtin' : null;
    if (flags.sfx && flags.sfx !== true && flags.sfx !== 'builtin' && flags.sfx !== 'none') {
      const dir = path.resolve(String(flags.sfx));
      sfx = {};
      for (const f of fs.readdirSync(dir).sort()) {
        const m = f.match(/^(whoosh|pop|hit|impact|stutter|tick|type|riser|shimmer)[-_ ]?[\w-]*\.(mp3|wav|ogg|m4a|flac)$/i);
        if (m) (sfx[m[1].toLowerCase()] ||= []).push(b64(path.join(dir, f)));
      }
      console.log('  sounds:', Object.entries(sfx).map(([k, v]) => `${k}×${v.length}`).join(', ') || '(none in the folder; using the built-in ones)');
      if (!Object.keys(sfx).length) sfx = 'builtin';
    }
    audioSpec = {
      duration: frames / FPS,
      cues: (await page.evaluate('(window.__video && window.__video.cues) || []')).filter((c) => c.t < frames / FPS),
      sfx,
      music: flags.music ? b64(path.resolve(String(flags.music))) : null,
      voice: flags.voice ? b64(path.resolve(String(flags.voice))) : null,
      voiceAt: Number(flags['voice-at'] || 0),
      voiceVolume: Number(flags['voice-volume'] ?? 1),
      sfxVolume: Number(flags['sfx-volume'] ?? (flags.voice ? 0.5 : 0.8)),
      musicVolume: Number(flags['music-volume'] ?? (flags.voice ? 0.16 : 0.35)),
      seed: flags.seed !== undefined ? Number(flags.seed) : undefined,
      reverb: !flags.dry,
      beat: flags.beat && !flags.music ? Number(flags.beat === true ? 120 : flags.beat) : undefined,
    };
  }

  // Encoder page
  const encoder = await connect(await open(pathToFileURL(path.join(here, 'video', 'encoder.html')).href));
  for (let i = 0; i < 100 && (await encoder.evaluate('typeof Mp4Muxer')) === 'undefined'; i++) await sleep(100);
  // the carousel tab must be in front before any capture: in the background Chrome stops producing frames and capture hangs
  await page.send('Page.bringToFront');
  await page.send('Emulation.setFocusEmulationEnabled', { enabled: true });
  // --stills=1.5,4,8 → only grabs JPEGs at those seconds (to check the animation) and exits
  if (flags.stills) {
    const dir = outPath.replace(/\.mp4$/i, '') + '-stills';
    fs.mkdirSync(dir, { recursive: true });
    for (const s of String(flags.stills).split(',').map(Number)) {
      await page.evaluate(`__video.seek(${s})`);
      const { data } = await page.send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
      fs.writeFileSync(path.join(dir, `t${s.toFixed(2).padStart(6, '0')}.jpg`), Buffer.from(data, 'base64'));
    }
    console.log(`Stills in ${dir}`);
    throw Object.assign(new Error(''), { done: true });
  }
  log('encoder loaded');
  console.log('  ' + await encoder.evaluate(`init(${W}, ${H}, ${FPS}, ${BITRATE}, ${JSON.stringify(audioSpec)})`));

  // the carousel tab must be in front: in the background Chrome stops producing frames and capture blocks
  await page.send('Page.bringToFront');
  await page.send('Emulation.setFocusEmulationEnabled', { enabled: true });
  log('encoder ready');
  const t0 = Date.now();
  for (let i = 0; i < frames; i++) {
    const ta = Date.now();
    await page.evaluate(`__video.seek(${(i / FPS).toFixed(5)})`);
    const tb = Date.now();
    const { data } = await page.send('Page.captureScreenshot', { format: 'jpeg', quality: 92 });
    const tc = Date.now();
    await encoder.evaluate(`addFrame("${data}", ${i})`);
    if (i < 6 || i % 5 === 0) log(`frame ${i}: seek ${tb - ta}ms · capture ${tc - tb}ms · encode ${Date.now() - tc}ms`);
    if (i % (FPS * 2) === 0 || i === frames - 1) {
      process.stdout.write(`\r  frame ${i + 1}/${frames} (${Math.round(((i + 1) / frames) * 100)}%)`);
    }
  }
  const size = await encoder.evaluate('finish()');
  const CH = 2 * 1024 * 1024;
  const parts = [];
  for (let s = 0; s < size; s += CH) parts.push(Buffer.from(await encoder.evaluate(`chunk(${s}, ${CH})`), 'base64'));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, Buffer.concat(parts));
  console.log(`\nMP4: ${outPath} (${(size / 1048576).toFixed(1)} MB, ${((Date.now() - t0) / 1000).toFixed(0)}s to render)`);
  page.close(); encoder.close();
} catch (e) {
  if (!e.done) { console.error('\nError:', e.message); exitCode = 1; }
} finally {
  chrome.kill();
  await sleep(300);
  fs.rmSync(profile, { recursive: true, force: true });
  process.exit(exitCode);
}
