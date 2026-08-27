# CHECKPOINT — TASK-009 + TASK-010 — Base do Motor de Movimento

## Estado

A base lógica para movimentação da composição no grafo está pronta.

### TASK-009

Criada abstração:

```text
CompositionPosition
```

com:

```text
segmentId
headNodeId
tailNodeId
```

Operações:

```text
createPosition
flipDirection
advanceToSegment
```

A posição de uma composição agora pode ser representada de forma independente da UI.

### TASK-010

Criado:

```text
stepComposition
```

Fluxo:

```text
Composition + CompositionPosition
        |
        v
hasLocomotive
        |
        v
resolveNextSegment
        |
        v
advanceToSegment
        |
        v
nextPosition
```

Bloqueios preservados:

```text
terminal
switch-against
interval-required
stop-board
no-locomotive
```

## Testes

Antes:

```text
92 testes
```

TASK-009:

```text
+10
= 102
```

TASK-010:

```text
+9
= 111
```

Último resultado informado:

```text
8 suítes
111 / 111 testes
build aprovado
```

## Teste visual

Ainda NÃO é necessário.

Nenhuma alteração desta etapa está conectada à UI ou ao `SimulationStore`.

O primeiro teste visual obrigatório deverá ocorrer assim que a posição/movimento lógico passar a alterar o estado usado pelo pátio em tela.

## Próximo passo

Antes da TASK-011:

```text
lint
test
build
git diff
git status
```

Depois consolidar commit/checkpoint.

Próxima etapa de domínio:

```text
TASK-011 — Colisão
```

Regra conhecida:

- duas composições podem existir na mesma linha;
- não podem se sobrepor;
- não podem atravessar uma à outra.

Não inventar granularidade/ocupação adicional sem definição explícita.
