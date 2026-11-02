# Colour: "2 base + 1 pop" palettes

**The user's pattern:** two "normal" colours do all the work and **one** colour stands out a little more and appears sparingly.
Source examples: *charcoal black + royal blue + a little tangerine*, *marshmallow white + galactic violet + bubblegum pink*, *aquajade + midnight abyss + baby pink*.

## How to use it (60 · 30 · 10)
| Role | Share | Where |
|---|---|---|
| **Base 1** | ~60% | Dominant background on most slides |
| **Base 2** | ~30% | Alternate background, blocks, large shapes, text |
| **Pop** | **≤ 10%** | One keyword, the CTA, a sticker/pill, the continuity element, a graphic detail |

Rules:
- The pop appears in **at most 1–2 places per slide**, and some slides have no pop at all. That is what makes it jump out.
- The pop is **never the background of a whole slide**, except on the CTA slide if intentional.
- The continuity element (disc, shape, object on the seam) is a great place for the pop: it links the slides and draws the eye.
- Photos: the grade pulls towards the base colours; the pop only goes into graphics on top.
- Pick a palette **different from the last one used** (log it in `font-history.md`, on the same line as the fonts).

## Contrast: the pop is almost never text on the light base
Measured with `scripts/contrast.mjs`. In almost every palette, the pop on the light base is below 3:1.
So:
- **pop as text → only on the dark base**, or
- **pop as a shape/pill background → dark text on top**.

## Palettes

Values: `light/dark base` = contrast between the two bases; `pop/dark` = pop as text on the dark base.

| # | Name | Base 1 | Base 2 | Pop | Contrast | Text on the pop | Mood |
|---|---|---|---|---|---|---|---|
| 1 | **Charcoal Royale** | Charcoal black `#1E1F22` | Royal blue `#2F4BDB` | Tangerine `#FF8C2B` | white/royal 6.7 · tangerine/charcoal 7.1 | charcoal (7.1) | Tech, confident with energy |
| 2 | **Galactic Candy** | Marshmallow white `#F8F5EF` | Galactic violet `#3B1F6E` | Bubblegum pink `#FF7EB6` | 12.0 · pink/violet 5.5 | violet (5.5) | Creative, young, beauty |
| 3 | **Abyss Jade** | Midnight abyss `#0B1A2E` | Aquajade `#2FB5A3` | Baby pink `#F7C6D9` | midnight/aquajade 6.9 · pink/midnight 11.7 | midnight (11.7) | Wellness, health, fresh |
| 4 | **Forest Zest** | Bone `#EDE6DA` | Forest `#1F3B2D` | Chartreuse `#C9F24B` | 9.8 · chartreuse/forest 9.5 | forest (9.5) | Sustainable, outdoor |
| 5 | **Coral Coast** | Sand `#E8DCC4` | Ink navy `#101828` | Coral `#FF6B57` | 13.1 · coral/navy 6.3 | navy (6.3) | Travel, summer, lifestyle |
| 6 | **Espresso Saffron** | Oat `#EADFCF` | Espresso `#2A1D17` | Saffron `#F2A900` | 12.4 · saffron/espresso 8.1 | espresso (8.1) | Coffee, food, craft |
| 7 | **Glacier Flamingo** | Glacier `#CFE3F2` | Navy `#142B4D` | Flamingo `#FF6F91` | 10.7 · flamingo/navy 5.4 | navy (5.4) | Friendly fintech, apps |
| 8 | **Burgundy Peach** | Cream `#FFF6E6` | Burgundy `#6B1E2E` | Peach `#FFB38A` | 10.6 · peach/burgundy 6.5 | burgundy (6.5) | Fashion, wine, warm editorial |
| 9 | **Teal Sunflower** | Mist `#DCE7E5` | Deep teal `#0F3B3E` | Sunflower `#FFC93C` | 9.7 · sunflower/teal 8.0 | deep teal (8.0) | Education, consulting |
| 10 | **Plum Mint** | Lavender haze `#E9E2F7` | Plum `#3D1F4F` | Mint `#7BE0B5` | 11.1 · mint/plum 8.7 | plum (8.7) | Beauty, skincare, calm |
| 11 | **Olive Tomato** | Ivory `#F7F3E8` | Olive `#4A5A2E` | Tomato `#F2542D` | 6.8 · white/olive 7.5 | **white** (3.5, only ≥ 50px/bold) | Restaurants, Mediterranean |
| 12 | **Midnight Gold** | Silver `#D9DEE4` | Midnight `#0D1B2A` | Gold `#E2B13C` | 12.9 · gold/midnight 8.8 | midnight (8.8) | Luxury, premium, events |
| 13 | **Cocoa Cherry** | Blush `#F6D9D5` | Cocoa `#3B2620` | Cherry `#D7263D` | 10.6 · cherry/blush 3.7 (≥ 50px) | **white** (5.0) | Patisserie, romantic, Valentine's |
| 14 | **Slate Cobalt** | Linen `#F3EEE6` | Slate `#34495E` | Cobalt `#1F5BFF` | 8.0 · cobalt/linen 4.5 | **white** (5.3) | Corporate, SaaS, B2B |

In palette 1 both bases are dark (charcoal/royal 2.5:1). Text goes in **white** on both, and tangerine is the only warm touch.

## Variables in the carousel
```css
:root {
  --bg: <base 1>;   --bg-alt: <base 2>;
  --ink: <text on bg>;   --ink-alt: <text on bg-alt>;
  --accent: <pop>;  --accent-ink: <text on the pop>;
}
```
The kit only uses `--accent` in `.hl`, `.pill`, `.slide.accent` and the elements you choose. Keep it rare.

## Making new palettes with the same pattern
1. Pick a **dark base** and a **light or mid base** from the same world (cool with cool, warm with warm).
2. Pick the **pop on the opposite side of the colour wheel**, or much more saturated than the bases.
3. Measure: base vs. base ≥ 4.5:1 (if text sits on one over the other), pop vs. dark base ≥ 3:1.
4. Give it an evocative name (it helps choosing by mood) and add it to this table.

Avoid palettes that fall into the template looks in `apple-design.md` › 4 without a reason in the topic (e.g. cream + terracotta, near-black + acid green). If the user asks for one, it is their call: use it.
