# Design com critério: princípios Apple aplicados a carrosséis

Adaptação da skill `apple-design` (Human Interface Guidelines, princípios de junho de 2026) a um meio
que não é uma app: 1080×1350 px vistos no feed de um telemóvel. As citações vêm de
`design-principles.md`, `typography.md`, `color.md`, `branding.md` e `writing.md` da HIG.
Quando uma regra é adaptação nossa e não da Apple, diz "(critério)".

## 1. Conversão de medidas: px do slide → pt no ecrã

Um slide de 1080px aparece no feed com ~390pt de largura num iPhone, ou seja **1pt ≈ 2,77px**.

| Referência HIG (mobile) | pt | px no slide |
|---|---|---|
| Texto mínimo | 11 pt | **≥ 31 px** |
| Texto por defeito (body) | 17 pt | **≈ 47 px** |
| "Texto grande" para contraste (≥ 18 pt) | 18 pt | **≥ 50 px** |

Consequências para o kit:
- Metadados (cabeçalho, rodapé, legendas pequenas): **≥ 31px**, nunca menos.
- Texto de apoio: **≥ 44px** (alvo 47px).
- A exceção é o texto "para guardar" (cartão com prompt, receita), que pode descer até 31px, porque a pessoa vai ampliá-lo ou guardá-lo. Assinala a exceção ao utilizador.
- *"In general, avoid light font weights"* (`typography.md › Best practices`): nada de pesos Thin/Light abaixo de 50px.

## 2. Contraste (crítico)

`color.md` e `accessibility.md`: texto até 17pt precisa de **4.5:1**, texto ≥ 18pt ou bold precisa de **3:1**.
Em px do slide, texto < 50px pede 4.5:1 e texto ≥ 50px ou bold pede 3:1.

- Calcula com valores hex reais: `node scripts/contrast.mjs "#FFFFFF" "#3B5BFF"`.
- Texto sobre foto: o contraste mede-se contra a zona mais clara da foto atrás do texto. Usa `.scrim` até passar.
- *"Nothing is conveyed by color alone"*: ✓/✗ levam sempre ícone ou palavra, não só verde/vermelho (o kit já o faz nas `.pill`).

## 3. Os 8 princípios como filtro do carrossel

| Princípio | Pergunta para o carrossel |
|---|---|
| **Purpose**: "Make something meaningful" | Qual é a **uma** coisa que a pessoa leva deste carrossel? Se não cabe numa frase, o tema está largo demais. |
| **Agency**: "Let people do things their own way" | Dá para perceber a ideia só pela capa + último slide? Quem salta slides não se perde? |
| **Responsibility**: "Act in people's best interest" | Métricas, resultados e promessas são verdadeiros? A recompensa do CTA existe mesmo? (critério: não inventar prova social) |
| **Familiarity**: "Build on what people know" | Os padrões repetem-se? (*"Once you establish a behavior or appearance for an element, apply it throughout your design."*) |
| **Flexibility**: "Adapt to diverse contexts" | Lê-se num ecrã pequeno, com brilho baixo, em modo escuro do Instagram, e por quem é daltónico? |
| **Simplicity**: "Be clear and direct" | *"Every element earning its place."* Cada slide tem só o necessário? |
| **Craft**: "Care about every detail" | Alinhamentos, espaçamentos, quebras de linha e ortografia estão perfeitos em todos os slides? |
| **Delight**: "Make it human" | Que emoção deve provocar (energia, calma, desejo, urgência)? *"Don't mistake delight for decoration."* |

## 4. Sistema visual: planear antes de desenhar

Antes do HTML, define e escreve no roteiro:

- **Cor**: 3–5 hex com papel (superfície escura, superfície clara, texto, acento, sinal) e o contraste de cada par texto/fundo.
- **Tipo**: 1 fonte de display usada com contenção + 1 fonte de texto (+1 para números, se precisar), com a escala em px.
- **Layout**: 1 frase + um wireframe ASCII do slide-tipo.
- **Assinatura**: **o único elemento** pelo qual o carrossel vai ser lembrado, e porque pertence a este tema.

### Criticar o plano (obrigatório)
Pergunta: *"Teria feito este mesmo plano para um tema diferente?"* Se sim, é um default e não uma escolha. Revê-o e diz ao utilizador o que mudou.

Os três looks "template" que dominam o que é gerado hoje, a evitar se não houver razão no tema:
1. creme quente + serif de alto contraste + acento terracota;
2. quase-preto + um único acento verde-ácido ou vermelhão;
3. "jornal": filetes finos, raio zero, colunas densas.

Também conta como default: número gigante sobre etiqueta pequena com gradiente, e marcadores 01/02/03 em conteúdo que não é sequência.
(No rodapé BACK 01…NN, a numeração é legítima porque o carrossel *é* uma sequência.)

## 5. Contenção de marca

`branding.md › Best practices`:
- *"Apply your app's accent color judiciously"*: o acento só aparece em 1–2 sítios por slide (palavra-chave, CTA, pílula ativa).
- *"Ensure branding always defers to content"*: o logótipo não aparece em todos os slides. O @handle no cabeçalho chega, e o logo vai para a capa ou para o CTA.
- *"Consider using a custom font... for headlines... while using system fonts for body copy"*: fonte de personalidade nos títulos e fonte neutra e legível no texto.
- *"Minimize the number of typefaces"* (`typography.md`): **uma** fonte de texto em todo o carrossel. As fontes display podem variar (até 3 no arquétipo E), porque são a assinatura e não a leitura. Isto concilia a variedade pedida pelo utilizador com a hierarquia da HIG.

## 6. Escrita

`writing.md`:
- *"Be clear... If you can use fewer words, do so."* Lê cada slide em voz alta e corta.
- *"If you're trying to convey more than one idea, consider breaking up the text onto multiple screens"*: um conceito por slide.
- *"Be action oriented"*: o CTA usa um verbo concreto ("Comenta GUIA", "Guarda"), não "Bora lá!".
- *"Adopt capitalization rules... then apply them consistently"*: escolhe uma regra de maiúsculas por tipo de elemento (títulos, pílulas, rodapé) e mantém-na.
- *"Avoid using we"* e possessivos desnecessários ("Favoritos" em vez de "Os teus favoritos").

## 7. Revisão final: 5 lentes por ordem

Faz esta revisão sobre os PNG renderizados e reporta apenas o que encontrar.

1. **Acessibilidade (Crítico)**: tamanhos mínimos (secção 1), contraste com números (secção 2), sem cor sozinha a transmitir significado, nada de pesos finos pequenos.
2. **Convenções do formato (Alto)**: 4:5, margens seguras, continuidade 1→2 presente e sem degraus, sem BACK/NEXT repetido, capa legível em miniatura, último slide com um só CTA.
3. **Ofício visual (Alto/Médio)**: hierarquia clara (peso + tamanho), 1 cor = 1 significado, alinhamentos, **ponto de vista** (diz qual é a assinatura), não parecer template, **ousadia gasta num só sítio**.
4. **Fluxo (Médio)**: cada slide merece o seguinte; a progressão faz sentido para quem salta slides.
5. **Texto (Médio)**: concisão, verbos, maiúsculas consistentes, sem jargão.

Termina sempre com **"Remove um acessório"**: aponta um elemento que pode sair sem perda e tira-o. Se não houver nenhum, diz que o design já está enxuto.

Formato do relatório ao utilizador (curto):
```
Revisão de design: Bom
Assinatura: <elemento>
Corrigido: <lista curta, com números quando houver, ex.: "rodapé 22px → 31px; texto #9A9A9A → #D0D0D0 (3.1:1 → 9.8:1)">
Removido: <acessório> | nada a remover
```
