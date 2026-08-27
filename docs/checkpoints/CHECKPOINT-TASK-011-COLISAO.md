# CHECKPOINT — TASK-011 — Colisão

## Estado atual

A base de movimento lógico agora cobre:

```text
TASK-009 → posição da composição
TASK-010 → passo discreto de movimento
TASK-011 → colisão por segmento
```

Fluxo atual:

```text
Composition
+ CompositionPosition
+ direction
+ topology
+ switches
+ interval
+ positionedCompositions
        |
        v
stepComposition
        |
        +-- no-locomotive
        +-- terminal
        +-- switch-against
        +-- interval-required
        +-- stop-board
        +-- collision
        |
        v
nextPosition
```

## Testes

```text
TASK-009: 102 testes totais
TASK-010: 111 testes totais
TASK-011: 121 testes totais
```

Último estado validado:

```text
121 / 121 testes aprovados
```

## Teste visual

Ainda NÃO é necessário.

A lógica ainda não está conectada ao Zustand/UI.

O primeiro teste em tela deve acontecer imediatamente quando:

- posições reais forem persistidas no store; e
- o movimento passar a alterar o material renderizado no mapa.

Não avançar várias etapas de UI sem essa validação intermediária.

## Próximo passo

```text
TASK-012 — Ocupação de AMV
```

Regra conhecida e consolidada:

```text
AMV ocupado = não pode ser manipulado.
```

A TASK-012 deve determinar ocupação a partir das posições das composições e da topologia existente.

Não inventar distância física, porcentagem de ocupação ou geometria adicional sem definição explícita.

