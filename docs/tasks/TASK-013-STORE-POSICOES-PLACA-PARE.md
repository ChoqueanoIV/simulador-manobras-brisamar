# TASK-013 — Store de posições + placa PARE

## Plano após auditoria de 2026-10-26

Base: commit `8426dc8`, TASK-012. A preparação renderiza `yardSections`;
não cria composições engatadas nem posições no grafo.

### Etapa A — integração lógica definida

- Registrar composições e posições explicitamente fornecidas pelo chamador,
  apenas em preparação; não converter `YardSectionState` automaticamente.
- Reutilizar `positionedCompositions` como fonte única de posições. O `Map`
  sugerido no roadmap duplicaria o estado já entregue pela TASK-012.
- Comandar `moveComposition(id, direction)` somente em simulação, reutilizando
  `stepComposition`, topologia, colisão e intervalo reais.
- Atualizar posições e ocupação de AMV na mesma publicação do Zustand.
- Rejeitar posições inválidas, IDs duplicados e entradas inconsistentes;
  copiar entradas para impedir que mutações externas invalidem ocupação.
- Preservar o setter da TASK-012 para compatibilidade, validando posições.
  Ele não substitui o cadastro de composições e não será uma ação de UI.
- Impedir saída de área protegida sem intervalo, não apenas entrada.
- Recusar navegação ambígua ou sem estado de AMV, sem escolher a primeira rota.

Aceite: testes de sucesso, bloqueios, atualização atômica, imutabilidade,
topologia inválida e regressão; lint/test/build aprovados. Sem alteração visual.

### Etapa B — PARE (definição recebida e implementada no domínio)

A regra está confirmada: sem intervalo não ultrapassa; com intervalo permite.
Na auditoria inicial, as nove placas só tinham coordenadas SVG, sem continuação
no grafo. O responsável confirmou nesta sessão que todas as nove vias continuam
além da placa e o intervalo do CCO libera acesso pelo controle já existente.
Documentação de domínio atualizada antes da mudança de topologia.

Implementado: `brisamarStopBoards`, nove continuações discretas protegidas e
`stop-board` efetivo na navegação. Nenhum comprimento/capacidade externo atribuído.
As extremidades externas representam o limite do modelo, não fim físico de via.
Testes cobrem as nove placas, ambos os sentidos, colisão e retirada/reconcessão
de intervalo. Os antigos IDs `TERM` são preservados como limites das placas.

### Etapa C — preparação e tela (aguarda definição e validação visual)

Frente inicial definida pelo responsável: o praticante escolhe a extremidade no
mapa. Ainda é preciso resolver relação seção/segmentos e engates iniciais.
Não considerar todos os materiais de uma seção automaticamente engatados.
O registro explícito da etapa A é infraestrutura real para essa futura conversão,
sem painel de teste ou nova interação no produto.

Primeiro teste em tela obrigatório: quando o fluxo real começar a registrar
posições, afetar bloqueio clicável de AMV ou mover material no SVG. Parar nesse
marco, fornecer roteiro e aguardar confirmação antes de evoluir UI relacionada.

## Riscos preservados

- Ocupação conservadora por adjacência; colisão por segmento inteiro.
- Movimento discreto não equivale a comprimento físico ou animação contínua.
- Topologia AMV-06/07/08/12 tem divergências com o desenho/checkpoints;
  não corrigir conexões ferroviárias por inferência.
- Nenhum commit ou push autorizado.

## Estado de entrega

- Etapas A e B implementadas; etapa C e TASK-014 não iniciadas.
- Não há chamada de `initializeCompositions` ou `moveComposition` na UI.
- O setter da TASK-012 mantém compatibilidade para consumidores internos;
  não é uma permissão de edição artificial ao praticante em simulação.
- Ver resultados, correções e auditoria no checkpoint de 2026-10-26.
