---
name: carrossel-mp4
description: "Cria um carrossel de Instagram exatamente como a skill carrosseis-instagram, mas entrega uma animação MP4 estilo After Effects (texto letra a letra, wipes, movimento de câmara entre slides, Ken Burns, efeitos sonoros e música sem crédito do Openverse) em vez dos PNG. Usar quando o utilizador escrever /carrossel-mp4 ou pedir o carrossel 'em vídeo', 'animado', 'em mp4', 'para reels' ou 'como se fosse After Effects'."
---

# Carrossel → MP4 animado

Esta skill **reutiliza a skill `carrosseis-instagram`** (tem de estar instalada em `~/.claude/skills/carrosseis-instagram`; a seguir chamada `<cs>`).
O resultado final é um **MP4** e não os PNG.

## Fluxo

1. **Faz o carrossel normalmente**: segue os passos 1 a 4 do `<cs>/SKILL.md` (briefing, arquétipo, sistema visual, roteiro e HTML). Aplicam-se todas as regras: continuidade entre slides, fontes novas, paleta 2+1 e revisão de design.
   - Pergunta também o **formato do vídeo**: feed 4:5 (1080×1350, por defeito) ou Reels 9:16 (1080×1920).
   - E o **som**: efeitos incluídos (por defeito), efeitos do Openverse, música do Openverse, ficheiros do utilizador ou sem som.
2. **Lê `<cs>/references/video.md`**: coreografia, controlo da animação com `data-anim`/`data-delay`, som e verificação.
3. **Ajusta a coreografia no HTML**, se for preciso. A animação é automática, mas `data-anim` e `data-delay` deixam afinar os momentos-chave.
4. **Verifica com stills antes do vídeo inteiro** (rápido):
   ```bash
   node <cs>/scripts/video.mjs <output>/carrossel.html <output>/carrossel.mp4 --stills=0.6,1.5,3,4.2,6
   ```
   Abre os JPEG em `<output>/carrossel-stills/` e confirma que nada está cortado, sobreposto ou invisível no fim de cada entrada.
5. **Som** (opcional, ver `video.md` › Som):
   - Openverse: `node <cs>/scripts/sons.mjs procurar "whoosh" --tipo=sfx`. Mostra as opções ao utilizador e, **com a autorização dele**, faz `node <cs>/scripts/sons.mjs baixar <id> <output>/sons/whoosh.mp3`.
   - Os nomes dos ficheiros definem o uso: `whoosh*` (transições), `pop*` (autocolantes/pílulas), `hit*` (títulos). Usa **vários por tipo** (`whoosh-1.mp3`, `whoosh-2.mp3`…) para as transições não soarem sempre iguais; rodam sem repetir seguido. A música vai à parte.
   - Sem ficheiros, os efeitos incluídos já variam sozinhos (5 whooshes, 3 pops, 3 impactos, com tom e duração aleatórios).
6. **Renderiza o MP4**:
   ```bash
   node <cs>/scripts/video.mjs <output>/carrossel.html <output>/carrossel.mp4 [--reels] [--sfx=<output>/sons] [--music=<output>/sons/musica.mp3]
   ```
   Não precisa de ffmpeg: usa o Chrome (GSAP + WebCodecs). São ~30–60 s para 20–30 s de vídeo. Corre em segundo plano se for longo.
7. **Entrega**:
   - `carrossel.mp4` (H.264 + AAC, pronto para Instagram/Reels)
   - `legenda.txt` (legenda, hashtags, keywords)
   - uma nota: duração, formato, sons usados (e de onde vêm, a partir de `sons/origem-sons.txt`) e placeholders que ficaram por substituir

Os PNG **não** se entregam, a não ser que o utilizador os peça. Se pedir, usa `render.mjs` como na skill base.
