---
name: carrosseis-instagram
description: "Cria carrosséis para Instagram completos, com roteiro slide a slide, legenda, hashtags e slides prontos em PNG 1080×1350 (gerados a partir de HTML). Cobre cinco arquétipos (educativo/listicle, portefólio/photo dump, contínuo/panorâmico, template em série e cinematográfico com fotos e tipografia expressiva) e técnicas de continuidade entre slides (fundo contínuo, elementos que atravessam a divisão). Usar sempre que o utilizador pedir um carrossel, post com vários slides, 'slides para o Instagram', 'carousel', um photo dump, cartazes em série (jogos, eventos, produtos) ou quiser transformar um tema, artigo ou conjunto de fotos num post deslizável, mesmo que não diga 'carrossel'."
---

# Carrosséis para Instagram

Produz duas coisas: **(1) o roteiro + a legenda** e **(2) os slides em PNG** prontos a publicar.
As regras saem da análise de carrosséis reais com bom desempenho e do feedback do utilizador (ver `references/`).

## Fluxo

### 1. Briefing (pergunta só o que falta)
- **Tema / conteúdo**: o que se quer comunicar, ou as fotos/dados disponíveis.
- **Objetivo**: alcance (partilhas), guardados (valor prático), leads (comentar palavra → DM), venda, ou portefólio.
- **Marca**: @handle, cores, fontes, logótipo. Se não houver nada, escolhe um sistema coerente com o tema e diz qual escolheste.
- **Imagens**: fotos do utilizador, banco de imagens livre ou nenhuma. Lê `references/imagens.md`. **Não geras imagens nem inventas fotografias.**
- **Idioma** do texto (por defeito, o idioma do utilizador).

Se o pedido já trouxer o suficiente, avança sem perguntar.

### 2. Escolher o arquétipo
| Situação | Arquétipo |
|---|---|
| Ensinar, comparar, dar dicas, contar um processo, "X erros", "antes/depois" | **A. Educativo/listicle** |
| Mostrar trabalho fotográfico, produtos ou projetos com muitas fotos | **B. Portefólio/photo dump** |
| Marca, produto ou ambiente em que o design corre como uma faixa única (panorama, fundo contínuo) | **C. Contínuo/panorâmico** |
| Vários itens com a mesma estrutura de dados (jogos, eventos, menus, preços, vagas) | **D. Template em série** |
| Mensagem forte com pouco texto, marca pessoal, storytelling, tom dramático/editorial, com fotos de pessoas ou cenas | **E. Cinematográfico** |

Os arquétipos combinam-se: um educativo (A) pode ter fundo contínuo (C) ou fotos cinematográficas (E).

Lê antes de escrever:
- `references/arquetipos.md`: a secção do arquétipo escolhido
- `references/continuidade.md`: **sempre**, porque todos os carrosséis levam continuidade entre slides
- `references/fontes.md`: **sempre**, para escolher um par de fontes novo
- `references/cores.md`: **sempre**, para escolher uma paleta "2 base + 1 pop" (exceto se a marca já tiver cores)
- `references/copy.md`: ganchos, CTAs e legendas
- `references/apple-design.md`: tamanhos mínimos, contraste, ofício e revisão

### 2b. Sistema visual: planear e criticar
Antes do roteiro, define o sistema (`references/apple-design.md` › 4):
- **Cor**: uma paleta de `references/cores.md` (2 cores base + 1 pop ≤ 10%), diferente da última usada, ou as cores da marca organizadas no mesmo padrão. Indica o contraste de cada par texto/fundo (`node scripts/contrast.mjs <texto> <fundo> <px>`).
- **Tipo**: escolhe em `references/fontes.md` um par **diferente do último usado** (regista-o em `references/historico-fontes.md`). Indica a escala em px (mínimo 31px; texto de apoio ≥ 44px).
- **Continuidade**: que técnica liga os slides (fundo contínuo, objeto na divisão, título partido…). Pelo menos a ligação **1→2** é obrigatória.
- **Assinatura**: o único elemento pelo qual o carrossel vai ser lembrado.

Depois critica o plano: *"Teria feito isto para outro tema?"* Se sim, é um default (ver os 3 looks template a evitar). Revê-o antes de avançar.

### 3. Roteiro (entregar ao utilizador)
Formato:

```
ARQUÉTIPO: E — Cinematográfico (+ continuidade por título partido)
SISTEMA: paleta Midnight Gold (#0D1B2A + #D9DEE4 + pop #E2B13C) · Bodoni Moda + Pinyon Script + DM Sans · grão + vinheta
CONTINUIDADE: 1→2 o título "DETA|LHE" é cortado na divisão; 3→4 a mesa atravessa a junção
ASSINATURA: uma palavra gigante por slide em fonte expressiva, atrás do sujeito

01 · CAPA     | Título: … | Subtítulo: … | Visual: … | Liga a 02: …
02 · …        | Título: … | Texto: … (≤ 15 palavras) | Visual: …
…
NN · CTA      | …

LEGENDA:
…
HASHTAGS / KEYWORDS:
…
IMAGENS: lista das fotos necessárias (com a fonte de cada uma ou o prompt sugerido)
```

Se o utilizador quiser rever o roteiro primeiro, para aqui e espera. Caso contrário, segue para os slides.

### 4. Construir os slides (HTML)
1. Copia a pasta `assets/kit/` para `<output>/kit/` (fica `kit/base.css` e `kit/carousel.js`).
2. Parte do exemplo mais próximo em `assets/exemplos/`, copia-o para `<output>/carrossel.html` e edita a marca, as fontes e o conteúdo:

   | Exemplo | Mostra |
   |---|---|
   | `A-educativo.html` | Comparações e framework, com título que atravessa 1→2 |
   | `B-portefolio.html` | Colagens de fotos |
   | `C-continuo.html` | Panorama emoldurado entre slides |
   | `C2-fundo-continuo.html` | Fundo de manchas contínuo e produtos em cima das divisões |
   | `D-serie.html` | Template repetido com `data-fit` |
   | `E-cinematografico.html` | Foto full-bleed, gradação, palavra gigante em fonte expressiva |

3. Regras do kit (detalhe em `references/design.md`):
   - Cada slide é `<section class="slide">` com 1080×1350; `light` = fundo claro; `clear` = transparente (deixa ver o fundo contínuo).
   - **Fundo contínuo**: `<div class="backdrop">` como primeiro filho de `.carousel`, com a largura de todos os slides.
   - **Elementos que atravessam slides**: filhos de `.carousel` com `class="span"` e `left` em px absolutos (o slide k começa em `(k-1)*1080px`).
   - `<div class="hdr">` = cabeçalho de 3 itens (opcional). `<div class="nav" data-auto>` = barra BACK/NEXT, **opcional e não usada por defeito** (ver regra 4).
   - `data-fit="grupo"` numa linha com `white-space:nowrap`: ajusta o tamanho até caber e aplica-o igual a todo o grupo.
   - Imagens: `<div class="media" style="background-image:url('foto.jpg')">`. Sem foto: `<div class="ph">descrição</div>`.
   - Fotos de fontes diferentes: une-as com `.grade` (gradação de cor), `.vignette` e `.texture` (grão).

### 5. Renderizar e verificar
```bash
node <skill>/scripts/render.mjs <pasta-output>/carrossel.html <pasta-output>/png
```
Gera `slide-01.png` … `slide-NN.png` (1080×1350) com o Chrome em modo headless (sem dependências npm).

**Abre os PNG e verifica-os um a um** com a checklist de `references/design.md`. Vê também **pares de slides lado a lado** para confirmar que a continuidade encaixa sem degraus. Depois faz a **revisão de design em 5 lentes** de `references/apple-design.md` › 7 e termina com "remove um acessório".
Corrige e volta a renderizar até não haver nada Crítico ou Alto.

Para pré-visualizar no browser, abre o HTML sem hash: aparecem todos os slides lado a lado em escala reduzida.

### 5b. Versão em vídeo
Se o utilizador pedir o carrossel animado/MP4 (ou usar `/carrossel-mp4`), segue `references/video.md`. Não precisa de ffmpeg; o som vem dos efeitos incluídos ou do Openverse (CC0, sem crédito).

### 6. Entregar
- `png/slide-XX.png`
- `legenda.txt` com a legenda, as hashtags e as keywords
- o roteiro em texto no chat
- uma nota curta com as escolhas (arquétipo, fontes, continuidade, assinatura), o resumo da revisão de design e o que falta (fotos em placeholder, créditos de imagens)

## Regras de ouro
1. **A capa é ~80% do resultado**: título enorme (≥ 120px), uma ideia, um visual central e contraste forte. Nunca pôr parágrafos na capa.
2. **Continuidade obrigatória**: o slide 2 mostra o fim de algo que começou no slide 1 (título, objeto, forma, fundo) para prender o olhar. Usa pelo menos mais uma ligação a meio do carrossel. Exceção: o arquétipo D, quando os itens são independentes.
3. **Variedade tipográfica**: cada carrossel usa um par de fontes diferente do anterior. Não repitas sempre Inter/Instrument Serif, porque as mesmas fontes saturam rápido. O texto corrido fica numa fonte legível; a personalidade vive nos títulos.
4. **Sem "desliza"/NEXT fixo no canto**: nada de rodapé repetido com BACK/NEXT nem "desliza →" em todos os slides. A continuidade já faz esse trabalho. No máximo um sinal discreto **só na capa**, e só se o design não tiver continuidade visível.
5. **Um conceito por slide.** Título de 1–4 palavras e texto de apoio ≤ 15 palavras. Se não cabe, divide em dois slides.
6. **Sistema coerente, variação controlada**: mesma grelha e as mesmas margens. Varia o fundo, a imagem e, no arquétipo E, a fonte display dentro da mesma família de estilo.
7. **O último slide tem um único CTA**, com recompensa quando possível (ex.: "Comenta GUIA e envio-te…").
8. **A legenda complementa e não repete**: gancho, contexto, CTA e hashtags/keywords.
9. **Margens de segurança**: texto importante a ≥ 80px das bordas laterais e longe das divisões entre slides, exceto quando é o próprio elemento de continuidade.
10. **Legibilidade no telemóvel**: 1pt ≈ 2,77px. Nenhum texto abaixo de 31px (11pt), texto de apoio ≥ 44px, contraste ≥ 4.5:1 (≥ 3:1 se ≥ 50px ou bold). O significado nunca vai só na cor.
11. **Cor 2 + 1**: duas cores base fazem o trabalho (~60/30) e uma cor pop aparece pouco (≤ 10%, 1–2 sítios por slide, nunca em todos). O pop como texto vai só sobre a base escura; sobre a clara, usa-o como forma, com texto escuro por cima. O logótipo aparece só na capa e/ou no CTA.
12. Entre 5 e 10 slides (máximo 20).
