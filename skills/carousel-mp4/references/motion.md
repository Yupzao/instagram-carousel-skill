# Motion-graphics mode (custom choreography)

Use it when the user wants something more dynamic than slides: kinetic typography, varied transitions and a continuous piece, in the style of a motion-graphics reel.
Working examples:
- `assets/motion-example.html`: a 29.6 s 9:16 reel comparing car tax (ISV) for three BMW 3 Series engines for VD Carros (slams, panels, zoom-through, whip pans, iris).
- `assets/eiffel-explainer/eiffel.html`: a 66 s 16:9 narrated physics explainer ("28 dominoes vs the Eiffel Tower"). A canvas world in real metres with a camera that follows the falling front from 5 mm to 330 m, a HUD counter (#n · height · energy), vector Paris landmarks, word-by-word captions synced to the voiceover (`timeline.js`), charts (×1.5 size, ×5 energy on a log axis) and a metaphor ending. Rebuild the voice with `scripts/voice/` (see `video.md` › Voiceover).
- `assets/eiffel-explainer/eiffel-short.html`: the same piece cut to **22.5 s** and made kinetic (`script-short.json`, voice at `-Rate '+18%'`, `join.mjs --lead=0.35 --gap=0.12`). Every key word lands with something: headline words slam in one by one on their spoken times, giant numbers (5 mm / 65 cm / 56 m / 284 m) slam on the words with a canvas punch-in and a shake, flash cuts between beats, the camera chases the falling front much faster. For short-form, prefer this density: one visual event per key word, no scene longer than ~3 s, no charts.
- `assets/eiffel-explainer/eiffel-personal.html` (`script-personal.json`): the short cut with a **personal, animated read** (per-line rate/pitch via `edge_voice.py`, conversational wording), italic-serif vs uppercase-Syne type contrast, key words slamming while the rest glide, and real samples. 24.7 s.
- `assets/grind-reel/grind.html` (`script.json`): a 20.2 s 9:16 motivational reel ("show up every day so you're there on the lucky one") built on one month's calendar: a highlight hops and lands on a random Tuesday, skipped days get crossed out, a check stamps on every day in sync with the voice while a DAY counter climbs, and an iris opens from the lucky tile to the end card. Every spoken line is a pre-built kinetic block (Fraunces italic connectors glide, Anton key words slam), with film grain and a slow camera drift. Generate the voice first: `edge_voice.py <dir>` writes the `timeline.js` the page loads.
- `assets/motion-example-16x9.html`: a 26.8 s 16:9 piece on importing a BMW M3 F80 (kinetic captions over moving photos, text behind the car, text on a path, text on the ground, glitch slices, pixel blocks, an app-style price card). Needs the photos next to it to render; read it for the techniques.

## How it works
- The page defines `window.__scene = async () => { …; return duration }`. `video.mjs` detects it and uses it **instead of** the automatic `animate.js`.
- Inside `__scene`, build a paused GSAP timeline and expose:
  ```js
  window.__video = { duration: tl.duration(), cues, seek: (s) => { tl.seek(s, false); } };
  ```
  **`seek` must not return anything** (use braces). If it returns the timeline, Chrome tries to serialise the whole GSAP object and capture hangs forever.
- `cues` = `[{ t, type: 'whoosh' | 'pop' | 'hit' }]`: the sound effects, at the moments you choose.
- Load GSAP yourself with a `<script>` from cdnjs, wait for `document.fonts.ready` and decode the images before building the timeline (positions measured with `getBoundingClientRect` depend on that).
- Structure: a `#stage` with the size of the video, `.scene` elements (`position:absolute; inset:0; visibility:hidden`) shown/hidden with `tl.set(…, {visibility})`, and transition elements (panels, iris, zoomer, flash) above the scenes.
- Render: `node <ic>/scripts/video.mjs page.html out.mp4 --reels` (or `--landscape`, or no flag for 4:5). `--stills` works the same way.

## Transition catalogue (vary them: never the same one twice in a row)
| Transition | How | Sound |
|---|---|---|
| **Slam** (word hitting the screen) | `fromTo` scale 2.6→1, blur 18px→0, `power4.out`, 0.38 s; one word at a time, ~0.35 s apart | `hit` |
| **Shake** | `#stage` keyframes x/y ±14px over 0.28 s, right after an important slam | — |
| **Flash** | white layer, opacity 0.85→0 in 0.35 s | — |
| **Diagonal panel** | brand-colour panel with `skewX(-18deg)` crossing the screen (in 0.42 s, out 0.42 s); swap scenes while it covers everything | `whoosh` |
| **Zoom-through** | an element from scene A (e.g. a photo card) grows with `expo.inOut` until it becomes the full-bleed photo of scene B | `whoosh` |
| **Whip pan** | A goes out to the left and B comes in from the right, with blur 24px, `power4.in/out`, 0.45 s each | `whoosh` |
| **Iris** | circle in the pop colour growing from the key number, followed 0.18 s later by a circle in the colour of the next scene | `whoosh` |
| **Wipe** | `clipPath: inset(0 100% 0 0) → inset(0 0 0 0)` on a title | `hit` |

| **Glitch slices** | 9 horizontal strips carrying the *next* photo (`background-position: 0 <top − i·120>px`) fly in from alternating sides, `power4.out` 0.32 s with a random 0–0.14 s offset; swap scenes at +0.48 s; `#stage` gets `saturate/hue-rotate` with `steps(4)` | `whoosh` |
| **Pixel blocks** | 16×9 grid of 120px squares in the pop colour: `scale 0→1`, `steps(2)`, `stagger {each: 0.0024, from: 'random'}`; swap at +0.5 s, then clear the same way | `whoosh` |

Inside each scene: counters (`onUpdate` writing `textContent`), bars growing in width, stickers with `back.out(2.4)` and a slight rotation, slow Ken Burns on photos (1.08→1 over the whole scene), and outline text sliding in behind the subject.

## Kinetic captions over footage (the "reel" look)
This is what makes a piece read as motion graphics rather than slides. Learned from creator reels (kinetic captions over video, 2026-11).
- **Two voices.** Connector words are small (50–60px, a neutral sans, white, soft text-shadow) and arrive with a short rise + blur. Key words are huge (200–320px, a heavy display face, red or white) and enter **letter by letter**: each letter from `y:160, scale:.2` and a random rotation, landing on `back.out(2.2)` with a small leftover tilt (±7°) so the word looks hand-placed. A sentence alternates both: *Quanto custa* / **IMPORTAR** / *este* / **M3?**
- **Words accumulate**, then the whole block leaves together (scale 1.25 + blur 22px + fade, 0.3 s) just before the transition.
- **The camera never stops.** Every photo lives in a `.rig` with a slow push/drift (`scale 1.12→1`, `x ±40`, `ease: none`) for the whole scene. A still photo with moving text looks like a slide; a moving photo looks like footage.
- **Text behind the subject.** Repeat the photo on top of the giant word with `clip-path: polygon(...)` traced around the subject (in % of the image), all inside the same rig so they move together. The word rises from behind the roof/shoulders (`yPercent 70→0`, `expo.out`). Trace only the top silhouette; below it the polygon can run to the bottom edge.
- **Text on a path.** SVG `<path>` drawn on with `strokeDasharray/strokeDashoffset` (a thick ribbon in the pop colour, gradient to transparent at the start) and a `<textPath>` repeating a short phrase, animating `attr: {startOffset: '100%' → '-60%'}`.
- **Text lying on the ground.** A container with `perspective: 700px` and the text inside with `rotateX(58deg)`, `transform-origin: 50% 100%`, scrolling sideways for the whole scene (e.g. "ALEMANHA → PORTUGAL →").
- **Editorial micro-type.** A fixed HUD over the footage scenes: one small label in each top corner (who × what, model · year) and a one-line source note at the bottom left (31px). It makes the piece feel produced, not templated.
- **Strike-through.** A pop-colour bar (`scaleX 0→1`, `rotate -3°`) across an old price, positioned from the word's `offsetLeft/offsetWidth` (layout values, not affected by transforms).

## Clean interface scene (product-video look)
For numbers, cut to one light scene that looks like an app: a white card with rows (label + small note on the left, value on the right), a **highlight that slides from row to row** (`top` tween, `power3.inOut`), a value revealed by **pixel blocks** disappearing in random order, and a total that counts up while going from `blur 18px, scale 1.15` to sharp. A headline on the left with one coloured word. Then leave with an iris from the total.

## Make it look designed, not generated
See the checklist in `<ic>/references/video.md` › "Why AI-made edits look AI". In motion-graphics mode especially:
- **Speed graph first:** decide each element's curve before its duration. Fast attack and a long settle for entrances; anticipation (a small move back) before big moves; nothing stops dead or moves at constant speed.
- **Contrast in one line:** mix an italic serif with an uppercase sans and jump the size on the key word (*like this* **ONE**), instead of a plain caption box.
- **Real interfaces:** for an app, site or tool, record or screenshot the real thing and animate around it; don't draw a fake window with grey placeholder bars.
- **Named sounds per job:** airy whoosh on moves, glass pop on appearances, soft impact on landings, mouse click on UI, from a real sample library.

## Pitfalls
- **Random must be seeded.** Stills and the render load the page separately; `Math.random()` gives different letter tilts each time. Use a small seeded generator.
- **Format numbers by hand.** `toLocaleString('pt-PT')` groups with a narrow space (`45 928,64`), not a dot. Use a regex: `i.replace(/\B(?=(\d{3})+(?!\d))/g, '.')`.
- **Measure before tweening.** `fromTo` renders its start state immediately, so `getBoundingClientRect()` taken after building a tween on a parent is offset. Measure positions (iris origin, zoom target) at the top of `__scene`, briefly making the scene visible.
- A text splitter must walk text nodes (TreeWalker) so coloured `<span>`s and decorative children inside a key word survive.

## Rhythm
- 25–30 s for 8–9 beats. The hook (first 1.5 s) is just big words slamming in, with no photo.
- Each scene gets ~3 s: entrance 0.4–1 s, reading time, then the transition starts **before** the scene feels static.
- Each transition type at most twice, never twice in a row.

## Composition
- 9:16: keep everything important between y = 285 and y = 1635, the central 4:5 area, so it also reads when cropped in the feed grid.
- 16:9: 1920×1080, 96px margins. Full-bleed moving photo with kinetic captions in the top-left third works best; a 4:3 photo at 1920 wide is 1440 tall, so pick its `top` (0 to −360) per shot to frame the subject. For data, a light scene with the headline on the left and a card on the right.
- Same rules as the base skill: 2+1 palette (the pop colour can fill the screen only in transitions and the CTA), minimum 31px, contrast checked, a new font pair.

## Checks
- Stills at the middle and end of each transition (e.g. 0.5 s after it starts and 0.3 s after it ends).
- Confirm that no sticker covers a number, no title wraps onto the next line (`white-space:nowrap` on wide titles) and the zoom/iris lands exactly on the next scene.
