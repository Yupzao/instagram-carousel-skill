# Continuity between slides

**The user's rule:** slide 2 must still hold something from slide 1 (an object, a shape or part of a title). That catches the viewer's eye and makes them swipe to "complete" what they saw.
In the feed, Instagram shows the cover. When someone swipes, the first thing they see is **the left edge of slide 2**. That edge must continue the cover.

Every carousel gets **at least the 1→2 link** and, ideally, 1–2 more links in the middle.
(Exception: archetype D when the items are independent.)

## Techniques (from simplest to strongest)

### 1. Continuous background
A single background designed for the full width (N × 1080px) and cut by the slides. E.g. pink and blue organic blobs where every seam cuts a blob in half.
- Implementation: `<div class="backdrop">` with an SVG or gradients, and `class="slide clear"` slides.
- Shapes must **cross** the seams. A shape fully inside one slide links nothing.
- Vary the composition: the big blob on the right of slide 1 continues on the left of slide 2.
- Text blocks stay inside one slide, never across a seam.

### 2. Object on the seam
A product, a cut-out photo, an arrow or a line placed **on the join**: half on one slide, half on the other.
- Implementation: `.span` with `left` = seam − half its width (seam k→k+1 = `k*1080px`).
- Good objects: a product PNG, a hand/arm, a pen, a plane, a chart line, a ribbon, a stamp.
- The object must not have text or faces on the cut line.

### 3. Split title
A giant word that starts on slide 1 and ends on slide 2 ("CONTI|NUES", "CAROU|SELS").
- Implementation: `.span` with the text (`white-space:nowrap`) and a `left` that starts inside slide 1.
- Cut between syllables or at wide letters, never through a thin letter.
- On slide 2, the continuing part should be ≥ 25% of the word so it reads as a continuation.

### 4. Framed panorama
A wide, framed photo on a neutral background crossing 2 slides (hotel/architecture style). See archetype C.

### 5. Guiding line
A line, path or ribbon running through **all** the slides, linking the content points (like a timeline). Implement it with an SVG `path` inside the `.backdrop`.

### 6. Scene cut
A full-bleed photo whose continuation is on the next slide (another part of the same scene). Useful in archetype E: the person looks to the right and the next slide shows what they see.

## Checks
- Render and look at the **pairs** 1|2, 2|3… side by side: the seam must line up with no steps (same height, colour and scale).
- Also look at each slide alone: it must make sense by itself, because slide 2 also shows in the feed to people who already saw the cover.
- Continuity must never cover text, because legibility comes first.
