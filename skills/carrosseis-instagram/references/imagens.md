# Imagens: de onde vêm

**O Claude não gera imagens.** Para carrosséis com fotos (arquétipos B, C, E), segue esta ordem:

1. **Fotos do utilizador**: pede os caminhos/ficheiros. É sempre a melhor opção para marca pessoal.
2. **Bancos de imagens com licença livre** (uso comercial permitido, sem atribuição obrigatória):
   - Unsplash (unsplash.com): licença Unsplash
   - Pexels (pexels.com): licença Pexels
   - Pixabay (pixabay.com): licença de conteúdo Pixabay

   Procura com termos concretos (ex.: "man flat cap leather armchair dark", "vintage office moody").
   **Antes de descarregar, mostra ao utilizador as escolhas (link + descrição) e pede autorização.** Guarda os ficheiros numa pasta `fotos/` do output e lista os créditos na nota final (atribuição não é obrigatória, mas é boa prática).
3. **Prompts para IA**: se nada servir, escreve prompts prontos para o utilizador gerar as imagens numa ferramenta à escolha (Midjourney, Firefly, etc.). Inclui o enquadramento 4:5, a luz, a paleta e o espaço livre para o título. Exemplo:
   > *Cinematic portrait of a man in a 1920s three-piece tweed suit and flat cap sitting in a worn leather armchair, dim warm tungsten light, dark wood library background, film grain, shallow depth of field, muted teal and amber grade, negative space above the head for a large title, vertical 4:5*
4. **Sem imagens**: design tipográfico e gráfico (formas SVG, gradientes, padrões), com `.ph` assinalados onde entraria uma foto.

## Nunca
- Usar imagens de portefólios de outros designers (Behance, Dribbble, Instagram) como fundo ou recurso: têm direitos de autor. Servem **só como referência** de estilo.
- Usar fotos de pessoas reais identificáveis tiradas de redes sociais.
- Apresentar placeholders como se fossem o resultado final.

## Unir fotos de fontes diferentes
Fotos de stock raramente combinam entre si. Aplica sempre a mesma camada em todos os slides:
- `.grade`: gradação de cor (variável `--grade`, ex.: âmbar/teal), em `mix-blend-mode: soft-light`;
- `.vignette`: escurece as bordas e foca o centro;
- `.texture`: grão de filme;
- recorte de enquadramento consistente (`background-position`) para o sujeito ficar sempre no mesmo terço.
