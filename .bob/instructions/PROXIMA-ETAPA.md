# PRÓXIMA ETAPA — TASK-009: Posição da Composição no Grafo

## Status do projeto

**Branch:** `feat/1-modo-preparacao-patio`
**Testes:** 92/92 passando (6 suítes)
**Última entrega:** Motor de Navegação no Grafo (`1e69823`)

---

## O que já foi implementado (não repetir, não refatorar)

### Commits entregues

| Commit | O que entregou |
|---|---|
| `1e69823` | Motor de navegação: `isSwitchAgainst` + `resolveNextSegment` — 21 testes |
| `ecc2304` | Épico 4 — `Composition`, `couple`, `splitAt`, `hasLocomotive`, `createComposition` — 21 testes + Topologia do grafo |
| `d86b5bb` | Finalização do modo de preparação — campo de anotação, botão Iniciar Simulação, feedback de modo, 7 testes |
| `6571523` | SVG do pátio, rolling stock visual, capacity badges, seleção de trecho |
| `30dfaa4` | Fundação do modo preparação |

### Domínio já existente

```
app/src/simulation/domain/
  composition/
    composition.ts           → Composition, couple, splitAt, hasLocomotive, createComposition
    composition.test.ts      → 21 testes
  navigation/
    navigationEngine.ts      → isSwitchAgainst, resolveNextSegment, NavigationResult, NavigationBlockReason
    navigationEngine.test.ts → 21 testes
  switches/
    switchRules.ts           → toggleSwitch, canReturnInterval, normalizeSwitchesOnIntervalReturn
    switchRules.test.ts      → 14 testes

app/src/yard/data/
  brisamarTopology.ts        → TrackNode, TrackSegment, brisamarNodes, brisamarSegments (lista completa)
  brisamarTopologyGraph.ts   → getSegmentsAtNode, getActiveSwitchConnection, getExitNode
  brisamarTopologyGraph.test.ts → 18 testes
  brisamarSwitches.ts        → brisamarSwitchDefinitions (AMV-01 a AMV-12), initialSwitchStates

app/src/types/switch.ts      → SwitchPosition, SwitchId, SwitchState, IntervalState, SwitchDefinition
app/src/rolling-stock/types/rollingStock.ts → Locomotive, WagonUnit, WagonBlock, RollingStock, CompositionUnit
app/src/state/simulationStore.ts → Zustand store (mode, interval, switches, yardSections, stationNotes)
app/src/preparation/         → tipos, dados e regras do modo preparação
```

### Tipos-chave já existentes

```ts
// rollingStock.ts
type Locomotive = { id: string; kind: 'locomotive'; number: string; orientation: LocomotiveOrientation };
type WagonUnit  = { id: string; kind: 'wagon-unit'; label: string; color: string; sourceBlockId: string };
type CompositionUnit = Locomotive | WagonUnit;

// composition.ts
type Composition = { id: string; units: CompositionUnit[] };

// brisamarTopology.ts
type TrackSegment = {
  id: string; line: string;
  startNodeId: string; endNodeId: string;
  protectedByInterval: boolean; technical: boolean;
};

// switch.ts
type SwitchDefinition = {
  id: SwitchId; positionA: string; positionB: string;
  intervalRule: 'none' | 'full-lock' | 'restricted-position';
  allowedWithoutInterval?: SwitchPosition;
  nodeCommon: string; nodeA: string; nodeB: string;
};
type IntervalState = 'not-granted' | 'granted';
```

---

## Erros já cometidos — não repetir

- **AMV não é segmento**: AMV é uma conexão entre nós. A composição atravessa o
  AMV chegando em um dos seus três nós, atravessa até o `throughNodeId`, e só
  então busca o segmento seguinte. A primeira versão de `resolveNextSegment`
  buscava candidatos diretamente no `exitNodeId` e falhava em todos os casos
  com AMV. Corrigido.
- **`WagonUnit` sem `kind`**: union discriminada exige `kind: 'wagon-unit'`.
- **`Record<SwitchId, ...>` rejeita `{}` nos testes**: assinatura relaxada para
  `Record<string, SwitchDefinition>` nos testes.
- **Emoji na locomotiva**: descartado.
- **Consolidar blocos iguais automaticamente**: não fazer.
- **L22 e L24 como regiões únicas**: já divididas — não reverter.
- **Mutação durante render**: proibida.

---

## TASK-009 — Posição da Composição no Grafo

### Objetivo

Dar a cada `Composition` uma posição física no grafo.

Sem isso, `resolveNextSegment` existe mas nunca é chamado com dados reais,
e o motor de movimento não tem entrada.

Esta etapa é **domínio puro** — nenhum arquivo React, nenhum SVG, nenhuma UI.

---

### Por que esta etapa vem antes do movimento?

O motor de movimento (arrastar) precisa de:
1. saber em qual segmento está a frente da composição;
2. saber em qual nó a frente está apontando (de qual extremidade vai sair);
3. chamar `resolveNextSegment` com esses dados;
4. decidir se avança, bloqueia ou para.

Sem `CompositionPosition`, não há entrada para o motor.

---

### Conceito de posição

Uma composição pode estar:

**Caso simples** — inteiramente dentro de um único segmento:

```
[SEG-L22-SUP]
  ←  [LOC] [W] [W]  →
  nó de frente: N-AMV05-C
  nó de cauda:  N-L22-TERM-ESQ
```

**Caso composto** — atravessando vários segmentos (ex.: composição longa sobre AMV):

```
[SEG-L22-SUP] — AMV-05 — [SEG-L22-05-09]
  [W] [W] [LOC] [W]
```

Para o MVP, **começar com o caso simples**: uma composição ocupa exatamente
um segmento e possui duas extremidades (frente e cauda), cada uma apontando
para um nó do segmento.

---

### Tipo a implementar

```ts
// app/src/simulation/domain/position/compositionPosition.ts

/**
 * Representa a posição de uma composição no grafo do pátio.
 *
 * Para o MVP: a composição ocupa exatamente um segmento.
 * `headNodeId` = nó para onde a frente aponta (de onde vai sair).
 * `tailNodeId` = nó oposto (de onde veio / onde está a cauda).
 *
 * Invariante: headNodeId e tailNodeId são as duas extremidades de segmentId.
 */
export type CompositionPosition = {
  segmentId: string;
  headNodeId: string;  // nó de saída da frente
  tailNodeId: string;  // nó de saída da cauda
};
```

---

### Funções a implementar

#### 1. `createPosition`

```ts
/**
 * Cria uma posição para uma composição em um segmento,
 * com a frente apontando para headNodeId.
 *
 * Valida que headNodeId e tailNodeId são as extremidades do segmento.
 *
 * @throws {Error} se os nós não pertencerem ao segmento.
 */
function createPosition(
  segment: TrackSegment,
  headNodeId: string,
): CompositionPosition
```

`tailNodeId` é inferido: se `headNodeId === segment.endNodeId` então
`tailNodeId = segment.startNodeId`, e vice-versa.

Lançar erro se `headNodeId` não for nenhuma das duas extremidades do segmento.

---

#### 2. `flipDirection`

```ts
/**
 * Inverte a direção da composição no mesmo segmento.
 * (Frente vira cauda, cauda vira frente.)
 *
 * Útil para representar manobra de marcha-ré.
 */
function flipDirection(position: CompositionPosition): CompositionPosition
```

---

#### 3. `advanceToSegment`

```ts
/**
 * Avança a posição para um novo segmento.
 *
 * Dado que a composição saiu pelo headNodeId atual e entrou no nextSegment,
 * calcula o novo headNodeId (o nó oposto ao ponto de entrada no novo segmento).
 *
 * O ponto de entrada no novo segmento é o nó compartilhado entre o segmento
 * atual e o próximo. Como pode haver um AMV no meio, recebe `entryNodeId`
 * explicitamente (= throughNodeId do AMV, já calculado pelo navigationEngine).
 *
 * @param entryNodeId - nó pelo qual a composição entra no nextSegment
 */
function advanceToSegment(
  nextSegment: TrackSegment,
  entryNodeId: string,
): CompositionPosition
```

O novo `tailNodeId` = `entryNodeId`.
O novo `headNodeId` = a outra extremidade de `nextSegment`
  (se `entryNodeId === nextSegment.startNodeId` → `nextSegment.endNodeId`, e vice-versa).

---

### Estrutura de arquivos

```
app/src/simulation/domain/position/
  compositionPosition.ts       ← tipos + funções
  compositionPosition.test.ts  ← testes unitários
```

---

### Testes obrigatórios

Cobrir:

- `createPosition` com headNodeId = startNodeId do segmento → ok
- `createPosition` com headNodeId = endNodeId do segmento → ok
- `createPosition` com nó inválido → lança erro
- `flipDirection` → inverte os dois nós
- `advanceToSegment` com entryNodeId = startNodeId → headNodeId = endNodeId
- `advanceToSegment` com entryNodeId = endNodeId → headNodeId = startNodeId
- sequência: `createPosition` → `advanceToSegment` → posição consistente

Usar segmentos reais de `brisamarSegments` em pelo menos dois testes.

---

### Critérios de aceite

- [ ] `CompositionPosition` definido e exportado
- [ ] `createPosition` implementado e testado
- [ ] `flipDirection` implementado e testado
- [ ] `advanceToSegment` implementado e testado
- [ ] todos os 92 testes anteriores continuam passando
- [ ] `npm run lint` → ok
- [ ] `npm run build` → ok

---

### Commit sugerido

```text
feat: implementa posicao da composicao no grafo
```

---

## Depois da TASK-009 — visão do caminho restante

Ordem recomendada das próximas tarefas:

### TASK-010 — Motor de Movimento (passo discreto)

```ts
function stepComposition(
  composition: Composition,
  position: CompositionPosition,
  direction: 'head' | 'tail',
  segments: TrackSegment[],
  switchDefs: Record<string, SwitchDefinition>,
  switchStates: SwitchState[],
  interval: IntervalState,
): StepResult
// StepResult = { ok: true; nextPosition: CompositionPosition }
//            | { ok: false; reason: NavigationBlockReason | 'no-locomotive' }
```

Regras do passo discreto:
- verificar `hasLocomotive(composition)` → se false, `reason: 'no-locomotive'`
- chamar `resolveNextSegment` com `position.segmentId`, `position.headNodeId`
  (se direction = 'head') ou `position.tailNodeId` (se direction = 'tail')
- se ok → chamar `advanceToSegment` e retornar nova posição
- se não ok → retornar o motivo

### TASK-011 — Colisão (detecção entre composições)

Duas composições não podem ocupar o mesmo segmento se os seus intervalos
físicos se sobrepõem. Nesta etapa, como cada composição ocupa um segmento
inteiro, a regra simplificada é: **duas composições não podem estar no mesmo
segmento ao mesmo tempo**.

### TASK-012 — Ocupação de AMV

Um AMV está ocupado se qualquer `CompositionPosition` tem o `segmentId`
adjacente ao AMV e a composição está próxima do nó do AMV.
Para o MVP: o AMV estará ocupado se a composição estiver no segmento
imediatamente conectado a qualquer um dos seus três nós.

### TASK-013 — Store de posições + placa PARE

Adicionar ao `simulationStore`:
- mapa `compositionPositions: Map<string, CompositionPosition>`
- ação `moveComposition(id, direction)` que chama `stepComposition`
- lógica de placa PARE usando `NavigationBlockReason 'stop-board'`

### TASK-014 — UI de movimentação (arrastar no SVG)

Conectar eventos de mouse no `YardCanvas` ao `moveComposition` do store.

---

## Regras de execução obrigatórias

1. Implementar um bloco de cada vez.
2. Após cada bloco: `npm run lint` → `npm run test` → `npm run build`.
3. Se qualquer um falhar, corrigir antes de avançar.
4. Não alterar `main`. Não fazer merge. Não fazer push sem autorização explícita.
5. Não inventar regras ferroviárias — consultar `docs/MAPA_BRISAMAR_V1_CONSOLIDADO.md` e `docs/MODELO_DOMINIO.md`.
6. Nenhuma regra de domínio dentro de componentes React.
7. Nenhum `any` desnecessário.
8. Branch esperada: `feat/1-modo-preparacao-patio`.

---

## Referências

- `docs/MODELO_DOMINIO.md` — seção 15 (CompositionPosition), seção 20 (Movimento)
- `docs/ESCOPO_MVP.md` — seções 7, 8, 9, 10
- `docs/MAPA_BRISAMAR_V1_CONSOLIDADO.md` — seções 3, 4, 5
- `app/src/simulation/domain/navigation/navigationEngine.ts`
- `app/src/simulation/domain/composition/composition.ts`
- `app/src/yard/data/brisamarTopology.ts`
- `app/src/yard/data/brisamarSwitches.ts`
