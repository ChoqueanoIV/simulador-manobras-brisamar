# ARQUITETURA.md

# Arquitetura — Simulador de Manobras do Pátio Brisamar

## 1. Objetivo

Este documento define a arquitetura inicial do Simulador de Manobras do Pátio Brisamar.

A arquitetura deve priorizar:

- simplicidade;
- execução offline;
- custo zero;
- facilidade de manutenção;
- organização clara;
- boa separação entre interface, estado e regras de domínio;
- facilidade de evolução com ChatGPT e Codex;
- documentação suficiente para uso como projeto de portfólio.

O projeto não deve introduzir backend, banco de dados, cloud ou serviços externos sem necessidade real.

---

## 2. Stack proposta

### Linguagem

- TypeScript

### Interface

- React

### Build e desenvolvimento

- Vite

### Renderização do pátio

- SVG interativo

### Estado da aplicação

- Zustand

### Testes

- Vitest
- Testing Library

### Qualidade

- ESLint
- Prettier

### Persistência

- nenhuma no MVP

### Backend

- nenhum no MVP

### Banco de dados

- nenhum no MVP

### Empacotamento desktop

O MVP poderá inicialmente funcionar como aplicação local executada no navegador.

Uma etapa posterior poderá avaliar empacotamento desktop com Tauri, mantendo a aplicação offline.

---

## 3. Princípios arquiteturais

### 3.1 Domínio independente da interface

As regras ferroviárias não devem ficar acopladas aos componentes React.

Exemplos:

- determinar se um AMV pode ser operado;
- validar chave contra;
- verificar se existe intervalo;
- verificar ocupação de AMV;
- calcular conexão entre segmentos;
- determinar quais elementos pertencem a uma composição;
- realizar corte;
- realizar engate.

Essas regras devem existir em funções e serviços de domínio testáveis.

### 3.2 SVG como representação visual

O Pátio Brisamar será desenhado em SVG.

O SVG deverá representar:

- trilhos;
- AMVs;
- marcos;
- placas PARE;
- blocos de vagões;
- locomotivas;
- regiões de interação.

O SVG é a camada visual.

A topologia do pátio deverá existir também como dados estruturados.

### 3.3 Topologia baseada em grafo

O pátio será representado internamente como uma rede de:

- nós;
- segmentos;
- AMVs;
- conexões.

Isso permitirá ao motor determinar qual é o próximo segmento válido durante uma movimentação.

### 3.4 Estado apenas em memória

Toda simulação existe apenas enquanto a aplicação estiver aberta.

Ao recarregar ou fechar:

- locomotivas desaparecem;
- vagões desaparecem;
- composições desaparecem;
- intervalo volta ao estado inicial;
- pátio retorna ao estado vazio.

### 3.5 Regras físicas acima da intenção

O sistema não deve tentar adivinhar para onde o praticante deseja ir.

A composição seguirá:

- o trilho disponível;
- a posição real dos AMVs;
- as restrições físicas;
- as regras de intervalo.

---

## 4. Estrutura proposta

```text
src/
├── app/
│   ├── App.tsx
│   └── providers/
│
├── components/
│   ├── controls/
│   ├── dialogs/
│   ├── tooltips/
│   └── common/
│
├── yard/
│   ├── data/
│   │   ├── brisamarTopology.ts
│   │   ├── brisamarSwitches.ts
│   │   ├── brisamarMarkers.ts
│   │   └── brisamarStopBoards.ts
│   ├── components/
│   │   ├── YardCanvas.tsx
│   │   ├── TrackSegmentView.tsx
│   │   ├── SwitchView.tsx
│   │   ├── MarkerView.tsx
│   │   └── StopBoardView.tsx
│   └── geometry/
│
├── rolling-stock/
│   ├── components/
│   │   ├── LocomotiveView.tsx
│   │   └── WagonBlockView.tsx
│   ├── domain/
│   └── utils/
│
├── simulation/
│   ├── domain/
│   │   ├── movement/
│   │   ├── coupling/
│   │   ├── cutting/
│   │   ├── interval/
│   │   └── switches/
│   ├── services/
│   └── validators/
│
├── state/
│   ├── simulationStore.ts
│   └── selectors.ts
│
├── types/
│
└── shared/
    ├── constants/
    ├── utils/
    └── math/
```

---

## 5. Separação de responsabilidades

### `yard`

Representa a estrutura fixa do Pátio Brisamar.

Responsável por:

- topologia;
- coordenadas;
- AMVs;
- marcos;
- placas;
- segmentos;
- desenho SVG.

### `rolling-stock`

Representa o material rodante.

Responsável por:

- locomotivas;
- blocos de vagões;
- orientação;
- comprimento visual;
- identificação;
- cor.

### `simulation`

Contém o coração das regras.

Responsável por:

- movimento;
- chave contra;
- engate;
- corte;
- ocupação;
- intervalo;
- placas PARE;
- permissões operacionais.

### `state`

Mantém o estado atual da simulação em memória.

### `components`

Contém componentes genéricos de interface.

---

## 6. Modos da aplicação

### Preparation Mode

Permite:

- adicionar locomotiva;
- adicionar vagões;
- definir quantidade;
- definir texto livre;
- definir cor;
- definir orientação;
- resetar uma linha;
- preencher anotação opcional.

### Simulation Mode

Permite:

- operar AMVs;
- solicitar intervalo;
- entregar intervalo;
- movimentar composições;
- engatar;
- cortar.

Não permite:

- editar artificialmente o pátio;
- resetar linha;
- adicionar ou remover material diretamente;
- desfazer automaticamente movimentos.

---

## 7. Fluxo principal

```text
Aplicação inicia
      ↓
Pátio vazio
      ↓
Modo Preparação
      ↓
Usuário preenche o pátio
      ↓
Iniciar Simulação
      ↓
Modo Simulação
      ↓
Movimentação livre respeitando regras
      ↓
Aplicação fechada
      ↓
Estado descartado
```

---

## 8. Zoom e pan

O canvas do pátio deverá suportar:

- zoom com roda do mouse;
- deslocamento horizontal;
- deslocamento vertical.

O zoom não deve alterar as regras físicas da simulação.

---

## 9. Escala visual

Blocos de vagões devem possuir tamanho proporcional à quantidade.

A escala gráfica será calibrada no protótipo.

A capacidade de trecho é referência de marco a marco e não deve funcionar como bloqueio rígido.

---

## 10. Regras que pertencem ao motor

O motor deverá conhecer, entre outras:

- vagão não se move sem locomotiva;
- composição não atravessa outra composição;
- AMV ocupado não pode ser operado;
- chave contra bloqueia circulação;
- chave reversa direciona a composição para o caminho real;
- AMVs 06, 07 e 08 exigem intervalo para manipulação;
- AMV-09 possui comportamento especial;
- intervalo libera áreas protegidas;
- placa PARE exige intervalo para ser ultrapassada;
- entrega do intervalo exige AMV-09 livre;
- entrega do intervalo retorna AMV-09 para L22 ↔ L22.

---

## 11. Testabilidade

As regras de negócio deverão ser testáveis sem renderizar a interface.

Exemplos de testes:

- `shouldBlockSwitchWhenOccupied`
- `shouldBlockProtectedSwitchWithoutInterval`
- `shouldAllowL22PassageThroughSwitch09WithoutInterval`
- `shouldBlockMovementAgainstSwitch`
- `shouldSplitWagonBlockAtRequestedPosition`
- `shouldNotMoveWagonsWithoutLocomotive`
- `shouldPreventCompositionOverlap`
- `shouldResetSwitch09WhenIntervalIsReturned`

---

## 12. Decisões para o MVP

Não implementar inicialmente:

- backend;
- API;
- banco;
- login;
- cloud;
- histórico;
- persistência;
- avaliação;
- pontuação;
- multiplayer;
- sincronização;
- inteligência para resolver manobra;
- algoritmo de melhor rota.

---

## 13. Próxima etapa

Após aprovação desta arquitetura:

1. formalizar o modelo de domínio;
2. criar backlog;
3. criar estrutura inicial do repositório;
4. inicializar React + TypeScript + Vite;
5. criar primeiro protótipo estático do Pátio Brisamar;
6. validar geometria antes de implementar movimentação.
