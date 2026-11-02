# Vídeo: carrossel animado em MP4

Usado pela skill `/carrossel-mp4`. O motor é `scripts/video.mjs`, que abre o carrossel no Chrome headless, injeta `scripts/video/animate.js` (GSAP), captura frame a frame e codifica com WebCodecs (`scripts/video/encoder.html`). Gera um MP4 H.264 + AAC, sem ffmpeg.

## Coreografia automática (estilo After Effects)
A "câmara" é a faixa de slides: entre slides há um **movimento de câmara rápido** (power4.inOut, 0,9 s) com desfoque de movimento. Os elementos que atravessam a divisão (continuidade) ficam no sítio e reforçam a transição.

Em cada slide, por ordem:
| Tipo | Elementos (auto) | Animação | Quando |
|---|---|---|---|
| `media` | `.bleed .media .frame .collage>* .photo .product` | escala 1.14→1 + fade, depois Ken Burns lento | 0 s |
| `title` | `.t-* .big .name .bodoni .italic .title .outline` | ≤ 16 caracteres: **letra a letra** (sobe e roda). Mais longo: **wipe** da esquerda | +0,15 s |
| `pop` | `.pill .num-grid>div .stats>div .card .crest .disc` | escala com ressalto (back.out) | +0,45 s |
| `text` | `p .lead .small .body .desc .cap .eyebrow .tag .meta .hdr` | sobe 34px + fade, em cascata | +0,55 s |
| `.span` | elementos que atravessam slides | entram no slide onde começam (`wipe` se tiverem texto, `pop` se não tiverem) | |

**Tempo parado** em cada slide: 1,6–3,6 s, conforme o número de palavras (tempo de leitura). O slide seguinte começa a animar a meio do movimento de câmara.

### Afinar no HTML
- `data-anim="chars|wipe|title|text|pop|media|none"`: força o tipo (`none` = estático, incluindo os filhos).
- `data-delay="0.4"`: atrasa esse elemento (segundos).
- Para um título partido entre slides (`.span`), `data-anim="wipe"` dá o efeito de "escrever" a palavra através da divisão.

### Duração ideal
- Feed: 15–30 s. Reels: 10–25 s. Com mais de 8 slides, corta ou junta slides.
- O 1.º segundo tem de mostrar já o título da capa: o gancho funciona igual ao do carrossel.

## Som
Por defeito, `video.mjs` gera **efeitos sonoros incluídos por síntese** (whoosh nas transições, pop nos autocolantes, impacto nos títulos). Não precisam de licença nem de crédito.

### Variação: o som nunca é sempre o mesmo
- **Efeitos incluídos:** há várias variantes por tipo. Whoosh: *sobe, desce, chicote, ar, riser*. Pop: *gota, blip, clique*. Impacto: *grave, batida, tom*.
  - As variantes rodam baralhadas, sem repetir a mesma duas vezes seguidas.
  - Em cada disparo, a duração, o tom e o volume mudam ligeiramente.
  - O whoosh tem pan estéreo da direita para a esquerda, a acompanhar o movimento da câmara.
- **Ficheiros:** podes pôr vários por tipo na pasta (`whoosh-1.mp3`, `whoosh-2.wav`, `whoosh_ar.ogg`, `pop-a.mp3`…). Rodam da mesma forma e cada um toca com o tom ligeiramente alterado (±8%).
  - Se um tipo não tiver ficheiros, usa as variantes incluídas.
  - Para variar a sério, descarrega 3–5 whooshes diferentes do Openverse.
- `--seed=N` fixa a mistura, para repetir exatamente o mesmo som. Sem seed, cada render soa diferente.

### Openverse: sons sem crédito
`scripts/sons.mjs` pesquisa na API do Openverse **apenas** as licenças **CC0** e **Public Domain Mark**, que dispensam crédito.
```bash
node scripts/sons.mjs procurar "whoosh swoosh" --tipo=sfx --max-seg=3
node scripts/sons.mjs procurar "lofi chill" --tipo=musica
node scripts/sons.mjs baixar <id> <output>/sons/whoosh.mp3
```
- **Antes de descarregar, mostra ao utilizador** os títulos, as durações e os links "ouvir" e pede autorização.
- Grava como `whoosh-1.mp3`, `whoosh-2.mp3`, `pop-1.mp3`, `hit-1.mp3`… numa pasta e passa `--sfx=<pasta>`. Os tipos em falta usam os efeitos incluídos.
- Música: `--music=<ficheiro>` (fade in/out automático; repete se for curta). Volume: `--music-volume=0.35`, `--sfx-volume=0.8`.
- O `baixar` regista a origem em `origem-sons.txt`. O crédito não é obrigatório, mas o registo fica guardado.
- Música CC0 boa é rara: se não houver nada adequado, entrega só com efeitos e diz ao utilizador que pode juntar música no próprio Instagram (biblioteca de áudio dos Reels).

### Outras fontes
- Ficheiros do utilizador (os mesmos nomes `whoosh/pop/hit`, ou `--music`).
- Plugin **SoundWeaver** (se estiver instalado): 52 efeitos WAV reais, que se copiam para a pasta de sons com os nomes acima.
- `--mute` gera o vídeo sem som.

## Verificação
1. `--stills=t1,t2,…` antes do render completo. Escolhe momentos a meio das entradas e no fim de cada pausa.
2. Confirma: nada fica invisível no fim da entrada, os textos não se cortam durante o wipe e a continuidade encaixa durante o movimento de câmara.
3. Depois do MP4, indica a duração e o tamanho. O Instagram aceita até 4 GB e 60 s no feed. Os ficheiros típicos ficam entre 15 e 40 MB.

## Opções do `video.mjs`
`--reels` (1080×1920) · `--fps=30` · `--bitrate=12` (Mbps) · `--sfx=builtin|<pasta>|none` · `--seed=N` · `--music=<ficheiro>` · `--sfx-volume` · `--music-volume` · `--mute` · `--stills=…` · `--max-frames=N` (testes) · `--debug`
