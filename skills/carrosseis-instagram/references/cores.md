# Cores: paletas "2 base + 1 pop"

**Padrão do utilizador:** duas cores "normais" que fazem o trabalho todo e **uma** cor que se destaca um pouco mais e aparece pouco.
Exemplos de origem: *charcoal black + royal blue + um pouco de tangerine*, *marshmallow white + galactic violet + bubblegum pink*, *aquajade + midnight abyss + baby pink*.

## Como usar (60 · 30 · 10)
| Papel | Proporção | Onde |
|---|---|---|
| **Base 1** | ~60% | Fundo dominante da maioria dos slides |
| **Base 2** | ~30% | Fundo alternado, blocos, formas grandes, texto |
| **Pop** | **≤ 10%** | Uma palavra-chave, o CTA, um autocolante/pílula, o elemento de continuidade, um detalhe gráfico |

Regras:
- O pop aparece **no máximo em 1–2 sítios por slide**, e há slides sem pop. É isso que o faz saltar.
- O pop **nunca é fundo de um slide inteiro**, exceto no slide do CTA, se for intencional.
- O elemento de continuidade (disco, forma, objeto na divisão) é um ótimo sítio para o pop: liga os slides e chama o olho.
- Fotos: a gradação puxa para as bases e o pop entra só nos grafismos por cima.
- Escolhe uma paleta **diferente da última usada** (regista-a em `historico-fontes.md`, na mesma linha das fontes).

## Contraste: o pop quase nunca é texto sobre o fundo claro
Medido com `scripts/contrast.mjs`. Em quase todas as paletas, o pop sobre a base clara fica abaixo de 3:1.
Por isso:
- **pop como texto → só sobre a base escura**, ou
- **pop como forma/fundo de pílula → texto escuro por cima**.

## Paletas

Valores: `base clara/escura` = contraste entre as duas bases; `pop/escura` = pop como texto sobre a base escura.

| # | Nome | Base 1 | Base 2 | Pop | Contraste | Texto em cima do pop | Tom |
|---|---|---|---|---|---|---|---|
| 1 | **Charcoal Royale** | Charcoal black `#1E1F22` | Royal blue `#2F4BDB` | Tangerine `#FF8C2B` | branco/royal 6.7 · tangerine/charcoal 7.1 | charcoal (7.1) | Tech, confiança com energia |
| 2 | **Galactic Candy** | Marshmallow white `#F8F5EF` | Galactic violet `#3B1F6E` | Bubblegum pink `#FF7EB6` | 12.0 · pink/violet 5.5 | violet (5.5) | Criativo, jovem, beleza |
| 3 | **Abyss Jade** | Midnight abyss `#0B1A2E` | Aquajade `#2FB5A3` | Baby pink `#F7C6D9` | midnight/aquajade 6.9 · pink/midnight 11.7 | midnight (11.7) | Bem-estar, saúde, fresco |
| 4 | **Forest Zest** | Bone `#EDE6DA` | Forest `#1F3B2D` | Chartreuse `#C9F24B` | 9.8 · chartreuse/forest 9.5 | forest (9.5) | Sustentável, outdoor |
| 5 | **Coral Coast** | Sand `#E8DCC4` | Ink navy `#101828` | Coral `#FF6B57` | 13.1 · coral/navy 6.3 | navy (6.3) | Viagem, verão, lifestyle |
| 6 | **Espresso Saffron** | Oat `#EADFCF` | Espresso `#2A1D17` | Saffron `#F2A900` | 12.4 · saffron/espresso 8.1 | espresso (8.1) | Café, comida, artesanal |
| 7 | **Glacier Flamingo** | Glacier `#CFE3F2` | Navy `#142B4D` | Flamingo `#FF6F91` | 10.7 · flamingo/navy 5.4 | navy (5.4) | Fintech amigável, apps |
| 8 | **Burgundy Peach** | Cream `#FFF6E6` | Burgundy `#6B1E2E` | Peach `#FFB38A` | 10.6 · peach/burgundy 6.5 | burgundy (6.5) | Moda, vinho, editorial quente |
| 9 | **Teal Sunflower** | Mist `#DCE7E5` | Deep teal `#0F3B3E` | Sunflower `#FFC93C` | 9.7 · sunflower/teal 8.0 | deep teal (8.0) | Educação, consultoria |
| 10 | **Plum Mint** | Lavender haze `#E9E2F7` | Plum `#3D1F4F` | Mint `#7BE0B5` | 11.1 · mint/plum 8.7 | plum (8.7) | Beleza, skincare, calma |
| 11 | **Olive Tomato** | Ivory `#F7F3E8` | Olive `#4A5A2E` | Tomato `#F2542D` | 6.8 · branco/olive 7.5 | **branco** (3.5, só ≥ 50px/bold) | Restauração, mediterrâneo |
| 12 | **Midnight Gold** | Silver `#D9DEE4` | Midnight `#0D1B2A` | Gold `#E2B13C` | 12.9 · gold/midnight 8.8 | midnight (8.8) | Luxo, premium, eventos |
| 13 | **Cocoa Cherry** | Blush `#F6D9D5` | Cocoa `#3B2620` | Cherry `#D7263D` | 10.6 · cherry/blush 3.7 (≥ 50px) | **branco** (5.0) | Doçaria, romântico, Valentim |
| 14 | **Slate Cobalt** | Linen `#F3EEE6` | Slate `#34495E` | Cobalt `#1F5BFF` | 8.0 · cobalt/linen 4.5 | **branco** (5.3) | Corporativo, SaaS, B2B |

Na paleta 1, as duas bases são escuras (charcoal/royal 2.5:1). O texto vai em **branco** sobre ambas e o tangerine é o único ponto quente.

## Variáveis no carrossel
```css
:root {
  --bg: <base 1>;   --bg-alt: <base 2>;
  --ink: <texto sobre bg>;   --ink-alt: <texto sobre bg-alt>;
  --accent: <pop>;  --accent-ink: <texto em cima do pop>;
}
```
O kit já usa `--accent` só em `.hl`, `.pill`, `.slide.accent` e nos elementos que tu decidires. Mantém-no raro.

## Criar paletas novas com o mesmo padrão
1. Escolhe uma **base escura** e uma **base clara ou média** do mesmo universo (frio com frio, quente com quente).
2. Escolhe o **pop no lado oposto da roda cromática** ou bem mais saturado do que as bases.
3. Mede: base vs. base ≥ 4.5:1 (se o texto vai numa sobre a outra), pop vs. base escura ≥ 3:1.
4. Dá-lhe um nome evocativo (ajuda a escolher pelo tom) e acrescenta-a a esta tabela.

Evita paletas que caiam nos looks template de `apple-design.md` › 4 sem razão no tema (ex.: creme + terracota, quase-preto + verde-ácido). Se o utilizador pedir uma delas, é escolha dele: usa-a.
