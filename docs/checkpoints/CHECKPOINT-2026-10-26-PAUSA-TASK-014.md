# Checkpoint de pausa — TASK-014 — 2026-10-26

## Situação da sessão

Trabalho pausado por solicitação explícita do responsável: “vamos pausar e fazer
um checkpoint”. Não continuar implementação ou evoluir UI até ele pedir retomada.
Este é o ponto de entrada mais recente; documentos anteriores ficam preservados.
A sessão do servidor Vite iniciada pelo agente foi encerrada ao salvar esta pausa.
Será necessário reiniciá-la para o próximo teste em tela.

### Autorização posterior para versionamento

Após salvar a pausa, o responsável autorizou commit e push na branch atual
respondendo “sim, prossiga” à proposta explícita de ambos. Esta autorização é
para versionar/publicar o checkpoint, sem retomar desenvolvimento ou considerar
aprovado o teste visual C1. Os registros de HEAD/status abaixo descrevem a
situação anterior ao commit. O hash resultante deve ser consultado no Git.
A pasta handoff preexistente permanece fora deste commit por não ter sido
criada ou modificada na implementação.

## Git

- Branch conferida: `feat/1-modo-preparacao-patio`.
- HEAD conferido: `8426dc8` — último commit continua sendo TASK-012.
- Nenhum commit, push, merge, stage, reset ou limpeza nesta sessão.
- Tudo que foi implementado está no diretório de trabalho e ainda NÃO commitado.
- Antes deste checkpoint: 15 arquivos rastreados modificados, diff acumulado
  de 403 inserções e 145 exclusões; arquivos novos não entram nesse diff padrão.
- Novos arquivos incluem funções e testes de engates, conversão de composições,
  rotas AMV-12/diagonal, integração do store, dados PARE e documentação.
- `brisamar_codex_handoff/` já estava não rastreado ao iniciar e foi preservado.
- Sincronia remota foi conferida anteriormente em `8426dc8`; não revalidada
  durante esta pausa. Não afirmar sincronização atual de alterações não commitadas.

## Implementação entregue até aqui

### TASK-013 — camada lógica

Registro explícito de composições/posições, `moveComposition`, atualização atômica
de posição e ocupação dos AMVs, validação/cópia de entradas e bloqueios tipados.
Placas PARE funcionais no domínio, com nove continuações lógicas protegidas.
Movimento a partir de área protegida também exige intervalo.

### TASK-014 A — engates na preparação

Marcação explícita entre itens vizinhos, sem engate automático. Acrescentar
material preserva ligações anteriores; limpar seção remove apenas suas ligações.
Iniciar bloqueia edição e preserva resumo somente leitura.
**Teste visual desta etapa aprovado pelo responsável.**

### TASK-014 B1 — AMV-12

Corrigida sequência real: curva → AMV-12 → L24 à direita → AMV-11 → rota alinhada.
Em A, AMV-12 liga curva a L22/AMV-10; em B, a L24/AMV-11.
Removidos salto incorreto até AMV-03/L30 e extensão fictícia à direita de L22.
AMV-11 tem ponta comum à direita; A segue L24 rumo ao AMV-04; B ao desvio/AMV-10.
Desenho e controles aprovados preservados.

### TASK-014 B2 — diagonal protegida

Corrigidos os trechos 09/08, 08/07 e 07/06 com pontas distintas de cada AMV.
Ida/volta pelas três linhas, chave contra, colisão e intervalo cobertos por testes.

### TASK-014 C1 — composições a partir da preparação

`buildPreparedCompositions` expande blocos em unidades e forma cadeias usando
somente engates marcados. Preserva ordem, identificação, cor, orientação e origem.
`startSimulation` publica composições e `compositionOrigins` atomicamente.
Entradas inconsistentes são rejeitadas sem publicação parcial.
Não mistura cenário preparado com inicialização lógica explícita.

O painel após início exibe “Composições iniciais: N”. A preparação visual, notas,
AMVs e materiais permanecem preservados. Essas composições ainda NÃO possuem
posição no grafo. O material ainda NÃO se movimenta pelo SVG.

**Teste visual de C1 solicitado, mas NÃO aprovado até esta pausa.**
Não confundir a aprovação anterior da etapa A com aprovação da conversão C1.

## Decisões do domínio já recebidas — não perguntar novamente

1. Praticante escolhe no mapa a extremidade inicial do movimento; não deduzir
   frente lógica da orientação frente/ré barra da locomotiva.
2. Praticante marca engates existentes durante a preparação, antes de iniciar.
3. As nove vias com placa PARE continuam além dela; acesso exige intervalo do CCO,
   usando o controle já existente. Não acrescentar autorização separada ou rádio.
4. AMV-12 vindo da curva acessa L24 pelo lado direito e segue ao próximo AMV;
   não salta para o acesso à L30.
5. Sequência da diagonal: L22 → 09 → 08 → 07 → 06. Em 08 escolhe L20 ou diagonal;
   em 07 escolhe L18 ou continuação até 06/L16. AMV-06 fixo preservado.
6. Intervalo autoriza o acesso, mas não alinha automaticamente nenhuma chave.

O responsável entende melhor trajetos concretos com nomes das linhas e desenhos
simples. Evitar perguntas com IDs de nós ou vocabulário de grafo.

## Últimas verificações reais

Rodadas realizadas antes do pedido de pausa; não foram repetidas sem mudança de
código durante a pausa:

| Verificação | Resultado |
| --- | --- |
| `npm run lint` | aprovado |
| `npm run test` | 21 suítes, 268/268 testes |
| `npm run build` | TypeScript + Vite aprovados, 46 módulos |
| `git diff --check` | aprovado |
| HTTP local | 200, antes de encerrar servidor para pausa |

Build final: JS 229,46 kB (gzip 71,30 kB), CSS 9,28 kB.

Para testes no sandbox Windows foi necessário usar TEMP/TMP em
`app/node_modules/.tmp`, pois o TEMP padrão apresentou `EPERM rename` antes
dos casos. Não é mudança no comportamento do produto.

Outras tentativas/correções estão em TASK-013/checkpoint e no histórico de
TASK-014: BOM do Prettier removido, expectativas de terminal/PARE e proteção
atualizadas conforme decisões, servidor inacessível no sandbox reiniciado fora
dele. Não houve falha na última rodada de 268 testes.

## Primeiro passo ao retomar

1. Ler este checkpoint, `AGENTS.md`, prompt mestre e task TASK-014.
2. Conferir branch/status e preservar TODAS as alterações locais.
3. Reiniciar servidor local na pasta `app`:

```powershell
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

O servidor iniciado dentro do sandbox escutava mas não respondia ao navegador.
Nesta máquina foi necessário executá-lo fora do sandbox; verificar HTTP antes
de afirmar que está acessível. Endereço: `http://127.0.0.1:5173/`.

4. Concluir **⚠️ TESTE EM TELA OBRIGATÓRIO da etapa C1**, conforme prompt mestre
   §8.E, e aguardar confirmação antes de evoluir UI relacionada:
   - Em pátio vazio, preparar `[5 FVR] [3820] [3 EPI]`.
   - Só a primeira ligação marcada → 2 composições iniciais após iniciar.
   - Recarregar/repetir com ambas marcadas → 1 composição inicial.
   - Recarregar/repetir sem marcas → 3 composições iniciais.
   - Conferir cenário, notas e resumo preservados; edição bloqueada após início.
   - Solicitar relato e, se possível, capturas.

Recarregar descarta o cenário por definição do MVP; não há salvamento.

## Próximo desenvolvimento após essa validação

Representação longitudinal: posição e extensão ao longo dos trilhos, várias
composições em um segmento, colisão por intervalos espaciais e ocupação parcial.
O modelo atual continua conservador: colisão por segmento e AMV por adjacência.
Não usar quantidade/capacidade para inventar comprimento em metros.
Não converter automaticamente seção em segmento por semelhança de nome.
L24 superior cobre vários trechos; L22 inferior corresponde agora ao trecho
AMV-10/AMV-12. Usar topologia corrigida e geometria real na integração espacial.

Movimento contínuo, seleção de extremidade, engate/corte durante manobra e
animação SVG ainda pendentes. Não afirmar MVP ou TASK-014 concluídos.

## Referências

- `docs/tasks/TASK-014-INTEGRACAO-PREPARACAO-MOVIMENTO.md` — histórico incremental.
- `docs/tasks/TASK-013-STORE-POSICOES-PLACA-PARE.md` — plano de integração lógica.
- `docs/checkpoints/CHECKPOINT-2026-10-26-TASK-013.md` — auditoria inicial.
- `docs/MAPA_BRISAMAR_V1_CONSOLIDADO.md` e `docs/MODELO_DOMINIO.md` — decisões.
- `brisamar_codex_handoff/CODEX_PROMPT_MESTRE.md` — protocolo de execução.
