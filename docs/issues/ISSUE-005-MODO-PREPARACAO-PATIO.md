# feat: implementar modo de preparação do pátio

## Contexto

O Simulador de Manobras Brisamar já possui o mapa base do pátio, zoom/pan, AMVs interativos, rotas visuais e regras iniciais de intervalo.

A próxima etapa é permitir que o praticante reproduza a **passagem de serviço** antes de iniciar a simulação.

O sistema deve sempre abrir com o pátio vazio.

O praticante será responsável por informar manualmente quais locomotivas e blocos de vagões existem em cada trecho do pátio naquele momento.

---

## Objetivo

Criar o **Modo Preparação**, permitindo montar o estado inicial do Pátio Brisamar antes de iniciar as manobras.

---

## Fluxo esperado

```text
Abrir aplicação
→ Pátio vazio
→ Preencher passagem de serviço
→ Adicionar locomotivas/vagões
→ Revisar cenário
→ Iniciar Simulação
```

Após iniciar a simulação, alterações artificiais no preenchimento deixam de ser permitidas.

---

## Funcionalidades

### Seleção de linha/trecho

Ao clicar em uma região válida do pátio durante o modo preparação, permitir:

- adicionar locomotiva;
- adicionar vagão/vagões;
- resetar trecho;
- cancelar.

### Locomotiva

Permitir informar:

- número;
- orientação:
  - Frente barra
  - Ré barra

A locomotiva poderá aparecer em qualquer posição da sequência, inclusive entre vagões.

### Vagões

Permitir informar:

- quantidade;
- identificação em texto livre;
- cor.

Exemplos:

```text
10 FVR
5 EPI
8 Bobina
3 Contêiner
```

Blocos iguais cadastrados separadamente devem permanecer separados.

### Ordem

O preenchimento deve preservar a ordem de cadastro da esquerda para a direita.

### Capacidade

Mostrar alerta quando a quantidade de referência do trecho for excedida.

Exemplo:

```text
59 / 55 ⚠
```

Esse alerta não deve bloquear o preenchimento.

### Reset

Disponível somente no modo preparação.

Remove todo o conteúdo do trecho selecionado após confirmação.

### Anotação

Disponibilizar campo opcional de texto livre para registrar a solicitação recebida da estação/controlador.

### Iniciar Simulação

Criar botão para finalizar o preenchimento.

Após iniciar:

- manter o cenário montado;
- remover opções de cadastro;
- remover reset;
- manter AMVs e intervalo funcionando;
- não permitir retornar ao modo preparação.

---

## Regras importantes

- o pátio sempre inicia vazio;
- não existe persistência;
- um único vagão deve ser suportado;
- descrições são totalmente livres;
- blocos iguais não são unidos;
- locomotivas podem ficar no meio dos vagões;
- múltiplas locomotivas são permitidas;
- capacidade é referência, não bloqueio;
- capacidade é vinculada ao trecho correto do pátio, não à linha inteira.

---

## Fora do escopo

Nesta issue não implementar:

- movimentação;
- engate;
- corte;
- colisão;
- chave contra;
- ocupação real dos AMVs;
- persistência;
- validação do trem final.

---

## Critérios de aceite

- [ ] pátio inicia vazio;
- [ ] modo preparação ativo ao abrir;
- [ ] seleção de trecho funciona;
- [ ] cadastro de locomotiva funciona;
- [ ] cadastro de bloco de vagões funciona;
- [ ] texto livre é aceito;
- [ ] cor pode ser escolhida;
- [ ] ordem de preenchimento é preservada;
- [ ] blocos iguais permanecem separados;
- [ ] locomotivas podem ficar entre blocos;
- [ ] reset de trecho funciona;
- [ ] alerta de capacidade não bloqueia;
- [ ] anotação opcional funciona;
- [ ] Iniciar Simulação encerra o modo preparação;
- [ ] cenário montado permanece na tela;
- [ ] geometria existente permanece intacta;
- [ ] lint/test/build passam.

---

## Documentação relacionada

```text
docs/tasks/TASK-005-MODO-PREPARACAO-PATIO.md
docs/checkpoints/CHECKPOINT-AMVS-INTERATIVOS.md
```

---

## Branch sugerida

```text
feat/5-modo-preparacao-patio
```

## Commit sugerido

```text
feat: implementa modo de preparacao do patio
```
