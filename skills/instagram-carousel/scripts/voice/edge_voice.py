"""Neural voiceover with edge-tts (Microsoft Edge "Read aloud" voices, e.g. en-US-BrianNeural) + word timing.

Reads <dir>/script.json, a JSON array of lines, and writes:
  <dir>/voice.mp3     the narration
  <dir>/timeline.js   window.TIMELINE = { total, lines: [{ start, end, text, words: [{ w, t }] }] }
Times include --lead (silence before the voice); render with: video.mjs … --voice=<dir>/voice.mp3 --voice-at=<lead>

Lines are plain strings (the whole script in ONE call: smooth, even delivery) or objects
  { "text": "Seriously!", "rate": "+15%", "pitch": "+8Hz", "gap": 0.3 }
for an animated, personal read: each line is synthesised on its own with its own speed and pitch
(faster and higher for excitement, slower and lower for the reflective close), then joined: each clip's trailing
silence is trimmed and a breath of 'gap' seconds (default --gap=0.22) added, so the pace stays tight.

Usage: python edge_voice.py <dir> [--voice=en-US-BrianNeural] [--rate=+5%] [--pitch=+0Hz] [--lead=0.35] [--gap=0.22]
List voices: python -m edge_tts --list-voices
Needs: pip install edge-tts. Unofficial use of the Edge read-aloud service: fine for drafts and personal use;
for commercial work prefer the official Azure Speech API (same voices).
"""
import asyncio, json, re, sys, pathlib
import edge_tts

args = [a for a in sys.argv[1:] if not a.startswith('--')]
flags = dict(a[2:].split('=', 1) for a in sys.argv[1:] if a.startswith('--') and '=' in a)
out = pathlib.Path(args[0] if args else '.').resolve()
VOICE = flags.get('voice', 'en-US-BrianNeural')
RATE = flags.get('rate', '+5%')
PITCH = flags.get('pitch', '+0Hz')
LEAD = float(flags.get('lead', '0.35'))
BYTES_PER_SEC = 48000 / 8  # edge-tts default output: 24 kHz, 48 kbit/s CBR mono MP3
FRAME = 144                # bytes per MP3 frame at that rate (576 samples = 24 ms), no padding
GAP = float(flags.get('gap', '0.22'))  # breath between lines in per-line mode

raw = json.loads((out / 'script.json').read_text(encoding='utf-8-sig'))
lines = [l if isinstance(l, str) else l['text'] for l in raw]
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())


async def synth(text, rate, pitch, at):
    com = edge_tts.Communicate(text, VOICE, rate=rate, pitch=pitch, boundary='WordBoundary')
    audio, words = bytearray(), []
    async for ch in com.stream():
        if ch['type'] == 'audio':
            audio += ch['data']
        elif ch['type'] == 'WordBoundary':
            words.append({'w': ch['text'], 't': ch['offset'] / 1e7 + at, 'e': (ch['offset'] + ch['duration']) / 1e7 + at})
    return audio, words


async def main():
    if all(isinstance(l, str) for l in raw):
        audio, words = await synth(' '.join(lines), RATE, PITCH, LEAD)
    else:  # per-line prosody: MP3 frames concatenate cleanly, each clip's length comes from its byte count
        audio, words, at = bytearray(), [], LEAD
        # a frame of silence, taken from the end of a short clip, to pad the breaths between lines
        quiet, _ = await synth('Hm.', RATE, PITCH, 0)
        silence = bytes(quiet[-FRAME:]) if len(quiet) >= FRAME else b''
        for l in raw:
            o = {'text': l} if isinstance(l, str) else l
            a, w = await synth(o['text'], o.get('rate', RATE), o.get('pitch', PITCH), at)
            if w:  # cut the clip's leading/trailing silence at frame boundaries, then leave a short breath ('gap', seconds)
                keep = (w[-1]['e'] - at + 0.2) * BYTES_PER_SEC
                a = a[:min(len(a), int(-(-keep // FRAME)) * FRAME)]
                cut = max(0, int((w[0]['t'] - at - 0.06) * BYTES_PER_SEC) // FRAME * FRAME)
                a = a[cut:]
                for x in w: x['t'] -= cut / BYTES_PER_SEC; x['e'] -= cut / BYTES_PER_SEC
            audio += a; words += w; at += len(a) / BYTES_PER_SEC
            if o.get('gap', GAP):
                pad = (silence * (int(o.get('gap', GAP) * BYTES_PER_SEC) // FRAME + 1)) if silence else b''
                audio += pad; at += len(pad) / BYTES_PER_SEC
    (out / 'voice.mp3').write_bytes(bytes(audio))

    # assign the word boundaries to the script lines by matching the letters in order
    timeline, i = [], 0
    for n, text in enumerate(lines):
        target, got, ws = norm(text), '', []
        while i < len(words) and len(got) < len(target):
            got += norm(words[i]['w']); ws.append(words[i]); i += 1
        if not ws:
            raise SystemExit(f'No words matched line {n}: {text}')
        timeline.append({'line': n, 'text': text, 'start': round(ws[0]['t'], 3), 'end': round(ws[-1]['e'], 3),
                         'words': [{'w': w['w'], 't': round(w['t'], 3)} for w in ws]})
    total = round(timeline[-1]['end'] + 0.8, 3)
    (out / 'timeline.js').write_text(f"window.TIMELINE = {json.dumps({'total': total, 'lines': timeline})};\n", encoding='utf-8')
    print(f'voice.mp3 · {VOICE} · {total:.1f}s with {LEAD}s lead')
    for l in timeline:
        print(f"{l['start']:6.2f}–{l['end']:6.2f}  {l['text']}")


asyncio.run(main())
