# Continuidade entre slides

**Regra do utilizador:** o slide 2 deve continuar a conter informação do slide 1, como um objeto, uma forma ou parte de um título. Assim o olhar da pessoa é apanhado e ela desliza para "completar" o que viu.
No feed, o Instagram mostra a capa. Quando a pessoa desliza, a primeira coisa que vê é a **margem esquerda do slide 2**. Essa margem tem de continuar a capa.

Todos os carrosséis levam **pelo menos a ligação 1→2** e, de preferência, mais 1–2 ligações a meio.
(Exceção: o arquétipo D, quando os itens são independentes.)

## Técnicas (das mais simples às mais fortes)

### 1. Fundo contínuo
Um único fundo desenhado para a largura total (N × 1080px) e cortado pelos slides. Ex.: manchas orgânicas rosa e azul em que cada divisão corta uma mancha a meio.
- Implementação: `<div class="backdrop">` com um SVG ou gradientes, e slides `class="slide clear"`.
- As formas devem **atravessar** as divisões. Uma forma inteira dentro de um slide não liga nada.
- Varia a composição: a mancha grande que no slide 1 está à direita continua à esquerda do slide 2.
- Os blocos de texto ficam dentro de um slide, sem atravessar a divisão.

### 2. Objeto na divisão
Um produto, uma foto recortada, uma seta ou uma linha posicionados **em cima da junção**: metade num slide e metade no outro.
- Implementação: `.span` com `left` = junção − metade da largura (junção k→k+1 = `k*1080px`).
- Bons objetos: produto em PNG, mão/braço, caneta, avião, linha de gráfico, fita, carimbo.
- O objeto não pode ter texto ou caras sobre a linha de corte.

### 3. Título partido
Uma palavra gigante que começa no slide 1 e acaba no 2 ("DETA|LHE", "CONTI|NUA").
- Implementação: `.span` com o texto (`white-space:nowrap`) e `left` a começar dentro do slide 1.
- Corta entre sílabas ou letras largas, nunca a meio de uma letra fina.
- No slide 2, a parte que continua deve ser ≥ 25% da palavra, para se perceber que é continuação.

### 4. Panorama emoldurado
Uma foto larga, com moldura e fundo neutro, que atravessa 2 slides (estilo hotel/arquitetura). Ver arquétipo C.

### 5. Linha condutora
Uma linha, um caminho ou uma fita que percorre **todos** os slides, ligando os pontos de conteúdo (como uma timeline). Implementa-se com um SVG `path` dentro do `.backdrop`.

### 6. Corte de cena
Uma foto em full-bleed cuja continuação está no slide seguinte (outra parte da mesma cena). É útil no arquétipo E: a pessoa olha para a direita e o slide seguinte mostra o que ela vê.

## Verificação
- Renderiza e vê os **pares** 1|2, 2|3… lado a lado: a junção tem de encaixar sem degraus (mesma altura, cor e escala).
- Vê também cada slide isolado: tem de fazer sentido sozinho, porque o slide 2 também aparece no feed a quem já viu a capa.
- A continuidade não pode tapar texto, porque a legibilidade vem primeiro.
