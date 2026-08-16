# CHECKPOINT — Issue #1 — Modo de Preparação do Pátio

**Data:** 2026-08-15  
**Branch:** `feat/1-modo-preparacao-patio`  
**Issue:** `#1 feat: implementar modo de preparação do pátio`

---

## 1. Objetivo da etapa

Implementar o Modo de Preparação do Pátio Brisamar, permitindo reproduzir a passagem de serviço antes da simulação propriamente dita.

O pátio deve iniciar vazio e permitir o cadastro manual de:

- locomotivas;
- blocos de vagões;
- identificação;
- cor;
- orientação da locomotiva;
- distribuição por trecho operacional.

A movimentação real ainda não faz parte desta etapa.

---

## 2. Estado funcional alcançado

Até este checkpoint:

- modo `preparation` implementado;
- estado preparado para futura transição para `simulation`;
- pátio inicia sem material;
- locomotivas podem ser cadastradas;
- vagões podem ser cadastrados em blocos;
- blocos iguais permanecem separados;
- ordem de cadastro é preservada;
- locomotiva pode ficar entre blocos de vagões;
- locomotiva conta como uma unidade de ocupação;
- capacidade de cada trecho é exibida;
- excesso de capacidade gera alerta, mas não bloqueia;
- reset de trecho disponível;
- material é renderizado diretamente no SVG;
- seleção de trechos funciona;
- zoom/pan e AMVs anteriores continuam preservados;
- alça curva da L22 pode receber material;
- materiais da alça acompanham visualmente a curva.

---

## 3. Tentativas e ajustes realizados

### 3.1 Fundação do domínio

Foi criada a base de tipos e regras para:

```text
SimulationMode
Locomotive
WagonBlock
RollingStock
YardSectionState
YardSectionId
```

Também foram criadas regras para:

- adicionar locomotiva;
- adicionar bloco;
- preservar ordem;
- resetar trecho;
- validar quantidade;
- validar locomotiva;
- calcular ocupação.

---

### 3.2 Primeira tentativa de renderização dos materiais

A primeira versão usava um cursor mutável durante o render.

Problema:

```text
react-hooks/immutability
Cannot reassign variable after render completes
```

Correção:
- substituir o cursor mutável por cálculo imutável usando `reduce`.

---

### 3.3 Erro de TypeScript no painel

O TypeScript sinalizou:

```text
'section' is possibly 'undefined'
```

Correção:
- após o guard clause, fixar referências locais seguras para `activeSection` e `activeSectionId`.

---

### 3.4 Primeira locomotiva

A primeira representação usava apenas bloco/seta.

Problemas observados:

- direção visual pouco clara;
- `Frente barra` estava orientada para o lado incorreto;
- locomotiva pequena demais;
- representação parecia um ícone técnico, não um veículo ferroviário;
- número podia ficar espelhado;
- vagão seguinte sobrepunha a locomotiva.

---

### 3.5 Tentativas visuais da locomotiva

Foram tentadas versões:

1. bloco simples com seta;
2. silhueta lateral compacta;
3. locomotiva SVG com nariz, cabine, rodas e número;
4. versão top-down simplificada.

Aprendizados:

- não usar emoji, porque a aparência varia por sistema/navegador;
- orientação deve ser controlada pelo SVG;
- número não deve ser espelhado;
- locomotiva precisa de largura mínima visual;
- a ocupação lógica pode ser 1 unidade, mas isso não significa 1/55 de largura mínima visível.

Estado atual:
- representação SVG top-down;
- locomotiva conta como 1 unidade;
- largura mínima visual reservada para impedir sobreposição.

A estética da locomotiva ainda pode receber refinamentos futuros sem alterar o domínio.

---

## 4. Regra consolidada de estacionamento

### Conceito fundamental

```text
trilho físico != zona de estacionamento
```

Locomotivas e vagões podem circular por áreas além dos marcos durante a simulação.

Porém, no **Modo Preparação**, material estacionado deve nascer somente em área segura:

```text
placa PARE <-> marco
```

ou:

```text
marco <-> marco
```

Nunca:

- sobre AMV;
- entre AMV e marco;
- invadindo gabarito de outra rota.

Esse conceito foi identificado após observar uma locomotiva criada perto demais de uma chave, onde poderia ocorrer conflito de gabarito com outro trem.

---

## 5. Escala visual e capacidade

### Primeira tentativa

A largura dos blocos era calculada somente pela quantidade, sem referência real da capacidade do trecho.

Problema:
- 10 vagões podiam ocupar quase toda uma linha;
- trechos diferentes tinham escalas inconsistentes.

### Regra atual

A capacidade de referência do trecho também guia a escala visual.

Exemplo:

```text
capacidade 55
10 veículos -> 10/55 do trecho útil
55 veículos -> 100% do trecho útil
60 veículos -> 100% visual + alerta
```

### Unidade de ocupação

```text
1 vagão = 1 unidade
1 locomotiva = 1 unidade
```

Exemplos:

```text
1 locomotiva = 1 / 55
54 vagões + 1 locomotiva = 55 / 55
55 vagões + 1 locomotiva = 56 / 55 ⚠
```

---

## 6. Divisão das linhas L22 e L24

Foi identificado que L22 e L24 não podem ser tratadas como uma única área de estacionamento.

Embora fisicamente sejam linhas conectadas, operacionalmente existem regiões distintas.

### Estrutura consolidada

```text
L24_SUPERIOR
L24_TRAVESSAO
L24_INFERIOR

L22_SUPERIOR
L22_TRAVESSAO
L22_INFERIOR
L22_CURVA
```

Cada região possui:

- seleção independente;
- capacidade própria;
- zona de estacionamento própria.

---

## 7. Travessão

Foi identificado que o travessão deve ser uma região própria.

Capacidade de referência:

```text
12 veículos
```

para L22 Travessão e L24 Travessão.

O material deve permanecer entre os marcos correspondentes.

---

## 8. Alça curva da L22 / AMV-12

Inicialmente a alça existia apenas como geometria de rota.

Problema:
- não era selecionável;
- não permitia estacionar locomotivas/vagões.

Regra informada:

```text
cabem 12 a 13 vagões
ou
1 locomotiva + 12 vagões
```

Capacidade adotada:

```text
13 unidades
```

Novo trecho:

```text
L22_CURVA
```

O material:

- começa depois da região de gabarito do AMV-12;
- termina antes da placa PARE;
- acompanha visualmente a curva;
- locomotiva continua contando como 1 unidade.

---

## 9. Capacidades consolidadas até aqui

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

Ainda sem capacidade final consolidada neste checkpoint:

```text
L20
L18
L16
```

---

## 10. Ajuste específico L26 / L28

Foi detectado que:

- L26 e L28 tinham capacidade 4;
- porém 4 vagões ocupavam comprimentos visuais muito diferentes;
- na L26 o bloco ficava excessivamente próximo ao AMV-01.

Correção aplicada:

- manter capacidade 4 em ambas;
- equalizar a referência visual útil;
- preservar área livre antes do AMV.

Regra consolidada:

```text
4 / 4 -> 100% da zona útil
```

em ambas, sem ocupar a área do AMV.

---

## 11. L22 superior e L24 superior

Problema inicial:
- sem `capacityReference`, qualquer quantidade era renderizada como 100% da área útil.

Correção:

```text
L22 superior = 22
L24 superior = 18
```

Exemplo:

```text
10 / 22 -> ~45%
10 / 18 -> ~56%
```

---

## 12. Erros técnicos encontrados

### ESLint

Erro:

```text
Cannot reassign variable after render completes
```

Arquivos afetados em diferentes momentos:

```text
YardRollingStock.tsx
```

Solução:
- remover mutação de cursor em render.

### TypeScript

Erro:

```text
section is possibly undefined
```

Solução:
- narrowing explícito antes das funções internas.

### PowerShell

Ocorreram comandos `cd app` executados quando o terminal já estava dentro de `app`.

Mensagem:

```text
...\app\app não existe
```

Não é erro de projeto, apenas diretório atual já correto.

---

## 13. Validações executadas

Durante a etapa foram executados repetidamente:

```powershell
npm run lint
npm run test
npm run build
```

Último estado validado durante o desenvolvimento:

```text
lint  -> aprovado
test  -> 25 testes aprovados
build -> aprovado
```

Após o último ajuste de geometria L26/L28, recomenda-se repetir os três comandos antes do commit final.

---

## 14. Arquivos principais envolvidos

```text
app/src/App.css
app/src/App.tsx

app/src/preparation/
├── components/
├── data/
├── domain/
└── types/

app/src/rolling-stock/
├── components/
└── types/

app/src/state/simulationStore.ts

app/src/yard/
├── components/
│   ├── YardCanvas.tsx
│   ├── YardRollingStock.tsx
│   └── SwitchView.tsx
└── data/
    └── yardSectionGeometry.ts
```

---

## 15. Documentos produzidos ao longo das tentativas

A documentação da etapa inclui arquivos específicos de ajustes, entre eles:

```text
TASK-005-AJUSTE-ALCA-CURVA-L22.md
TASK-005-AJUSTE-CAPACIDADE-L26-L28.md
TASK-005-AJUSTE-CAPACIDADE-SUPERIOR-L22-L24.md
TASK-005-AJUSTE-TRECHOS-TRAVESSAO.md
TASK-005-CORRECAO-ESCALA-L26-L28.md
```

Esses arquivos devem ser preservados como histórico das decisões tomadas.

---

## 16. Arquivos temporários que não devem ir para o commit

Os arquivos abaixo foram usados apenas como instruções intermediárias dos ZIPs:

```text
README_ETAPA2.md
README_ETAPA2B.md
README_ETAPA2C.md
```

O conteúdo relevante dessas tentativas está consolidado neste checkpoint e nos documentos da TASK-005.

Esses READMEs temporários podem ser removidos antes do `git add`.

---

## 17. Estado atual

Aparentemente validado visualmente até:

- seleção de trechos;
- cadastro de locomotivas;
- cadastro de blocos;
- escala baseada em capacidade;
- estacionamento dentro de marco;
- travessão;
- alça curva;
- divisão superior/travessão/inferior;
- ajuste L26/L28.

Ainda há espaço para refinamento visual da locomotiva.

---

## 18. Próximo passo

Antes de continuar amanhã:

1. remover READMEs temporários;
2. executar lint/test/build final;
3. adicionar arquivos definitivos;
4. criar commit;
5. fazer push da branch.

Amanhã, continuar a Issue #1 a partir deste checkpoint.

Prioridades sugeridas:

1. validar capacidades de L20, L18 e L16;
2. revisar visual final da locomotiva;
3. concluir anotação da estação;
4. concluir botão `Iniciar Simulação`;
5. bloquear preenchimento/reset após iniciar;
6. validar critérios de aceite restantes;
7. abrir PR da Issue #1 quando todos os critérios forem atendidos.

---

## 19. Regra de documentação do projeto

A partir deste checkpoint:

> Toda evolução relevante deve registrar o estado final, as tentativas que falharam, os erros observados, as hipóteses descartadas, as correções realizadas e a regra operacional consolidada.

O objetivo é preservar não apenas **o que foi feito**, mas **por que o projeto chegou à solução atual**.
