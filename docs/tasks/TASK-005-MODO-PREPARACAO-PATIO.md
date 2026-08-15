# TASK-005 — Modo de Preparação do Pátio

## Status
Planejada

## Objetivo

Implementar o modo de preparação do Pátio Brisamar.

Ao abrir a aplicação, o pátio deve iniciar vazio e o praticante deverá reproduzir a passagem de serviço antes de iniciar qualquer simulação de manobra.

Esta task não implementa movimentação de locomotivas ou vagões. O foco é montar corretamente o cenário inicial.

---

## 1. Fluxo principal

```text
Abrir aplicação
        ↓
Pátio vazio
        ↓
Modo Preparação
        ↓
Preencher locomotivas e vagões
        ↓
Revisar cenário
        ↓
Iniciar Simulação
        ↓
Modo Preparação encerrado
```

Depois de iniciar a simulação, não será possível retornar ao modo preparação.

---

## 2. Estado inicial

Ao abrir a aplicação:

- nenhuma locomotiva no pátio;
- nenhum vagão no pátio;
- nenhuma composição criada;
- intervalo não concedido;
- AMVs no estado inicial definido;
- modo atual = `preparation`.

```ts
type SimulationMode = 'preparation' | 'simulation';
```

---

## 3. Seleção da linha

Durante o modo preparação, o praticante poderá clicar em uma região válida de linha.

Ao clicar, abrir menu contextual ou painel com:

```text
Adicionar locomotiva
Adicionar vagão/vagões
Resetar linha
Cancelar
```

`Resetar linha` somente deve aparecer quando existir material cadastrado no trecho selecionado.

---

## 4. Adicionar locomotiva

Campos:

```text
Número
Orientação
```

### Número

Texto livre, com recomendação visual de quatro dígitos.

Exemplo:

```text
3820
```

Não bloquear outro formato nesta primeira versão.

### Orientação

Opções:

```text
Frente barra
Ré barra
```

A orientação representa a posição física da locomotiva.

Ela não limita:

- puxar;
- recuar;
- direção futura da circulação.

---

## 5. Adicionar vagão ou bloco de vagões

Campos:

```text
Quantidade
Identificação
Cor
```

### Quantidade

- inteiro positivo;
- mínimo 1.

### Identificação

Texto livre.

Exemplos:

```text
FVR
EPI
Bobina
Placa
Contêiner
Perfil
Tubo
```

O sistema não interpreta semanticamente esse conteúdo.

### Cor

Cor escolhida pelo praticante apenas para diferenciação visual.

A cor não possui regra operacional.

---

## 6. Blocos iguais permanecem separados

Exemplo:

```text
5 FVR
3 EPI
5 FVR
```

Resultado:

```text
[5 FVR] [3 EPI] [5 FVR]
```

Nunca unir automaticamente os dois blocos FVR.

---

## 7. Ordem de preenchimento

O cadastro deve acontecer da esquerda para a direita na representação visual da linha.

Exemplo:

Primeiro:

```text
8 FVR
```

Depois:

```text
5 Bobina
```

Resultado:

```text
[8 FVR][5 Bobina]
```

---

## 8. Locomotiva entre vagões

O modelo precisa permitir cenários como:

```text
[10 FVR] [3820] [5 Bobina]
```

Isso é válido e pode existir já na passagem de serviço.

A locomotiva não precisa ficar obrigatoriamente em uma extremidade da linha.

---

## 9. Múltiplas locomotivas

Durante o preenchimento deve ser possível cadastrar:

- uma locomotiva;
- duas locomotivas;
- três locomotivas;
- quatro locomotivas;
- locomotivas separadas por vagões.

Exemplo:

```text
[3820][3812][10 FVR]
```

ou

```text
[10 FVR][3820][5 EPI][3812]
```

---

## 10. Representação visual da locomotiva

Sugestão inicial:

```text
┌────────┐
│  3820  │
│ Frente │
└────────┘
```

ou de forma mais compacta dentro do SVG.

A locomotiva precisa ser claramente diferente de um bloco de vagões.

---

## 11. Representação visual dos vagões

O tamanho visual do bloco deve variar de acordo com a quantidade.

Exemplo conceitual:

```text
[ 3 ]
[      10      ]
[              20              ]
```

Não é necessário representar cada vagão individualmente na tela.

Internamente, porém, a estrutura deverá permitir cortes futuros dentro do bloco.

---

## 12. Tooltip

Ao passar o mouse sobre um bloco:

```text
Quantidade: 10
Identificação: FVR
```

Para locomotiva:

```text
Locomotiva: 3820
Orientação: Frente barra
```

---

## 13. Capacidade

Durante o modo preparação, o sistema deve comparar a quantidade cadastrada com a capacidade de referência do trecho.

Exemplo:

```text
59 / 55 ⚠
```

Regra:

- apenas alertar;
- nunca bloquear cadastro;
- nunca bloquear início da simulação.

Motivo:
vagões possuem comprimentos físicos diferentes.

---

## 14. Capacidade é do trecho, não da linha inteira

A capacidade deve estar vinculada à região correta:

```text
placa PARE ↔ marco
```

ou

```text
marco ↔ marco
```

conforme o trecho real.

Não usar a extensão visual inteira da linha como capacidade automática.

---

## 15. Resetar linha

Disponível somente no modo preparação.

Ao clicar:

- remover todas as locomotivas daquele trecho;
- remover todos os blocos de vagões daquele trecho;
- solicitar confirmação antes da exclusão.

Exemplo:

```text
Deseja limpar todo o conteúdo da L22 inferior?
```

Depois de `Iniciar Simulação`, reset deixa de existir.

---

## 16. Correção de preenchimento

Nesta primeira versão, não haverá edição individual de um bloco já cadastrado.

Se o praticante preencher incorretamente:

1. resetar o trecho;
2. preencher novamente na ordem correta.

Isso mantém o modo preparação simples.

---

## 17. Anotação da estação

Adicionar campo opcional de texto livre.

Exemplo:

```text
KSV:
10 FVR + 5 bobinas + 8 contêineres
```

Características:

- opcional;
- não interpretado;
- não validado;
- não interfere em regras;
- serve apenas como referência visual.

---

## 18. Iniciar Simulação

Adicionar botão:

```text
Iniciar Simulação
```

Ao clicar:

1. confirmar que o praticante deseja encerrar o preenchimento;
2. alterar modo para `simulation`;
3. ocultar ações de cadastro;
4. ocultar reset de linha;
5. manter todo o cenário montado;
6. manter AMVs e intervalo disponíveis conforme regras já implementadas.

---

## 19. Confirmação

Sugestão:

```text
Iniciar simulação?

Após iniciar, o preenchimento do pátio não poderá ser alterado diretamente.
Qualquer mudança deverá ocorrer por manobra.
```

Botões:

```text
Cancelar
Iniciar Simulação
```

---

## 20. Estrutura de domínio sugerida

```text
app/src/
├── preparation/
│   ├── components/
│   │   ├── AddRollingStockMenu.tsx
│   │   ├── AddLocomotiveForm.tsx
│   │   ├── AddWagonBlockForm.tsx
│   │   └── StationNotes.tsx
│   └── domain/
│       └── preparationRules.ts
│
├── rolling-stock/
│   ├── components/
│   │   ├── LocomotiveView.tsx
│   │   └── WagonBlockView.tsx
│   └── types/
│       └── rollingStock.ts
│
└── state/
    └── simulationStore.ts
```

---

## 21. Tipos sugeridos

```ts
type LocomotiveOrientation = 'front-barra' | 'rear-barra';

type Locomotive = {
  id: string;
  kind: 'locomotive';
  number: string;
  orientation: LocomotiveOrientation;
};

type WagonBlock = {
  id: string;
  kind: 'wagon-block';
  quantity: number;
  label: string;
  color: string;
};

type RollingStock = Locomotive | WagonBlock;
```

---

## 22. Ordem na linha

Cada trecho deverá possuir uma coleção ordenada.

Exemplo:

```ts
type YardSectionState = {
  sectionId: string;
  rollingStock: RollingStock[];
};
```

A posição no array representa a ordem visual inicial.

Exemplo:

```ts
[
  { kind: 'wagon-block', quantity: 10, label: 'FVR' },
  { kind: 'locomotive', number: '3820' },
  { kind: 'wagon-block', quantity: 5, label: 'EPI' },
]
```

---

## 23. Identificadores de trechos

Evitar usar apenas:

```text
L22
L24
```

porque uma mesma linha possui regiões diferentes.

Exemplos de IDs futuros:

```text
L22_SUPERIOR
L22_TRAVESSAO
L22_INFERIOR
L24_SUPERIOR
L24_TRAVESSAO
L24_INFERIOR
```

Além das demais linhas conforme o mapa.

---

## 24. Testes mínimos

### Vagões

```text
quantidade 0 → inválido
quantidade -1 → inválido
quantidade 1 → válido
texto livre → válido
```

### Locomotiva

```text
número preenchido → válido
orientação frente barra → válida
orientação ré barra → válida
```

### Ordem

Cadastrar:

```text
5 FVR
3820
3 EPI
```

deve preservar exatamente:

```text
5 FVR → 3820 → 3 EPI
```

### Reset

```text
trecho com materiais
→ reset
→ rollingStock = []
```

### Iniciar simulação

```text
preparation → simulation
```

Após isso:

```text
cadastro direto → indisponível
reset → indisponível
```

---

## 25. Fora do escopo

Esta task NÃO implementa:

- arrastar locomotivas;
- movimentação de vagões;
- engate;
- corte;
- colisão;
- chave contra;
- ocupação real de AMV;
- placa PARE funcional;
- validação final do trem;
- persistência.

---

## 26. Critérios de aceite

- [ ] aplicação inicia com pátio vazio;
- [ ] modo inicial é preparação;
- [ ] linha/trecho pode ser selecionado;
- [ ] adicionar locomotiva;
- [ ] orientação frente/ré barra;
- [ ] adicionar bloco de vagões;
- [ ] quantidade livre positiva;
- [ ] identificação livre;
- [ ] escolha de cor;
- [ ] blocos iguais não são unidos;
- [ ] ordem de cadastro é preservada;
- [ ] locomotiva pode ficar entre vagões;
- [ ] múltiplas locomotivas são permitidas;
- [ ] tooltip funciona;
- [ ] alerta de capacidade não bloqueia;
- [ ] reset de trecho funciona;
- [ ] anotação da estação é opcional;
- [ ] botão Iniciar Simulação funciona;
- [ ] cadastro/reset desaparecem no modo simulação;
- [ ] cenário é preservado após iniciar;
- [ ] geometria e AMVs existentes não são alterados;
- [ ] lint passa;
- [ ] testes passam;
- [ ] build passa.

---

## 27. Commit sugerido

```text
feat: implementa modo de preparacao do patio
```
