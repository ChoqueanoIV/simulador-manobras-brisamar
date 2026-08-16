# HISTÓRICO DE TENTATIVAS — ISSUE #1

Este documento funciona como índice rápido das tentativas realizadas na implementação do Modo Preparação.

## Sequência

```text
Fundação de domínio
↓
Primeiro painel de preparação
↓
Primeira renderização no SVG
↓
Correção de lint por cursor mutável
↓
Correção TypeScript de section undefined
↓
Primeira locomotiva
↓
Ajuste de orientação Frente/Ré barra
↓
Separação trilho físico x estacionamento
↓
Locomotiva SVG
↓
Escala por capacidade
↓
Locomotiva passa a contar 1 unidade
↓
Correção de sobreposição vagão/locomotiva
↓
Nova tentativa visual top-down da locomotiva
↓
Divisão L22/L24 em 3 regiões
↓
Travessão com capacidade 12
↓
Criação da alça curva L22
↓
Capacidade da curva = 13
↓
Renderização acompanhando a curva
↓
Capacidade L22 superior = 22
↓
Capacidade L24 superior = 18
↓
Capacidade L26 = 4
↓
Capacidade L28 = 4
↓
Correção da escala visual L26/L28
```

## Decisões descartadas

- usar emoji de locomotiva;
- usar uma única região para toda L22;
- usar uma única região para toda L24;
- considerar somente vagões na capacidade;
- permitir material nascer perto do AMV;
- usar largura fixa de bloco sem capacidade;
- usar cursor mutável durante render;
- tratar alça curva apenas como rota sem estacionamento.

## Princípio consolidado

```text
A geometria permite circulação.
Os marcos definem estacionamento seguro.
A capacidade define referência de ocupação.
A interface deve respeitar as três coisas separadamente.
```
