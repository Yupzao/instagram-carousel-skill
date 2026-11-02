# Design: sistema visual, kit e checklist

## Formato
- 1080×1350 (4:5) sempre. É o formato que ocupa mais ecrã no feed.
- Área segura: 80px laterais. A faixa de 170px em cima e em baixo é reservada a cabeçalho/rodapé.
- O Instagram pode cortar a pré-visualização da grelha do perfil para 3:4: na capa, o título deve ficar no centro vertical.

## Tipografia (pares testados)
| Uso | Fonte (Google Fonts) | Classe do kit |
|---|---|---|
| (Escolher o par em `fontes.md`. Estes são só os nomes das classes.) | | |
| Título principal | display do par escolhido | `.t-xl`, `.t-l` |
| Contraste elegante | Instrument Serif itálico | `.t-serif` |
| Condensado (desporto, eventos, preços) | Anton | `.t-cond` |
| Texto | Inter 500/600 | `.lead`, `.small` |

Tamanhos mínimos a 1080px (1pt ≈ 2,77px no feed, ver `apple-design.md`): título ≥ 96px, texto de apoio ≥ 44px e metadados ≥ 31px (= 11pt, o mínimo da HIG). Nada de pesos Thin/Light abaixo de 50px.
No máximo 2 famílias por carrossel (3 se uma for só para números).

## Cor
- 1 fundo escuro, 1 fundo claro, 1 acento. O acento serve só para destacar (palavra, pílula, CTA).
- Estados ✓/✗ em verde/vermelho só nas etiquetas, nunca no fundo.
- Em fotos, usar sempre um `.scrim` (gradiente) por baixo do texto.

## Componentes do kit (`assets/kit/base.css`)
| Classe | O que é |
|---|---|
| `.carousel` | Contentor de todos os slides (obrigatório) |
| `.slide` / `.slide.light` | Slide 1080×1350, fundo escuro / claro |
| `.hdr` | Cabeçalho de 3 itens |
| `.nav[data-auto]` | Rodapé BACK 01…NN NEXT. **Opcional, não usar por defeito** |
| `.slide.clear` | Slide transparente, que deixa ver o `.backdrop` |
| `.backdrop` | Fundo contínuo com a largura de todos os slides (1.º filho de `.carousel`) |
| `.grade` `.vignette` | Gradação de cor (`--grade`) e vinheta para unir fotos |
| `.outline` | Texto só com contorno |
| `.cutout` | Recorte PNG do sujeito por cima do título |
| `.t-script` `.t-mega` | Título em script / palavra gigante (arquétipo E) |
| `.content` | Área central em flex coluna, centrada |
| `.content.top` | Área central alinhada ao topo |
| `.t-xl` `.t-l` `.t-m` `.t-serif` `.t-cond` | Títulos |
| `.lead` `.small` `.muted` | Texto |
| `.hl` | Palavra com caixa de cor de acento |
| `.pill` `.pill.bad` `.pill.good` | Etiquetas em pílula |
| `.vs` | Duas colunas de comparação |
| `.card` | Cartão branco com sombra (prompts, notas) |
| `.media` | Imagem (background-image) que preenche o contentor |
| `.bleed` | Ocupa o slide inteiro (usar com `.media`) |
| `.scrim` / `.scrim.top` | Gradiente escuro para legibilidade |
| `.collage` | Grelha de fotos (definir `grid-template-*` inline) |
| `.ph` | Placeholder de imagem com descrição |
| `.span` | Elemento que atravessa slides (filho direto de `.carousel`) |
| `.num-grid` | Grelha de quadrados numerados (slide framework) |
| `.stats` | Fila de métricas com ícone |
| `.texture` | Grão/ruído subtil sobre o fundo |
| `[data-fit="grupo"]` | Ajusta o tamanho para caber numa linha; igual em todo o grupo |

Variáveis de marca no `:root` do HTML: `--bg`, `--bg-alt`, `--ink`, `--ink-alt`, `--accent`, `--accent-ink`, `--f-display`, `--f-serif`, `--f-cond`, `--f-body`.

## Checklist de verificação (ver cada PNG)
- [ ] O título da capa lê-se num thumbnail pequeno (imagina-o a 1/4 do tamanho).
- [ ] Nenhum texto cortado, a sobrepor-se a outro ou a tocar nas margens.
- [ ] Contraste ≥ 4.5:1 (≥ 3:1 em texto ≥ 50px ou bold), medido com `scripts/contrast.mjs`. Texto sobre foto tem scrim.
- [ ] Nenhum texto abaixo de 31px (exceto cartões "para guardar", assinalados).
- [ ] Continuidade 1→2 visível. Em cada par de slides lado a lado, a junção encaixa sem degraus.
- [ ] Sem "desliza"/NEXT repetido. Se houver cabeçalho, está na mesma posição em todos os slides.
- [ ] Fontes carregadas (sem fallback Arial/Times) e par diferente do último em `historico-fontes.md`.
- [ ] Um conceito por slide, sem slides "cheios".
- [ ] Nos elementos `.span`, a junção entre slides não corta caras, logos ou texto.
- [ ] No arquétipo D, o título tem o mesmo tamanho em todos os slides.
- [ ] O último slide tem um único CTA.
- [ ] Placeholders (`.ph`) assinalados ao utilizador se ficaram por substituir.
