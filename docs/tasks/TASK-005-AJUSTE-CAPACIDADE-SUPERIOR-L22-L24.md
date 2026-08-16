# TASK-005 — Ajuste de capacidade visual L22/L24 superior

## Problema observado

Ao cadastrar 10 vagões:

- L22 superior ocupava visualmente todo o trecho;
- L24 superior também ocupava espaço excessivo.

A causa era a ausência de `capacityReference` nesses dois trechos. Sem
capacidade configurada, o renderizador tratava qualquer ocupação como 100% da
área útil.

## Regra corrigida

### L22 superior

```text
Capacidade de referência: 22 veículos
```

Logo:

```text
10 veículos = 10 / 22 ≈ 45% da área útil
22 veículos = 22 / 22 = 100% da área útil
```

### L24 superior

```text
Capacidade de referência: 18 veículos
```

Logo:

```text
10 veículos = 10 / 18 ≈ 56% da área útil
18 veículos = 18 / 18 = 100% da área útil
```

## Regra de estacionamento preservada

A escala continua restrita à zona útil:

```text
placa PARE ↔ marco
```

ou:

```text
marco ↔ marco
```

conforme o trecho.

Nenhum material cadastrado no Modo Preparação deve nascer na região de AMV ou
fora do limite protegido pelo marco.
