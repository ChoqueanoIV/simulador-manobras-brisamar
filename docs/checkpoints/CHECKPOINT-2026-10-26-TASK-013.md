# Checkpoint — auditoria e TASK-013 — 2026-10-26

## Git e preservação

- Raiz: `C:/Users/Leandro CHOQUE/OneDrive/Documentos/PROJETO SIMULADOR BRISAMAR`.
- Branch: `feat/1-modo-preparacao-patio`.
- HEAD: `8426dc8cbf1e83ed286a69ed9d58a4d6fbcfc836` (TASK-012).
- Commits anteriores: `35a8995` colisão; `6d7da0b` posição/movimento;
  `1e69823` navegação; `ecc2304` topologia.
- Origin: `https://github.com/ChoqueanoIV/simulador-manobras-brisamar.git`.
- `git ls-remote` inicialmente falhou por DNS no sandbox. Nova consulta somente
  leitura, com acesso de rede ampliado, retornou o mesmo hash do HEAD. Sincronia
  confirmada nesse instante, sem fetch, commit, merge ou push.
- Estado inicial: somente `?? brisamar_codex_handoff/`; preservado integralmente.
- Nenhum arquivo rastreado do usuário tinha alteração inicial.

## Fontes lidas e inventário

Prompt mestre integral, AGENTS, READMEs, configurações TS/ESLint/Vite,
`.bob/instructions/PROXIMA-ETAPA.md`, `.bob/PROMPT-CONTEXTO-CHATGPT.md`, documentos
de escopo/mapa/arquitetura/modelo, todas as tasks e checkpoints existentes.
`docs/REGRAS_NEGOCIO.md` e package.json da raiz não existem.

Aplicação em `app/`: React, TypeScript, Zustand, SVG, Vite, Vitest e ESLint.
`npm test` não substitui `tsc -b` do build. Configuração TS atual não declara
`strict`; não foi alterada nesta fatia. Não há backend, banco ou persistência.

| TASK / módulo | Estado comprovado no código |
| --- | --- |
| 001/003/004 | Fundação, SVG, zoom/pan, AMVs e intervalo em UI |
| 005 | Preparação por seção, notas, escala/capacidades e bloqueio de edição após início |
| 006 | Tipos individuais, `createComposition`, `couple`, `splitAt`, `hasLocomotive`; sem UI de engate/corte |
| 007 | Nós, segmentos, conexões e consultas; divergências ferroviárias abaixo |
| 008 | Navegação/chave contra/intervalo; PARE era apenas enum reservado |
| 009/010 | Posição e passo discreto puros; sem movimento SVG |
| 011 | Colisão conservadora por segmento inteiro |
| 012 | Ocupação conservadora por adjacência, setter e bloqueio via `toggleSwitch` |
| 013 nesta sessão | Cadastro lógico explícito, comando no store e PARE funcional no domínio |
| 014 / restante | Conversão real da preparação, seleção de extremidade e movimento SVG pendentes |

Fluxo visual atual: `PreparationPanel → yardSections → YardRollingStock`.
`startSimulation` altera o modo e preserva o cenário; não cria posições.
Fluxo novo, ainda sem chamador React: `initializeCompositions → compositions +
positionedCompositions → moveComposition → stepComposition → posições + AMVs`.

## Divergências e riscos encontrados

1. README e tasks antigas dizem “planejada” mesmo com implementação existente;
   checkpoints guardam diferentes contagens históricas. A matriz acima registra
   o estado real sem apagar a história.
2. `.bob/PROMPT-CONTEXTO-CHATGPT.md` presume entrega por copiar/colar e 92 testes;
   está superado pelo pedido atual de editar diretamente e pelo checkpoint 012.
3. AMV-06 é fixo no código/UI e no checkpoint visual; escopo/mapa mais antigos
   descrevem manipulação com intervalo. Comportamento existente preservado.
4. `N-AMV06-C` é ponta de AMV-06 e AMV-07; `N-AMV07-C` é ponta de AMV-07 e
   AMV-08. O motor anterior selecionava a primeira definição encontrada.
5. `N-AMV03-B` tem `SEG-L30` e `SEG-L22-L24-AMV12`; `N-AMV12-B` tem
   `SEG-L22-CURVA` e `SEG-L22-L24-AMV12`. O motor escolhia o primeiro candidato.
   AMV-12 no checkpoint aprovado tem a alça como ponta fixa; no grafo a ponta
   comum é `N-AMV12-C`. Precisa de validação de topologia, não correção inferida.
6. Seções de estacionamento não correspondem necessariamente a um segmento:
   L24 superior atravessa vários AMVs; L22 inferior renderizada fica entre
   AMV-10 e AMV-12, enquanto `SEG-L22-INF` está após AMV-12. Não converter por
   semelhança de nomes. Esse ponto impede uma integração honesta do movimento SVG.
7. `splitAt` não renova `sourceBlockId`; o cadastro ainda não expande blocos em
   `WagonUnit`. São lacunas da integração de engate/corte, fora desta fatia.
8. Setters do Zustand/objetos acessíveis pelo store podem ser usados por código
   interno; a garantia de invariantes depende das ações públicas previstas.
   O setter legado agora valida/copia entradas; não é exposto em controles de UI.
9. Não há ocupação longitudinal, distância nem trem atravessando vários segmentos.

## Decisões e implementações

- Reusar array de posições da TASK-012, evitando um Map mutável redundante.
- Registro explícito de composição/posição apenas em preparação. Validar IDs,
  extremidades, veículos duplicados e colisão inicial, sem inferir engates.
- Copiar objetos de entrada para evitar ocupação obsoleta por mutação externa.
- Movimento apenas em simulação, retornando bloqueios tipados; falha preserva
  o objeto inteiro do estado. Sucesso publica posição e ocupação atomicamente.
- Reusar `toggleSwitch`, `stepComposition`, colisão e topologia reais.
- Posição inválida retorna `invalid-position`; navegação ambígua ou sem estado
  de AMV retorna `invalid-topology`, sem selecionar rota arbitrária.
- Corrigir movimentação a partir de área protegida sem intervalo (antes só a
  entrada no destino protegido era verificada). Regra centralizada na navegação.
- Responsável escolheu: praticante define a extremidade inicial no mapa.
- Pergunta inicial sobre placas foi reformulada didaticamente após o responsável
  pedir explicação. Ele confirmou continuidade nas nove pontas e intervalo CCO.
- Atualizar mapa/modelo antes do código; acrescentar nove continuações lógicas,
  sem distância ou capacidade inferida e sem segunda autorização de intervalo.
- Não modificar geometria, componentes React, CSS nem adicionar painel artificial.

## Tentativas, sintomas e correções

1. Baseline: lint e build aprovados. Teste no TEMP padrão falhou nas 11 suítes
   antes de executar casos (`EPERM rename` no cache SSR do sandbox).
   Correção de ambiente, sem mudar o produto: TEMP/TMP em `app/node_modules/.tmp`.
   Reexecução: 11 suítes, 142/142 testes. Não eram falhas ferroviárias.
2. Primeira fatia de store/integridade: lint/build aprovados, 13 suítes,
   175/175 testes. Fixtures antigas HEAD/TAIL substituídas por posições reais;
   esses nós fictícios nunca eram posições válidas da topologia.
3. Após PARE: 211/212 testes. Uma asserção antiga dizia que todos os trechos de
   L22/L24/L26/L28/L30 eram livres, incluindo as novas continuações externas.
   Corrigir seu escopo para trechos internos, mantendo teste explícito de proteção
   de cada extensão. Expectativas antigas “terminal” em placas atualizadas para
   a regra validada; terminais reais/modelados continuam testados.
4. Prettier falhou ao ler `.prettierrc.json` por BOM UTF-8 preexistente. Removido
   somente o BOM e executada formatação nos arquivos de lógica/testes envolvidos.
5. `git diff --check` apontou linha vazia extra no fim da topologia; removida.
   Avisos LF/CRLF são configuração Git existente; sem conversão global.
   Uma checagem adicional com `core.autocrlf=false` identificou CR residual no
   JSON de configuração; normalizado somente esse arquivo para LF, sem mudança
   de valores, e repetido `git diff --check` com a configuração normal do projeto.
6. Consulta de `.gitignore` da raiz retornou arquivo ausente; ignore do app
   existe e cobre `node_modules` e `dist`. Nenhum arquivo removido por isso.

## Como reproduzir as verificações

Na pasta `app`, em PowerShell:

```powershell
npm run lint
$env:TEMP = Join-Path (Get-Location) 'node_modules/.tmp'
$env:TMP = $env:TEMP
npm run test
npm run build
```

O ajuste de TEMP é local ao processo e necessário neste sandbox Windows;
não é requisito permanente da aplicação. Nenhuma dependência foi instalada.

## Próximo marco visual e pendências

### Verificação final concluída

| Comando | Resultado real |
| --- | --- |
| `npm run lint` | aprovado, exit 0 |
| `npm run test` com TEMP/TMP local | 14 arquivos, 212/212 testes, exit 0 |
| `npm run build` | TypeScript + Vite aprovados, exit 0; 43 módulos |
| `git diff --check` | aprovado após remover linha vazia extra |

Build: JS 225,69 kB (gzip 70,16 kB), CSS 8,81 kB. Testes novos elevaram a base
de 142 para 212 (+70), sem remoção de casos existentes. As expectativas de
terminal e de proteção foram atualizadas conforme a decisão explícita sobre PARE.

`git diff --stat`: 11 arquivos rastreados, 234 inserções e 95 exclusões.
Há também 6 arquivos novos desta sessão (3 suítes, dados PARE, task e checkpoint),
que o diff padrão não contabiliza. `git status --short`: 11 modificados,
esses 6 novos e a pasta handoff já existente, intacta. Nada staged.

Arquivos principais: store e testes de integração, navegação, validação de
posição, passo de movimento, topologia e dados PARE. Documentos mapa/modelo
registram decisões; task/checkpoint registram plano, auditoria e tentativas.
Configuração Prettier teve somente remoção de BOM. Nenhum pacote alterado.

Não há mudança de interação real nesta entrega: nenhuma ação de UI cria as
posições explícitas. Teste em tela da nova movimentação ainda não é executável
pelo fluxo do produto. Não afirmar validação visual sem evidência.

Antes da TASK-014, validar os itens 3–6 da auditoria e definir como o praticante
informa quais materiais já estão engatados na passagem de serviço. A decisão da
extremidade inicial já foi recebida; não perguntar novamente.

**⚠️ TESTE EM TELA OBRIGATÓRIO** no primeiro incremento que ligar a preparação
às posições ou alterar material/bloqueio clicável no SVG. Roteiro desse marco:

1. Preparar locomotiva e dois blocos iguais, conferindo separação e capacidade.
2. Iniciar, escolher extremidade explicitamente e conferir cenário preservado.
3. Comandar movimento; conferir rota real, ausência de sobreposição, posição e
   cadeados atualizados; AMV ocupado não alterna.
4. Sem intervalo, tentar cruzar PARE/área protegida; material permanece no limite.
5. Conceder intervalo, repetir e conferir travessia; entregar quando permitido,
   confirmar AMV-09 alinhado em A e material protegido imobilizado.
6. Solicitar relato dos resultados e capturas antes/depois, parar e aguardar
   confirmação antes de evoluir UI relacionada, conforme o prompt mestre §8.E.

Sem commit, push ou alteração do handoff original.
