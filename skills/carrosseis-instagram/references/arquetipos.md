# Arquétipos de carrossel

Cada arquétipo indica a estrutura, as regras visuais e um exemplo real de onde foi tirado.

---

## A. Educativo / listicle

**Quando**: ensinar, comparar (noob vs pro, antes/depois, errado/certo), listas de dicas, processos, "prompts que usei".
**Objetivo típico**: guardados + partilhas + leads.

### Estrutura (framework de 10 slides)
| Slide | Função | Conteúdo |
|---|---|---|
| 1 | **Parar o scroll** | Título enorme + tese numa frase + visual central |
| 2–3 | **Criar interesse** | Primeiro exemplo concreto e o problema em que o público se reconhece |
| 4–5 | **Mostrar valor** | Ideias-chave e as comparações mais fortes |
| 6–9 | **Entregar a recompensa** | As restantes dicas/exemplos, o framework e o resumo |
| 10 | **CTA simples** | Uma ação, idealmente com recompensa |

Com menos slides, comprime mas mantém a ordem gancho → interesse → valor → recompensa → CTA.

### Padrões visuais
- **Capa**: título em duas camadas com contraste de famílias. Por exemplo, serif itálico pequeno ("noob v/s pro") por cima de um sans black enorme ("carousels"), com um elemento em pílula a ligar (v/s). Por baixo, a tese em 2 linhas com a parte final a bold ("One gets ignored, **One goes viral.**").
- **Prova social opcional na capa**: fila de ícones com números (❤ 59.6K, 💬 3.8K, 🔁 3.1K, ✈ 32.8K, 🔖 61.2K).
- **Cabeçalho fixo**: `data · @handle · categoria`, pequeno e em 3 colunas.
- ~~Rodapé fixo BACK/NEXT~~: **não usar por defeito** (feedback do utilizador). A vontade de deslizar vem da continuidade (`continuidade.md`).
- **Slides de comparação**: título curto no topo, duas etiquetas em pílula (`NOOB ❌` / `PRO ✅`), duas colunas com o exemplo mau e o bom e, em baixo, 2–4 palavras sob cada lado ("Flat & hard to scan" / "Clear & instantly scannable").
- **Fundos alternados**: preto texturado ↔ papel claro. Dá ritmo sem perder a identidade.
- **Slide "framework/resumo"**: grelha numerada (1–10 em quadrados) com chavetas a agrupar fases. Muito guardável.
- **Variante "resultado → como"**, retirada de um carrossel de prompts de ChatGPT: slide N mostra o resultado e slide N+1 repete o fundo esbatido com um cartão branco por cima com o "como" (prompt, passos, receita). Os pares repetem-se.

### Último slide (CTA)
- Palavra-gatilho enorme entre aspas: `comment 'carousel'`.
- Promessa concreta da recompensa: "e envio-te o **Playbook completo** com 25 fórmulas de gancho…".
- Ícone de guardar ("save for later") e mini-cartão do perfil.

---

## B. Portefólio / photo dump

**Quando**: fotografia, produtos, obras, projetos de cliente, viagens, "o meu mês em fotos".
**Objetivo típico**: alcance + autoridade + seguidores.

### Estrutura
| Slide | Conteúdo |
|---|---|
| 1 | Foto mais forte em full-bleed + título tipográfico grande sobreposto (ex.: `INSTAGRAM` pequeno + `LAYOUT` enorme). O sujeito pode tapar parte do título (efeito de profundidade com `.cutout`). |
| 2–N | **Um tema por slide** (um carro, um projeto ou um local): colagem vertical de 2–4 fotos (plano geral + detalhes). Sem texto ou só com uma legenda mínima. |
| Último (opcional) | Foto forte + CTA discreto ("mais em @handle", "bookings abertos"). |

### Regras
- Coerência de cor **dentro** de cada slide, porque as fotos do mesmo tema partilham a paleta.
- Ordenar slides por contraste: alternar claro/escuro, quente/frio.
- Colagens sem espaçamento (gap 0) ou com gap fino e uniforme (6–12px). Nunca misturar.
- Grelhas típicas: 3 linhas (1fr 1fr 1fr), 2+1 (2 colunas em cima, uma larga em baixo), 1 grande + 2 pequenas.
- Legenda curta: frase de atitude + equipamento/ficha técnica.

---

## C. Contínuo / panorâmico

**Quando**: marcas premium, hotelaria, arquitetura, moda, viagens, storytelling ambiental, e produtos com **fundo contínuo**.

**Variante C2: fundo contínuo com conteúdo** (ex.: "Summer Products" rosa/azul). Um só fundo de manchas orgânicas corre por todos os slides, os produtos recortados ficam em cima das divisões, os títulos são grandes e brancos e há 2 linhas de descrição por produto. A capa e o último slide levam uma pessoa/produto em destaque. Ver `exemplos/C2-fundo-continuo.html`.
**Objetivo típico**: desejo de marca, tempo de visualização.

### Estrutura
- 5–10 slides, **com pouco ou nenhum texto**: a imagem é a mensagem.
- Alterna slides **full-bleed** com slides de **fundo neutro + imagem emoldurada** (respiro).
- Pelo menos uma imagem **atravessa a divisão** entre dois slides. Fica metade num e metade no seguinte, o que obriga ao swipe para a completar.
- Opcional: um fio condutor (linha, forma, título longo) que corre ao longo de todos os slides.

### Regras
- Paleta restrita (2–3 tons tirados das fotos). Ex.: pedra, madeira, luz quente baixa e bege neutro.
- As imagens que atravessam slides devem ter o ponto de interesse **fora** da linha de corte (nada de caras ou logos cortados ao meio).
- Se houver texto, usa serif fino ou sans leve, pequeno, discreto, com muito espaço.
- Legenda: 1–2 frases poéticas/de marca + 2–3 hashtags próprias.

### Implementação no kit
Os slides ficam lado a lado dentro de `.carousel`. Um elemento `.span` posicionado com `left` absoluto atravessa a fronteira:
slide 2 começa em 1080px e slide 3 em 2160px. Uma imagem com `left:1380px; width:1560px` ocupa o lado direito do slide 2 e o esquerdo do 3.

---

## D. Template em série

**Quando**: vários itens com os mesmos campos, como jogos, eventos, menus, imóveis, vagas, produtos, oradores ou resultados.
**Objetivo típico**: informar rápido e de forma reconhecível.

### Estrutura
- Um slide por item, **exatamente o mesmo layout**, só mudam os dados e a foto.
- Opcional: slide 1 de capa da série ("Agenda do fim de semana") e último slide com resumo.

### Layout de referência (cartaz de jogo)
- ~60% de cima: foto (equipa, produto, local).
- ~40% de baixo: bloco sólido na cor da marca, com:
  - linha pequena em cima: competição · jornada;
  - título principal condensado, bold e em maiúsculas, em 2 linhas (`EQUIPA A` / `vs EQUIPA B`), com o "vs" em script ou mais pequeno;
  - linha pequena em baixo: `data | hora | local`.
- Logótipo/emblema pequeno no topo.

### Regras
- Fonte condensada (Anton, Bebas Neue, Oswald) para caberem nomes longos.
- O nome mais longo da série define o tamanho do título, que deve ser igual em todos os slides.
- Hierarquia: o quê (título) > quando (data/hora) > onde > o resto.
- Legenda: 1 linha com o contexto + emoji, e a lista dos itens só se ajudar.

---

## E. Cinematográfico

**Quando**: marca pessoal, agências, serviços criativos, mensagens de autoridade, storytelling. O ponto de partida é uma frase forte com pouco texto.
**Referência**: carrossel de uma agência de social media: personagem de época num escritório escuro, uma palavra gigante por slide.
**Objetivo típico**: memorabilidade, autoridade, partilhas.

### Estrutura
| Slide | Conteúdo |
|---|---|
| 1 | Foto full-bleed do sujeito (centrado, olhar para a câmara) + título de 1–2 palavras enorme em fonte expressiva, **atrás ou à frente do sujeito**. Tagline pequena por cima ("Social Media"). |
| 2–N | Cada slide: **uma palavra-chave gigante** (DETALHE, É POR ISSO, Comunicou, Design, Shhh…, O Silêncio) + 1–2 linhas de texto pequeno que completam a ideia. A foto muda de plano (geral, médio, grande plano, detalhe) mas mantém a mesma cena e a mesma luz. |
| Último | Frase de fecho + CTA discreto, com a mesma linguagem. |

### Regras visuais
- **Gradação única** em todas as fotos (`.grade` + `.vignette` + `.texture`): tons escuros quentes, pretos esmagados e realces âmbar.
- **A palavra-chave é a assinatura**: 180–320px, em fonte display que interpreta a palavra (ver `fontes.md` › Combinações expressivas). Pode variar entre slides, com no máximo 3 fontes display.
- **Posição variável mas pensada**: a palavra ocupa o espaço negativo da foto (em cima, de lado, atrás do sujeito). Varia entre esquerda, centro e direita para dar ritmo.
- **Texto de apoio** pequeno (≥ 31px), sempre na mesma fonte e cor, junto à palavra-chave.
- **Continuidade**: corte de cena (o sujeito olha para a direita e o slide seguinte mostra o que ele vê), objeto na divisão ou palavra partida entre slides.
- Sem cabeçalho/rodapé repetido: a foto e a tipografia chegam.

### Imagens
Vê `imagens.md`. Precisa de 5–10 fotos da **mesma pessoa/cena**: fotos do utilizador, sessão própria, stock com a mesma personagem ou prompts IA com descrição fixa da personagem.
