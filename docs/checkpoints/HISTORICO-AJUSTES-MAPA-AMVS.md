# HISTORICO_AJUSTES_MAPA_AMVS.md

# Histórico de Tentativas e Ajustes — Pátio Brisamar

Este documento registra as principais decisões tomadas durante a construção visual do mapa e dos AMVs.

O objetivo é evitar repetição de erros nas próximas etapas.

---

## Tentativa 1 — mapa genérico

### Erro
O pátio foi desenhado de forma excessivamente abstrata, com várias linhas paralelas e uma região inferior que não existia no quadro.

### Aprendizado
Não inferir a topologia somente a partir dos nomes das linhas.

A referência visual do quadro deve ter prioridade.

---

## Tentativa 2 — aproximação do quadro

A geometria passou a representar:

- diagonais;
- linhas curtas;
- travessão;
- região protegida;
- alça direita.

Melhorou significativamente, mas os marcos permaneceram incorretos.

---

## Marcos — primeiro erro

Os marcos foram colocados sobre o trilho.

Isso contradiz sua função visual e operacional.

Correção:
- deslocar para a área branca.

---

## Marcos — segundo erro

Os marcos foram aproximados das curvas seguindo a própria diagonal.

Erro:
- o marco não acompanha a curva;
- ele representa gabarito de segurança.

Correção:
- posicionar entre linhas paralelas;
- tratar como limite lateral de material estacionado.

---

## Marcos — terceiro erro

Tentou-se usar capacidade de vagões para calcular automaticamente o ponto do marco.

Erro:
- a capacidade depende do marco;
- portanto o marco deve ser posicionado primeiro pela geometria.

Correção:
1. definir geometria;
2. definir marco;
3. posteriormente calibrar tamanho dos vagões.

---

## AMVs — primeira representação

Somente número + posição:

```text
08 · A
08 · B
```

Problema:
- exigia interpretação mental;
- não mostrava claramente para onde a rota estava alinhada.

Correção:
- destacar o trilho ativo.

---

## AMVs — cores A/B

Primeira tentativa:

```text
A = azul
B = laranja
```

Problema:
- poderia sugerir estado permitido/proibido.

Correção:
```text
qualquer rota ativa = laranja
```

---

## AMV-07 e AMV-08 — erro de interpretação 1

Foi interpretado que a escolha seria entre:

- trecho reto para CCO;
- diagonal.

Isso não representava corretamente a decisão operacional.

---

## AMV-07 e AMV-08 — erro de interpretação 2

Foi interpretado que o destaque da diagonal deveria continuar para os dois lados simultaneamente.

Também incorreto.

Regra consolidada:

### AMV-08
```text
vindo do AMV-09:
A → L20
B → L18
```

### AMV-07
```text
vindo do AMV-08:
A → L18
B → L16
```

São destinos mutuamente exclusivos.

---

## AMV-06

Foi inicialmente exibido com cadeado por ser fixo.

Problema:
- cadeado transmite bloqueio de circulação.

Correção:
- AMV-06 fixo;
- sem cadeado;
- circulação permitida;
- interface não oferece manipulação.

---

## AMV-09

Foi importante distinguir:

```text
bloqueio de manipulação
≠
bloqueio de circulação
```

Sem intervalo:

```text
L22 ↔ L22 permitido
L22 ↔ L20 não selecionável
```

---

## AMV-12 — erro de interpretação 1

Foi desenhada rota:

```text
L22 ↔ alça
```

e

```text
L22 ↔ L24
```

como se a alça fosse uma alternativa móvel.

Erro.

---

## AMV-12 — erro de interpretação 2

Depois a alça foi deixada fixa em preto e o destaque alternava apenas L22/L24.

Problema:
- visualmente parecia que a alça não fazia parte da rota.

---

## AMV-12 — regra final

A alça é sempre uma ponta da rota.

O AMV seleciona a outra ponta:

```text
alça ↔ L22
```

ou

```text
alça ↔ L24 superior
```

Visual final:

```text
alça laranja + L22 laranja
```

ou

```text
alça laranja + L24 laranja
```

Nunca L22 e L24 simultaneamente.

---

## Conclusão

A etapa mostrou que, neste projeto, pequenos detalhes geométricos possuem significado operacional.

Regra para futuras implementações:

> Não transformar uma inferência visual em regra de domínio sem validar primeiro a operação ferroviária correspondente.
