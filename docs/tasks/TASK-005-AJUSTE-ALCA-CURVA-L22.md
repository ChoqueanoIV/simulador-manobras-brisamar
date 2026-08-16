# TASK-005 — Ajuste da alça curva da L22

## Regra operacional informada

A alça curva ligada ao AMV-12 comporta aproximadamente:

```text
12 a 13 vagões
```

ou:

```text
1 locomotiva + 12 vagões
```

Como o simulador considera:

```text
1 vagão = 1 unidade
1 locomotiva = 1 unidade
```

a capacidade de referência do trecho foi configurada como:

```text
13 unidades
```

## Novo trecho

```text
L22_CURVA
```

Rótulo:

```text
Linha 22 - alça curva
```

## Estacionamento

A alça passa a ser selecionável durante o Modo Preparação.

O material:

- não nasce junto ao AMV-12;
- começa somente após a região de gabarito da chave;
- termina antes da placa PARE;
- acompanha visualmente a curvatura da linha;
- continua sujeito ao alerta de capacidade.

## Exemplos

```text
12 vagões        → 12 / 13
13 vagões        → 13 / 13
1 loco + 12 vagões → 13 / 13
14 vagões        → 14 / 13 ⚠
```
