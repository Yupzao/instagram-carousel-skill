# Fontes: biblioteca de pares (Google Fonts)

**Regra do utilizador:** as mesmas fontes saturam rapidamente. Cada carrossel usa um par **diferente do último**.
Antes de escolher, lê `historico-fontes.md` (se existir). Depois de entregar, acrescenta-lhe uma linha:
`AAAA-MM-DD · tema · display + texto · paleta`.

Escolhe pelo **tom do tema**, não por hábito. Na dúvida entre dois, fica com o menos usado no histórico.

## Pares por tom

| # | Tom | Display (títulos) | Texto | Nota |
|---|---|---|---|---|
| 1 | Editorial elegante | **Bodoni Moda** 700–900 | DM Sans 500 | Alto contraste, ótimo em maiúsculas |
| 2 | Cinematográfico/dramático | **Playfair Display** 800 itálico | Manrope 500 | Títulos de uma palavra |
| 3 | Clássico de luxo | **Cinzel** 700 | Lato 400/700 | Só maiúsculas; letterspacing +0.04em |
| 4 | Romântico/assinatura | **Pinyon Script** ou **Great Vibes** | Jost 500 | Só 1–3 palavras; nunca em texto corrido |
| 5 | Moderno geométrico | **Syne** 800 | Space Grotesk 500 | Tecnologia, criativos |
| 6 | Grotesco com carácter | **Bricolage Grotesque** 800 | Bricolage Grotesque 500 | Uma família só, com muitos pesos |
| 7 | Impacto/desporto | **Anton** ou **Bebas Neue** | Barlow 600 | Condensadas, nomes longos |
| 8 | Brutal/streetwear | **Archivo Black** | Archivo 500 | Maiúsculas apertadas |
| 9 | Suave/beleza/lifestyle | **DM Serif Display** | Outfit 400/600 | Pastéis, produtos |
| 10 | Divertido/arredondado | **Fredoka** 700 ou **Baloo 2** 800 | Nunito 600 | Infantil, comida, verão |
| 11 | Retro anos 70 | **Shrikhand** ou **Righteous** | Work Sans 500 | Cores quentes |
| 12 | Literário/calmo | **Cormorant Garamond** 600 itálico | Manrope 400 | Hotelaria, bem-estar |
| 13 | Técnico/dados | **JetBrains Mono** 800 | IBM Plex Sans 500 | Números e código |
| 14 | Contemporâneo sério | **Fraunces** 800 (opsz alto) | Inter Tight 500 | Finanças, consultoria |
| 15 | Contorno/outline | **Unbounded** 800 com `-webkit-text-stroke` | Plus Jakarta Sans 500 | Palavras de fundo gigantes |
| 16 | Old-school/cartaz | **Abril Fatface** | Karla 500 | Promoções, eventos |

## Combinações expressivas (arquétipo E)
No estilo cinematográfico, a **fonte display pode variar de slide para slide**, como no exemplo "Carrosséis / Detalhe / Comunicou / Shhh… / O Silêncio": cada palavra-chave ganha uma fonte que a interpreta.
Regras para não virar caos:
- máximo **3 fontes display** no carrossel, todas do mesmo universo (ex.: Bodoni Moda + Playfair itálico + Pinyon Script);
- **uma única fonte de texto** em todos os slides;
- a mesma cor, o mesmo tamanho-base e o mesmo alinhamento do texto de apoio em todos os slides;
- a fonte acompanha o significado: "Shhh…" em script, "DETALHE" em serifa de alto contraste, "É POR ISSO" em condensada.

## Técnicas tipográficas que dão vida
- **Duas camadas**: palavra pequena em script/itálico sobre palavra gigante em serifa/black.
- **Contorno**: palavra de fundo gigante só com contorno (`.outline`), atrás do sujeito.
- **Sujeito à frente do título**: recorte PNG por cima do título (`.cutout`).
- **Título partido na divisão** entre slides (ver `continuidade.md`).
- **Mistura de pesos** na mesma linha ("Design **que comunica**").

## Carregar fontes
Um único `<link>` do Google Fonts com as famílias e os pesos usados, por exemplo:
```html
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,700;0,900;1,700&family=Pinyon+Script&family=DM+Sans:wght@500;700&display=swap" rel="stylesheet">
```
Depois define `--f-display`, `--f-serif`, `--f-script`, `--f-body` no `:root` do carrossel.
Confirma no PNG que a fonte carregou: se aparecer Arial/Times, o nome da família está mal escrito.
