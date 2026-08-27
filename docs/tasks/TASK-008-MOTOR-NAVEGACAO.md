# TASK-008 — Motor de Navegação no Grafo

## Status
Planejada

## Contexto

A topologia do grafo está concluída (TASK-007).

O motor de navegação é a camada que, dado o estado atual da composição
no grafo e o estado do simulador, determina para onde ela pode ou não pode ir.

---

## Objetivo

Implementar as funções puras de domínio que resolvem a próxima posição
de uma composição no grafo do pátio.

---

## 1. isSwitchAgainst

```ts
function isSwitchAgainst(
  switchDef: SwitchDefinition,
  position: SwitchPosition,
  entryNodeId: string,
): boolean
```

### Lógica do grafo

Um AMV tem três nós: `nodeCommon` (ponta única), `nodeA` e `nodeB`.

| De onde chega | Posição do AMV | Resultado |
|---|---|---|
| `nodeCommon` | qualquer | NÃO é contra — sai pelo ramo ativo |
| `nodeA` | A | NÃO é contra — sai pelo common |
| `nodeA` | B | **CONTRA** — ramo A desconectado |
| `nodeB` | B | NÃO é contra — sai pelo common |
| `nodeB` | A | **CONTRA** — ramo B desconectado |
| outro nó | qualquer | não pertence a este AMV → false |

---

## 2. resolveNextSegment

```ts
type NavigationBlockReason =
  | 'terminal'
  | 'switch-against'
  | 'interval-required'
  | 'stop-board';

type NavigationResult =
  | { ok: true; segment: TrackSegment }
  | { ok: false; reason: NavigationBlockReason };

function resolveNextSegment(
  currentSegmentId: string,
  exitNodeId: string,
  segments: TrackSegment[],
  switchDefs: Record<SwitchId, SwitchDefinition>,
  switchStates: SwitchState[],
  interval: IntervalState,
): NavigationResult
```

### Algoritmo

1. Listar todos os segmentos conectados ao `exitNodeId`.
2. Remover o segmento atual (`currentSegmentId`) — é de onde viemos.
3. Se não restar nenhum segmento → `{ ok: false, reason: 'terminal' }`.
4. Para cada segmento candidato:
   a. Verificar se há um AMV conectando `exitNodeId` ao segmento candidato.
   b. Se houver AMV: verificar `isSwitchAgainst` → se contra, descartar.
   c. Se o segmento for `protectedByInterval` e intervalo não concedido → descartar com `interval-required`.
5. O segmento restante válido é o próximo.
6. Se nenhum restou → `{ ok: false, reason: 'switch-against' }` ou `'interval-required'` conforme o caso.

---

## 3. Estrutura de arquivos

```text
app/src/simulation/domain/navigation/
  navigationEngine.ts       ← isSwitchAgainst + resolveNextSegment
  navigationEngine.test.ts  ← testes
```

---

## 4. Fora do escopo

- movimentação por arraste;
- colisão;
- UI;
- ocupação de AMV;
- placas PARE (reservar `'stop-board'` no enum, não implementar bloqueio ainda).

---

## 5. Critérios de aceite

- [ ] `isSwitchAgainst` implementada e testada
- [ ] `resolveNextSegment` implementada e testada
- [ ] todos os 71 testes anteriores continuam passando
- [ ] lint passa
- [ ] build passa

---

## 6. Commit sugerido

```text
feat: implementa motor de navegacao no grafo do patio
```
