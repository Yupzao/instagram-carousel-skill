---
name: instagram-carousel
description: "Creates complete Instagram carousels: slide-by-slide script, caption, hashtags and ready-to-post 1080×1350 PNG slides (rendered from HTML). Covers five archetypes (educational/listicle, portfolio/photo dump, continuous/panoramic, series template and cinematic with photos and expressive type) and slide-to-slide continuity techniques (continuous background, elements crossing the seam). Use whenever the user asks for a carousel, a multi-slide post, 'Instagram slides', a photo dump, a series of posters (matches, events, products), or wants to turn a topic, article or set of photos into a swipeable post, even without saying 'carousel'."
---

# Instagram carousels

Produces two things: **(1) the script + caption** and **(2) the slides as PNG**, ready to post.
The rules come from analysing real, well-performing carousels and from user feedback (see `references/`).

## Workflow

### 1. Brief (ask only for what is missing)
- **Topic / content**: what to communicate, or the photos/data available.
- **Goal**: reach (shares), saves (practical value), leads (comment a word → DM), sales, or portfolio.
- **Brand**: @handle, colours, fonts, logo. If there is nothing, pick a system that fits the topic and say which one you picked.
- **Images**: the user's photos, a free stock library, or none. Read `references/images.md`. **You do not generate images or invent photographs.**
- **Language** of the copy (default: the user's language).

If the request already has enough, go ahead without asking.

### 2. Pick the archetype
| Situation | Archetype |
|---|---|
| Teaching, comparing, tips, a process, "X mistakes", "before/after" | **A. Educational/listicle** |
| Showing photography, products or projects with many photos | **B. Portfolio/photo dump** |
| A brand, product or mood where the design runs as one strip (panorama, continuous background) | **C. Continuous/panoramic** |
| Several items with the same data structure (matches, events, menus, prices, jobs) | **D. Series template** |
| A strong message with little text, personal brand, storytelling, dramatic/editorial tone, with photos of people or scenes | **E. Cinematic** |

Archetypes combine: an educational carousel (A) can have a continuous background (C) or cinematic photos (E).

Read before writing:
- `references/archetypes.md`: the section for the chosen archetype
- `references/continuity.md`: **always**, because every carousel has continuity between slides
- `references/fonts.md`: **always**, to pick a new font pairing
- `references/colors.md`: **always**, to pick a "2 base + 1 pop" palette (unless the brand already has colours)
- `references/copy.md`: hooks, CTAs and captions
- `references/apple-design.md`: minimum sizes, contrast, craft and review

### 2b. Visual system: plan and critique
Before the script, define the system (`references/apple-design.md` › 4):
- **Colour**: a palette from `references/colors.md` (2 base colours + 1 pop at ≤ 10%), different from the last one used, or the brand colours arranged in the same pattern. State the contrast of each text/background pair (`node scripts/contrast.mjs <text> <background> <px>`).
- **Type**: pick a pairing in `references/fonts.md` **different from the last one used** (log it in `references/font-history.md`). State the scale in px (minimum 31px; supporting text ≥ 44px).
- **Continuity**: which technique links the slides (continuous background, object on the seam, split title…). At least the **1→2** link is mandatory.
- **Signature**: the single element the carousel will be remembered by.

Then critique the plan: *"Would I have made this for a different topic?"* If yes, it is a default (see the 3 template looks to avoid). Revise it before moving on.

### 3. Script (deliver to the user)
Format:

```
ARCHETYPE: E — Cinematic (+ continuity via split title)
SYSTEM: Midnight Gold palette (#0D1B2A + #D9DEE4 + pop #E2B13C) · Bodoni Moda + Pinyon Script + DM Sans · grain + vignette
CONTINUITY: 1→2 the title "DETA|IL" is cut at the seam; 3→4 the desk crosses the join
SIGNATURE: one giant word per slide in an expressive font, behind the subject

01 · COVER    | Title: … | Subtitle: … | Visual: … | Links to 02: …
02 · …        | Title: … | Text: … (≤ 15 words) | Visual: …
…
NN · CTA      | …

CAPTION:
…
HASHTAGS / KEYWORDS:
…
IMAGES: list of the photos needed (with the source of each or the suggested prompt)
```

If the user wants to review the script first, stop here and wait. Otherwise go on to the slides.

### 4. Build the slides (HTML)
1. Copy `assets/kit/` to `<output>/kit/` (giving `kit/base.css` and `kit/carousel.js`).
2. Start from the closest example in `assets/examples/`, copy it to `<output>/carousel.html` and edit the brand, fonts and content:

   | Example | Shows |
   |---|---|
   | `A-educational.html` | Comparisons and framework, with a disc linking 1→2 |
   | `B-portfolio.html` | Photo collages |
   | `C-continuous.html` | Framed panorama across slides |
   | `C2-continuous-background.html` | Continuous blob background with products on the seams |
   | `D-series.html` | Repeated template with `data-fit` |
   | `E-cinematic.html` | Full-bleed photo, colour grade, giant word in an expressive font |

3. Kit rules (details in `references/design.md`):
   - Each slide is `<section class="slide">` at 1080×1350; `light` = light background; `clear` = transparent (shows the continuous background).
   - **Continuous background**: `<div class="backdrop">` as the first child of `.carousel`, as wide as all the slides.
   - **Elements crossing slides**: children of `.carousel` with `class="span"` and an absolute `left` in px (slide k starts at `(k-1)*1080px`).
   - `<div class="hdr">` = 3-item header (optional). `<div class="nav" data-auto>` = BACK/NEXT bar, **optional and not used by default** (see rule 4).
   - `data-fit="group"` on a line with `white-space:nowrap`: shrinks the text until it fits and applies the same size to the whole group.
   - Images: `<div class="media" style="background-image:url('photo.jpg')">`. No photo: `<div class="ph">description</div>`.
   - Photos from different sources: unify them with `.grade` (colour grade), `.vignette` and `.texture` (grain).

### 5. Render and check
```bash
node <skill>/scripts/render.mjs <output>/carousel.html <output>/png
```
Writes `slide-01.png` … `slide-NN.png` (1080×1350) with headless Chrome (no npm dependencies).

**Open the PNGs and check them one by one** with the checklist in `references/design.md`. Also look at **pairs of slides side by side** to confirm the continuity lines up with no steps. Then run the **5-lens design review** in `references/apple-design.md` › 7 and finish with "remove one accessory".
Fix and re-render until nothing Critical or High is left.

To preview in a browser, open the HTML without a hash: all slides appear side by side, scaled down.

### 5b. Video version
If the user asks for the carousel animated/as MP4 (or uses `/carousel-mp4`), follow `references/video.md`. No ffmpeg needed; sound comes from the built-in effects or from Openverse (CC0, no credit).

### 6. Deliver
- `png/slide-XX.png`
- `caption.txt` with the caption, hashtags and keywords
- the script as text in the chat
- a short note with the choices (archetype, fonts, palette, continuity, signature), the design review summary and what is missing (photo placeholders, image credits)

## Golden rules
1. **The cover is ~80% of the result**: huge title (≥ 120px), one idea, one central visual, strong contrast. Never paragraphs on the cover.
2. **Continuity is mandatory**: slide 2 shows the end of something that started on slide 1 (title, object, shape, background) to hook the eye. Add at least one more link mid-carousel. Exception: archetype D when the items are independent.
3. **Type variety**: every carousel uses a font pairing different from the previous one. Don't always repeat the same fonts; the same fonts get stale fast. Body copy stays in a readable font; personality lives in the titles.
4. **No fixed "swipe"/NEXT in the corner**: no repeated BACK/NEXT footer and no "swipe →" on every slide. Continuity already does that job. At most one discreet cue **on the cover only**, and only if the design has no visible continuity.
5. **One concept per slide.** Title of 1–4 words, supporting text ≤ 15 words. If it doesn't fit, split it into two slides.
6. **Coherent system, controlled variation**: same grid and margins. Vary the background, the image and, in archetype E, the display font within the same style family.
7. **The last slide has a single CTA**, with a reward when possible (e.g. "Comment GUIDE and I'll send you…").
8. **The caption complements, it doesn't repeat**: hook, context, CTA and hashtags/keywords.
9. **Safe margins**: important text ≥ 80px from the side edges and away from the seams, unless it is the continuity element itself.
10. **Mobile legibility**: 1pt ≈ 2.77px. No text below 31px (11pt), supporting text ≥ 44px, contrast ≥ 4.5:1 (≥ 3:1 if ≥ 50px or bold). Meaning never relies on colour alone.
11. **Colour 2 + 1**: two base colours do the work (~60/30) and one pop colour appears sparingly (≤ 10%, 1–2 places per slide, never on every slide). The pop as text goes only on the dark base; on the light base, use it as a shape with dark text on top. The logo appears only on the cover and/or the CTA.
12. Between 5 and 10 slides (20 max).
