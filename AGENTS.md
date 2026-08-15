# AGENTS.md

# Instruções para agentes de IA — Simulador de Manobras do Pátio Brisamar

## 1. Objetivo

Este arquivo orienta ChatGPT, Codex e outros agentes que atuem neste repositório.

Antes de alterar código relacionado ao domínio ferroviário, o agente deve consultar:

1. `docs/ESCOPO_MVP.md`
2. `docs/MAPA_BRISAMAR_V1_CONSOLIDADO.md`
3. `docs/ARQUITETURA.md`
4. `docs/MODELO_DOMINIO.md`
5. `docs/REGRAS_NEGOCIO.md`, quando disponível

As regras do domínio definidas nesses documentos têm prioridade sobre inferências do agente.

---

## 2. Princípio fundamental

Este projeto é um **simulador livre de planejamento de manobras**.

Ele não deve:

- calcular automaticamente a melhor manobra;
- corrigir a estratégia do praticante;
- sugerir a melhor rota;
- avaliar desempenho;
- pontuar movimentos;
- transformar o programa em procedimento operacional.

O sistema apenas deve impedir ações que contrariem regras físicas ou operacionais explicitamente documentadas.

---

## 3. Segurança conceitual

A interface deve deixar claro:

> Simulador de planejamento de manobras — não substitui procedimentos operacionais vigentes.

Não remover ou enfraquecer essa mensagem sem decisão explícita registrada.

---

## 4. Restrições de produto

O MVP deve permanecer:

- offline;
- sem login;
- sem banco de dados;
- sem backend;
- sem cloud;
- sem persistência;
- sem histórico;
- sem custos recorrentes;
- voltado para computador e mouse.

Não adicionar serviços externos ou dependências SaaS sem solicitação explícita.

---

## 5. Regras ferroviárias críticas

Nunca alterar sem validação explícita:

### Vagões
- vagões não se movimentam sem locomotiva engatada;
- identificação de vagões é texto livre;
- blocos iguais não se fundem automaticamente.

### Engate
- contato não engata automaticamente;
- qualquer engate pode ser cortado;
- locomotivas e vagões possuem engate em ambas as extremidades.

### Movimento
- duas composições podem permanecer na mesma linha;
- não podem se sobrepor;
- não podem atravessar uma à outra;
- não existe Undo.

### AMV
- AMV ocupado não pode ser manipulado;
- cada AMV possui duas posições;
- chave contra bloqueia circulação;
- chave direcionada para outro caminho não bloqueia: a composição segue o caminho real.

### Intervalo
- toda simulação começa sem intervalo;
- AMV-06, 07 e 08 dependem de intervalo para manipulação;
- AMV-09 permite L22 ↔ L22 sem intervalo;
- AMV-09 não pode ser direcionado para L20 sem intervalo;
- ao entregar intervalo, AMV-09 deve ficar L22 ↔ L22;
- não é permitido entregar intervalo com AMV-09 ocupado;
- materiais podem permanecer em L16/L18/L20 após entrega;
- sem intervalo, esses materiais não podem ser movimentados.

### Placa PARE
- sem intervalo, não pode ser ultrapassada;
- com intervalo, pode ser ultrapassada.

### Marcos
- não bloqueiam circulação;
- capacidades são referências de marco a marco.

---

## 6. Arquitetura

Preservar separação entre:

- visualização;
- estado;
- domínio;
- topologia;
- regras de simulação.

Evitar colocar regra de domínio diretamente em componentes React.

Preferir funções puras e testáveis para regras ferroviárias.

---

## 7. TypeScript

Evitar `any`.

Criar tipos explícitos para:

- AMVs;
- segmentos;
- locomotivas;
- vagões;
- composições;
- engates;
- intervalo;
- posições;
- nós do grafo.

---

## 8. Testes

Toda nova regra de negócio deve possuir teste unitário correspondente sempre que viável.

Especial atenção para:

- chave contra;
- AMV ocupado;
- intervalo;
- AMV-09;
- corte;
- engate;
- colisão;
- composição sem locomotiva;
- placa PARE.

---

## 9. Commits

Preferir Conventional Commits em português.

Exemplos:

```text
feat: adiciona representação inicial do pátio brisamar
feat: implementa operação dos amvs
fix: impede movimentação de vagões sem locomotiva
test: adiciona cenários de chave contra
docs: documenta regras de intervalo
refactor: separa motor de movimento da camada visual
```

---

## 10. Pull Requests

PRs devem conter:

- título objetivo;
- resumo;
- alterações realizadas;
- evidências visuais quando houver alteração de interface;
- testes realizados;
- riscos ou limitações conhecidas.

---

## 11. Alterações de domínio

Quando uma solicitação contradizer documentos existentes:

1. não alterar silenciosamente;
2. identificar a divergência;
3. atualizar a documentação;
4. somente depois alterar o código.

---

## 12. Escopo

Não adicionar funcionalidades fora do MVP apenas porque parecem úteis.

Exemplos que não devem entrar sem decisão explícita:

- login;
- ranking;
- histórico;
- salvar cenário;
- multiplayer;
- cadastro de usuário;
- API;
- banco;
- cloud;
- algoritmo de otimização;
- geração automática de rota.

---

## 13. Prioridade de implementação

Ordem recomendada:

1. topologia estática;
2. SVG do pátio;
3. zoom e pan;
4. AMVs visuais;
5. modo preparação;
6. locomotivas;
7. blocos de vagões;
8. composição e engate;
9. corte;
10. movimento;
11. ocupação de AMV;
12. chave contra;
13. intervalo;
14. placas PARE;
15. refinamento visual;
16. empacotamento offline.

---

## 14. Regra para agentes

Em caso de dúvida sobre uma regra ferroviária:

**não inventar.**

Registrar a dúvida e solicitar validação do responsável pelo domínio antes de implementar.
