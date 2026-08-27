# PRÓXIMA ETAPA — MOTOR DE NAVEGAÇÃO NO GRAFO

## Contexto

A topologia do grafo do Pátio Brisamar está concluída:
- nós e segmentos definidos em `brisamarTopology.ts`;
- conexões dos AMVs mapeadas em `brisamarSwitches.ts`;
- funções de consulta em `brisamarTopologyGraph.ts`.

A próxima etapa é o **motor de navegação**: dado um segmento atual + nó de
chegada + estado dos AMVs + estado do intervalo, determinar se a composição
pode avançar e para qual segmento ela irá.

**Esta etapa não implementa movimentação por arraste.** É domínio puro.

---

## Escopo

### A — resolveNextSegment

Dada a posição atual de uma composição (segmento + nó de saída),
retornar o próximo segmento ou o motivo pelo qual não pode avançar.

```ts
type NavigationResult =
  | { ok: true; segment: TrackSegment }
  | { ok: false; reason: NavigationBlockReason };

type NavigationBlockReason =
  | 'terminal'           // extremidade de linha, não há próximo segmento
  | 'switch-against'     // chave contra
  | 'interval-required'  // segmento protegido sem intervalo concedido
  | 'stop-board'         // placa PARE (reservado — sem dados ainda)

function resolveNextSegment(
  currentSegmentId: string,
  exitNodeId: string,
  segments: TrackSegment[],
  switchDefs: Record<SwitchId, SwitchDefinition>,
  switchStates: SwitchState[],
  interval: IntervalState,
): NavigationResult
```

### B — isSwitchAgainst

Determinar se um AMV está contra para uma composição que chega por um nó.

Regra do grafo:
- composição chega por `entryNodeId`;
- o AMV tem `nodeCommon`, `nodeA`, `nodeB`;
- se `entryNodeId === nodeCommon` → composição vem da ponta única → **não é contra**
  (ela sairá pelo ramo ativo: nodeA ou nodeB conforme a posição);
- se `entryNodeId === nodeA` e posição é A → **não é contra** (composição vem pelo ramo ativo, sai pelo common);
- se `entryNodeId === nodeA` e posição é B → **chave contra** (ramo A não está conectado);
- se `entryNodeId === nodeB` e posição é B → **não é contra**;
- se `entryNodeId === nodeB` e posição é A → **chave contra**;
- se `entryNodeId` não pertence ao AMV → não é um AMV relevante para esta travessia.

```ts
function isSwitchAgainst(
  switchDef: SwitchDefinition,
  position: SwitchPosition,
  entryNodeId: string,
): boolean
```

---

## Fora do escopo desta etapa

NÃO implementar agora:
- movimentação por arraste;
- detecção de colisão;
- ocupação de AMV por material rodante;
- placas PARE funcionais (reservar enum, não bloquear);
- UI de qualquer tipo.

---

## Testes obrigatórios

```powershell
npm run lint
npm run test
npm run build
```

Cobrir:
- composição chegando pela ponta comum → segue pelo ramo ativo;
- composição chegando pelo ramo ativo → sai pela ponta comum;
- composição chegando pelo ramo inativo → chave contra bloqueada;
- segmento protegido sem intervalo → bloqueado;
- segmento protegido com intervalo → permitido;
- terminal de linha → bloqueado com reason 'terminal'.

---

## Referências

- `docs/MAPA_BRISAMAR_V1_CONSOLIDADO.md` — seção 4 (regras AMV, chave contra)
- `docs/MODELO_DOMINIO.md` — seções 20, 23 e 24
- `app/src/yard/data/brisamarTopology.ts`
- `app/src/yard/data/brisamarTopologyGraph.ts`
- `app/src/yard/data/brisamarSwitches.ts`
