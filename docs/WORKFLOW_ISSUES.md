# WORKFLOW_ISSUES.md

# Fluxo de Desenvolvimento a partir da TASK-005

A partir desta etapa, novas funcionalidades relevantes devem preferencialmente nascer como Issues.

## Fluxo

```text
Ideia / Regra
   ↓
Issue
   ↓
Task em docs/tasks
   ↓
Branch
   ↓
Implementação
   ↓
Lint + Test + Build
   ↓
Validação visual
   ↓
Commit
   ↓
PR
   ↓
Merge
   ↓
Checkpoint quando necessário
```

## Quando criar uma Issue

Criar para:

- funcionalidade;
- bug;
- melhoria relevante;
- alteração de regra operacional;
- refatoração de impacto.

Não criar uma Issue separada para:

- ajuste de poucos pixels;
- pequeno ajuste de CSS dentro de uma entrega já aberta;
- correção de texto;
- tentativa intermediária durante a mesma implementação.

Esses ajustes pertencem à Issue em andamento.

## Convenção sugerida de branch

```text
feat/<numero>-descricao
fix/<numero>-descricao
refactor/<numero>-descricao
docs/<numero>-descricao
```

Exemplo:

```text
feat/5-modo-preparacao-patio
```

## Commits

Usar Conventional Commits / Semantic Commit em português.

Exemplos:

```text
feat: implementa modo de preparacao do patio
fix: corrige selecao visual do amv 12
test: adiciona testes das regras de preparacao
docs: atualiza checkpoint do simulador brisamar
```
