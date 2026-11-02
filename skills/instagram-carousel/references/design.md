# Design: visual system, kit and checklist

## Format
- Always 1080×1350 (4:5). It is the format that takes up the most screen in the feed.
- Safe area: 80px on the sides. The 170px bands at the top and bottom are reserved for header/footer.
- Instagram may crop the profile grid preview to 3:4: on the cover, keep the title near the vertical centre.

## Typography
| Use | Font (Google Fonts) | Kit class |
|---|---|---|
| (Pick the pairing in `fonts.md`. These are just the class names.) | | |
| Main title | display font of the chosen pairing | `.t-xl`, `.t-l` |
| Elegant contrast | serif italic of the pairing | `.t-serif` |
| Condensed (sports, events, prices) | e.g. Anton | `.t-cond` |
| Body | body font of the pairing | `.lead`, `.small` |

Minimum sizes at 1080px (1pt ≈ 2.77px in the feed, see `apple-design.md`): title ≥ 96px, supporting text ≥ 44px, metadata ≥ 31px (= 11pt, the HIG minimum). No Thin/Light weights below 50px.
One body font per carousel; display fonts may vary (up to 3 in archetype E).

## Colour
- See `colors.md`: 2 base colours + 1 pop. The pop only highlights (word, pill, CTA, continuity element).
- ✓/✗ states in green/red only on labels, never as backgrounds.
- On photos, always put a `.scrim` (gradient) under the text.

## Kit components (`assets/kit/base.css`)
| Class | What it is |
|---|---|
| `.carousel` | Container for all slides (required) |
| `.slide` / `.slide.light` / `.slide.accent` | 1080×1350 slide, dark / light / pop-colour background |
| `.slide.clear` | Transparent slide that shows the `.backdrop` |
| `.backdrop` | Continuous background as wide as all slides (first child of `.carousel`) |
| `.span` | Element that crosses slides (direct child of `.carousel`) |
| `.hdr` | 3-item header |
| `.nav[data-auto]` | BACK 01…NN NEXT footer. **Optional, not used by default** |
| `.content` | Centred flex-column area |
| `.content.top` / `.left` / `.bottom` | Area aligned to the top / left / bottom |
| `.t-xl` `.t-l` `.t-m` `.t-serif` `.t-cond` | Titles |
| `.t-mega` `.t-script` | Giant word / script title (archetype E) |
| `.outline` | Outline-only text |
| `.lead` `.small` `.muted` | Text |
| `.hl` | Word on a pop-colour box |
| `.pill` `.pill.bad` `.pill.good` `.pill.dark` | Pill labels |
| `.vs` | Two comparison columns |
| `.card` | White card with shadow (prompts, notes) |
| `.media` | Image (background-image) filling its container |
| `.bleed` | Fills the whole slide (use with `.media`) |
| `.scrim` / `.scrim.top` | Dark gradient for legibility |
| `.grade` `.vignette` | Colour grade (`--grade`) and vignette to unify photos |
| `.texture` | Subtle grain over the background |
| `.cutout` | PNG cut-out of the subject on top of the title |
| `.collage` | Photo grid (set `grid-template-*` inline) |
| `.ph` | Image placeholder with a description |
| `.num-grid` | Grid of numbered squares (framework slide) |
| `.stats` | Row of metrics with icons |
| `[data-fit="group"]` | Shrinks to fit one line; same size across the group |

Brand variables in the HTML `:root`: `--bg`, `--bg-alt`, `--ink`, `--ink-alt`, `--accent`, `--accent-ink`, `--f-display`, `--f-serif`, `--f-cond`, `--f-script`, `--f-body`, `--grade`.

## Checklist (look at each PNG)
- [ ] The cover title reads in a small thumbnail (imagine it at 1/4 size).
- [ ] No text cut off, overlapping other text or touching the margins.
- [ ] Contrast ≥ 4.5:1 (≥ 3:1 for text ≥ 50px or bold), measured with `scripts/contrast.mjs`. Text over photos has a scrim.
- [ ] No text below 31px (except "save this" cards, flagged to the user).
- [ ] 1→2 continuity is visible. In each pair of slides side by side, the seam lines up with no steps.
- [ ] No repeated "swipe"/NEXT. If there is a header, it sits in the same place on every slide.
- [ ] Fonts loaded (no Arial/Times fallback) and the pairing differs from the last one in `font-history.md`.
- [ ] One concept per slide, no crowded slides.
- [ ] On `.span` elements, the seam doesn't cut faces, logos or text.
- [ ] In archetype D, the title is the same size on every slide.
- [ ] The last slide has a single CTA.
- [ ] Placeholders (`.ph`) flagged to the user if they were not replaced.
