# TASK-012 — Ocupação de AMV por Composição

## Objetivo

Derivar o estado `occupied` dos AMVs a partir das posições lógicas das
composições no grafo do Pátio Brisamar.

Regra operacional consolidada:

```text
AMV ocupado = não pode ser manipulado.
```

Nesta task, uma composição posicionada em qualquer segmento adjacente a uma
das três pontas do AMV torna esse AMV ocupado.

O AMV continua sendo uma conexão entre nós e nunca um segmento.

---

## Arquivos criados

```text
app/src/simulation/domain/switch-occupancy/switchOccupancy.ts
app/src/simulation/domain/switch-occupancy/switchOccupancy.test.ts
app/src/simulation/domain/switch-occupancy/applySwitchOccupancy.ts
app/src/simulation/domain/switch-occupancy/applySwitchOccupancy.test.ts
```

## Arquivos integrados

```text
app/src/state/simulationStore.ts
app/src/state/simulationStore.test.ts
```

---

## Regra de adjacência

Uma posição ocupa um AMV quando o segmento em que a composição está possui
como `startNodeId` ou `endNodeId` qualquer um dos nós:

```text
nodeCommon
nodeA
nodeB
```

A regra é calculada a partir de:

```text
CompositionPosition
TrackSegment
SwitchDefinition
```

Não foi criada geometria paralela.

---

## APIs criadas

### isPositionAdjacentToSwitch

Verifica se a posição lógica está em um segmento adjacente ao AMV.

### isSwitchOccupiedByComposition

Retorna `true` quando pelo menos uma composição está em segmento adjacente.

### applySwitchOccupancyToStates

Recalcula apenas:

```text
SwitchState.occupied
```

Preserva:

```text
SwitchState.id
SwitchState.position
```

Não muta o array de estados recebido.

---

## Integração com o Zustand

O `simulationStore` passa a possuir:

```text
positionedCompositions
setPositionedCompositions(...)
```

Quando as posições são atualizadas:

```text
positionedCompositions
        |
        v
applySwitchOccupancyToStates
        |
        v
switches[].occupied
```

A manipulação do AMV continua usando a regra existente de `toggleSwitch`.

Portanto não foi duplicada a regra:

```text
occupied = não manipular
```

---

## Testes

A TASK-012 foi construída incrementalmente.

### Etapa 1

Implementação da regra de ocupação.

Estado:

```text
121 testes anteriores preservados
```

### Etapa 2

Testes de `switchOccupancy`.

Cobertura:

- nodeCommon;
- nodeA;
- nodeB;
- segmento distante;
- segmento inexistente;
- nenhuma composição;
- múltiplas composições.

Resultado:

```text
131 testes
```

### Etapa 3

Criação de `applySwitchOccupancyToStates`.

Resultado:

```text
131 testes preservados
```

### Etapa 4

Testes da derivação de estados.

Resultado esperado inicialmente:

```text
138 testes
```

### Etapa 5

Integração ao `simulationStore`.

Foram adicionados testes para:

- store iniciar sem posições;
- AMV-05 ficar ocupado com composição em `SEG-L22-SUP`;
- AMV-05 voltar a ficar livre após afastamento;
- `operateSwitch` não alterar AMV ocupado.

Resultado final:

```text
11 suítes
142 / 142 testes aprovados
build aprovado
```

---

## Tentativa que falhou e correção

Durante a Etapa 4 foi criado um teste tentando representar um estado sem
definição correspondente por meio de:

```text
AMV-99
```

com coerção:

```ts
as SwitchState
```

O Vitest executou, mas o TypeScript corretamente rejeitou no build:

```text
TS2352
Type '"AMV-99"' is not comparable to type 'SwitchId'
```

A tentativa foi descartada.

### Correção

O teste passou a usar um `SwitchState` real e válido:

```text
AMV-11
```

enquanto o `Record<string, SwitchDefinition>` fornecido ao teste contém apenas
a definição de `AMV-10`.

Assim é possível testar corretamente:

```text
SwitchState válido sem definição correspondente
```

sem violar o tipo `SwitchId`.

Resultado após a correção:

```text
142 / 142 testes
build aprovado
```

---

## Decisões arquiteturais

### Não alterar SwitchId

Nenhum ID artificial é aceito apenas para facilitar testes.

### Não duplicar bloqueio de AMV ocupado

`toggleSwitch` continua sendo a fonte da regra de manipulação.

### Ocupação é derivada

`occupied` não deve ser uma informação independente da posição das
composições quando a simulação estiver operando com posições reais.

### Ainda não criar direção inicial das composições

A TASK-012 só precisa do `segmentId` para determinar adjacência.

A definição de `headNodeId`/`tailNodeId` inicial a partir do cenário preparado
não deve ser inventada nesta task.

---

## Teste em tela

Ainda não existe um teste visual operacional significativo para esta task.

Motivo:

```text
setPositionedCompositions()
```

já está integrado ao store, porém a UI ainda não possui uma ação real que
converta o cenário preparado em `CompositionPosition` ou mova uma composição.

Criar uma tela/harness artificial apenas para testar isso acrescentaria código
temporário ao produto.

O teste em tela deverá ser obrigatório assim que a próxima integração criar
posições reais utilizadas pela interface.

---

## Fora do escopo

Não implementado:

```text
direção inicial da composição
conversão automática de YardSection para CompositionPosition
placa PARE
movimentação na UI
drag-and-drop
colisão visual
ocupação parcial do AMV por distância
```

---

## Critérios de aceite

- [x] ocupação por adjacência implementada
- [x] nodeCommon/nodeA/nodeB cobertos
- [x] derivação imutável dos SwitchStates
- [x] posição A/B preservada
- [x] integração ao Zustand
- [x] AMV ocupado bloqueia operação pela regra existente
- [x] tentativa inválida AMV-99 documentada e corrigida
- [x] 142 testes aprovados
- [x] build aprovado
