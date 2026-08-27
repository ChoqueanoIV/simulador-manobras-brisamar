# PROMPT DE CONTEXTO — SIMULADOR BRISAMAR
## Cole este texto como primeira mensagem em uma nova sessão do ChatGPT

---

Você vai me ajudar a continuar o desenvolvimento de um projeto TypeScript/React/Vite.

**Importante — como vamos trabalhar juntos:**
- Você **não tem acesso ao meu computador**.
- Para cada passo, você vai **gerar o código completo** e eu vou **copiar e colar** nos arquivos.
- Depois de colar, eu vou **rodar os comandos no terminal** e **colar o resultado de volta** aqui para você validar.
- Só avançamos para o próximo passo depois que o resultado do terminal estiver ok.
- **Um arquivo por vez.** Nunca gere dois arquivos ao mesmo tempo.
- Sempre que gerar código para um arquivo existente, mostre o arquivo **inteiro** — nunca parcial com `// ...resto do código`.
- Se der erro no terminal, eu colo o erro aqui e você corrige antes de avançar.

Leia todo o contexto abaixo antes de qualquer resposta. Não pule nenhuma seção.

---

## 1. O QUE É O PROJETO

Simulador visual offline de planejamento de manobras ferroviárias para o Pátio Brisamar.

O praticante abre o programa, reproduz a passagem de serviço (quais vagões e locomotivas estão em quais linhas), inicia a simulação e move composições livremente, respeitando regras físicas e operacionais reais do pátio.

**Princípio fundamental:** o simulador não sugere manobras, não avalia desempenho, não calcula rota ótima. Ele apenas impede ações fisicamente impossíveis.

**Restrições absolutas do produto:**
- Offline, sem backend, sem banco, sem login, sem persistência
- Funciona só no computador (mouse)
- Não tem Undo

---

## 2. STACK TECNOLÓGICA

- **React 18 + TypeScript + Vite**
- **Zustand** para estado global
- **Vitest** para testes
- **SVG nativo** para o canvas do pátio
- Sem bibliotecas de drag-and-drop, sem canvas 2D, sem WebGL

**Comandos que rodarei no terminal** (sempre na pasta `app/`):
```
npm run lint    → ESLint
npm run test    → Vitest
npm run build   → Vite build
```

Atualmente: **92 testes passando, lint ok, build ok.**

---

## 3. ESTRUTURA DO PROJETO

```
app/src/
  components/
  preparation/
    types/preparation.ts
    data/yardSections.ts
    domain/preparationRules.ts
    components/PreparationPanel.tsx
  rolling-stock/
    types/rollingStock.ts
  simulation/
    domain/
      composition/
        composition.ts           ← Composition, couple, splitAt, hasLocomotive, createComposition
        composition.test.ts      ← 21 testes
      navigation/
        navigationEngine.ts      ← isSwitchAgainst, resolveNextSegment
        navigationEngine.test.ts ← 21 testes
      switches/
        switchRules.ts           ← toggleSwitch, canReturnInterval, normalizeSwitchesOnIntervalReturn
        switchRules.test.ts      ← 14 testes
  state/
    simulationStore.ts           ← Zustand store principal
    simulationStore.test.ts      ← 7 testes
  types/
    switch.ts
  yard/
    data/
      brisamarTopology.ts        ← TrackNode, TrackSegment, brisamarNodes, brisamarSegments
      brisamarTopologyGraph.ts   ← getSegmentsAtNode, getActiveSwitchConnection, getExitNode
      brisamarTopologyGraph.test.ts ← 18 testes
      brisamarSwitches.ts        ← brisamarSwitchDefinitions (AMV-01 a AMV-12), initialSwitchStates
    components/
      YardCanvas.tsx
  App.tsx / App.css / main.tsx
```

---

## 4. TIPOS PRINCIPAIS JÁ EXISTENTES

Estes tipos **já existem no projeto** — não recrie, apenas use:

```ts
// rolling-stock/types/rollingStock.ts
type LocomotiveOrientation = 'front-barra' | 'rear-barra';

type Locomotive = {
  id: string;
  kind: 'locomotive';
  number: string;
  orientation: LocomotiveOrientation;
};

type WagonUnit = {
  id: string;
  kind: 'wagon-unit';
  label: string;
  color: string;
  sourceBlockId: string;
};

type WagonBlock = {
  id: string;
  kind: 'wagon-block';
  quantity: number;
  label: string;
  color: string;
};

type CompositionUnit = Locomotive | WagonUnit;

// simulation/domain/composition/composition.ts
type Composition = {
  id: string;
  units: CompositionUnit[];
};

// yard/data/brisamarTopology.ts
type TrackNode = { id: string };

type TrackSegment = {
  id: string;
  line: string;
  startNodeId: string;
  endNodeId: string;
  protectedByInterval: boolean;
  technical: boolean;
};

// types/switch.ts
type SwitchPosition = 'A' | 'B';
type SwitchId = 'AMV-01' | 'AMV-02' | 'AMV-03' | 'AMV-04' | 'AMV-05' |
                'AMV-06' | 'AMV-07' | 'AMV-08' | 'AMV-09' | 'AMV-10' |
                'AMV-11' | 'AMV-12';

type SwitchState = {
  id: SwitchId;
  position: SwitchPosition;
  occupied: boolean;
};

type IntervalState = 'not-granted' | 'granted';

type SwitchDefinition = {
  id: SwitchId;
  positionA: string;
  positionB: string;
  intervalRule: 'none' | 'full-lock' | 'restricted-position';
  allowedWithoutInterval?: SwitchPosition;
  nodeCommon: string;
  nodeA: string;
  nodeB: string;
};
```

---

## 5. TOPOLOGIA DO GRAFO — CONCEITO CRÍTICO

O pátio é modelado como um grafo:
- **Nó** = ponto físico de conexão entre segmentos (ex: `N-L22-TERM-ESQ`, `N-AMV05-C`)
- **Segmento** = trecho navegável entre dois nós (ex: `SEG-L22-SUP`)
- **AMV** = **conexão** entre três nós: `nodeCommon` (ponta única), `nodeA`, `nodeB`

**REGRA FUNDAMENTAL: AMV NÃO É UM SEGMENTO.**

Quando a composição chega a um nó que pertence a um AMV, ela **atravessa o AMV**
até o `throughNodeId`, e só depois busca o segmento seguinte naquele nó.

Exemplo de segmentos reais (usados nos testes):
```
SEG-L22-SUP:    startNodeId='N-L22-TERM-ESQ',  endNodeId='N-AMV05-C'
SEG-L22-05-09:  startNodeId='N-AMV05-A',        endNodeId='N-AMV09-C'
SEG-L30:        startNodeId='N-L30-TERM',        endNodeId='N-AMV03-B'
SEG-L16:        startNodeId='N-L16-TERM-ESQ',   endNodeId='N-AMV06-B',  protectedByInterval=true
```

Linhas do pátio: L16, L18, L20 (áreas protegidas — requerem intervalo), L22, L24, L26, L28, L30.

AMVs com regra de intervalo especial:
- AMV-06, 07, 08: `intervalRule: 'full-lock'` — bloqueados para manipulação sem intervalo
- AMV-09: `intervalRule: 'restricted-position'`, `allowedWithoutInterval: 'A'`
  → posição A (L22↔L22) é permitida sem intervalo; posição B (L22↔L20) só com intervalo

---

## 6. MOTOR DE NAVEGAÇÃO JÁ IMPLEMENTADO

Arquivo: `app/src/simulation/domain/navigation/navigationEngine.ts`

Já existe e está testado — **não recrie, não modifique**:

```ts
// Determina se um AMV está contra para composição chegando por entryNodeId
export function isSwitchAgainst(
  switchDef: SwitchDefinition,
  position: SwitchPosition,
  entryNodeId: string,
): boolean

// Tipos de resultado
export type NavigationBlockReason =
  | 'terminal'          // extremidade de linha
  | 'switch-against'    // chave contra
  | 'interval-required' // área protegida sem intervalo
  | 'stop-board';       // placa PARE (reservado)

export type NavigationResult =
  | { ok: true; segment: TrackSegment }
  | { ok: false; reason: NavigationBlockReason };

// Resolve o próximo segmento ou o motivo do bloqueio
export function resolveNextSegment(
  currentSegmentId: string,
  exitNodeId: string,
  segments: TrackSegment[],
  switchDefs: Record<string, SwitchDefinition>,
  switchStates: SwitchState[],
  interval: IntervalState,
): NavigationResult
```

---

## 7. REGRAS FERROVIÁRIAS CRÍTICAS

Estas regras vêm da documentação do domínio — **nunca inventar**:

**Vagões:**
- Nunca se movem sem locomotiva engatada na composição
- Identificação é texto livre
- Blocos iguais não se fundem automaticamente

**Engate:**
- Contato não engata automaticamente
- Qualquer engate pode ser cortado
- Locomotivas e vagões têm engate nos dois lados

**AMV:**
- Ocupado = não pode ser manipulado (qualquer material sobre ele)
- Chave contra bloqueia movimento
- Chave direcionada para outro caminho não bloqueia — a composição segue o caminho real

**Intervalo:**
- Simulação começa SEM intervalo
- AMV-06, 07, 08 bloqueados para manipulação sem intervalo
- AMV-09 só pode ir para posição B (L20) com intervalo
- Ao devolver intervalo: AMV-09 deve estar livre e voltar para L22↔L22
- Materiais podem ficar em L16/L18/L20 após entrega, mas não podem ser movimentados

**Placa PARE:**
- Sem intervalo: não pode ser ultrapassada
- Com intervalo: pode ser ultrapassada

**Colisão:**
- Duas composições podem estar na mesma linha
- Não podem se sobrepor nem atravessar uma à outra

---

## 8. ERROS JÁ COMETIDOS — NÃO REPETIR

- Buscar candidatos diretamente no `exitNodeId` sem atravessar o AMV → sempre falha. Correto: computar `throughNodeId` primeiro.
- `WagonUnit` sem campo `kind` → quebra union discriminada TypeScript
- `Record<SwitchId, ...>` em testes com objeto vazio `{}` → usar `Record<string, SwitchDefinition>` nos testes
- Emoji para locomotiva → descartado
- Consolidar blocos iguais automaticamente → proibido
- L22 e L24 como regiões únicas → já divididas, não reverter
- Mutação de variável durante render React → proibida
- Lógica de domínio dentro de componente React → proibida
- Criar versões paralelas de arquivos (`v2`, `novo`, `backup`) → proibido

---

## 9. HISTÓRICO — O QUE FOI ENTREGUE

| Commit | O que entregou |
|---|---|
| `1e69823` | Motor de navegação: `isSwitchAgainst` + `resolveNextSegment` — 21 testes |
| `ecc2304` | Composição: `couple`, `splitAt`, `hasLocomotive` — 21 testes + Topologia do grafo — 18 testes |
| `d86b5bb` | Modo preparação finalizado: anotação, Iniciar Simulação, feedback de modo — 7 testes |
| `6571523` | SVG do pátio, rolling stock visual, capacity badges |
| `30dfaa4` | Fundação do modo preparação |

**Total atual: 92 testes passando em 6 suítes.**

---

## 10. PRÓXIMA ETAPA — TASK-009: Posição da Composição no Grafo

### Por que esta etapa?

`resolveNextSegment` já existe e sabe calcular o próximo segmento.
Mas para chamá-lo com dados reais, preciso saber:
- em qual segmento a composição está;
- para qual nó a frente está apontando.

Isso é `CompositionPosition`. Sem ela, o motor de movimento não tem entrada.

### Esta etapa é domínio puro — zero React, zero SVG, zero UI.

### Tipo a criar

```ts
// Arquivo: app/src/simulation/domain/position/compositionPosition.ts

type CompositionPosition = {
  segmentId: string;
  headNodeId: string;  // nó para onde a frente aponta (saída)
  tailNodeId: string;  // nó oposto (onde está a cauda)
};
// Invariante: headNodeId e tailNodeId são sempre as duas extremidades de segmentId.
```

### Funções a criar

#### `createPosition(segment, headNodeId): CompositionPosition`
- Recebe o segmento e qual nó é a frente
- `tailNodeId` é inferido: o nó oposto ao `headNodeId` no segmento
- Se `headNodeId` não for `startNodeId` nem `endNodeId` → lança `Error`

#### `flipDirection(position): CompositionPosition`
- Inverte `headNodeId` e `tailNodeId` (marcha-ré no mesmo segmento)
- Retorna nova posição — não modifica a original

#### `advanceToSegment(nextSegment, entryNodeId): CompositionPosition`
- `entryNodeId` = nó pelo qual a composição entra no novo segmento
  (é o `throughNodeId` já calculado pelo `resolveNextSegment`)
- Novo `tailNodeId` = `entryNodeId`
- Novo `headNodeId` = a outra extremidade de `nextSegment`:
  - se `entryNodeId === nextSegment.startNodeId` → `headNodeId = nextSegment.endNodeId`
  - se `entryNodeId === nextSegment.endNodeId` → `headNodeId = nextSegment.startNodeId`
- Se `entryNodeId` não for extremidade do segmento → lança `Error`

### Arquivos a criar

```
app/src/simulation/domain/position/compositionPosition.ts
app/src/simulation/domain/position/compositionPosition.test.ts
```

### Testes obrigatórios

```ts
// createPosition
- headNodeId = startNodeId → ok, tailNodeId = endNodeId
- headNodeId = endNodeId   → ok, tailNodeId = startNodeId
- headNodeId inválido      → lança Error

// flipDirection
- inverte headNodeId e tailNodeId corretamente

// advanceToSegment
- entryNodeId = startNodeId do próximo segmento → headNodeId = endNodeId
- entryNodeId = endNodeId do próximo segmento   → headNodeId = startNodeId
- entryNodeId inválido                          → lança Error

// sequência completa
- createPosition → advanceToSegment → posição consistente

// com segmentos reais (importar brisamarSegments)
- pelo menos 2 testes usando segmentos reais do pátio
```

### Critérios de aceite antes de fechar esta etapa

- [ ] `CompositionPosition` exportado
- [ ] `createPosition` implementado e testado
- [ ] `flipDirection` implementado e testado
- [ ] `advanceToSegment` implementado e testado
- [ ] Todos os 92 testes anteriores continuam passando
- [ ] `npm run lint` → ok (zero warnings)
- [ ] `npm run build` → ok

### Commit sugerido (Conventional Commits em português)
```
feat: implementa posicao da composicao no grafo
```

---

## 11. CAMINHO APÓS A TASK-009

Para referência — não implementar agora:

**TASK-010 — Motor de movimento (passo discreto)**
```ts
function stepComposition(
  composition: Composition,
  position: CompositionPosition,
  direction: 'head' | 'tail',
  segments, switchDefs, switchStates, interval
): { ok: true; nextPosition: CompositionPosition }
 | { ok: false; reason: NavigationBlockReason | 'no-locomotive' }
```
Regras: verificar `hasLocomotive` → chamar `resolveNextSegment` → chamar `advanceToSegment`

**TASK-011 — Colisão** — duas composições no mesmo segmento = bloqueio

**TASK-012 — Ocupação de AMV** — composição em segmento adjacente ao AMV = AMV ocupado

**TASK-013 — Store de posições + placa PARE** — integrar `stepComposition` no Zustand

**TASK-014 — UI de movimentação** — arrastar no SVG chama o store

---

## 12. REGRAS QUE VOCÊ DEVE SEGUIR

- **Um arquivo de cada vez.** Gere, eu colo, eu rodo, eu te mostro o resultado.
- **Código sempre completo.** Nunca use `// ...resto do código` ou `// mantém o restante`.
- **Nunca invente regras ferroviárias.** Se não estiver documentado aqui, pergunte antes.
- **Nenhuma lógica de domínio dentro de componente React.**
- **Nenhum `any` desnecessário.**
- **Se o terminal der erro**, eu colo aqui e você corrige antes de avançar.
- **Não sugira refatorações** de código não relacionado à tarefa atual.

---

## COMO COMEÇAR

Confirme que leu todo o contexto respondendo:

> "Entendido. Vou implementar a TASK-009. Começando pelo arquivo de implementação: `app/src/simulation/domain/position/compositionPosition.ts`"

E então gere o conteúdo completo desse arquivo.
Depois aguarde eu colar o resultado do terminal antes de gerar os testes.
