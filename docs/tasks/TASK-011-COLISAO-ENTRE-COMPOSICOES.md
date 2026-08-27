# TASK-011 — Colisão entre Composições

## Objetivo

Adicionar uma regra de domínio que impeça uma composição de avançar para um segmento já ocupado por outra composição.

Esta task permanece no domínio puro:

- sem React;
- sem SVG;
- sem Zustand;
- sem drag-and-drop;
- sem persistência.

---

## Regra consolidada

Duas composições podem existir na mesma linha física, desde que estejam em segmentos diferentes.

Não podem:

- ocupar o mesmo segmento ao mesmo tempo;
- avançar para um segmento já ocupado por outra composição.

A própria composição em movimento deve ser ignorada na verificação de colisão.

---

## Arquivos implementados

```text
app/src/simulation/domain/collision/collisionRules.ts
app/src/simulation/domain/collision/collisionRules.test.ts
```

A regra principal criada foi:

```ts
isSegmentOccupiedByOtherComposition(
  targetSegmentId,
  movingCompositionId,
  positionedCompositions,
)
```

Também foi integrada ao motor existente:

```text
app/src/simulation/domain/movement/stepComposition.ts
```

com novo motivo de bloqueio:

```text
collision
```

---

## Fluxo atualizado do movimento

```text
Composition
    |
    v
hasLocomotive?
    |
    +-- não --> no-locomotive
    |
    v
resolveNextSegment(...)
    |
    +-- bloqueado --> motivo do navigationEngine
    |
    v
segmento de destino ocupado por outra composição?
    |
    +-- sim --> collision
    |
    v
advanceToSegment(...)
```

---

## Testes da regra de colisão

Cenários cobertos:

1. nenhuma composição posicionada;
2. nenhuma composição no segmento alvo;
3. outra composição no segmento alvo;
4. ignorar a própria composição;
5. própria composição + outra composição no mesmo segmento;
6. composições em segmentos diferentes da mesma linha;
7. múltiplas composições, com apenas uma no segmento alvo.

---

## Testes da integração com o movimento

Foram adicionados cenários para validar:

1. bloqueio quando outra composição ocupa o destino;
2. a própria composição não gera colisão;
3. outras composições em segmentos diferentes não bloqueiam.

---

## Evolução da suíte

Antes da TASK-011:

```text
111 testes
```

Após os testes de colisão:

```text
118 testes
```

Após integrar colisão ao `stepComposition`:

```text
121 testes
```

Último resultado informado:

```text
121 / 121 testes aprovados
```

---

## Decisões arquiteturais

### Colisão por segmento

A TASK-011 usa o segmento do grafo como unidade de ocupação.

Não foi inventada granularidade interna de posição dentro do segmento.

### Reutilizar CompositionPosition

A regra de colisão consome:

```text
CompositionPosition.segmentId
```

e não cria outro conceito paralelo de posição.

### Não mover regra para UI

A colisão é regra de domínio.

A interface futura apenas apresentará o bloqueio.

### Não integrar ao Store nesta task

O Zustand será integrado em etapa posterior, junto com posições reais das composições.

---

## Fora do escopo

Não implementado:

```text
ocupação de AMV
colisão parcial dentro de um mesmo segmento
distância física entre veículos
placa PARE no store
movimentação visual
drag-and-drop
```

---

## Critérios de aceite

- [x] regra de colisão criada
- [x] própria composição ignorada
- [x] segmento livre permitido
- [x] segmento ocupado bloqueado
- [x] integração ao `stepComposition`
- [x] motivo `collision` adicionado
- [x] testes específicos implementados
- [x] testes anteriores preservados
- [x] 121 testes aprovados

---

## Próxima task

```text
TASK-012 — Ocupação de AMV
```

A próxima task deve continuar no domínio puro.

Não conectar à UI antes de existir:

- regra de ocupação de AMV;
- testes;
- integração controlada ao estado.

