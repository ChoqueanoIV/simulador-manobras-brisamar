# TASK-010 — Motor de Movimento por Passo Discreto

## Objetivo

Criar a primeira operação de movimento lógico de uma composição no grafo do Pátio Brisamar.

Esta task permanece exclusivamente no domínio:

- sem React;
- sem SVG;
- sem Zustand;
- sem drag-and-drop;
- sem colisão;
- sem ocupação de AMV;
- sem persistência.

A função produz apenas a próxima `CompositionPosition` ou um motivo de bloqueio.

---

## Dependências reutilizadas

A implementação reutiliza componentes já consolidados:

```text
Composition
hasLocomotive
CompositionPosition
flipDirection
advanceToSegment
resolveNextSegment
getActiveSwitchConnection
SwitchDefinition
SwitchState
IntervalState
TrackSegment
```

Nenhuma dessas regras foi duplicada ou reimplementada.

---

## Arquivo implementado

```text
app/src/simulation/domain/movement/stepComposition.ts
```

API principal:

```ts
stepComposition(
  composition,
  position,
  direction,
  segments,
  switchDefs,
  switchStates,
  interval,
)
```

Direções aceitas:

```text
head
tail
```

---

## Fluxo consolidado

```text
Composition
    |
    v
tem locomotiva?
    |
    +-- não --> no-locomotive
    |
    v
direção = tail?
    |
    +-- sim --> flipDirection(position)
    |
    v
resolveNextSegment(...)
    |
    +-- bloqueado --> preserva motivo do navigationEngine
    |
    v
identifica nó de entrada no próximo segmento
    |
    v
advanceToSegment(...)
    |
    v
nextPosition
```

---

## Regra: vagões sem locomotiva

Uma composição que não possui locomotiva não pode executar passo de movimento.

Resultado:

```text
no-locomotive
```

A regra é verificada antes de consultar a navegação.

---

## Movimento pela frente

Com:

```text
direction = head
```

a posição atual é usada como está.

`headNodeId` representa o nó de saída da composição.

---

## Movimento pela cauda

Com:

```text
direction = tail
```

a função utiliza:

```text
flipDirection(position)
```

antes de consultar o motor de navegação.

Isso representa uma mudança da direção lógica do movimento sem mutar a posição recebida.

A posição original permanece imutável.

---

## Travessia de AMV

Regra crítica preservada:

```text
AMV NÃO É SEGMENTO
```

O `navigationEngine` já atravessa logicamente o AMV antes de selecionar o segmento seguinte.

Como o contrato público de `resolveNextSegment` retorna o próximo segmento, mas não expõe diretamente o `throughNodeId`, a TASK-010 recupera o nó de entrada usando a conexão ativa já definida por:

```text
SwitchDefinition
SwitchState
getActiveSwitchConnection
```

Não foi alterado o `navigationEngine`.

---

## Bloqueios preservados

A TASK-010 não redefine bloqueios.

Ela propaga os motivos existentes:

```text
terminal
switch-against
interval-required
stop-board
```

e acrescenta somente:

```text
no-locomotive
```

---

## Intervalo

A TASK-010 apenas encaminha o estado atual de intervalo ao `navigationEngine`.

Portanto continua valendo:

- áreas protegidas bloqueiam sem intervalo;
- entrada é permitida quando o intervalo está concedido;
- regras especiais dos AMVs permanecem no domínio existente.

Nenhuma regra de intervalo foi duplicada nesta task.

---

## Testes implementados

Arquivo:

```text
app/src/simulation/domain/movement/stepComposition.test.ts
```

Cenários cobertos:

1. bloqueia composição sem locomotiva;
2. avança pela frente;
3. avança pela cauda;
4. movimento pela cauda não muta a posição original;
5. retorna `terminal`;
6. bloqueia segmento protegido sem intervalo;
7. permite segmento protegido com intervalo;
8. atravessa AMV pela conexão ativa;
9. preserva `switch-against`.

---

## Resultado da validação

Após a TASK-009:

```text
102 testes
```

Após a TASK-010:

```text
111 testes
```

Estado validado:

```text
8 suítes aprovadas
111 / 111 testes aprovados
build aprovado
TypeScript aprovado
Vite aprovado
```

O lint deve permanecer obrigatório na validação final antes do commit.

---

## Decisões tomadas

### Reutilizar `resolveNextSegment`

Não criar um segundo motor de navegação.

### Não modificar `navigationEngine`

A TASK-010 consome o contrato existente e resolve somente a informação necessária para produzir a nova posição.

### Não integrar ao store

Integração com Zustand pertence a etapa posterior.

### Não implementar colisão

Colisão pertence à TASK-011.

### Não calcular ocupação de AMV

Pertence à TASK-012.

---

## Fora do escopo

Não implementado aqui:

```text
colisão
ocupação de AMV
placa PARE no store
posição no Zustand
movimentação visual
drag-and-drop
engate automático
corte pela UI
persistência
```

---

## Critérios de aceite

- [x] `stepComposition` implementado
- [x] composição sem locomotiva bloqueada
- [x] avanço por `head`
- [x] avanço por `tail`
- [x] posição original não mutada
- [x] integração com `resolveNextSegment`
- [x] intervalo preservado
- [x] chave contra preservada
- [x] travessia de AMV validada
- [x] testes específicos implementados
- [x] testes anteriores preservados
- [x] build aprovado
- [ ] lint final antes do commit

---

## Próxima task

```text
TASK-011 — Colisão
```

Não iniciar TASK-011 no mesmo commit desta task.

Antes:

1. rodar lint;
2. rodar todos os testes;
3. rodar build;
4. revisar `git diff`;
5. revisar `git status`;
6. documentar/commitar TASK-009 e TASK-010 de forma controlada.
