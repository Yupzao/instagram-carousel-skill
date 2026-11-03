---
name: carousel-mp4
description: "Creates an Instagram carousel exactly like the instagram-carousel skill, but delivers an After Effects-style MP4 animation (letter-by-letter text, wipes, camera moves between slides, Ken Burns, varied sound effects and credit-free music from Openverse) instead of the PNGs. Use when the user types /carousel-mp4 or asks for the carousel 'as a video', 'animated', 'as an mp4', 'for reels' or 'like After Effects'."
---

# Carousel → animated MP4

This skill **reuses the `instagram-carousel` skill** (it must be installed at `~/.claude/skills/instagram-carousel`; called `<ic>` below).
The final output is an **MP4**, not the PNGs.

## Workflow

1. **Make the carousel as usual**: follow steps 1 to 4 of `<ic>/SKILL.md` (brief, archetype, visual system, script and HTML). All the rules apply: continuity between slides, new fonts, 2+1 palette and design review.
   - **Always ask the orientation before designing**, even when the request doesn't mention it (multiple-choice question):
     - **Vertical**: Reels/Stories 9:16 (1080×1920, `--reels`) or feed 4:5 (1080×1350, no flag);
     - **Horizontal**: 16:9 (1920×1080, `--landscape`), for YouTube, a website or screens.

     The orientation changes the whole composition (grid, sizes, safe zone), so never pick it by default. Horizontal only works in motion-graphics mode.
   - Also ask the **style**: **slides** (the automatic choreography: camera move between slides) or **motion graphics** (kinetic typography and varied transitions, so it doesn't look like slides). If the user says the result "looks like slides" or asks for something more dynamic, use motion graphics. See `references/motion.md`.
   - And the **sound**: built-in effects (default), Openverse effects, Openverse music, the user's files, or no sound.
2. **Read `<ic>/references/video.md`**: choreography, controlling the animation with `data-anim`/`data-delay`, sound and checks.
3. **Tune the choreography in the HTML** if needed. The animation is automatic, but `data-anim` and `data-delay` let you fine-tune the key moments.
4. **Check with stills before the full video** (fast):
   ```bash
   node <ic>/scripts/video.mjs <output>/carousel.html <output>/carousel.mp4 --stills=0.6,1.5,3,4.2,6
   ```
   Open the JPEGs in `<output>/carousel-stills/` and confirm nothing is cut off, overlapping or invisible at the end of each entrance.
5. **Sound** (optional, see `video.md` › Sound):
   - Openverse: `node <ic>/scripts/sounds.mjs search "whoosh" --type=sfx`. Show the options to the user and, **with their permission**, run `node <ic>/scripts/sounds.mjs download <id> <output>/sounds/whoosh-1.mp3`.
   - File names set the use: `whoosh*` (transitions), `pop*` (stickers/pills), `hit*` (titles). Use **several per type** (`whoosh-1.mp3`, `whoosh-2.mp3`…) so the transitions don't always sound the same; they rotate without back-to-back repeats. Music goes separately.
   - With no files, the built-in effects already vary on their own (5 whooshes, 3 pops, 3 hits, with random pitch and length).
6. **Render the MP4**:
   ```bash
   node <ic>/scripts/video.mjs <output>/carousel.html <output>/carousel.mp4 [--reels] [--sfx=<output>/sounds] [--music=<output>/sounds/music.mp3]
   ```
   No ffmpeg needed: it uses Chrome (GSAP + WebCodecs). About 30–60 s for 20–30 s of video. Run it in the background if it is long.
7. **Deliver**:
   - `carousel.mp4` (H.264 + AAC, ready for Instagram/Reels)
   - `caption.txt` (caption, hashtags, keywords)
   - a note: length, format, sounds used (and where they come from, from `sounds/sound-sources.txt`) and placeholders still to replace

Do **not** deliver the PNGs unless the user asks for them. If they do, use `render.mjs` as in the base skill.
