# TASK-007 — Topologia do Grafo do Pátio Brisamar

## Status
Planejada

## Contexto

O Épico 4 (composição, engate, corte) foi concluído.

Para o motor de movimentação funcionar, o pátio precisa ser modelado como
um grafo computável de nós e segmentos. Sem esse grafo, o motor não sabe
por qual trilho a composição deve continuar ao atravessar um AMV.

---

## Objetivo

Criar os dados estáticos da topologia do Pátio Brisamar:
- nós de conexão (`TrackNode`);
- segmentos navegáveis (`TrackSegment`);
- conexões dos AMVs mapeadas no grafo;
- funções puras de consulta do grafo.

---

## 1. Princípio fundamental

```text
Nó = ponto físico de conexão entre dois ou mais segmentos
Segmento = trecho navegável entre dois nós
AMV = ponto onde três segmentos se encontram (comum + ramoA + ramoB)
```

---

## 2. Convenção de nomenclatura dos nós

Prefixo por região:
- `N-` + referência geográfica no pátio

Exemplos:
- `N-L22-TERM-ESQ` — terminal esquerdo de L22
- `N-AMV05-C` — ponta comum do AMV-05
- `N-AMV05-A` — ramo A do AMV-05
- `N-AMV05-B` — ramo B do AMV-05

---

## 3. Estrutura dos tipos

### TrackNode

```ts
type TrackNode = {
  id: string;
};
```

### TrackSegment

```ts
type TrackSegment = {
  id: string;
  line: string;
  startNodeId: string;
  endNodeId: string;
  protectedByInterval: boolean;
};
```

### SwitchDefinition (atualização)

Acrescentar ao tipo já existente:

```ts
type SwitchDefinition = {
  // campos existentes...
  nodeCommon: string;
  nodeA: string;
  nodeB: string;
};
```

---

## 4. Mapeamento dos segmentos por linha

### L30

```
N-L30-TERM ──[L30-SEG]── N-AMV03-B
```

### L28

```
N-L28-TERM ──[L28-SEG]── N-AMV02-B (via AMV-01-B)
```

### L26

```
N-L26-TERM ──[L26-SEG]── N-AMV02-B (via AMV-01-A)
```

### L24

```
N-L24-TERM-ESQ ──[L24-SUPERIOR]── N-AMV02-C
N-AMV02-C ──(AMV-02)
N-AMV03-C ──(AMV-03) → ramoB para L30
N-AMV04-C ──(AMV-04) → ramoB para L22
N-AMV11-C ──(AMV-11)
N-AMV11-A ──[L24-INFERIOR]── N-L24-TERM-DIR
```

### L22

```
N-L22-TERM-ESQ ──[L22-SUPERIOR]── N-AMV05-C
N-AMV05-C ──(AMV-05) → ramoB para L24
N-AMV09-C ──(AMV-09) → ramoB para L20
N-AMV10-C ──(AMV-10)
N-AMV12-C ──(AMV-12)
N-AMV12-A ──[L22-INFERIOR]── N-L22-TERM-DIR
N-AMV12-B ──[L22-CURVA]── N-L22-CURVA-TERM
```

### L20

```
N-L20-TERM-ESQ ──[L20-SEG]── N-AMV08-B (via diagonal)
N-AMV08-TECNICO ──[L20-TECNICO]── (saída técnica)
```

### L18

```
N-L18-TERM-ESQ ──[L18-SEG]── N-AMV07-B
N-AMV07-TECNICO ──[L18-TECNICO]── (saída técnica)
```

### L16

```
N-L16-TERM-ESQ ──[L16-SEG]── N-AMV06-B
N-AMV06-TECNICO ──[L16-TECNICO]── (saída técnica)
```

---

## 5. Fora do escopo desta task

- movimentação;
- chave contra (lógica de bloqueio);
- ocupação de AMV;
- placas PARE funcionais;
- intervalo nas linhas protegidas;
- UI de qualquer tipo.

---

## 6. Critérios de aceite

- [ ] `TrackNode` e `TrackSegment` definidos em `brisamarTopology.ts`
- [ ] `SwitchDefinition` atualizado com `nodeCommon`, `nodeA`, `nodeB`
- [ ] `brisamarTopology.ts` com todos os nós e segmentos
- [ ] `brisamarTopologyGraph.ts` com `getSegmentsAtNode`, `getActiveSwitchConnection`, `getExitNode`
- [ ] testes unitários das funções de consulta
- [ ] nenhuma regressão nos 53 testes anteriores
- [ ] lint passa
- [ ] build passa

---

## 7. Commit sugerido

```text
feat: implementa topologia do grafo do patio brisamar
```
