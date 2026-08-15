# BACKLOG_MVP.md

# Backlog Oficial do MVP — Simulador de Manobras do Pátio Brisamar

## 1. Objetivo

Este backlog organiza o desenvolvimento do MVP em uma ordem incremental, priorizando primeiro a fidelidade visual e topológica do Pátio Brisamar e, depois, as regras de simulação.

A estratégia é evitar implementar o motor de manobras antes de validar o mapa visual e os elementos ferroviários básicos.

---

# ÉPICO 0 — Fundação do Projeto

## TASK 0.1 — Criar repositório GitHub

### Objetivo
Criar o repositório oficial do projeto.

### Entregas
- repositório GitHub;
- branch principal;
- `.gitignore`;
- licença a definir;
- documentação inicial versionada.

### Critérios de aceite
- repositório acessível;
- documentos do projeto adicionados;
- primeiro commit realizado.

---

## TASK 0.2 — Inicializar React + TypeScript + Vite

### Objetivo
Criar a aplicação base.

### Entregas
- React;
- TypeScript;
- Vite;
- estrutura inicial de pastas.

### Critérios de aceite
- `npm install` executa sem erro;
- `npm run dev` inicia a aplicação;
- tela inicial abre localmente.

---

## TASK 0.3 — Configurar qualidade de código

### Entregas
- ESLint;
- Prettier;
- aliases de importação;
- scripts de lint;
- scripts de format;
- scripts de test.

### Critérios de aceite
- `npm run lint` funcionando;
- `npm run format` funcionando;
- estrutura preparada para testes.

---

## TASK 0.4 — Configurar Vitest

### Objetivo
Preparar testes unitários desde o início.

### Entregas
- Vitest;
- Testing Library;
- configuração de ambiente de testes;
- teste inicial de sanidade.

---

# ÉPICO 1 — Representação Visual do Pátio

## TASK 1.1 — Criar canvas SVG do Pátio Brisamar

### Objetivo
Transformar a planta em uma representação SVG navegável.

### Entregas
- componente `YardCanvas`;
- linhas principais;
- proporção inicial do pátio;
- preservação da topologia real.

### Critérios de aceite
- L16, L18, L20, L22, L24, L26, L28 e L30 representadas;
- desenho reconhecível em relação ao quadro atual;
- nenhuma regra de simulação necessária nesta task.

---

## TASK 1.2 — Implementar zoom

### Objetivo
Permitir ampliação e redução com a roda do mouse.

### Critérios de aceite
- zoom fluido;
- não perde posicionamento relativo dos elementos;
- limites mínimos e máximos definidos.

---

## TASK 1.3 — Implementar pan

### Objetivo
Permitir arrastar o cenário para navegar pelo pátio.

### Critérios de aceite
- navegação horizontal;
- navegação vertical;
- interação não interfere no clique dos elementos ferroviários.

---

## TASK 1.4 — Renderizar marcos

### Objetivo
Representar visualmente todos os marcos do pátio.

### Critérios de aceite
- marcos visíveis;
- identificadores internos;
- possibilidade futura de associar capacidade a trechos marco a marco.

---

## TASK 1.5 — Renderizar placas PARE

### Objetivo
Representar as placas PARE existentes na planta.

### Critérios de aceite
- posição coerente com o layout;
- elemento identificável visualmente;
- preparado para receber regra de bloqueio posteriormente.

---

# ÉPICO 2 — AMVs

## TASK 2.1 — Renderizar AMV-01 a AMV-12

### Objetivo
Adicionar todos os AMVs ao SVG.

### Critérios de aceite
- 12 AMVs visíveis;
- numeração interna disponível;
- posição atual de cada AMV perceptível.

---

## TASK 2.2 — Implementar duas posições por AMV

### Objetivo
Permitir alternar cada AMV entre posição A e posição B.

### Regras
- mudança instantânea;
- sem animação;
- estado visual claro.

---

## TASK 2.3 — Implementar regras específicas dos AMVs

### Mapeamento

- AMV-01: L22↔L26 | L22↔L28
- AMV-02: L24↔L24 | L24↔acesso L26/L28
- AMV-03: L24↔L24 | L24↔L30
- AMV-04: L24↔L24 | L24↔L22
- AMV-05: L22↔L22 | L22↔L24
- AMV-06: L16↔L16 | L16↔diagonal
- AMV-07: L18↔L18 | L18↔diagonal
- AMV-08: L20↔L20 | L20↔diagonal
- AMV-09: L22↔L22 | L22↔L20
- AMV-10: L22↔L22 | L22↔L24
- AMV-11: L24↔L24 | L24↔L22
- AMV-12: L22↔L22 | L22↔L24

### Critérios de aceite
- conexões descritas no mapa lógico refletidas no estado da aplicação.

---

# ÉPICO 3 — Modo Preparação

## TASK 3.1 — Criar modo Preparação

### Objetivo
Abrir o programa com o pátio zerado e permitir reprodução da passagem de serviço.

### Critérios de aceite
- nenhuma locomotiva inicialmente;
- nenhum vagão inicialmente;
- edição direta permitida;
- intervalo inicialmente não concedido.

---

## TASK 3.2 — Adicionar locomotiva em uma linha

### Campos
- número da locomotiva;
- orientação:
  - frente barra;
  - ré barra.

### Regras
- locomotiva pode ser inserida em qualquer posição da sequência durante o preenchimento;
- número exibido visualmente.

---

## TASK 3.3 — Adicionar bloco de vagões

### Campos
- quantidade;
- identificação livre;
- cor.

### Regras
- preenchimento da esquerda para a direita;
- aceitar um único vagão;
- texto livre;
- blocos iguais permanecem separados.

---

## TASK 3.4 — Implementar tamanho proporcional do bloco

### Objetivo
Representar visualmente a quantidade.

### Critérios de aceite
- 10 vagões visualmente maiores que 6;
- 6 maiores que 1;
- tamanho proporcional consistente no pátio.

---

## TASK 3.5 — Criar tooltip de bloco

### Conteúdo mínimo
- quantidade;
- identificação.

### Regra
Tooltip somente com hover do mouse.

---

## TASK 3.6 — Resetar linha durante preparação

### Regras
- disponível apenas no modo Preparação;
- limpa todos os elementos cadastrados naquela linha;
- após iniciar simulação, ação deixa de existir.

---

## TASK 3.7 — Campo opcional de anotação da estação

### Objetivo
Permitir ao praticante registrar a ordem recebida.

### Regras
- texto livre;
- opcional;
- não validado pelo sistema;
- não influencia o motor.

---

## TASK 3.8 — Botão Iniciar Simulação

### Regras
Ao clicar:
- encerra modo Preparação;
- remove opções de cadastro/reset;
- entra em modo Simulação;
- não permite retornar ao modo Preparação.

---

# ÉPICO 4 — Modelo de Composição, Engate e Corte

## TASK 4.1 — Representar veículos individualmente no domínio

### Objetivo
Permitir corte em qualquer posição mesmo quando visualmente agrupados.

### Critérios de aceite
- bloco visual pode representar múltiplas unidades;
- ordem física preservada.

---

## TASK 4.2 — Detectar contato entre materiais

### Regras
- materiais não se atravessam;
- materiais não se sobrepõem;
- movimento para ao encostar.

---

## TASK 4.3 — Implementar engate manual

### Regras
- contato não engata automaticamente;
- usuário clica no ponto de contato;
- ação `Engatar`;
- locomotiva↔vagão permitido;
- vagão↔vagão permitido;
- locomotiva↔locomotiva permitido.

---

## TASK 4.4 — Implementar corte

### Regras
- corte em qualquer engate;
- corte dentro de bloco;
- preservação de ordem;
- novos blocos independentes após o corte.

### Exemplo
`[15 FVR]` → `[12 FVR] [3 FVR]`

---

## TASK 4.5 — Suportar múltiplas locomotivas

### Cenários
- locomotiva única;
- dupla de máquinas;
- trio de máquinas;
- quadra de máquinas;
- locomotiva no meio de vagões.

---

# ÉPICO 5 — Motor de Movimentação

## TASK 5.1 — Implementar arraste de composição

### Objetivo
Movimentar material com clique + arraste.

### Regras
- movimento contínuo;
- animado;
- sem velocidade configurável;
- locomotiva pode puxar ou empurrar.

---

## TASK 5.2 — Impedir movimento de vagões sem locomotiva

### Critério de aceite
Qualquer conjunto sem locomotiva engatada permanece imóvel.

---

## TASK 5.3 — Permitir múltiplas composições na mesma linha

### Regras
- mesma linha pode conter várias composições;
- distância entre elas é permitida;
- sem conceito global de linha ocupada.

---

## TASK 5.4 — Impedir sobreposição e atravessamento

### Regras
- composição para ao encontrar outra;
- pode encostar;
- só passa a se mover junto após engate.

---

## TASK 5.5 — Fazer composição seguir a topologia

### Objetivo
O arraste deve respeitar trilhos e conexões.

### Critérios de aceite
- composição não sai do trilho;
- AMV determina o próximo segmento;
- movimento pode atravessar múltiplos segmentos.

---

# ÉPICO 6 — Ocupação e Chave Contra

## TASK 6.1 — Detectar ocupação de AMV

### Regra
Se qualquer locomotiva ou vagão estiver sobre a região física do AMV:
- AMV bloqueado;
- exibir cadeado;
- clique desabilitado.

---

## TASK 6.2 — Implementar chave contra

### Objetivo
Determinar passagem inválida com base em:
- sentido de chegada;
- posição do AMV;
- conexão ativa.

### Regra
Chave contra bloqueia a movimentação antes da passagem.

---

## TASK 6.3 — Implementar desvio involuntário

### Regra
Se a chave estiver em posição válida, porém levando para outra linha:
- não bloquear;
- composição segue a rota real da chave.

---

# ÉPICO 7 — Intervalo da Estação

## TASK 7.1 — Criar controle de intervalo

### Estado inicial
`Sem intervalo`

### Ações
- Solicitar intervalo para a estação;
- Entregar intervalo para a estação.

---

## TASK 7.2 — Bloquear AMV-06, AMV-07 e AMV-08 sem intervalo

### Regra
Sem intervalo:
- não podem ser manipulados;
- exibir cadeado.

---

## TASK 7.3 — Implementar regra especial do AMV-09

### Sem intervalo
- circulação L22↔L22 permitida;
- manipulação para L22↔L20 proibida.

### Com intervalo
- duas posições liberadas.

---

## TASK 7.4 — Proteger movimentação nas L16/L18/L20

### Sem intervalo
- material pode permanecer estacionado;
- material não pode ser movimentado.

### Com intervalo
- movimentação permitida.

---

## TASK 7.5 — Entregar intervalo

### Regras
- AMV-09 deve estar desocupado;
- se ocupado, bloquear entrega;
- ao entregar, AMV-09 retorna para L22↔L22;
- materiais podem permanecer nas linhas protegidas;
- movimentos voltam a ficar bloqueados.

---

# ÉPICO 8 — Placas PARE

## TASK 8.1 — Bloquear ultrapassagem sem intervalo

### Regra
Composição pode chegar até a placa, mas não ultrapassá-la.

---

## TASK 8.2 — Permitir ultrapassagem com intervalo

### Regra
Intervalo concedido libera passagem além da placa PARE.

---

# ÉPICO 9 — Capacidades e Alertas

## TASK 9.1 — Associar capacidade aos segmentos marco a marco

### Referências iniciais

#### Superior
- L30: 28–30
- L28: 4
- L26: 4
- L24: 18
- L22: 22
- L20: 30
- L18: 25
- L16: 20

#### Travessão
- L24: 11–12
- L22: 11–12

#### Inferior
- L24: 55
- L22: 55

---

## TASK 9.2 — Exibir alerta quando acima da referência

### Exemplo
`59 / 55 ⚠`

### Regras
- não impedir cadastro;
- não impedir circulação;
- não classificar automaticamente como irregularidade.

---

# ÉPICO 10 — Refinamento Visual

## TASK 10.1 — Ajustar escala final de vagões

### Objetivo
Calibrar o tamanho visual usando os trechos marco a marco.

---

## TASK 10.2 — Diferenciar estados de AMV

### Estados visuais
- posição A;
- posição B;
- bloqueado por ocupação;
- bloqueado por intervalo.

---

## TASK 10.3 — Melhorar tooltips

### Elementos
- vagões;
- locomotivas;
- AMVs;
- capacidade;
- bloqueios.

---

## TASK 10.4 — Adicionar aviso de finalidade

Exibir:

> Simulador de planejamento de manobras — não substitui procedimentos operacionais vigentes.

---

# ÉPICO 11 — Testes e Estabilização

## TASK 11.1 — Testes de AMV

Cobrir:
- posição A/B;
- ocupação;
- intervalo;
- AMV-09;
- chave contra.

---

## TASK 11.2 — Testes de composição

Cobrir:
- engate;
- corte;
- múltiplas locomotivas;
- vagões sem locomotiva;
- colisão.

---

## TASK 11.3 — Testes de intervalo

Cobrir:
- concessão;
- entrega;
- bloqueio de linhas;
- AMV-09 ocupado;
- placa PARE.

---

## TASK 11.4 — Teste integrado do fluxo principal

Cenário mínimo:

1. abrir pátio vazio;
2. cadastrar locomotiva;
3. cadastrar vagões;
4. iniciar simulação;
5. engatar;
6. movimentar;
7. operar AMV;
8. solicitar intervalo;
9. entrar em área protegida;
10. entregar intervalo.

---

# ÉPICO 12 — Empacotamento Offline

## TASK 12.1 — Avaliar empacotamento com Tauri

### Objetivo
Permitir abrir o simulador como aplicação local no Windows.

### Condição
Somente após o MVP web local estar estabilizado.

---

## TASK 12.2 — Gerar primeira versão executável

### Objetivo
Criar pacote que funcione offline no computador de destino.

### Critérios de aceite
- não depende de internet;
- não depende de serviço pago;
- pátio inicia zerado;
- todas as regras do MVP continuam funcionando.

---

# Ordem recomendada de execução

```text
Épico 0
  ↓
Épico 1
  ↓
Épico 2
  ↓
Épico 3
  ↓
Épico 4
  ↓
Épico 5
  ↓
Épico 6
  ↓
Épico 7
  ↓
Épico 8
  ↓
Épico 9
  ↓
Épico 10
  ↓
Épico 11
  ↓
Épico 12
```

## Regra de desenvolvimento

Não avançar para uma camada complexa sem validar a anterior.

Especialmente:

> **Não iniciar o motor de movimentação antes de validar visualmente a topologia do Pátio Brisamar e os 12 AMVs.**
