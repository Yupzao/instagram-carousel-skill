#!/usr/bin/env node
// Renders each slide of an HTML carousel to a 1080×1350 PNG with headless Chrome.
// Usage: node render.mjs <carousel.html> [output-folder]   (set CHROME_PATH to force a browser)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , input, outArg] = process.argv;
if (!input) {
  console.error('usage: node render.mjs <carousel.html> [output-folder]');
  process.exit(1);
}

const htmlPath = path.resolve(input);
const outDir = path.resolve(outArg || path.join(path.dirname(htmlPath), 'png'));
fs.mkdirSync(outDir, { recursive: true });

const html = fs.readFileSync(htmlPath, 'utf8');
const n = (html.match(/<section\s+class="slide(?:\s[^"]*)?"/g) || []).length;
if (!n) {
  console.error('No <section class="slide"> found.');
  process.exit(1);
}

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidates = {
    win32: [
      'C:/Program Files/Google/Chrome/Application/chrome.exe',
      'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
      path.join(os.homedir(), 'AppData/Local/Google/Chrome/Application/chrome.exe'),
      'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
      'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    ],
    darwin: [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    ],
    linux: ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/snap/bin/chromium'],
  }[process.platform] || [];
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) {
    console.error('Chrome/Edge not found. Set CHROME_PATH to the executable path.');
    process.exit(1);
  }
  return found;
}

const chrome = findChrome();
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'carousel-chrome-'));
const url = pathToFileURL(htmlPath).href;

for (let k = 1; k <= n; k++) {
  const file = path.join(outDir, `slide-${String(k).padStart(2, '0')}.png`);
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    '--force-device-scale-factor=1', '--window-size=1080,1350',
    '--virtual-time-budget=8000', '--allow-file-access-from-files',
    `--user-data-dir=${profile}`, `--screenshot=${file}`, `${url}#render=${k}`,
  ], { stdio: 'ignore' });
  console.log(file);
}

fs.rmSync(profile, { recursive: true, force: true });
console.log(`${n} slides rendered to ${outDir}`);
