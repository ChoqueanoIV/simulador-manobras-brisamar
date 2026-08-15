# CHECKPOINT — Geometria + AMVs Interativos

## Projeto
Simulador de Manobras — Pátio Brisamar

## Marco alcançado
Primeira versão visual do pátio considerada aprovada, com AMVs interativos, intervalo funcional e linguagem visual de rota ativa padronizada.

---

## 1. Estado atual do projeto

Até este checkpoint, o projeto possui:

- aplicação React + TypeScript + Vite;
- execução local/offline;
- Zustand para estado;
- Vitest para testes;
- ESLint e Prettier;
- documentação técnica;
- mapa SVG do Pátio Brisamar;
- zoom;
- pan;
- AMV-01 até AMV-12 visíveis;
- estados A/B;
- intervalo concedido/entregue;
- bloqueios por intervalo;
- destaque visual da rota ativa;
- rota ativa padronizada em laranja;
- AMV-06 fixo e sem cadeado;
- regras específicas dos AMVs 07, 08, 09 e 12.

---

## 2. Geometria aprovada

A geometria foi construída em várias iterações.

### V1
A primeira tentativa ficou incorreta porque tratava o pátio como várias linhas paralelas longas e criou uma região inferior retangular que não representava o quadro real.

Decisão:
- descartada;
- voltar ao desenho original como referência principal.

### V2
A topologia foi aproximada ao quadro original.

Melhorias:
- L30 diagonal;
- L28/L26 curtas;
- L24/L22 principais;
- diagonais centrais;
- alça curva à direita;
- remoção do retângulo artificial.

Problema:
- marcos ainda incorretos.

### V3
Foi aumentado o espaçamento entre as linhas.

Objetivo:
- melhorar leitura dos AMVs;
- dar espaço para marcos;
- preparar área para vagões;
- evitar sobreposição visual.

### V4
Tentativa de utilizar capacidade de vagões para definir comprimento visual.

Aprendizado:
- a capacidade não pode definir automaticamente a coordenada do marco;
- primeiro a geometria física precisa estar coerente;
- a escala dos vagões será calibrada posteriormente.

### V5
Os marcos passaram a ser interpretados como referência de gabarito.

Conceito consolidado:
- marco não fica sobre trilho;
- marco fica no espaço branco;
- representa limite para material estacionado;
- evita invasão do gabarito de outra circulação.

### V6
Reposicionamento dos marcos usando o quadro original como referência.

Foram revisados:
- L28/L26;
- L26/L24;
- L24/L30;
- travessão;
- região protegida;
- marco próximo à curva direita.

### V7 / V8
Ajustes finos.

Destaques:
- marco L28/L26 recuado;
- marco L26/L24 aproximado do AMV-01;
- marco L24/L30 centralizado entre AMV-02 e AMV-03;
- inclinação da L30 aumentada;
- último ajuste do marco L24/L30 realizado manualmente para não ficar sobre trilho.

Resultado:
- geometria visual considerada aprovada.

---

## 3. Conceito consolidado de marco

O marco representa uma referência de segurança para material estacionado.

Regra visual:

- não deve ficar sobre o trilho;
- deve ficar no espaço branco entre linhas;
- precisa representar o ponto em que o material estacionado ainda mantém o gabarito da circulação vizinha;
- vagões podem transitar além do marco;
- a restrição está relacionada a estacionamento, não circulação.

Capacidade:
- calculada de marco a placa PARE ou de marco a marco, conforme a região;
- trecho entre marco e AMV pode ser utilizado para circulação;
- esse trecho não entra na capacidade de estacionamento.

---

## 4. AMVs — evolução visual

A primeira versão mostrava somente:

```text
01 · A
01 · B
```

Foi considerado insuficiente.

Decisão:
- destacar diretamente no trilho a rota atualmente alinhada.

### Primeira convenção
- posição A em azul;
- posição B em laranja.

Problema:
- as cores poderiam sugerir permitido/proibido.

### Convenção final
- qualquer rota ativa = laranja;
- trilho não selecionado = preto;
- ponto do AMV = vermelho;
- cadeado somente para bloqueio operacional verdadeiro.

Isso passa a ser a linguagem visual padrão.

---

## 5. AMV-06

Regra atual:

- permanece fixo nesta etapa;
- recebe a circulação vinda do AMV-07;
- encaminha para L16;
- não deve ser clicável;
- não deve exibir cadeado.

Motivo da remoção do cadeado:
- cadeado poderia sugerir que locomotivas e vagões não podem circular pelo trecho;
- o AMV é fixo para a interface, não bloqueado para circulação.

Apresentação sugerida:

```text
06 · FIXO
```

---

## 6. AMV-07

Regra consolidada:

Chegando do AMV-08:

### Posição A
```text
AMV-08 → L18
```

### Posição B
```text
AMV-08 → L16
```

Nunca:
- L18 e L16 simultaneamente.

Manipulação:
- somente com intervalo concedido.

---

## 7. AMV-08

Regra consolidada:

Chegando do AMV-09:

### Posição A
```text
AMV-09 → L20
```

### Posição B
```text
AMV-09 → L18
```

Nunca:
- L20 e L18 simultaneamente.

Manipulação:
- somente com intervalo concedido.

---

## 8. AMV-09

Regra consolidada:

### Sem intervalo
- permanece em L22 ↔ L22;
- composição pode circular normalmente por L22;
- não pode ser operado para L20.

### Com intervalo
- pode ser alterado para L22 ↔ L20.

### Entrega do intervalo
- deve retornar para L22 ↔ L22;
- futuramente, se ocupado, a entrega deverá ser bloqueada.

---

## 9. AMV-12

Esse AMV exigiu refinamento específico.

Conceito consolidado:

A alça de curva é sempre uma das pontas da rota.

O clique seleciona exclusivamente a outra ponta:

### Posição A
```text
alça de curva ↔ L22
```

### Posição B
```text
alça de curva ↔ L24 superior
```

A alça:
- permanece sempre destacada como parte da rota;
- não deve parecer que se move;
- L22 e L24 nunca podem aparecer ativos ao mesmo tempo.

Visual:
- alça laranja + L22 laranja;
ou
- alça laranja + L24 superior laranja.

---

## 10. Intervalo

A interface já possui:

- Solicitar intervalo;
- Entregar intervalo.

Estado inicial:
```text
Não concedido
```

Com intervalo:
- AMV-07 e AMV-08 podem ser operados;
- AMV-09 pode acessar L20.

Sem intervalo:
- AMV-07 e AMV-08 ficam bloqueados;
- AMV-09 não pode ser desviado para L20.

AMV-06:
- fixo;
- sem cadeado.

---

## 11. Interação corrigida dos AMVs

Foi identificado conflito entre:

- clique no AMV;
- pan do mapa.

Sintoma:
- clicar no AMV não alterava A/B.

Correção:
- `onPointerDown` no `SwitchView` interrompe propagação;
- pan não captura o clique do AMV.

Resultado:
- clique nos AMVs passou a funcionar normalmente.

---

## 12. Zoom e pan

Zoom:
- roda do mouse;
- botões `+` e `-`.

Pan:
- arraste de área vazia.

Importante:
- geometria, AMVs, marcos e futuras composições compartilham o mesmo sistema de coordenadas SVG;
- o zoom não altera relações físicas do mapa.

---

## 13. Arquivos principais envolvidos

```text
app/src/App.tsx
app/src/App.css
app/src/yard/components/YardCanvas.tsx
app/src/yard/components/SwitchView.tsx
app/src/yard/data/brisamarSwitches.ts
app/src/state/simulationStore.ts
app/src/simulation/domain/switches/switchRules.ts
app/src/simulation/domain/switches/switchRules.test.ts
app/src/types/switch.ts
```

---

## 14. Testes existentes

Foram adicionados testes para:

- bloqueio sem intervalo;
- liberação com intervalo;
- AMV ocupado;
- AMV-09;
- retorno do AMV-09 ao entregar intervalo;
- AMV-07;
- AMV-08;
- AMV-12;
- AMV comum.

Antes de criar o checkpoint Git, executar:

```powershell
npm run lint
npm run test
npm run build
```

---

## 15. Estado visual considerado aprovado

### Cores

```text
Preto    → trilho
Laranja  → rota atualmente alinhada
Vermelho → ponto do AMV
Cadeado  → bloqueio operacional real
```

Não utilizar azul como rota ativa.

---

## 16. O que ainda NÃO está implementado

- modo de preenchimento de vagões;
- locomotivas;
- blocos de vagões;
- capacidade visual real;
- engate;
- corte;
- movimento de composições;
- detecção de ocupação de AMV;
- chave contra durante movimento;
- placas PARE funcionais;
- bloqueio de movimentação em linhas protegidas;
- colisão;
- composição atravessando vários segmentos;
- persistência (não será implementada no MVP).

---

## 17. Próxima etapa recomendada

A próxima etapa deverá evitar mexer na geometria aprovada.

Sugestão:

### TASK-005 — Modo Preparação

Implementar:

- pátio inicia vazio;
- clique em uma linha;
- adicionar locomotiva;
- adicionar bloco de vagões;
- quantidade;
- descrição livre;
- cor;
- orientação da locomotiva;
- reset de linha;
- botão Iniciar Simulação.

Somente depois:
- engate;
- corte;
- movimentação.

---

## 18. Regra para continuação

Ao retomar o projeto:

1. consultar este checkpoint;
2. não redesenhar a geometria sem necessidade real;
3. preservar linguagem visual laranja;
4. preservar especificidades dos AMVs 06, 07, 08, 09 e 12;
5. validar regra operacional antes de inferir comportamento ferroviário.

---

## 19. Status

```text
GEOMETRIA BASE                APROVADA
ZOOM / PAN                    FUNCIONANDO
AMVs INTERATIVOS              FUNCIONANDO
INTERVALO                     FUNCIONANDO
ROTAS VISUAIS                 APROVADAS
PADRÃO LARANJA                APROVADO
AMV-06 FIXO SEM CADEADO       APROVADO
AMV-07 L18/L16                APROVADO
AMV-08 L20/L18                APROVADO
AMV-09 L22/L20                APROVADO
AMV-12 ALÇA + L22/L24         APROVADO
```

Este arquivo representa o checkpoint funcional e conceitual da etapa atual.
