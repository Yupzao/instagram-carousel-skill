#!/usr/bin/env node
// Transforma um carrossel HTML do kit numa animação MP4 (H.264), sem ffmpeg:
// o Chrome headless anima com GSAP, captura frame a frame e codifica com WebCodecs.
// Uso: node video.mjs <carrossel.html> [saida.mp4] [opções]
//   --reels             1080×1920 (carrossel centrado); por defeito 1080×1350 (feed 4:5)
//   --fps=30 --bitrate=12 (Mbps)
//   --sfx=builtin|<pasta> efeitos: 'builtin' (síntese, por defeito) ou pasta com whoosh*.*, pop*.*, hit*.* (mp3/wav/ogg).
//                       Vários por tipo (whoosh-1.mp3, whoosh-2.wav…) rodam sem repetir o mesmo seguido.
//   --seed=42           fixa a variação aleatória dos sons (sem seed, cada render soa diferente)
//   --music=<ficheiro>   música de fundo (fade in/out; repete se for curta)
//   --sfx-volume=0.8 --music-volume=0.35   --mute (sem áudio)
//   --stills=1,3.5,6     só tira JPEGs nesses segundos, para verificar
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
  console.error('uso: node video.mjs <carrossel.html> [saida.mp4] [--fps=30] [--reels] [--bitrate=12]');
  process.exit(1);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(input);
const outPath = path.resolve(outArg || htmlPath.replace(/\.html?$/i, '') + '.mp4');
const FPS = Number(flags.fps) || 30;
const W = 1080;
const H = flags.reels ? 1920 : 1350;
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
  if (!f) { console.error('Chrome/Edge não encontrado. Define CHROME_PATH.'); process.exit(1); }
  return f;
}

// Cliente CDP mínimo (WebSocket nativo do Node ≥ 22).
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

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'carrossel-video-'));
const chrome = spawn(findChrome(), [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  '--hide-scrollbars', '--force-device-scale-factor=1', '--allow-file-access-from-files', '--no-first-run',
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows',
  `--window-size=${W},${H}`, 'about:blank',
], { stdio: 'ignore' });

let exitCode = 0;
try {
  // Porta do DevTools
  const portFile = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 100 && !fs.existsSync(portFile); i++) await sleep(100);
  log('chrome a correr');
  const port = fs.readFileSync(portFile, 'utf8').split('\n')[0].trim();
  const base = `http://127.0.0.1:${port}`;
  const open = async (url) => (await (await fetch(`${base}/json/new?${encodeURI(url)}`, { method: 'PUT' })).json()).webSocketDebuggerUrl;

  // Página do carrossel
  const page = await connect(await open(pathToFileURL(htmlPath).href));
  await page.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  for (let i = 0; i < 100 && (await page.evaluate('document.readyState')) !== 'complete'; i++) await sleep(100);
  log('página carregada');
  const duration = await page.evaluate(fs.readFileSync(path.join(here, 'video', 'animate.js'), 'utf8'));
  const frames = Math.min(Math.ceil(duration * FPS), Number(flags['max-frames']) || Infinity);
  console.log(`Animação: ${duration.toFixed(1)}s · ${frames} frames · ${W}×${H} @ ${FPS}fps`);

  // Áudio
  let audioSpec = null;
  if (!flags.mute) {
    const b64 = (f) => fs.readFileSync(f).toString('base64');
    let sfx = flags.sfx === undefined || flags.sfx === true || flags.sfx === 'builtin' ? 'builtin' : null;
    if (flags.sfx && flags.sfx !== true && flags.sfx !== 'builtin' && flags.sfx !== 'none') {
      const dir = path.resolve(String(flags.sfx));
      sfx = {};
      for (const f of fs.readdirSync(dir).sort()) {
        const m = f.match(/^(whoosh|pop|hit)[-_ ]?[\w-]*\.(mp3|wav|ogg|m4a|flac)$/i);
        if (m) (sfx[m[1].toLowerCase()] ||= []).push(b64(path.join(dir, f)));
      }
      console.log('  sons:', Object.entries(sfx).map(([k, v]) => `${k}×${v.length}`).join(', ') || '(nenhum na pasta; usa os incluídos)');
      if (!Object.keys(sfx).length) sfx = 'builtin';
    }
    audioSpec = {
      duration: frames / FPS,
      cues: (await page.evaluate('__video.cues')).filter((c) => c.t < frames / FPS),
      sfx,
      music: flags.music ? b64(path.resolve(String(flags.music))) : null,
      sfxVolume: Number(flags['sfx-volume'] ?? 0.8),
      musicVolume: Number(flags['music-volume'] ?? 0.35),
      seed: flags.seed !== undefined ? Number(flags.seed) : undefined,
    };
  }

  // Página do encoder
  const encoder = await connect(await open(pathToFileURL(path.join(here, 'video', 'encoder.html')).href));
  for (let i = 0; i < 100 && (await encoder.evaluate('typeof Mp4Muxer')) === 'undefined'; i++) await sleep(100);
  // --stills=1.5,4,8 → só tira JPEGs nesses segundos (para verificar a animação) e sai
  if (flags.stills) {
    const dir = outPath.replace(/\.mp4$/i, '') + '-stills';
    fs.mkdirSync(dir, { recursive: true });
    for (const s of String(flags.stills).split(',').map(Number)) {
      await page.evaluate(`__video.seek(${s})`);
      const { data } = await page.send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
      fs.writeFileSync(path.join(dir, `t${s.toFixed(2).padStart(6, '0')}.jpg`), Buffer.from(data, 'base64'));
    }
    console.log(`Stills em ${dir}`);
    throw Object.assign(new Error(''), { done: true });
  }
  log('encoder carregado');
  console.log('  ' + await encoder.evaluate(`init(${W}, ${H}, ${FPS}, ${BITRATE}, ${JSON.stringify(audioSpec)})`));

  // o separador do carrossel tem de estar à frente: em fundo o Chrome deixa de produzir frames e a captura bloqueia
  await page.send('Page.bringToFront');
  await page.send('Emulation.setFocusEmulationEnabled', { enabled: true });
  log('encoder pronto');
  const t0 = Date.now();
  for (let i = 0; i < frames; i++) {
    const ta = Date.now();
    await page.evaluate(`__video.seek(${(i / FPS).toFixed(5)})`);
    const tb = Date.now();
    const { data } = await page.send('Page.captureScreenshot', { format: 'jpeg', quality: 92 });
    const tc = Date.now();
    await encoder.evaluate(`addFrame("${data}", ${i})`);
    if (i < 6 || i % 5 === 0) log(`frame ${i}: seek ${tb - ta}ms · captura ${tc - tb}ms · encode ${Date.now() - tc}ms`);
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
  console.log(`\nMP4: ${outPath} (${(size / 1048576).toFixed(1)} MB, ${((Date.now() - t0) / 1000).toFixed(0)}s a renderizar)`);
  page.close(); encoder.close();
} catch (e) {
  if (!e.done) { console.error('\nErro:', e.message); exitCode = 1; }
} finally {
  chrome.kill();
  await sleep(300);
  fs.rmSync(profile, { recursive: true, force: true });
  process.exit(exitCode);
}
