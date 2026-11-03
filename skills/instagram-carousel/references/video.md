# Video: the carousel as an animated MP4

Used by the `/carousel-mp4` skill. The engine is `scripts/video.mjs`: it opens the carousel in headless Chrome, injects `scripts/video/animate.js` (GSAP), captures it frame by frame and encodes with WebCodecs (`scripts/video/encoder.html`). Output is an H.264 + AAC MP4, no ffmpeg.

## Automatic choreography (After Effects style)
The "camera" is the strip of slides: between slides there is a **fast camera move** (power4.inOut, 0.9 s) with motion blur. Elements crossing the seam (continuity) stay in place and reinforce the transition.

On each slide, in order:
| Type | Elements (auto) | Animation | When |
|---|---|---|---|
| `media` | `.bleed .media .frame .collage>* .photo .product` | scale 1.14→1 + fade, then a slow Ken Burns | 0 s |
| `title` | `.t-* .big .name .bodoni .italic .title .outline` | ≤ 16 characters: **letter by letter** (rise + rotate). Longer: **wipe** from the left | +0.15 s |
| `pop` | `.pill .num-grid>div .stats>div .card .crest .disc` | scale with overshoot (back.out) | +0.45 s |
| `text` | `p .lead .small .body .desc .cap .eyebrow .tag .meta .hdr` | rises 34px + fade, staggered | +0.55 s |
| `.span` | elements crossing slides | enter on the slide where they start (`wipe` if they hold text, `pop` if not) | |

**Hold time** on each slide: 1.6–3.6 s depending on the word count (reading time). The next slide starts animating halfway through the camera move.

### Fine-tuning in the HTML
- `data-anim="chars|wipe|title|text|pop|media|none"`: forces the type (`none` = static, children included).
- `data-delay="0.4"`: delays that element (seconds).
- For a title split across slides (`.span`), `data-anim="wipe"` gives the effect of "writing" the word across the seam.

### Ideal length
- Feed: 15–30 s. Reels: 10–25 s. With more than 8 slides, cut or merge slides.
- The first second must already show the cover title: the hook works the same as in the carousel.

## Sound
By default, `video.mjs` generates **built-in sound effects by synthesis** (whoosh on transitions, pop on stickers, hit on titles). No licence and no credit needed.

### Variation: the sound is never always the same
- **Built-in effects:** several variants per type. Whoosh: *rise, fall, whip, air, riser*. Pop: *drop, blip, click*. Hit: *low, punch, tom*.
  - Variants rotate in shuffled order, never the same one twice in a row.
  - On each trigger, length, pitch and volume change slightly.
  - The whoosh pans in stereo from right to left, following the camera move.
- **Files:** put several per type in the folder (`whoosh-1.mp3`, `whoosh-2.wav`, `whoosh_air.ogg`, `pop-a.mp3`…). They rotate the same way and each one plays with a slightly shifted pitch (±8%).
  - If a type has no files, the built-in variants are used.
  - For real variety, download 3–5 different whooshes from Openverse.
- `--seed=N` fixes the mix so the exact same sound can be reproduced. Without a seed, every render sounds different.

### Openverse: credit-free sounds
`scripts/sounds.mjs` searches the Openverse API for **CC0** and **Public Domain Mark** licences **only**, which require no credit.
```bash
node scripts/sounds.mjs search "whoosh swoosh" --type=sfx --max-sec=3
node scripts/sounds.mjs search "lofi chill" --type=music
node scripts/sounds.mjs download <id> <output>/sounds/whoosh-1.mp3
```
- **Before downloading, show the user** the titles, lengths and "listen" links and ask for permission.
- Save as `whoosh-1.mp3`, `whoosh-2.mp3`, `pop-1.mp3`, `hit-1.mp3`… in a folder and pass `--sfx=<folder>`. Missing types use the built-in effects.
- Music: `--music=<file>` (automatic fade in/out; loops if short). Volume: `--music-volume=0.35`, `--sfx-volume=0.8`.
- `download` logs the source in `sound-sources.txt`. Credit is not required, but the record is kept.
- Without an API key Openverse is rate-limited (max 20 results per request). If it doesn't respond, wait a few minutes or use the built-in effects.
- Good CC0 music is rare: if nothing fits, deliver with effects only and tell the user they can add music in Instagram itself (the Reels audio library).

### Other sources
- **The user's installed pack (use it by default):** `--sfx=C:/Users/user/sfx/kit-motion`. It holds 7 whooshes, 5 pops and 3 hits picked from the SJC SFX Pack Vol 1 (Sam John Creates); the full 149-sound pack is in `C:/Users/user/sfx/sjc-vol1` (UI & Motion, Camera, Gears, Race). Its licence allows commercial videos with no credit, but **never copy these sounds into a skill, template or shared folder**: they can't be redistributed on their own. File names must have no spaces (`whoosh-1.wav`), or the engine ignores them.
- The user's files (same `whoosh/pop/hit` names, or `--music`).
- The **SoundWeaver** plugin (if installed): 52 real WAV effects, copied into the sounds folder with the names above.
- `--mute` renders the video with no sound.

## Custom choreography (motion graphics)
If the page defines `window.__scene()`, `video.mjs` uses it instead of the automatic choreography. This is how to make kinetic-typography pieces with varied transitions that don't look like slides. Full guide and transition catalogue: `~/.claude/skills/carousel-mp4/references/motion.md`.

## Checks
1. `--stills=t1,t2,…` before the full render. Pick moments halfway through entrances and at the end of each hold.
2. Confirm: nothing is invisible at the end of its entrance, text isn't clipped during the wipe, and continuity lines up during the camera move.
3. After the MP4, report its length and size. Instagram accepts up to 4 GB and 60 s in the feed. Typical files are 15–40 MB.

## `video.mjs` options
`--reels` (1080×1920) · `--landscape` (1920×1080, custom choreography only) · `--fps=30` · `--bitrate=12` (Mbps) · `--sfx=builtin|<folder>|none` · `--seed=N` · `--music=<file>` · `--sfx-volume` · `--music-volume` · `--mute` · `--stills=…` · `--max-frames=N` (testing) · `--debug`
