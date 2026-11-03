# Images: where they come from

**Claude does not generate images by itself.** For carousels with photos (archetypes B, C, E), follow this order:

1. **The user's photos**: ask for the paths/files. Always the best option for a personal brand.
2. **Free-licence stock libraries** (commercial use allowed, no attribution required):
   - Unsplash (unsplash.com): Unsplash licence
   - Pexels (pexels.com): Pexels licence
   - Pixabay (pixabay.com): Pixabay content licence

   Search with concrete terms (e.g. "man flat cap leather armchair dark", "vintage office moody").
   **Before downloading, show the user your picks (link + description) and ask for permission.** Save the files in a `photos/` folder in the output and list the credits in the final note (attribution is not required, but it is good practice).
3. **Higgsfield API** (only if `HIGGSFIELD_KEY` is set; check with `node scripts/higgsfield.mjs check`): generate the images with `scripts/higgsfield.mjs image "<prompt>" photos/x.png`. **Each generation spends the user's credits: confirm the prompt and get a yes first.** Keep one fixed character/scene description across all prompts so the slides match. See `video.md` › AI footage.
4. **AI prompts**: if nothing fits, write ready-to-use prompts for the user to generate the images in a tool of their choice (Midjourney, Firefly, etc.). Include the 4:5 framing, the light, the palette and free space for the title. Example:
   > *Cinematic portrait of a man in a 1920s three-piece tweed suit and flat cap sitting in a worn leather armchair, dim warm tungsten light, dark wood library background, film grain, shallow depth of field, muted teal and amber grade, negative space above the head for a large title, vertical 4:5*
5. **No images**: typographic and graphic design (SVG shapes, gradients, patterns), with `.ph` placeholders marked where a photo would go.

## Never
- Use images from other designers' portfolios (Behance, Dribbble, Instagram) as backgrounds or assets: they are copyrighted. Use them **only as style references**.
- Use photos of real, identifiable people taken from social media.
- Present placeholders as if they were the final result.

## Unifying photos from different sources
Stock photos rarely match each other. Apply the same layer on every slide:
- `.grade`: colour grade (variable `--grade`, e.g. amber/teal), in `mix-blend-mode: soft-light`;
- `.vignette`: darkens the edges and focuses the centre;
- `.texture`: film grain;
- consistent framing (`background-position`) so the subject always sits in the same third.
