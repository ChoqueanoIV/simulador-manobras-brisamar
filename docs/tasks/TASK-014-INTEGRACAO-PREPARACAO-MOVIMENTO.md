# TASK-014 — Integração da preparação ao movimento

## Etapas e dependências

### A — Engates explícitos na preparação

Decisão recebida em 2026-10-26: o praticante marca os engates antes de iniciar.
Implementar uma ligação explícita entre itens consecutivos da mesma seção,
com regra pura, estado em memória e botão no conteúdo do trecho.

Aceite:
- cada ligação começa desmarcada e pode ser marcada/desmarcada;
- preservar ordem, blocos iguais separados, orientação e capacidades;
- limpar seção remove somente seus engates;
- acrescentar item preserva ligações existentes e não engata o novo;
- após início, bloquear alteração também no store e mostrar resumo;
- rejeitar ligação entre itens não vizinhos ou de seções diferentes;
- lint/test/build e teste em tela obrigatório antes da próxima fatia de UI.

Esta etapa não cria posições ou movimento nem altera SVG/topologia.

### B — Convergência entre grafo e mapa

Resolver divergências registradas no checkpoint TASK-013, usando os checkpoints
visuais aprovados como referência e solicitando validação onde houver conflito.
Não deduzir conexões por semelhança de IDs.

### C — Conversão e movimento

Expandir vagões preservando origem dos blocos, formar grupos segundo as ligações
explícitas e permitir escolha da extremidade inicial no mapa (decisão já validada).
Não mapear seção/segmento até concluir B. A colisão por segmento e a ocupação
conservadora não bastam para simular várias composições no mesmo segmento ou
comprimento físico contínuo; modelagem deverá ser refinada antes de prometer isso.

## Protocolo visual da etapa A

Preparar `[5 FVR] [3820] [3 EPI]`; marcar e desmarcar cada ligação, acrescentar
novo bloco e conferir que fica separado. Limpar outra seção e conferir isolamento.
Iniciar simulação: ligações preservadas e controles de edição indisponíveis.
Conferir capacidades, notas, AMVs e zoom/pan existentes.
Solicitar relato e capturas antes/depois; aguardar confirmação antes de evoluir UI.

Sem commit ou push sem autorização.

## Checkpoint da etapa A — 2026-10-26

Implementada e aguardando teste em tela do responsável. Lint/build aprovados;
17 suítes, 226/226 testes. Novos testes de domínio, store e painel real via
Testing Library (+14 casos). Nenhum teste anterior removido.

Estado: `preparationCouplings`; ação `toggleInitialCoupling`; regra pura
`togglePreparationCoupling`; componente `PreparationCouplings` no painel.
Ligações são preservadas como declaração inicial, sem fusão de blocos nem
conversão em posição no grafo. O resumo após início é somente leitura.

Tentativas/correções: implementação inicial do componente foi seguida pela
inclusão no painel e estilos; primeira execução conjunta de lint/test/build
aprovada, sem falhas. Usado o ajuste TEMP/TMP documentado no checkpoint 013.
Fixture antiga de reset do store agora também limpa os engates para isolamento.

Verificado `git diff --check`: aprovado. Diff acumulado desde TASK-012:
14 arquivos rastreados, 318 inserções e 95 exclusões; arquivos novos aparecem
separados no status, incluindo componente, regra e três suítes desta etapa.
Todas as alterações da TASK-013 e pasta handoff preservadas. Nada staged,
nenhum commit/push. Servidor Vite iniciado em `http://127.0.0.1:5173/` para teste.

**⚠️ TESTE EM TELA OBRIGATÓRIO**: pausa conforme §8.E do prompt mestre.
Solicitado ao usuário executar o roteiro acima e enviar relato/capturas.
Não prosseguir com UI de movimento antes da confirmação. Grafo e SVG não foram
alterados neste incremento; divergências da etapa B continuam registradas.

### Correção de acesso ao teste em tela

O usuário enviou captura com `ERR_CONNECTION_TIMED_OUT` em 127.0.0.1:5173.
O processo Vite iniciado no sandbox permanecia escutando, mas não respondia
à requisição HTTP feita fora dele. Dentro do sandbox, a tentativa HTTP também
retornou erro de permissão de soquete. Encerrada somente a sessão Vite iniciada
pelo agente e reiniciado o mesmo comando fora do sandbox, na mesma porta.
Nenhuma alteração de código, firewall, proxy ou dependências.

### Aprovação visual recebida — 2026-10-26

O responsável confirmou: “Teste visual aprovado”. Etapa A aprovada em tela.
A pausa visual desta etapa está encerrada; autorização para commit/push não foi
concedida. Próxima etapa: convergência grafo/mapa, preservando a UI aprovada.
Novo incremento de interação exigirá nova validação visual no respectivo marco.

### Etapa B1 — conexão AMV-12 validada e corrigida

O responsável esclareceu: vindo da curva, alinhado para L24, o material entra
na L24 e segue reto até o próximo AMV próximo ao meio do pátio; ali obedece
ao alinhamento dessa chave. O desenho aprovado identifica esse próximo AMV
como AMV-11. A pergunta anterior sobre duas pontas foi reformulada após pedido
de explicação; não foi presumido que o código antigo representava a via real.

Atualizado primeiro `MAPA_BRISAMAR_V1_CONSOLIDADO.md`. Depois corrigidos:
- curva na ponta comum do AMV-12;
- ramo A ligado ao trecho L22 entre AMV-10 e AMV-12;
- ramo B ligado à L24 inferior, até a ponta comum do AMV-11 à direita;
- ramo A de AMV-11 ligado ao travessão L24; ramo B existente para AMV-10 preservado;
- removida a ligação indevida AMV-12 → AMV-03/L30 e a extensão fictícia de L22
  após AMV-12, com os dois nós terminais direitos sem correspondência no desenho.

Sete testes de movimento real cobrem os alinhamentos, retorno, chave contra,
continuação pelo AMV-11 e independência do acesso à L30. O teste de proteção
contra saída ambígua passou a injetar explicitamente uma duplicação em fixture,
pois a ambiguidade real de AMV-03-B deixou de existir. O teste genérico de terminal
no store usa agora o limite externo modelado, com intervalo, preservando o caso.
Nenhum desenho, rótulo, controle, preparação ou geometria aprovado foi alterado.

Tentativa de leitura via rg usou prefixo `app/` já dentro de `app` e retornou
arquivo ausente; leitura refeita a partir da raiz, sem consequência para o código.
AMVs 06/07/08 e modelagem longitudinal continuam pendentes; não foram alterados.

Validação B1: lint aprovado; 18 arquivos de teste, 233/233 casos aprovados
(+7 sobre a etapa A); TypeScript/Vite aprovados, 45 módulos, JS 227,58 kB.
Nenhum teste anterior removido. Sem nova interação visual neste incremento:
o teste visual aprovado da preparação permanece válido; movimento no SVG ainda
não está conectado. Sem commit/push.

### Etapa B2 — diagonal L20/L18/L16 validada

O responsável confirmou a sequência L22 → 09 → 08 → 07 → 06 e esclareceu que
intervalo concedido autoriza acesso, mas o praticante precisa alinhar as pontas
seguintes para escolher a linha reta ou a continuação diagonal. Confirmou também
a explicação consolidada com “perfeito”. Registro no mapa precedeu a edição.

Corrigidos os trechos entre 09/08, 08/07 e 07/06: suas extremidades passam a
ligar as pontas distintas de cada AMV. Criados `N-AMV08-D` e `N-AMV07-D` para
os ramos diagonais, mantendo os IDs históricos dos ramos que entram nas linhas.
Não usar mais a ponta comum do AMV anterior como ramo do próximo.
AMV-06 fixo preservado, assim como trechos técnicos, intervalo e linguagem visual.

Criada suíte `protectedDiagonalRoutes.test.ts`: ida/volta pelos três destinos,
intervalo sem alinhamento automático, bloqueios de retorno em chaves contra,
colisão, ocupação, imobilização após entrega e unicidade de pontas dos AMVs.
O teste de rejeição de dados com nó compartilhado foi mantido por fixture
explicitamente inconsistente; a topologia real agora não tem essa duplicação.
Nenhuma API, painel de teste ou nova interação visual foi adicionada.

Verificação B2: lint aprovado; 19 suítes, 248/248 testes (+15); TypeScript e
Vite aprovados (45 módulos). Não houve falha nessa rodada. `git diff --check`
aprovado. Diff acumulado rastreado: 15 arquivos, 378 inserções e 143 exclusões;
arquivos novos continuam separados no status. Nada staged, nenhum commit/push.
Preparação e teste visual já aprovado preservados. Próxima etapa técnica:
representação longitudinal e conversão dos grupos explicitamente engatados,
sem usar a ocupação de um segmento inteiro como posição física de cada trem.

### Etapa C1 — conversão dos grupos preparados

Implementada `buildPreparedCompositions`, função pura usada por `startSimulation`.
Cada cadeia explicitamente engatada gera uma composição; cada item separado
gera seu próprio grupo. Blocos expandem para `WagonUnit` com identidade estável,
`sourceBlockId`, texto livre, cor e ordem preservados. Locomotivas conservam
identificação/orientação, inclusive no meio do grupo. Não há fusão de blocos.

Estado `compositionOrigins` relaciona composição, seção e IDs dos itens originais,
sem duplicar unidades nem atribuir frente, distância ou posição no grafo.
Início publica modo/composições/origens atomicamente; entradas inconsistentes
são rejeitadas antes de qualquer publicação. Não misturar a inicialização lógica
explícita com um cenário preparado: essa combinação é rejeitada explicitamente.
O caminho explícito da TASK-013 permanece funcionando quando não há materiais
na preparação, sem substituir os dados das suítes anteriores.

Decisões técnicas: IDs gerados determinísticos com tuplas JSON para evitar
ambiguidades por separadores; validação de duplicidade de seções, itens, veículos
e engates, bem como quantidades inválidas e marcas sem adjacência. Sem tamanho
físico derivado da quantidade. A conversão cria objetos próprios e não altera o
cenário renderizado, notas, AMVs ou marcações originais.

Primeira rodada: lint/build aprovados e 268/268 testes (+20), sem falhas.
O teste antigo que esperava nenhuma composição após preparar locomotiva foi
atualizado para o novo comportamento definido: composição criada, sem posição
ou engate inventado. Foram mantidos seus bloqueios após início e a preservação
do cenário. Fixtures de store passaram a limpar também `compositionOrigins`.

Acrescentado no resumo real após início: “Composições iniciais: N”, permitindo
verificar a conversão em tela. Teste do painel confirma dois grupos quando só
uma das duas ligações foi marcada. Nenhuma mudança de geometria ou movimento.

**⚠️ TESTE EM TELA OBRIGATÓRIO** ao concluir esta rodada, conforme prompt mestre
§8.E. Cenário vazio inicial, preparar `[5 FVR] [3820] [3 EPI]`:
1. Marcar somente primeira ligação; iniciar → duas composições iniciais.
2. Recarregar e repetir com ambas marcadas → uma composição inicial.
3. Recarregar e repetir sem marcas → três composições iniciais.
4. Em todos, conferir materiais, capacidades durante preparação, notas e resumo
   preservados, sem controles de edição após início. Ainda não há movimento.
Solicitar relato/capturas e aguardar aprovação antes de evoluir UI relacionada.

Próximo trabalho espacial precisa tratar extensão e posição ao longo do trilho,
várias composições por segmento e ocupação parcial. Não inferir metros de
capacidade de referência nem reutilizar o segmento inteiro como posição de trem.

Rodada final C1 com o resumo integrado: lint aprovado, 21 suítes e 268/268 testes,
TypeScript/Vite aprovados (46 módulos; JS 229,46 kB). `git diff --check` aprovado.
Servidor local verificado fora do sandbox com HTTP 200. Diff acumulado rastreado:
15 arquivos, 403 inserções e 145 exclusões; arquivos novos listados separadamente
no status. Nada staged; sem commit/push. Pausa para teste em tela da etapa C1.

### Pausa solicitada pelo responsável

Desenvolvimento pausado explicitamente em 2026-10-26. Retomar por
`docs/checkpoints/CHECKPOINT-2026-10-26-PAUSA-TASK-014.md`.
Teste visual C1 continua pendente; etapa A permanece aprovada. Não fazer
commit/push nem continuar implementação sem novo pedido do responsável.
