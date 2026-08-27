# REGRAS OPERACIONAIS CONSOLIDADAS — ISSUE #1

## Princípio central

```text
TRILHO FÍSICO != ZONA DE ESTACIONAMENTO
```

No Modo Preparação, material nasce apenas:

```text
MARCO <-> MARCO
```

ou:

```text
PLACA PARE <-> MARCO
```

Nunca:
- sobre AMV;
- entre AMV e marco;
- invadindo gabarito;
- fora da zona segura.

A região além do marco pode existir para circulação futura, mas não para estacionamento inicial.

## Ocupação

```text
1 vagão = 1 unidade
1 locomotiva = 1 unidade
```

Excesso de capacidade gera alerta, não bloqueio.

A capacidade orienta a escala visual do material.

Locomotiva deve manter largura mínima visual suficiente para ser reconhecível e não pode ser sobreposta por vagões.

## Ordem

A ordem cadastrada é física e deve ser preservada.

```text
10 FVR
LOCO 3820
5 EPI
```

não pode ser reorganizado ou consolidado automaticamente.

Blocos iguais cadastrados separadamente permanecem separados.

## Capacidades consolidadas

```text
L30               = 30
L28               = 4
L26               = 4

L24_SUPERIOR      = 18
L24_TRAVESSAO     = 12
L24_INFERIOR      = 55

L22_SUPERIOR      = 22
L22_TRAVESSAO     = 12
L22_INFERIOR      = 55
L22_CURVA         = 13
```

NÃO inventar capacidades para:

```text
L20
L18
L16
```

Se uma tarefa depender delas, solicitar definição operacional.

## L22/L24

L24:

```text
L24_SUPERIOR
L24_TRAVESSAO
L24_INFERIOR
```

L22:

```text
L22_SUPERIOR
L22_TRAVESSAO
L22_INFERIOR
L22_CURVA
```

São regiões independentes para seleção, estado, capacidade e estacionamento.

## Travessão

Capacidade de referência:

```text
12 unidades
```

Material somente entre marcos.

## Alça curva L22 / AMV-12

É região selecionável no Modo Preparação.

Capacidade:

```text
13 unidades
```

Referência operacional:

```text
12 a 13 vagões
ou
1 locomotiva + 12 vagões
```

Material:
- começa depois do gabarito do AMV-12;
- termina antes da placa PARE;
- acompanha visualmente a curva.

## L26 / L28

```text
capacidade = 4 em cada
```

`4/4` ocupa aproximadamente 100% da zona útil, preservando área livre antes do AMV.

## Locomotiva

- SVG, não emoji.
- Frente barra/Ré barra controlam orientação.
- número sempre legível e nunca espelhado.
- conta como 1 unidade.
- não pode ser engolida/sobreposta pelo bloco de vagões.

## AMVs

As regras dos AMVs passaram por várias iterações.

NÃO refatore ou reinterpretar nesta etapa.

Preserve:
- posições;
- rotas;
- bloqueios;
- intervalo;
- AMV-07;
- AMV-08;
- AMV-12;
- cores;
- geometria validada.

Se a tarefa exigir mudar AMV, pare e peça definição antes.
