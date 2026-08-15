# 🚆 Simulador de Manobras — Pátio Brisamar

Simulador visual e interativo para **planejamento de manobras ferroviárias no Pátio Brisamar**, desenvolvido a partir de situações e regras encontradas na rotina operacional ferroviária.

O projeto busca transformar em software uma prática já utilizada no dia a dia: representar o estado atual do pátio e planejar, antes da execução em campo, como locomotivas e vagões deverão ser movimentados para formar uma determinada composição.

> ⚠️ **Este projeto é um simulador de planejamento e treinamento.  
> Não substitui procedimentos, normas, autorizações ou orientações operacionais vigentes.**

---

## 🎯 Objetivo

Em um pátio ferroviário, os vagões necessários para formar um trem podem estar distribuídos entre diferentes linhas e em diferentes posições.

Por exemplo, uma composição solicitada pode precisar de:

- vagões destinados a Volta Redonda;
- vagões de bobina;
- vagões de placa;
- vagões de contêiner;
- outros tipos ou destinos.

Esses materiais nem sempre estão agrupados.

O desafio do praticante é analisar o estado atual do pátio e planejar uma sequência de manobras capaz de organizar a composição desejada.

É daí que nasce a ideia do projeto:

> **um "Tetris ferroviário" para planejamento de manobras.**

---

## 🧩 Como o simulador funcionará

Ao abrir o programa, o Pátio Brisamar estará vazio.

O praticante utilizará as informações recebidas na passagem de serviço para reproduzir o cenário encontrado no início do turno.

Fluxo previsto:

```text
Abrir o simulador
        ↓
Pátio vazio
        ↓
Preencher a passagem de serviço
        ↓
Adicionar locomotivas e vagões
        ↓
Iniciar simulação
        ↓
Operar AMVs
        ↓
Engatar e cortar materiais
        ↓
Puxar e recuar composições
        ↓
Planejar a formação do trem
```

Não existe uma solução obrigatória.

O praticante poderá testar estratégias diferentes até encontrar a sequência de manobras que considerar adequada.

---

## 🛤️ Pátio Brisamar

O cenário do simulador será baseado na topologia real utilizada no planejamento das manobras do **Pátio Brisamar**.

O mapa será reconstruído digitalmente e permitirá interação com:

- linhas ferroviárias;
- AMVs;
- marcos;
- placas PARE;
- locomotivas;
- vagões;
- blocos de vagões;
- composições.

O desenho poderá ter proporções ajustadas para melhorar a experiência na tela, preservando a topologia necessária para a simulação.

---

## 🚂 Locomotivas

As locomotivas serão identificadas principalmente pelo número.

Exemplo:

```text
3820
```

Também será possível informar sua orientação:

```text
Frente barra
Ré barra
```

A orientação representa sua posição física no pátio, mas não impede movimentos nos dois sentidos.

O simulador permitirá:

- locomotiva isolada;
- dupla de máquinas;
- trio de máquinas;
- quadra de máquinas;
- locomotivas no meio de composições;
- locomotivas puxando vagões;
- locomotivas recuando vagões.

---

## 🚃 Vagões

O sistema não possuirá um cadastro rígido de tipos de vagão.

O preenchimento será propositalmente flexível para acompanhar a forma como uma passagem de serviço pode ser registrada.

Exemplos:

```text
10 FVR
8 Bobina
12 Placa
5 EPI
3 Contêiner
```

Cada bloco terá:

- quantidade;
- descrição livre;
- cor escolhida pelo praticante.

Blocos com a mesma descrição não serão agrupados automaticamente.

Por exemplo:

```text
[5 FVR] [3 EPI] [5 FVR]
```

continuará representando três grupos distintos.

---

## 📏 Representação visual dos blocos

O tamanho visual dos blocos será proporcional à quantidade de vagões.

Assim:

```text
[ 6 vagões ]
```

será visualmente menor que:

```text
[          20 vagões          ]
```

Isso permitirá identificar rapidamente onde existem concentrações maiores de material sem preencher o mapa com textos.

As informações detalhadas poderão ser exibidas ao passar o mouse sobre o bloco.

---

## 🔗 Engate e corte

O contato entre materiais não provocará engate automático.

Quando uma locomotiva ou composição encostar em outro material:

1. o movimento será interrompido;
2. os materiais permanecerão separados;
3. o praticante poderá decidir se deseja realizar o engate.

Será possível realizar cortes entre quaisquer engates válidos.

Exemplo:

```text
[15 FVR]
```

poderá ser cortado em:

```text
[12 FVR] [3 FVR]
```

---

## 🔀 AMVs

Os aparelhos de mudança de via serão elementos interativos do simulador.

Cada AMV possuirá duas posições possíveis.

O praticante deverá observar a posição das chaves e preparar corretamente a rota antes ou durante suas manobras.

O simulador distinguirá situações como:

### Chave reversa

A chave direciona a composição para outro caminho possível.

Nesse caso, o trem simplesmente seguirá o caminho definido pela posição atual do AMV.

### Chave contra

A composição tenta transpor o AMV por um sentido incompatível com sua posição.

Na situação real isso poderia provocar a quebra da chave.

Nesse caso, o simulador impedirá o movimento.

---

## 🔒 Proteção dos AMVs

Um AMV não poderá ser manipulado enquanto existir locomotiva ou vagão sobre sua região.

Quando estiver ocupado, será exibida uma indicação visual de bloqueio.

Somente após todo o material liberar a região será possível alterar sua posição.

---

## 📻 Intervalo de manobra

Toda simulação começará sem intervalo concedido.

O sistema terá controles para:

- **Solicitar intervalo para a estação**
- **Entregar intervalo para a estação**

O intervalo interfere na possibilidade de:

- operar determinados AMVs;
- movimentar materiais em áreas protegidas;
- acessar determinadas linhas;
- ultrapassar placas PARE.

Entre os AMVs envolvidos nessa regra estão os AMVs **06, 07, 08 e 09**.

Uma particularidade importante é o AMV-09:

Sem intervalo, uma composição poderá circular normalmente pela rota:

```text
L22 → L22
```

Porém, sua operação para permitir:

```text
L22 → L20
```

dependerá da concessão de intervalo.

---

## 🛑 Placas PARE

As placas PARE serão limites operacionais durante a simulação.

Sem intervalo, a composição não poderá ultrapassar o limite.

Com intervalo concedido, a ultrapassagem poderá ser realizada.

---

## 📐 Capacidade das linhas

A capacidade será representada **de marco a marco**, acompanhando a lógica utilizada no pátio.

Exemplo:

```text
Linha 22
Capacidade de referência: 55 vagões
```

A capacidade não será uma trava rígida.

Como diferentes vagões possuem comprimentos físicos diferentes, poderão existir situações como:

```text
59 / 55 ⚠️
```

O simulador apresentará um alerta, mas continuará permitindo a operação.

---

## 🖱️ Interação

O projeto foi pensado inicialmente para utilização em computador.

Estão previstos:

- movimentação por clique e arraste;
- animação contínua das composições;
- zoom com a roda do mouse;
- movimentação do mapa;
- tooltips;
- indicação visual das posições dos AMVs;
- indicação visual de AMVs bloqueados.

Não haverá controle de velocidade das locomotivas.

---

## 🧠 Filosofia da simulação

O programa não pretende dizer ao praticante qual é a melhor manobra.

Também não pretende avaliar sua estratégia.

Não haverá inicialmente:

- pontuação;
- ranking;
- número de erros;
- histórico;
- sugestão automática de rota;
- algoritmo de melhor manobra;
- validação automática da formação final.

A proposta é oferecer liberdade para experimentar.

Se uma estratégia não funcionar, o praticante deverá corrigir a situação realizando novas manobras.

---

## 💾 Funcionamento offline

O projeto foi pensado para funcionar localmente e sem dependência de infraestrutura externa.

Não será necessário:

- login;
- matrícula;
- servidor;
- API;
- banco de dados;
- cloud;
- conexão permanente com a internet.

Ao fechar ou atualizar a aplicação, o cenário será descartado.

Uma nova execução começará novamente com o pátio vazio.

---

## 🛠️ Tecnologias

Base inicial:

- **React**
- **TypeScript**
- **Vite**
- **Zustand**
- **Vitest**
- **Testing Library**
- **ESLint**
- **Prettier**

O projeto prioriza ferramentas gratuitas e open source.

---

## 🏗️ Arquitetura

A aplicação está sendo estruturada para separar:

```text
Interface
   ↓
Estado da simulação
   ↓
Motor ferroviário
   ↓
Topologia do pátio
   ↓
Regras operacionais
```

Essa separação permitirá evoluir as regras ferroviárias sem concentrar toda a lógica nos componentes React.

---

## 📁 Estrutura do repositório

```text
simulador-manobras-brisamar/
│
├── app/
│   └── aplicação React + TypeScript
│
├── docs/
│   ├── ARQUITETURA.md
│   ├── BACKLOG_MVP.md
│   ├── ESCOPO_MVP.md
│   ├── MAPA_BRISAMAR_V1_CONSOLIDADO.md
│   ├── MODELO_DOMINIO.md
│   └── tasks/
│
├── scripts/
├── AGENTS.md
└── README.md
```

---

## 📚 Documentação

### Escopo

[`docs/ESCOPO_MVP.md`](docs/ESCOPO_MVP.md)

Define o comportamento esperado do primeiro produto funcional.

### Arquitetura

[`docs/ARQUITETURA.md`](docs/ARQUITETURA.md)

Define a organização técnica da aplicação.

### Modelo de domínio

[`docs/MODELO_DOMINIO.md`](docs/MODELO_DOMINIO.md)

Documenta os principais conceitos ferroviários representados pelo software.

### Mapa Brisamar

[`docs/MAPA_BRISAMAR_V1_CONSOLIDADO.md`](docs/MAPA_BRISAMAR_V1_CONSOLIDADO.md)

Consolida a interpretação da topologia utilizada pelo simulador.

### Backlog

[`docs/BACKLOG_MVP.md`](docs/BACKLOG_MVP.md)

Organiza a evolução planejada do MVP.

---

## 🚧 Status do projeto

**Em desenvolvimento.**

### Concluído

- [x] levantamento inicial das regras;
- [x] definição do escopo do MVP;
- [x] definição inicial do domínio;
- [x] levantamento dos AMVs;
- [x] regras de intervalo;
- [x] regras de engate e corte;
- [x] regras iniciais de movimentação;
- [x] arquitetura inicial;
- [x] criação do projeto React + TypeScript;
- [x] configuração de lint e formatação;
- [x] configuração inicial de testes;
- [x] publicação do repositório.

### Próximas etapas

- [ ] construir o primeiro SVG do Pátio Brisamar;
- [ ] validar visualmente a topologia;
- [ ] transformar linhas e AMVs em entidades do domínio;
- [ ] implementar zoom e pan;
- [ ] criar modo de preparação;
- [ ] adicionar locomotivas;
- [ ] adicionar blocos de vagões;
- [ ] implementar engate e corte;
- [ ] implementar motor de movimentação;
- [ ] implementar chave contra;
- [ ] implementar regras de intervalo;
- [ ] consolidar o MVP offline.

---

## 💡 Origem do projeto

Este projeto nasceu da experiência prática com planejamento de manobras ferroviárias.

No trabalho diário, um quadro físico do pátio pode ser utilizado para representar locomotivas, vagões e posições encontradas durante a passagem de serviço.

A ideia do **Simulador de Manobras Brisamar** é transportar esse raciocínio para uma aplicação interativa, permitindo experimentar diferentes estratégias de organização antes da execução da manobra.

---

## ⚠️ Aviso

Este software possui finalidade de **simulação, estudo e planejamento**.

Ele não substitui:

- procedimentos operacionais;
- comunicação com controladores;
- autorizações;
- normas de segurança;
- regulamentos ferroviários;
- treinamento oficial;
- decisões tomadas durante operações reais.

As regras implementadas no software representam exclusivamente o escopo definido para o simulador.
