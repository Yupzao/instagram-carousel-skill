"""Neural voiceover with edge-tts (Microsoft Edge "Read aloud" voices, e.g. en-US-BrianNeural) + word timing.

Reads <dir>/script.json (a JSON array of sentences), synthesises it in ONE call (natural flow between
sentences) and writes:
  <dir>/voice.mp3     the narration
  <dir>/timeline.js   window.TIMELINE = { total, lines: [{ start, end, text, words: [{ w, t }] }] }
Times include --lead (silence before the voice); render with: video.mjs … --voice=<dir>/voice.mp3 --voice-at=<lead>

Usage: python edge_voice.py <dir> [--voice=en-US-BrianNeural] [--rate=+5%] [--lead=0.35]
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
LEAD = float(flags.get('lead', '0.35'))

lines = json.loads((out / 'script.json').read_text(encoding='utf-8-sig'))
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())


async def main():
    com = edge_tts.Communicate(' '.join(lines), VOICE, rate=RATE, boundary='WordBoundary')
    audio, words = bytearray(), []
    async for ch in com.stream():
        if ch['type'] == 'audio':
            audio += ch['data']
        elif ch['type'] == 'WordBoundary':
            words.append({'w': ch['text'], 't': ch['offset'] / 1e7 + LEAD, 'e': (ch['offset'] + ch['duration']) / 1e7 + LEAD})
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
    print(f'voice.mp3 · {VOICE} {RATE} · {total:.1f}s with {LEAD}s lead')
    for l in timeline:
        print(f"{l['start']:6.2f}–{l['end']:6.2f}  {l['text']}")


asyncio.run(main())
