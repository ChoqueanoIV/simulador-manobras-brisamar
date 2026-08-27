# PRÓXIMA ETAPA — ÉPICO 4: MODELO DE COMPOSIÇÃO, ENGATE E CORTE

## Contexto

A Issue #1 (Modo de Preparação) foi concluída.

O pátio:
- inicia vazio;
- suporta cadastro de locomotivas e blocos de vagões por trecho;
- exibe material visual proporcional no SVG;
- possui anotação opcional da estação;
- possui botão "Iniciar Simulação" com confirmação;
- bloqueia edições após iniciar;
- exibe modo atual no header;
- AMVs, intervalo e geometria já funcionam.

A próxima etapa é implementar as **entidades de composição** que permitirão, futuramente, o motor de movimento, engate e corte.

**Esta etapa NÃO implementa movimentação por arraste.** O foco é a modelagem de domínio.

---

## Escopo

### A — Representação individual dos veículos no domínio

O `WagonBlock` atual no store agrupa vagões apenas visualmente.
Para suportar corte em qualquer posição, o domínio precisa de `WagonUnit` — um vagão individual.

Implementar:
- tipo `WagonUnit` com `id`, `label`, `color`, `sourceBlockId`;
- ao adicionar um bloco de N vagões, criar N `WagonUnit`s internamente;
- o `WagonBlock` visual continua existindo — é reconstruído a partir de unidades consecutivas com mesmo `sourceBlockId`;
- a ordem física das unidades é preservada no array.

**Referência:** `docs/MODELO_DOMINIO.md` seções 11 e 12.

Antes de criar, procure se `WagonUnit` já existe em algum arquivo.

Valide este bloco antes de avançar.

### B — Tipo Composition

Representar uma composição: conjunto físico engatado de material rodante.

```ts
type Composition = {
  id: string;
  unitIds: string[]; // IDs de WagonUnit e Locomotive em ordem física
};
```

Regras:
- pode conter zero ou mais locomotivas;
- pode conter zero ou mais vagões;
- uma locomotiva sozinha é uma composição válida;
- um bloco de vagões sozinho é uma composição válida (sem locomotiva, não pode mover);
- a ordem do array representa a sequência física.

Não implementar movimentação agora. Apenas o tipo e as funções de domínio.

Valide este bloco antes de avançar.

### C — Engate (domínio puro)

Implementar funções puras:

```text
couple(compositionA, compositionB, side): Composition
```

Regras:
- une duas composições;
- preserva a ordem física;
- o lado do engate determina qual extremidade de A se une a qual extremidade de B;
- não gera engate automático;
- nenhuma UI nesta etapa.

Testes unitários obrigatórios para esta função.

Valide este bloco antes de avançar.

### D — Corte (domínio puro)

Implementar funções puras:

```text
splitAt(composition, index): [Composition, Composition]
```

Regras:
- divide a composição em dois no índice indicado;
- preserva a ordem física de ambas as partes;
- corte dentro de um bloco visual é permitido (separa unidades individuais);
- resultado: dois objetos `Composition` independentes.

Exemplo de corte dentro de bloco:
```text
[15 FVR] → splitAt(12) → [12 FVR] [3 FVR]
```

Testes unitários obrigatórios.

Valide este bloco antes de avançar.

---

## Fora do escopo desta etapa

NÃO implementar agora:
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

## Testes obrigatórios

Após cada bloco e ao final:

```powershell
npm run lint
npm run test
npm run build
```

Testes de domínio para:
- criar N `WagonUnit`s a partir de um bloco;
- `couple` preserva ordem;
- `splitAt` divide corretamente;
- `splitAt` dentro de bloco visual;
- composição sem locomotiva é válida.

---

## Referências

- `docs/MODELO_DOMINIO.md` — seções 9 a 15
- `docs/ESCOPO_MVP.md` — seções 7 e 8
- `docs/BACKLOG_MVP.md` — Épico 4
- `app/src/rolling-stock/types/rollingStock.ts` — tipos atuais
- `app/src/state/simulationStore.ts` — store atual
