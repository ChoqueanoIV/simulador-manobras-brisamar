# CHECKPOINT — TASK-012 — Ocupação de AMV

## Base de movimento atualmente disponível

```text
TASK-009 → CompositionPosition
TASK-010 → stepComposition
TASK-011 → colisão por segmento
TASK-012 → ocupação de AMV derivada das posições
```

## Fluxo de estado

```text
PositionedComposition[]
        |
        v
simulationStore.setPositionedCompositions
        |
        v
applySwitchOccupancyToStates
        |
        v
SwitchState.occupied
        |
        v
toggleSwitch
        |
        +-- occupied → posição não muda
```

## Estado validado

```text
11 suítes
142 / 142 testes
build aprovado
```

## Correção registrada

Uma tentativa de teste usou `AMV-99 as SwitchState`.

O TypeScript rejeitou corretamente porque `AMV-99` não pertence a `SwitchId`.

A versão corrigida usa `AMV-11` real, omitindo apenas sua definição no mapa de
SwitchDefinitions.

## Ponto importante antes da próxima integração

Ainda NÃO existe regra consolidada neste checkpoint dizendo como transformar
automaticamente uma `YardSectionState` preenchida durante a preparação em:

```text
Composition
+
CompositionPosition.headNodeId
+
CompositionPosition.tailNodeId
```

Em especial, não inferir silenciosamente a direção inicial da composição.

A topologia possui orientação convencional de segmentos, mas isso não é, por
si só, regra suficiente para decidir a frente operacional de toda composição.

## Teste visual

Ainda não é necessário.

Torná-lo obrigatório imediatamente quando uma etapa conectar posições reais
ao mapa/interface.

## Próxima referência do roadmap

O contexto anterior aponta para:

```text
TASK-013 — Store de posições + placa PARE
```

Antes de implementar qualquer conversão automática do cenário preparado,
validar se já existe documentação definindo a direção inicial das composições.

Não inventar essa regra.
