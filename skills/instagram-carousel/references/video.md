# Video: the carousel as an animated MP4

Used by the `/carousel-mp4` skill. The engine is `scripts/video.mjs`: it opens the carousel in headless Chrome, injects `scripts/video/animate.js` (GSAP), captures it frame by frame and encodes with WebCodecs (`scripts/video/encoder.html`). Output is an H.264 + AAC MP4, no ffmpeg.

## Editing: what fast-cut motion-design reels do (and the engine reproduces)
Learned from analysing a motion-design reel frame by frame and its audio (cut detection + onset analysis):
- **Every cut has a sound.** Almost every hard cut lands on a short, heavy low hit (within ~0.2 s).
- **Stutter runs:** bursts of 2–3 quick cuts/zoom steps 0.3–0.5 s apart, each on a tight thud.
- **UI ticks:** very short, bright clicks (60–120 ms, no low end) whenever an interface element appears.
- **Risers into reveals:** long, rising, bright sounds (2+ s) that end exactly on a big reveal, then an impact.
- **A continuous, loud, compressed bed** (music) under everything; hits duck it briefly.
- **Vertical format trick:** fixed title band on top, the content in the middle, and a blurred, enlarged copy of the content filling the rest of the 9:16 frame.

## Automatic choreography (After Effects style)
Layers: `.bgfill` (blurred copy, Reels only) · `.cam` (camera: zoom, punch-in, shake, motion blur) › `.carousel` (pans between slides) · header band · white flash layer.

**Intro (stutter):** the cover is visible from frame 0 and slams in with three hard zoom steps (1.32 → 1.15 → 1), each on a hit, with flash frames and a camera shake. The stutter *is* the cover's entrance. `--no-stutter` turns it off.

**Transitions** (leaving each slide). `--transitions=auto` (default) varies the edit like a reel:
| Type | Look | Sound | Lands after |
|---|---|---|---|
| `pan` | camera travels to the next slide, motion blur | whoosh | 0.45 s |
| `whip` | fast pan (0.5 s), heavy blur | whoosh | 0.25 s |
| `zoom` | zoom-through: push in + blur, cut, next slide settles from 1.25 → 1 | whoosh + impact | 0.28 s |
| `cut` | hard cut + white flash + punch-in + shake | impact | 0 s |

**Continuity rule:** if anything crosses the k→k+1 seam (a `.span`, or a continuous `.backdrop`), auto uses only `pan`/`whip`, so the link is seen. Elsewhere it rotates cut → whip → zoom → pan. Force one per slide with `data-transition="cut"` on the `<section>`, or globally with `--transitions=cut`. `video.mjs` prints the chosen edit (`edit: 1→2 pan · 2→3 whip · …`).

**Finale:** a riser ends exactly as the last slide lands, plus an impact and a shimmer on the reveal.

On each slide, in order:
| Type | Elements (auto) | Animation | When |
|---|---|---|---|
| `media` | `.bleed .media .frame .collage>* .photo .product` | scale 1.14→1 + fade, then a slow Ken Burns | 0 s |
| `title` | `.t-* .big .name .bodoni .italic .title .outline` | ≤ 16 characters: **letter by letter** (rise + rotate). Longer: **wipe** from the left | +0.15 s |
| `pop` | `.pill .num-grid>div .stats>div .card .crest .disc` | scale with overshoot (back.out) | +0.45 s |
| `text` | `p .lead .small .body .desc .cap .eyebrow .tag .meta .hdr` | rises 34px + fade, staggered | +0.55 s |
| `.span` | elements crossing slides | enter on the slide where they start (`wipe` if they hold text, `pop` if not) | |

**Hold time** on each slide: 1.6–3.6 s depending on the word count (reading time). The next slide starts animating halfway through the camera move.

**Beat grid:** with `--bpm=N` (or `--beat=N`), the *landing* of each transition (the cut, or the moment the next slide arrives) falls exactly on a beat, and the stutter steps are half-beats.

**Reels layout** (`--reels`): 1080×1920 with the 4:5 carousel centred, a **blurred background fill** (`--no-bgfill` for a flat colour) and an optional **title band**: `--header="Small line|Big line"`.

### Fine-tuning in the HTML
- `data-anim="chars|wipe|title|text|pop|media|none"`: forces the type (`none` = static, children included).
- `data-delay="0.4"`: delays that element (seconds).
- For a title split across slides (`.span`), `data-anim="wipe"` gives the effect of "writing" the word across the seam.

### Ideal length
- Feed: 15–30 s. Reels: 10–25 s. With more than 8 slides, cut or merge slides.
- The first second must already show the cover title: the hook works the same as in the carousel.

## Sound
By default, `video.mjs` generates **built-in sound effects by synthesis**. No licence and no credit needed. They go through a mix bus like a real edit: **compressor → make-up gain → limiter** (loud without clipping) and a generated **reverb** send (`--dry` to turn it off).

| Cue | When | Built-in variants |
|---|---|---|
| `whoosh` | pan / whip / zoom transitions | rise, fall, whip, air, riser |
| `impact` | hard cuts, zoom landings, stutter end, final landing | boom (sub drop), slam, thud |
| `stutter` | stutter-intro steps | thud |
| `hit` | wiped titles | low, punch, tom |
| `type` | letter-by-letter titles (one key every 2 letters) | key |
| `pop` | first sticker/pill on a slide | drop, blip, click |
| `tick` | further UI elements (max 4 per slide) | tick, click, blipHi |
| `riser` | ends exactly on the final reveal | noiseRise, toneRise |
| `shimmer` | final slide | sparkle (3 arpeggios) |

**Bed:** `--music=<file>` (fade in/out, loops if short) or, with no music, `--beat=120` for a minimal synthesised kick/hat/snare bed. Either way the bed ducks under every impact (sidechain-style) so the hits punch through. Measured on the test renders: peak ≈ 0.96–0.99, no clipped samples; about −18 dBFS RMS with the beat bed, −23 dBFS with effects only.

### Variation: the sound is never always the same
- **Built-in effects:** several variants per type. Whoosh: *rise, fall, whip, air, riser*. Pop: *drop, blip, click*. Hit: *low, punch, tom*.
  - Variants rotate in shuffled order, never the same one twice in a row.
  - On each trigger, length, pitch and volume change slightly.
  - The whoosh pans in stereo from right to left, following the camera move.
- **Files:** put several per type in the folder (`whoosh-1.mp3`, `whoosh-2.wav`, `impact-1.wav`, `riser-1.mp3`, `tick-a.wav`…; any of the cue names above). They rotate the same way and each one plays with a slightly shifted pitch (±8%).
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
`--reels` (1080×1920) · `--landscape` (1920×1080, custom choreography only) · `--header="small|big"` · `--no-bgfill` · `--transitions=auto|pan|whip|zoom|cut` · `--no-stutter` · `--bpm=N` · `--beat=N` · `--fps=30` · `--bitrate=12` (Mbps) · `--sfx=builtin|<folder>|none` · `--seed=N` · `--music=<file>` · `--sfx-volume` · `--music-volume` · `--dry` · `--mute` · `--stills=…` · `--max-frames=N` (testing) · `--debug` (prints the cue list)

## AI footage with Higgsfield (optional)
`scripts/higgsfield.mjs` calls the Higgsfield API (https://docs.higgsfield.ai) to generate **images** (e.g. the cinematic character shots) and short **image-to-video clips** for reels.
- The user creates a key in the Higgsfield console and sets `HIGGSFIELD_KEY="<key-id>:<key-secret>"` as an environment variable themselves. Never ask for the key in the chat. `node scripts/higgsfield.mjs check` confirms it is set.
- **Every generation spends the user's credits:** show the prompt (and model, length, ratio) and get a yes before each call.
- `node scripts/higgsfield.mjs image "<prompt>" photos/shot-1.png` (default model `higgsfield-ai/soul/v2/standard`; extra fields with `--params='{…}'`).
- `node scripts/higgsfield.mjs video "<prompt>" clips/clip-1.mp4 --image=photos/shot-1.png --duration=5 --aspect=9:16` (default `higgsfield/cinema-studio/4.0`).
- `node scripts/higgsfield.mjs run <model-path> '<json>' out.ext` for any other model in the Model API Reference.
- Generated images go into the slides as `.media` backgrounds. Clips are not embedded by `video.mjs` yet: deliver them next to the MP4.

## Voiceover (narrated explainers)
For explainer videos with a narrator (e.g. the "28 dominoes vs the Eiffel Tower" example), the voice drives the edit:
1. Write the script as a JSON array of sentences in `<output>/script.json`. One sentence = one beat of the edit. Check every number and fact you state.
2. `powershell -ExecutionPolicy Bypass -File <ic>/scripts/voice/tts.ps1 -Dir <output>`: synthesises each sentence offline with a Windows voice (default "Microsoft Mark", `-Rate '+8%'`) and records the **start time of every word**.
3. `node <ic>/scripts/voice/join.mjs <output>`: joins the lines into `voice.wav` (with `--lead`/`--gap` pauses) and writes `timeline.js` → `window.TIMELINE = { total, lines: [{ start, end, text, words: [{ w, t }] }] }`.
4. In the custom scene (`window.__scene`), load `timeline.js` and time everything from it: captions word by word (spoken words bright, upcoming dimmed, keywords in the pop colour), cuts on sentence starts, key visuals on key words. See `carousel-mp4/assets/eiffel-explainer/eiffel.html`.
5. Render with `--voice=<output>/voice.wav`. Effects and music defaults drop under the voice (`--sfx-volume` 0.5, `--music-volume` 0.16).
**Neural voices (recommended): edge-tts.** Microsoft's neural voices (e.g. `en-US-BrianNeural`, `en-US-AndrewNeural`, `en-US-AriaNeural`, `en-GB-RyanNeural`; list with `python -m edge_tts --list-voices`) with word timing, no key:
- Needs `pip install edge-tts` (ask the user before installing).
- `python <ic>/scripts/voice/edge_voice.py <output> --voice=en-US-BrianNeural --rate=+8% --lead=0.35` → `voice.mp3` + `timeline.js` (the whole script in one call, so the delivery flows between sentences).
- Render with `--voice=<output>/voice.mp3 --voice-at=0.35` (the same lead).
- It uses the Edge read-aloud service unofficially: fine for drafts and personal use; for commercial work the same voices are on the official Azure Speech API (user's key).

Other voices: the user's own recording (any WAV/MP3 via `--voice`), or a TTS service of their choice (ElevenLabs, OpenAI, Azure, Google, with the user's own key set as an environment variable). Windows voices (`tts.ps1`) are free and offline but sound synthetic; say so when delivering.
