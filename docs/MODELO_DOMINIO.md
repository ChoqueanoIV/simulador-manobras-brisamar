# MODELO_DOMINIO.md

# Modelo de Domínio — Simulador de Manobras do Pátio Brisamar

## 1. Objetivo

Este documento descreve as principais entidades de domínio do simulador e suas responsabilidades.

O domínio deverá representar a realidade necessária para a simulação sem tentar reproduzir detalhes ferroviários que ficaram fora do escopo do MVP.

---

## 2. Yard

Representa o Pátio Brisamar.

### Responsabilidades

- armazenar os segmentos ferroviários;
- armazenar os AMVs;
- armazenar os marcos;
- armazenar as placas PARE;
- manter a topologia fixa.

### Exemplo conceitual

```ts
type Yard = {
  segments: TrackSegment[];
  switches: Switch[];
  markers: Marker[];
  stopBoards: StopBoard[];
};
```

---

## 3. TrackSegment

Representa um trecho navegável de trilho.

Não deve ser confundido com o nome geral de uma linha.

Uma mesma linha, como L22, poderá possuir diversos segmentos.

### Propriedades conceituais

```ts
type TrackSegment = {
  id: string;
  line: string;
  region?: 'superior' | 'travessao' | 'inferior' | 'tecnico';
  startNodeId: string;
  endNodeId: string;
  referenceCapacity?: number;
  protectedByInterval?: boolean;
};
```

---

## 4. Marker

Representa um marco físico.

### Responsabilidades

- servir de referência espacial;
- delimitar trechos de capacidade;
- permitir passagem normal.

### Regra

O marco não bloqueia circulação.

---

## 5. StopBoard

Representa uma placa PARE.

### Regra

- sem intervalo: não pode ser ultrapassada;
- com intervalo: pode ser ultrapassada.

---

## 6. Switch

Representa um AMV.

### Propriedades conceituais

```ts
type Switch = {
  id: string;
  position: 'A' | 'B';
  connections: SwitchConnections;
  intervalRule: SwitchIntervalRule;
  occupied: boolean;
};
```

### Regras gerais

- possui exatamente duas posições;
- posição muda instantaneamente;
- posição deve ser visível;
- não pode ser operado se estiver ocupado;
- pode direcionar a composição para outro caminho;
- pode estar contra dependendo do sentido de chegada.

---

## 7. SwitchConnections

Define quais extremidades ficam conectadas em cada posição.

Exemplo:

```ts
type SwitchConnections = {
  A: [string, string];
  B: [string, string];
};
```

Não é o nome da linha que determinará o movimento, mas a conexão entre nós/segmentos.

---

## 8. SwitchIntervalRule

Representa a dependência de intervalo.

```ts
type SwitchIntervalRule =
  | { type: 'none' }
  | { type: 'full-lock' }
  | { type: 'restricted-position'; allowedWithoutInterval: 'A' | 'B' };
```

### Exemplos

AMV-06:

```text
full-lock
```

Sem intervalo não pode ser manipulado.

AMV-09:

```text
restricted-position
allowedWithoutInterval = posição L22 ↔ L22
```

---

## 9. RollingStock

Tipo base para material rodante.

```ts
type RollingStock = Locomotive | WagonUnit;
```

Internamente, mesmo que a interface mostre blocos, o motor poderá precisar representar unidades individuais para permitir cortes em qualquer posição.

---

## 10. Locomotive

Representa uma locomotiva.

### Propriedades

```ts
type Locomotive = {
  id: string;
  number: string;
  orientation: 'frente-barra' | 're-barra';
};
```

### Regras

- normalmente identificada por quatro dígitos;
- possui engate em ambas as extremidades;
- pode puxar;
- pode empurrar;
- orientação não limita o sentido de circulação;
- pode trabalhar sozinha ou engatada a outras locomotivas.

---

## 11. WagonUnit

Representação lógica de um vagão individual.

Mesmo que o usuário cadastre `10 FVR`, internamente o domínio poderá representar dez unidades.

Isso permite:

- cortar 4 + 6;
- cortar 12 + 3;
- preservar a ordem;
- reconstruir blocos visuais.

```ts
type WagonUnit = {
  id: string;
  label: string;
  color: string;
  sourceBlockId: string;
};
```

---

## 12. WagonBlock

Representação visual de vagões consecutivos agrupados.

```ts
type WagonBlock = {
  id: string;
  label: string;
  color: string;
  wagonIds: string[];
};
```

### Regras

- tamanho visual proporcional à quantidade;
- blocos iguais não se unem automaticamente;
- identificação é texto livre;
- cor não possui significado operacional obrigatório.

---

## 13. Coupling

Representa um engate físico entre dois veículos.

```ts
type Coupling = {
  fromRollingStockId: string;
  toRollingStockId: string;
};
```

### Regras

- locomotiva possui engate em ambas as extremidades;
- vagão possui engate em ambas as extremidades;
- qualquer engate existente pode ser cortado;
- contato não gera engate automático.

---

## 14. Composition

Representa um conjunto fisicamente engatado.

```ts
type Composition = {
  id: string;
  rollingStockIds: string[];
  position: CompositionPosition;
};
```

### Regras

- pode conter uma ou várias locomotivas;
- pode conter locomotiva no meio;
- pode conter apenas locomotivas;
- pode representar dupla, trio ou quadra de máquinas;
- só pode movimentar vagões se houver locomotiva pertencendo à composição.

---

## 15. CompositionPosition

Representa a posição física da composição no grafo.

O modelo definitivo será fechado durante a implementação do movimento.

Conceitualmente deverá permitir:

- saber em qual segmento está a frente;
- saber em qual segmento está a traseira;
- saber quais AMVs estão ocupados;
- representar composição atravessando vários segmentos simultaneamente.

---

## 16. IntervalState

Representa o estado da concessão de intervalo.

```ts
type IntervalState = 'not-granted' | 'granted';
```

### Estado inicial

```text
not-granted
```

### Ao conceder

- libera movimentação protegida;
- libera AMVs protegidos;
- libera ultrapassagem de placas PARE.

### Ao entregar

- AMV-09 precisa estar livre;
- AMV-09 retorna para L22 ↔ L22;
- áreas protegidas voltam a ficar bloqueadas para movimento;
- materiais podem permanecer estacionados.

---

## 17. SimulationState

Estado geral da sessão atual.

```ts
type SimulationState = {
  mode: 'preparation' | 'simulation';
  yard: Yard;
  locomotives: Locomotive[];
  wagons: WagonUnit[];
  wagonBlocks: WagonBlock[];
  couplings: Coupling[];
  compositions: Composition[];
  interval: IntervalState;
  stationNote: string;
};
```

---

## 18. Preparation Mode

Permite edição direta.

### Ações

- adicionar locomotiva;
- adicionar bloco;
- escolher quantidade;
- definir identificação;
- escolher cor;
- definir orientação;
- resetar linha;
- escrever anotação.

### Ordem

Elementos são cadastrados da esquerda para a direita.

---

## 19. Simulation Mode

Não permite edição direta da passagem de serviço.

Mudanças somente por:

- movimento;
- engate;
- corte;
- operação de AMV;
- concessão de intervalo.

---

## 20. Movimento

A ação de movimento deverá receber uma composição e um deslocamento solicitado pelo mouse.

O motor determinará:

1. direção;
2. segmento atual;
3. próximo nó;
4. existência de AMV;
5. posição do AMV;
6. chave contra ou passagem válida;
7. intervalo;
8. placa PARE;
9. colisão;
10. ocupação futura.

---

## 21. Colisão

Duas composições podem estar na mesma linha.

Não podem:

- se sobrepor;
- atravessar uma à outra;
- empurrar uma à outra sem engate.

Ao contato:

- movimento para;
- composições continuam separadas;
- usuário pode optar por engatar.

---

## 22. Ocupação de AMV

Um AMV estará ocupado sempre que qualquer parte de locomotiva ou vagão estiver sobre sua região física.

Enquanto ocupado:

- não pode mudar de posição.

---

## 23. Chave contra

O motor deverá determinar a condição a partir de:

- lado pelo qual a composição chega;
- posição A/B;
- conexões ativas.

Se não existir conexão válida para atravessar o AMV naquele sentido:

- movimento bloqueado.

---

## 24. Chave direcionando para outro caminho

Se existe conexão válida, mas não é o caminho imaginado pelo praticante:

- movimento permitido;
- composição segue pela conexão real.

---

## 25. Capacidade

A capacidade é atributo de referência do segmento entre marcos.

Não é bloqueio.

Quando ultrapassada:

- gerar apenas indicação visual.

---

## 26. Princípio do domínio

O domínio deve responder:

> “Esta ação é fisicamente e operacionalmente permitida no modelo atual?”

O domínio não deve responder:

> “Esta é a melhor manobra?”

A estratégia pertence ao praticante.
