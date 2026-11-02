# Design with judgement: Apple principles applied to carousels

An adaptation of the `apple-design` skill (Human Interface Guidelines, June 2026 principles) to a medium
that is not an app: 1080×1350 px seen in a phone's feed. Quotes come from the HIG's
`design-principles.md`, `typography.md`, `color.md`, `branding.md` and `writing.md`.
When a rule is our own adaptation rather than Apple's, say "(judgement)".

## 1. Converting units: slide px → on-screen pt

A 1080px slide shows in the feed at ~390pt wide on an iPhone, so **1pt ≈ 2.77px**.

| HIG reference (mobile) | pt | px on the slide |
|---|---|---|
| Minimum text | 11 pt | **≥ 31 px** |
| Default text (body) | 17 pt | **≈ 47 px** |
| "Large text" for contrast (≥ 18 pt) | 18 pt | **≥ 50 px** |

What this means for the kit:
- Metadata (header, footer, small captions): **≥ 31px**, never less.
- Supporting text: **≥ 44px** (target 47px).
- The exception is "save this" text (a card with a prompt or recipe), which can go down to 31px because people will zoom in or save it. Flag the exception to the user.
- *"In general, avoid light font weights"* (`typography.md › Best practices`): no Thin/Light weights below 50px.

## 2. Contrast (critical)

`color.md` and `accessibility.md`: text up to 17pt needs **4.5:1**; text ≥ 18pt or bold needs **3:1**.
In slide px: text < 50px needs 4.5:1, text ≥ 50px or bold needs 3:1.

- Compute it from real hex values: `node scripts/contrast.mjs "#FFFFFF" "#3B5BFF"`.
- Text over a photo: measure against the lightest area of the photo behind the text. Add a `.scrim` until it passes.
- *"Nothing is conveyed by color alone"*: ✓/✗ always carry an icon or a word, not just green/red (the kit's `.pill` already does this).

## 3. The 8 principles as a filter for the carousel

| Principle | Question for the carousel |
|---|---|
| **Purpose**: "Make something meaningful" | What is the **one** thing people take away? If it doesn't fit in one sentence, the topic is too broad. |
| **Agency**: "Let people do things their own way" | Can you get the idea from the cover + last slide alone? Do people who skip slides get lost? |
| **Responsibility**: "Act in people's best interest" | Are the metrics, results and promises true? Does the CTA reward really exist? (judgement: never invent social proof) |
| **Familiarity**: "Build on what people know" | Do the patterns repeat? (*"Once you establish a behavior or appearance for an element, apply it throughout your design."*) |
| **Flexibility**: "Adapt to diverse contexts" | Does it read on a small screen, at low brightness, in Instagram's dark mode, and for colour-blind people? |
| **Simplicity**: "Be clear and direct" | *"Every element earning its place."* Does each slide have only what it needs? |
| **Craft**: "Care about every detail" | Are alignment, spacing, line breaks and spelling perfect on every slide? |
| **Delight**: "Make it human" | What emotion should it trigger (energy, calm, desire, urgency)? *"Don't mistake delight for decoration."* |

## 4. Visual system: plan before you draw

Before the HTML, define it and write it into the script:

- **Colour**: a palette from `colors.md` with roles (base 1, base 2, pop) and the contrast of each text/background pair.
- **Type**: 1 display font used with restraint + 1 body font (+1 for numbers if needed), with the scale in px.
- **Layout**: 1 sentence + an ASCII wireframe of the typical slide.
- **Signature**: **the single element** the carousel will be remembered by, and why it belongs to this topic.

### Critique the plan (mandatory)
Ask: *"Would I have made this same plan for a different topic?"* If yes, it is a default, not a choice. Revise it and tell the user what changed.

The three "template" looks that dominate generated work today, to avoid unless the topic gives a reason:
1. warm cream + high-contrast serif + terracotta accent;
2. near-black + a single acid-green or vermilion accent;
3. "broadsheet": hairline rules, zero radius, dense columns.

Also a default: a giant number over a small label with a gradient, and 01/02/03 markers on content that is not a sequence.
(In a BACK 01…NN footer the numbering is legitimate because the carousel *is* a sequence.)

## 5. Brand restraint

`branding.md › Best practices`:
- *"Apply your app's accent color judiciously"*: the pop colour appears in only 1–2 places per slide (keyword, CTA, active pill).
- *"Ensure branding always defers to content"*: the logo is not on every slide. The @handle in the header is enough; the logo goes on the cover or the CTA.
- *"Consider using a custom font... for headlines... while using system fonts for body copy"*: personality font in the titles, a neutral, readable font for the text.
- *"Minimize the number of typefaces"* (`typography.md`): **one** body font across the carousel. Display fonts may vary (up to 3 in archetype E) because they are the signature, not the reading. This reconciles the variety the user asked for with the HIG's hierarchy.

## 6. Writing

`writing.md`:
- *"Be clear... If you can use fewer words, do so."* Read each slide aloud and cut.
- *"If you're trying to convey more than one idea, consider breaking up the text onto multiple screens"*: one concept per slide.
- *"Be action oriented"*: the CTA uses a concrete verb ("Comment GUIDE", "Save this"), not "Let's go!".
- *"Adopt capitalization rules... then apply them consistently"*: pick one capitalisation rule per element type (titles, pills, footer) and stick to it.
- *"Avoid using we"* and needless possessives ("Favorites" rather than "Your Favorites").

## 7. Final review: 5 lenses in order

Run this review on the rendered PNGs and report only what you find.

1. **Accessibility (Critical)**: minimum sizes (section 1), contrast with numbers (section 2), no meaning carried by colour alone, no thin weights at small sizes.
2. **Format conventions (High)**: 4:5, safe margins, 1→2 continuity present and seamless, no repeated BACK/NEXT, cover readable as a thumbnail, last slide with a single CTA.
3. **Visual craft (High/Medium)**: clear hierarchy (weight + size), 1 colour = 1 meaning, alignment, **point of view** (name the signature), not template-looking, **boldness spent in one place**.
4. **Flow (Medium)**: each slide earns the next; the progression makes sense for people who skip slides.
5. **Copy (Medium)**: concise, verbs, consistent capitalisation, no jargon.

Always finish with **"Remove one accessory"**: point to an element that can go without loss and remove it. If there is none, say the design is already lean.

Report format for the user (short):
```
Design review: Good
Signature: <element>
Fixed: <short list, with numbers when relevant, e.g. "footer 22px → 31px; text #9A9A9A → #D0D0D0 (3.1:1 → 9.8:1)">
Removed: <accessory> | nothing to remove
```
