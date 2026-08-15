# TASK-004 — Estados e Operação dos AMVs

## Objetivo

Transformar os AMVs do mapa estático em elementos interativos, preservando a geometria aprovada do Pátio Brisamar.

Esta task introduz **estado e operação visual dos AMVs**, mas ainda não implementa movimento de locomotivas ou vagões.

---

## Escopo

Implementar:

- estado A/B para cada AMV;
- clique para alternar posição;
- representação visual clara da posição atual;
- bloqueio visual por intervalo;
- regra especial do AMV-09;
- bloqueio futuro por ocupação preparado na estrutura;
- estado inicial coerente com as regras do pátio;
- testes unitários das regras de operação.

Ainda não implementar:

- locomotivas;
- vagões;
- engate;
- corte;
- movimento;
- detecção real de ocupação;
- chave contra durante circulação;
- colisão.

---

# Regras por AMV

## AMV-01

- Posição A: L22 ↔ L26
- Posição B: L22 ↔ L28
- Intervalo: não obrigatório

## AMV-02

- Posição A: L24 ↔ L24
- Posição B: L24 ↔ acesso L26/L28
- Intervalo: não obrigatório

## AMV-03

- Posição A: L24 ↔ L24
- Posição B: L24 ↔ L30
- Intervalo: não obrigatório

## AMV-04

- Posição A: L24 ↔ L24
- Posição B: L24 ↔ L22
- Intervalo: não obrigatório

## AMV-05

- Posição A: L22 ↔ L22
- Posição B: L22 ↔ L24
- Intervalo: não obrigatório

## AMV-06

- Posição A: L16 ↔ L16
- Posição B: L16 ↔ diagonal de manobra
- Intervalo: obrigatório para manipulação

Sem intervalo:
- não pode ser manipulado;
- exibir cadeado.

Com intervalo:
- pode alternar A/B se desocupado.

## AMV-07

- Posição A: L18 ↔ L18
- Posição B: L18 ↔ diagonal de manobra
- Intervalo: obrigatório para manipulação

Sem intervalo:
- não pode ser manipulado;
- exibir cadeado.

Com intervalo:
- pode alternar A/B se desocupado.

## AMV-08

- Posição A: L20 ↔ L20
- Posição B: L20 ↔ diagonal de manobra
- Intervalo: obrigatório para manipulação

Sem intervalo:
- não pode ser manipulado;
- exibir cadeado.

Com intervalo:
- pode alternar A/B se desocupado.

## AMV-09

- Posição A: L22 ↔ L22
- Posição B: L22 ↔ L20

Regra especial:

Sem intervalo:
- circulação futura L22 ↔ L22 deverá continuar permitida;
- AMV deve permanecer em A;
- clique para mudar para B deve ser bloqueado;
- exibir cadeado/restrição visual.

Com intervalo:
- pode alternar A/B se desocupado.

Ao entregar intervalo:
- deve obrigatoriamente voltar para A;
- se estiver ocupado, a entrega do intervalo será bloqueada futuramente.

## AMV-10

- Posição A: L22 ↔ L22
- Posição B: L22 ↔ L24
- Intervalo: não obrigatório

## AMV-11

- Posição A: L24 ↔ L24
- Posição B: L24 ↔ L22
- Intervalo: não obrigatório

## AMV-12

- Posição A: L22 ↔ L22
- Posição B: L22 ↔ L24
- Intervalo: não obrigatório

---

# Estado inicial

Toda nova sessão deve iniciar:

- sem intervalo;
- AMV-09 em posição A (L22 ↔ L22);
- AMVs 06, 07 e 08 bloqueados para clique;
- demais AMVs podem iniciar em posição A como padrão técnico do MVP.

> Observação: anteriormente foi definido que vários AMVs poderiam iniciar em qualquer posição. Para o software, usar A como padrão torna o estado inicial determinístico sem alterar a regra operacional. Isso deve permanecer documentado como decisão técnica do MVP.

---

# Estado de bloqueio

Cada AMV deverá possuir internamente:

```ts
type SwitchState = {
  id: SwitchId;
  position: 'A' | 'B';
  occupied: boolean;
};
```

A permissão de operação não deve ser armazenada como estado duplicado.

Ela deve ser calculada a partir de:

- AMV;
- intervalo;
- ocupação;
- regra específica.

Exemplo:

```ts
canOperateSwitch(switchState, intervalState)
```

---

# Regras de operação

A operação deverá seguir esta ordem:

1. verificar se AMV está ocupado;
2. verificar regra de intervalo;
3. verificar restrição de posição;
4. se permitido, alternar posição;
5. atualizar visual.

---

# Prioridade de bloqueios

## Ocupação

Se `occupied === true`:

- operação bloqueada independentemente de intervalo;
- exibir cadeado.

## Intervalo

AMV-06, 07 e 08:

- sem intervalo: bloqueados;
- com intervalo: liberados se desocupados.

AMV-09:

- sem intervalo: posição A permitida, alteração para B bloqueada;
- com intervalo: A/B permitidas se desocupado.

---

# Representação visual

Cada AMV deve mostrar:

- número;
- posição atual;
- trecho ativo de forma clara;
- estado bloqueado.

Sugestão visual:

## Liberado

- ponto/vermelho atual pode ser mantido;
- ramo ativo recebe destaque;
- clique disponível.

## Bloqueado

- cadeado próximo ao número;
- cursor `not-allowed`;
- tooltip com motivo.

Exemplos de tooltip:

```text
AMV-07
Posição A
Bloqueado: intervalo não concedido
```

```text
AMV-09
Posição A — L22 ↔ L22
Acesso à L20 requer intervalo
```

---

# Controle temporário de intervalo

Para testar esta task, adicionar temporariamente à interface:

```text
Intervalo: Não concedido
[ Solicitar intervalo ]
```

Quando ativo:

```text
Intervalo: Concedido
[ Entregar intervalo ]
```

Neste momento, o botão existe apenas para validar os estados dos AMVs.

A lógica completa de movimentação nas linhas protegidas será implementada em task posterior.

---

# Entrega do intervalo nesta task

Como ainda não existe ocupação real:

- ao clicar em `Entregar intervalo`;
- AMV-09 deve retornar automaticamente para A;
- intervalo volta para `not-granted`;
- AMVs 06, 07 e 08 voltam a ficar bloqueados.

Quando ocupação real existir, a regra será expandida para bloquear a entrega se AMV-09 estiver ocupado.

---

# Estrutura sugerida

```text
app/src/
├── yard/
│   ├── components/
│   │   ├── YardCanvas.tsx
│   │   └── SwitchView.tsx
│   └── data/
│       └── brisamarSwitches.ts
│
├── simulation/
│   └── domain/
│       └── switches/
│           ├── switchRules.ts
│           └── switchRules.test.ts
│
├── state/
│   └── simulationStore.ts
│
└── types/
    └── switch.ts
```

---

# Tipos sugeridos

```ts
export type SwitchPosition = 'A' | 'B';

export type SwitchId =
  | 'AMV-01'
  | 'AMV-02'
  | 'AMV-03'
  | 'AMV-04'
  | 'AMV-05'
  | 'AMV-06'
  | 'AMV-07'
  | 'AMV-08'
  | 'AMV-09'
  | 'AMV-10'
  | 'AMV-11'
  | 'AMV-12';

export type SwitchState = {
  id: SwitchId;
  position: SwitchPosition;
  occupied: boolean;
};
```

---

# Funções de domínio

Criar funções puras como:

```ts
canOperateSwitch(...)
toggleSwitch(...)
getSwitchLockReason(...)
normalizeSwitchesOnIntervalReturn(...)
```

A regra não deve ficar diretamente dentro de `YardCanvas.tsx`.

---

# Testes mínimos

## AMV-06

```text
sem intervalo + desocupado → bloqueado
com intervalo + desocupado → permitido
com intervalo + ocupado → bloqueado
```

## AMV-09

```text
sem intervalo + posição A → circulação visual permitida
sem intervalo + tentativa de mudar para B → bloqueado
com intervalo + tentativa de mudar para B → permitido
entregar intervalo com AMV-09 em B → retorna para A
```

## AMV comum

Exemplo AMV-10:

```text
sem intervalo + desocupado → permitido
ocupado → bloqueado
```

---

# Critérios de aceite

- [ ] AMV-01 a AMV-12 possuem estado A/B;
- [ ] posição atual é visualmente identificável;
- [ ] clique alterna AMVs comuns;
- [ ] AMV-06, 07 e 08 ficam bloqueados sem intervalo;
- [ ] AMV-09 não pode ir para L20 sem intervalo;
- [ ] AMV-09 continua representando L22 ↔ L22 sem intervalo;
- [ ] intervalo pode ser concedido/entregue pela interface;
- [ ] entregar intervalo retorna AMV-09 para A;
- [ ] cadeado aparece em AMVs bloqueados;
- [ ] regras estão separadas da camada React;
- [ ] testes das regras passam;
- [ ] `npm run lint` passa;
- [ ] `npm run test` passa;
- [ ] `npm run build` passa;
- [ ] geometria aprovada da TASK-003 não é alterada.

---

# Commit sugerido

```text
feat: adiciona estados e operacao dos amvs
```
