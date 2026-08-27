# TASK-006 — Épico 4: Modelo de Composição, Engate e Corte

## Status
Planejada

## Contexto

A Issue #1 (Modo de Preparação) foi concluída.

O pátio já:
- inicia vazio;
- suporta cadastro de locomotivas e blocos de vagões por trecho;
- exibe material visual proporcional no SVG;
- possui anotação opcional da estação;
- possui botão "Iniciar Simulação" com confirmação;
- bloqueia edições diretas após iniciar;
- AMVs, intervalo e geometria funcionam.

Esta task cobre os fundamentos do Épico 4: a representação interna de veículos individuais e as operações de composição, engate e corte no domínio — **sem** UI de movimento.

---

## Objetivo

Implementar o modelo de domínio de composição para que o motor de movimento (Épico 5) possa ser construído sobre uma base sólida.

---

## 1. Representação individual de vagões — WagonUnit

O `WagonBlock` atual agrupa vagões apenas visualmente.

Para suportar corte em qualquer posição, o domínio precisa de `WagonUnit`.

### Tipo

```ts
type WagonUnit = {
  id: string;
  label: string;
  color: string;
  sourceBlockId: string;
};
```

### Regras

- ao cadastrar `10 FVR`, criar 10 `WagonUnit`s com o mesmo `sourceBlockId`;
- o `WagonBlock` visual é reconstruído agrupando unidades consecutivas com mesmo `sourceBlockId`;
- a ordem física das unidades é preservada no array;
- corte separa unidades individuais, gerando novos `sourceBlockId`s para os novos grupos.

### Referência

`docs/MODELO_DOMINIO.md` — seção 11

---

## 2. Tipo Composition

```ts
type Composition = {
  id: string;
  unitIds: string[]; // IDs de WagonUnit e/ou Locomotive em ordem física
};
```

### Regras

- pode conter zero ou mais locomotivas;
- pode conter zero ou mais vagões;
- locomotiva sozinha é composição válida;
- vagões sem locomotiva formam composição válida (mas não podem se mover);
- a ordem do array representa a sequência física.

### Referência

`docs/MODELO_DOMINIO.md` — seção 14

---

## 3. Engate — couple

Função pura de domínio:

```ts
function couple(
  a: Composition,
  b: Composition,
  side: 'a-head' | 'a-tail',
): Composition
```

### Regras

- `side = 'a-tail'`: B é engatado ao final de A → resultado: `[...a.unitIds, ...b.unitIds]`
- `side = 'a-head'`: B é engatado ao início de A → resultado: `[...b.unitIds, ...a.unitIds]`
- preserva a ordem física de ambas as composições;
- não gera engate automático (apenas a função pura é implementada; quem chama decide quando engatar);
- não altera as composições originais (imutável).

### Referência

`docs/ESCOPO_MVP.md` — seção 7  
`docs/MODELO_DOMINIO.md` — seção 13

---

## 4. Corte — splitAt

Função pura de domínio:

```ts
function splitAt(
  composition: Composition,
  index: number,
): [Composition, Composition]
```

### Regras

- divide a composição na posição `index`;
- `index` é o número de unidades que ficam na primeira parte;
- `index` deve ser `>= 1` e `< composition.unitIds.length`;
- resultado: dois objetos `Composition` com IDs próprios;
- preserva a ordem física em ambas as partes;
- corte dentro de um `WagonBlock` visual é permitido — o `sourceBlockId` da parte restante deve ser atualizado para refletir a separação;
- não altera a composição original (imutável).

### Exemplo

```text
Composição: [WU1, WU2, WU3, WU4, WU5] — todos "FVR"
splitAt(index=3)
→ A: [WU1, WU2, WU3]  (3 FVR)
→ B: [WU4, WU5]        (2 FVR)
```

### Referência

`docs/ESCOPO_MVP.md` — seção 8  
`docs/MODELO_DOMINIO.md` — seções 12 e 14

---

## 5. Fora do escopo desta task

- movimentação por arraste;
- detecção de contato;
- colisão;
- chave contra;
- ocupação de AMV;
- intervalo nas linhas L16/L18/L20;
- UI de engate/corte (botões, clique no pátio);
- persistência;
- backend.

---

## 6. Testes mínimos

### WagonUnit

```text
cadastrar 10 FVR → criar 10 WagonUnit com mesmo sourceBlockId
cadastrar 1 vagão → criar 1 WagonUnit
sourceBlockId preservado por unidade
```

### Composition

```text
composição com apenas locomotiva → válida
composição com apenas vagões → válida
composição vazia → válida (edge case)
```

### couple

```text
couple(A, B, 'a-tail') → [...A.unitIds, ...B.unitIds]
couple(A, B, 'a-head') → [...B.unitIds, ...A.unitIds]
ordem preservada
resultado é nova composição (imutável)
```

### splitAt

```text
splitAt(comp, 3) → parte A com 3 unidades, parte B com o restante
splitAt(comp, 1) → parte A com 1 unidade
splitAt dentro de WagonBlock visual → unidades individuais separadas
resultado é par de novas composições (imutável)
```

---

## 7. Estrutura de arquivos sugerida

```text
app/src/
├── rolling-stock/
│   └── types/
│       └── rollingStock.ts       ← adicionar WagonUnit
│
└── simulation/
    └── domain/
        └── composition/
            ├── composition.ts        ← tipo Composition + funções couple/splitAt
            └── composition.test.ts   ← testes
```

---

## 8. Critérios de aceite

- [ ] `WagonUnit` definido em `rollingStock.ts`
- [ ] tipo `Composition` definido em `composition.ts`
- [ ] `couple` implementada e testada
- [ ] `splitAt` implementada e testada
- [ ] todos os testes passam
- [ ] lint passa
- [ ] build passa
- [ ] nenhuma regressão nos testes anteriores (32 testes)

---

## 9. Commit sugerido

```text
feat: implementa modelo de composicao, engate e corte
```
