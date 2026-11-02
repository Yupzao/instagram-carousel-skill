# Carousel archetypes

Each archetype gives the structure, the visual rules and the kind of real carousel it was drawn from.

---

## A. Educational / listicle

**When**: teaching, comparing (noob vs pro, before/after, wrong/right), lists of tips, processes, "prompts I used".
**Typical goal**: saves + shares + leads.

### Structure (10-slide framework)
| Slide | Role | Content |
|---|---|---|
| 1 | **Stop the scroll** | Huge title + one-sentence thesis + central visual |
| 2–3 | **Build interest** | First concrete example and the problem the audience recognises |
| 4–5 | **Show value** | Key ideas and the strongest comparisons |
| 6–9 | **Deliver the payoff** | The remaining tips/examples, the framework and the summary |
| 10 | **Simple CTA** | One action, ideally with a reward |

With fewer slides, compress but keep the order hook → interest → value → payoff → CTA.

### Visual patterns
- **Cover**: two-layer title with contrasting families. For example, a small italic serif ("noob v/s pro") above a huge black sans ("carousels"), linked by a pill element (v/s). Below, the thesis in 2 lines with the last part in bold ("One gets ignored, **one goes viral.**").
- **Optional social proof on the cover**: a row of icons with numbers (❤ 59.6K, 💬 3.8K, 🔁 3.1K, ✈ 32.8K, 🔖 61.2K). Only real numbers.
- **Fixed header**: `date · @handle · category`, small, in 3 columns.
- ~~Fixed BACK/NEXT footer~~: **not used by default** (user feedback). The urge to swipe comes from continuity (`continuity.md`).
- **Comparison slides**: short title at the top, two pill labels (`NOOB ❌` / `PRO ✅`), two columns with the bad and the good example and, below, 2–4 words under each side ("Flat & hard to scan" / "Clear & instantly scannable").
- **Alternating backgrounds**: textured black ↔ light paper. Adds rhythm without losing identity.
- **"Framework/summary" slide**: numbered grid (1–10 in squares) with brackets grouping the phases. Very saveable.
- **"Result → how" variant**, taken from a ChatGPT-prompts carousel: slide N shows the result and slide N+1 repeats the blurred background with a white card on top holding the "how" (prompt, steps, recipe). The pairs repeat.

### Last slide (CTA)
- Huge trigger word in quotes: `comment 'carousel'`.
- Concrete promise of the reward: "and I'll send you the **full Playbook** with 25 hook formulas…".
- Save icon ("save for later") and a mini profile card.

---

## B. Portfolio / photo dump

**When**: photography, products, artwork, client projects, travel, "my month in photos".
**Typical goal**: reach + authority + followers.

### Structure
| Slide | Content |
|---|---|
| 1 | Strongest photo full-bleed + large typographic title on top (e.g. small `INSTAGRAM` + huge `LAYOUT`). The subject can cover part of the title (depth effect with `.cutout`). |
| 2–N | **One theme per slide** (a car, a project or a place): vertical collage of 2–4 photos (wide shot + details). No text, or a minimal caption only. |
| Last (optional) | Strong photo + discreet CTA ("more at @handle", "bookings open"). |

### Rules
- Colour coherence **within** each slide, because photos of the same theme share a palette.
- Order slides by contrast: alternate light/dark, warm/cool.
- Collages with no gap (0) or a thin, even gap (6–12px). Never mix.
- Typical grids: 3 rows (1fr 1fr 1fr), 2+1 (2 columns on top, one wide below), 1 big + 2 small.
- Short caption: attitude line + gear/specs.

---

## C. Continuous / panoramic

**When**: premium brands, hospitality, architecture, fashion, travel, mood storytelling, and products with a **continuous background**.

**C2 variant: continuous background with content** (e.g. a pink/blue "Summer Products" carousel). A single background of organic blobs runs across all slides, cut-out products sit on top of the seams, titles are large, and each product gets 2 lines of description. The cover and the last slide feature a person/product. See `examples/C2-continuous-background.html`.
**Typical goal**: brand desire, view time.

### Structure
- 5–10 slides, **with little or no text**: the image is the message.
- Alternate **full-bleed** slides with **neutral background + framed image** slides (breathing room).
- At least one image **crosses the seam** between two slides: half on one, half on the next, which forces the swipe to complete it.
- Optional: a guiding thread (line, shape, long title) running through all the slides.

### Rules
- Restricted palette (2–3 tones taken from the photos). E.g. stone, wood, low warm light and neutral beige.
- Images that cross slides must keep the point of interest **off** the cut line (no faces or logos cut in half).
- If there is text, use a thin serif or light sans, small, discreet, with lots of space.
- Caption: 1–2 poetic/brand sentences + 2–3 own hashtags.

### Implementation in the kit
Slides sit side by side inside `.carousel`. A `.span` element with an absolute `left` crosses the boundary:
slide 2 starts at 1080px and slide 3 at 2160px. An image with `left:1380px; width:1560px` fills the right side of slide 2 and the left side of slide 3.

---

## D. Series template

**When**: several items with the same fields, such as matches, events, menus, properties, jobs, products, speakers or results.
**Typical goal**: inform fast and recognisably.

### Structure
- One slide per item, **exactly the same layout**, only the data and the photo change.
- Optional: slide 1 as the series cover ("This weekend's fixtures") and a last slide with a summary.

### Reference layout (match poster)
- Top ~60%: photo (team, product, venue).
- Bottom ~40%: solid block in the brand colour, with:
  - small line on top: competition · round;
  - main title condensed, bold, uppercase, on 2 lines (`TEAM A` / `vs TEAM B`), with the "vs" in script or smaller;
  - small line below: `date | time | venue`.
- Small logo/crest at the top.

### Rules
- Condensed font (Anton, Bebas Neue, Oswald) so long names fit.
- The longest name in the series sets the title size, which must be the same on every slide (`data-fit`).
- Hierarchy: what (title) > when (date/time) > where > the rest.
- Caption: 1 line of context + emoji, and the list of items only if it helps.

---

## E. Cinematic

**When**: personal brand, agencies, creative services, authority messages, storytelling. The starting point is a strong sentence with little text.
**Reference**: a social media agency carousel: a period character in a dark office, one giant word per slide.
**Typical goal**: memorability, authority, shares.

### Structure
| Slide | Content |
|---|---|
| 1 | Full-bleed photo of the subject (centred, looking at the camera) + huge 1–2 word title in an expressive font, **behind or in front of the subject**. Small tagline above ("Social Media"). |
| 2–N | Each slide: **one giant keyword** (DETAIL, THAT'S WHY, Communicated, Design, Shhh…, Silence) + 1–2 lines of small text completing the idea. The shot changes (wide, medium, close-up, detail) but keeps the same scene and the same light. |
| Last | Closing line + discreet CTA, in the same language. |

### Visual rules
- **One grade** on all photos (`.grade` + `.vignette` + `.texture`): warm dark tones, crushed blacks, amber highlights.
- **The keyword is the signature**: 180–320px, in a display font that interprets the word (see `fonts.md` › Expressive combinations). It can change between slides, with at most 3 display fonts.
- **Varied but deliberate position**: the word occupies the photo's negative space (top, side, behind the subject). Alternate left, centre and right for rhythm.
- **Small supporting text** (≥ 31px), always in the same font and colour, next to the keyword.
- **Continuity**: scene cut (the subject looks right and the next slide shows what they see), object on the seam, or a word split across slides.
- No repeated header/footer: the photo and the type are enough.

### Images
See `images.md`. Needs 5–10 photos of the **same person/scene**: the user's photos, their own shoot, stock with the same character, or AI prompts with a fixed character description.
