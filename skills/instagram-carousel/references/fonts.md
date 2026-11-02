# Fonts: library of pairings (Google Fonts)

**The user's rule:** the same fonts get stale fast. Every carousel uses a pairing **different from the last one**.
Before choosing, read `font-history.md` (if it exists). After delivering, add a line to it:
`YYYY-MM-DD · topic · display + body · palette`.

Choose by the **mood of the topic**, not by habit. If torn between two, pick the one used least in the history.

## Pairings by mood

| # | Mood | Display (titles) | Body | Note |
|---|---|---|---|---|
| 1 | Elegant editorial | **Bodoni Moda** 700–900 | DM Sans 500 | High contrast, great in uppercase |
| 2 | Cinematic/dramatic | **Playfair Display** 800 italic | Manrope 500 | One-word titles |
| 3 | Classic luxury | **Cinzel** 700 | Lato 400/700 | Uppercase only; letter-spacing +0.04em |
| 4 | Romantic/signature | **Pinyon Script** or **Great Vibes** | Jost 500 | 1–3 words only; never body copy |
| 5 | Geometric modern | **Syne** 800 | Space Grotesk 500 | Tech, creatives |
| 6 | Grotesque with character | **Bricolage Grotesque** 800 | Bricolage Grotesque 500 | One family, many weights |
| 7 | Impact/sports | **Anton** or **Bebas Neue** | Barlow 600 | Condensed, long names |
| 8 | Brutal/streetwear | **Archivo Black** | Archivo 500 | Tight uppercase |
| 9 | Soft/beauty/lifestyle | **DM Serif Display** | Outfit 400/600 | Pastels, products |
| 10 | Playful/rounded | **Fredoka** 700 or **Baloo 2** 800 | Nunito 600 | Kids, food, summer |
| 11 | Retro 70s | **Shrikhand** or **Righteous** | Work Sans 500 | Warm colours |
| 12 | Literary/calm | **Cormorant Garamond** 600 italic | Manrope 400 | Hospitality, wellness |
| 13 | Technical/data | **JetBrains Mono** 800 | IBM Plex Sans 500 | Numbers and code |
| 14 | Serious contemporary | **Fraunces** 800 (high opsz) | Inter Tight 500 | Finance, consulting |
| 15 | Outline | **Unbounded** 800 with `-webkit-text-stroke` | Plus Jakarta Sans 500 | Giant background words |
| 16 | Old-school/poster | **Abril Fatface** | Karla 500 | Promotions, events |

## Expressive combinations (archetype E)
In the cinematic style, the **display font can change from slide to slide**, as in "Carousels / Detail / Communicated / Shhh… / Silence": each keyword gets a font that interprets it.
Rules to keep it from turning into chaos:
- at most **3 display fonts** in the carousel, all from the same world (e.g. Bodoni Moda + Playfair italic + Pinyon Script);
- **a single body font** on every slide;
- the same colour, base size and alignment for the supporting text on every slide;
- the font follows the meaning: "Shhh…" in script, "DETAIL" in a high-contrast serif, "THAT'S WHY" in a condensed face.

## Typographic techniques that bring it to life
- **Two layers**: a small script/italic word above a giant serif/black word.
- **Outline**: a giant outline-only background word (`.outline`) behind the subject.
- **Subject in front of the title**: a PNG cut-out on top of the title (`.cutout`).
- **Title split at the seam** between slides (see `continuity.md`).
- **Mixed weights** on the same line ("Design **that communicates**").

## Loading fonts
One Google Fonts `<link>` with the families and weights used, for example:
```html
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,700;0,900;1,700&family=Pinyon+Script&family=DM+Sans:wght@500;700&display=swap" rel="stylesheet">
```
Then set `--f-display`, `--f-serif`, `--f-script`, `--f-body` in the carousel's `:root`.
Check in the PNG that the font loaded: if Arial/Times shows up, the family name is misspelled.
