# ESCOPO_MVP.md

# Escopo do MVP — Simulador de Manobras do Pátio Brisamar

## 1. Visão do produto

O projeto tem como objetivo criar um simulador visual e interativo para planejamento livre de manobras ferroviárias no Pátio Brisamar.

A ferramenta digitaliza a prática já realizada em quadro físico: o praticante recebe a passagem de serviço, reproduz o estado atual do pátio e testa livremente a estratégia de manobra antes de ir ao campo.

> **Simulador de planejamento de manobras — não substitui procedimentos operacionais vigentes.**

## 2. Filosofia do MVP

Fluxo principal:

```text
Abrir programa
→ pátio vazio
→ preencher passagem de serviço
→ iniciar simulação
→ realizar manobras livremente
→ fechar programa
→ todo estado é descartado
```

O sistema não deve indicar a melhor solução, sugerir rotas, avaliar desempenho ou validar automaticamente a formação final.

## 3. Plataforma

- uso em computador;
- funcionamento preferencialmente offline;
- sem login;
- sem matrícula;
- sem banco de dados;
- sem backend;
- sem cloud;
- sem persistência;
- interação por mouse;
- zoom com roda do mouse;
- pan do cenário.

## 4. Modos da aplicação

### 4.1 Preparação

Permite reproduzir a passagem de serviço:

- adicionar locomotivas;
- adicionar vagões/blocos;
- definir quantidade;
- definir identificação livre;
- escolher cor;
- definir orientação da locomotiva;
- resetar uma linha;
- preencher anotação opcional da estação.

Os elementos são preenchidos da esquerda para a direita.

### 4.2 Simulação

Inicia após o botão **Iniciar Simulação**.

A partir desse momento:

- não é permitido resetar linha;
- não é permitido editar artificialmente o cenário;
- alterações acontecem somente por manobra;
- não existe Undo;
- erro de estratégia é corrigido através de nova manobra.

## 5. Vagões

O cadastro de vagões possui:

- quantidade;
- identificação em texto livre;
- cor escolhida pelo praticante.

Exemplos de identificação:

- FVR;
- EPI;
- bobina;
- placa;
- contêiner;
- tubo;
- perfil;
- qualquer outro texto usado na passagem de serviço.

O sistema não interpreta semanticamente essas identificações.

### 5.1 Blocos

Vagões consecutivos podem ser representados como blocos.

O tamanho visual do bloco deve ser proporcional à quantidade.

Um único vagão precisa ser visível.

Blocos com a mesma identificação não são unidos automaticamente.

Exemplo:

```text
[5 FVR] [5 FVR]
```

continua representando dois grupos distintos.

### 5.2 Tooltip

Ao passar o mouse sobre um bloco, exibir pelo menos:

- quantidade;
- identificação.

## 6. Locomotivas

Cada locomotiva possui:

- identificação numérica, normalmente quatro dígitos;
- orientação `frente barra` ou `ré barra`.

A orientação representa a posição física e não limita o sentido de movimento.

A locomotiva pode:

- puxar;
- empurrar/recuar;
- trabalhar sozinha;
- trabalhar em dupla;
- trabalhar em trio;
- trabalhar em quadra;
- permanecer no meio de uma composição.

## 7. Engate

Todo vagão e locomotiva possui engate nas duas extremidades.

O contato entre materiais não gera engate automático.

Quando dois materiais encostam:

1. o movimento para;
2. eles continuam separados;
3. o praticante decide se deseja engatar.

## 8. Corte

É permitido cortar em qualquer engate:

- vagão ↔ vagão;
- locomotiva ↔ vagão;
- vagão ↔ locomotiva;
- locomotiva ↔ locomotiva.

Também é permitido cortar dentro de um bloco.

Exemplo:

```text
[15 FVR] → [12 FVR] [3 FVR]
```

## 9. Movimento

A movimentação será feita por clique e arraste do mouse.

O movimento será:

- contínuo;
- animado;
- preso à geometria dos trilhos;
- sem controle de velocidade.

Vagões nunca podem se movimentar sem pelo menos uma locomotiva engatada à composição.

## 10. Múltiplas composições

Duas ou mais composições podem permanecer na mesma linha.

Não existe conceito global de linha ocupada.

Entretanto, materiais não podem:

- se sobrepor;
- atravessar uns aos outros;
- empurrar outra composição sem engate.

## 11. AMVs

O projeto utiliza AMV-01 a AMV-12.

Todos possuem exatamente duas posições.

A alteração da posição é instantânea.

A posição atual precisa ser visualmente identificável.

Se qualquer locomotiva ou vagão estiver sobre a região do AMV:

- o AMV fica bloqueado;
- deve ser exibido um cadeado;
- não pode ser manipulado até ficar completamente livre.

## 12. Chave contra

A condição de chave contra depende de:

- sentido da composição;
- lado pelo qual ela chega;
- posição atual do AMV.

Se a passagem naquela configuração quebraria a chave na situação física real, o movimento deve ser bloqueado.

Se a chave apenas estiver direcionada para outro caminho válido, o movimento não deve ser bloqueado: a composição segue pelo caminho real definido pelo AMV.

## 13. Intervalo da estação

Toda simulação começa **sem intervalo**.

Existem os controles:

- **Solicitar intervalo para a estação**
- **Entregar intervalo para a estação**

### 13.1 Sem intervalo

- AMV-06, AMV-07 e AMV-08 não podem ser manipulados;
- AMV-09 pode permitir circulação L22 ↔ L22;
- AMV-09 não pode ser alterado para L22 ↔ L20;
- materiais podem permanecer estacionados em L16/L18/L20;
- materiais nessas áreas não podem ser movimentados;
- placas PARE não podem ser ultrapassadas.

### 13.2 Com intervalo

- AMV-06, 07 e 08 podem ser manipulados, se desocupados;
- AMV-09 pode ser direcionado para L20;
- movimentações nas áreas protegidas são liberadas;
- placas PARE podem ser ultrapassadas.

### 13.3 Entrega do intervalo

- AMV-09 precisa estar desocupado;
- se ocupado, a entrega é bloqueada;
- AMV-09 deve terminar em L22 ↔ L22;
- materiais podem permanecer estacionados nas linhas protegidas;
- esses materiais voltam a ficar imobilizados até novo intervalo.

## 14. Placas PARE

Sem intervalo, representam limite de circulação.

Com intervalo concedido, podem ser ultrapassadas.

## 15. Marcos

Os marcos:

- não impedem circulação;
- delimitam referências de capacidade;
- podem ser atravessados por locomotivas e vagões.

A capacidade é sempre entendida de **marco a marco**.

## 16. Capacidade dos trechos

As capacidades são referências, nunca bloqueios rígidos.

Exemplo:

```text
59 / 55 ⚠
```

É permitido cadastrar e movimentar quantidade superior à referência, pois vagões possuem comprimentos físicos diferentes.

O programa deve apenas apresentar alerta visual.

## 17. Referências de capacidade conhecidas

### Superior
- L30: 28–30 vagões
- L28: 4
- L26: 4
- L24: 18
- L22: 22
- L20: 30
- L18: 25
- L16: 20

### Travessão
- L24: 11–12
- L22: 11–12

### Inferior
- L24: 55
- L22: 55

## 18. Anotação da estação

O sistema pode oferecer um campo opcional de texto livre.

Exemplo:

```text
KSV — 10 FVR + 5 bobinas + 8 contêineres
```

Essa anotação:

- é opcional;
- não é interpretada;
- não é validada;
- não influencia o motor.

## 19. Resultado da manobra

O MVP não terá:

- validação automática do trem formado;
- pontuação;
- ranking;
- contagem de erros;
- histórico;
- eficiência;
- sugestão de melhor manobra.

O simulador funciona como um **“Tetris ferroviário livre”**.

## 20. Persistência

Nenhum estado é salvo.

Ao fechar ou recarregar:

- locomotivas são removidas;
- vagões são removidos;
- composições são removidas;
- intervalo volta ao padrão;
- pátio volta a ficar vazio.

## 21. Fidelidade visual

A interface deve manter aparência próxima ao quadro real do Pátio Brisamar.

É permitido ajustar:

- espaçamento;
- comprimento gráfico;
- distância entre linhas;
- tamanho de AMVs;
- dimensões clicáveis;
- proporções.

A topologia ferroviária real deve ser preservada.

## 22. Fora do escopo do MVP

- login;
- usuários;
- banco;
- API;
- cloud;
- salvamento;
- recuperação;
- histórico;
- multiplayer;
- tablet;
- celular;
- touch;
- avaliação;
- algoritmo de rota ótima;
- cadastro prévio de trens;
- cadastro rígido de cargas;
- tamanhos individuais de modelos de vagão;
- controle de velocidade;
- Undo.

## 23. Restrições tecnológicas

O projeto deve utilizar ferramentas gratuitas/open source sempre que possível e não depender de serviços com cobrança recorrente para sua operação.

## 24. GitHub e desenvolvimento

O projeto será versionado no GitHub e usado também como portfólio.

A documentação deve permanecer como fonte de verdade para ChatGPT, Codex e futuros agentes.

## 25. Definição resumida do MVP

> Aplicação offline e sem persistência que permite ao praticante reproduzir o estado atual do Pátio Brisamar e manipular locomotivas, vagões e AMVs livremente, respeitando as regras físicas e operacionais essenciais definidas no projeto, como auxílio visual ao planejamento de manobras, sem substituir procedimentos operacionais vigentes.
