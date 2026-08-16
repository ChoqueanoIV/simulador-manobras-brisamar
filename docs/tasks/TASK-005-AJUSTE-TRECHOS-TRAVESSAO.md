# TASK-005 — Ajuste dos trechos L22/L24 no Travessão

## Contexto

Durante a validação visual do Modo Preparação foi identificado que L22 e L24
não podem ser tratadas como uma única área de estacionamento.

A linha física continua conectada, porém a preparação deve respeitar os
limites operacionais definidos pelos marcos.

## Regra consolidada

As linhas L22 e L24 passam a possuir três regiões independentes:

```text
SUPERIOR | TRAVESSÃO | INFERIOR
```

Cada região possui sua própria zona válida para material estacionado.

## Travessão

O trecho intermediário possui capacidade de referência:

```text
12 veículos
```

de marco a marco.

Para a referência visual de capacidade:

- 1 vagão = 1 unidade;
- 1 locomotiva = 1 unidade.

## Regra de posicionamento

Locomotivas e vagões adicionados no Modo Preparação:

- nunca devem nascer em área de AMV;
- nunca devem ultrapassar um marco;
- devem permanecer somente dentro da área segura do trecho selecionado;
- podem circular posteriormente além dos marcos durante a simulação,
  mas não podem ser cadastrados estacionados fora deles.

## IDs

```text
L24_SUPERIOR
L24_TRAVESSAO
L24_INFERIOR

L22_SUPERIOR
L22_TRAVESSAO
L22_INFERIOR
```

## Critério visual

Ao clicar em cada uma dessas regiões, o painel lateral deve mostrar
explicitamente o trecho correspondente.

Exemplo:

```text
Linha 22 - travessão
0 / 12
```
