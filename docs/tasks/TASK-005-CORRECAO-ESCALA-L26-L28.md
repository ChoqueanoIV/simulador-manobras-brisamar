# TASK-005 — Correção da escala visual de L26 e L28

## Problema observado

L26 e L28 possuem capacidade de 4 veículos cada, porém quatro vagões eram
renderizados com comprimentos muito diferentes.

Isso fazia a L26 parecer comportar muito mais material do que a L28 e levava
o bloco da L26 excessivamente próximo ao AMV-01.

## Correção

As duas linhas passam a usar a mesma extensão visual útil para estacionamento:

```text
L28: 4 / 4 → 100% da zona útil
L26: 4 / 4 → 100% da zona útil
```

Assim, quatro vagões possuem aproximadamente o mesmo comprimento visual nas
duas linhas.

A área restante até o AMV permanece livre, preservando gabarito e circulação.

## Regra preservada

- capacidade L26 = 4;
- capacidade L28 = 4;
- locomotiva conta como uma unidade;
- material nunca deve ser criado sobre AMV;
- material deve permanecer dentro da zona segura de estacionamento.
