# PRÓXIMA ETAPA — ÉPICO 5 (PREPARAÇÃO): TOPOLOGIA DO GRAFO

## Contexto

O Épico 4 (domínio de composição, engate e corte) foi concluído.

Para que o motor de movimentação (Épico 5 completo) funcione, é necessário antes
modelar o **pátio como grafo computável** — nós de conexão e segmentos de trilho.

Sem esse grafo, o motor não consegue:
- determinar por qual trilho a composição deve continuar;
- detectar quando um AMV está contra;
- seguir a topologia ao atravessar de um segmento para outro.

**Esta etapa entrega apenas os dados estáticos da topologia.** Nenhum movimento ainda.

---

## Fonte de verdade

```text
docs/MAPA_BRISAMAR_V1_CONSOLIDADO.md
docs/MODELO_DOMINIO.md  (seções 2 e 3)
app/src/yard/data/brisamarSwitches.ts  (AMVs já mapeados)
app/src/yard/components/YardCanvas.tsx (coordenadas SVG de referência)
```

---

## Escopo

### A — Tipo TrackNode

Nó de conexão na topologia. Representa um ponto do pátio onde:
- dois segmentos se encontram;
- ou um AMV conecta/desconecta rotas.

```ts
type TrackNode = {
  id: string;
};
```

### B — Tipo TrackSegment

Trecho navegável de trilho entre dois nós.

```ts
type TrackSegment = {
  id: string;
  line: string;           // 'L22', 'L24', etc.
  startNodeId: string;
  endNodeId: string;
  protectedByInterval: boolean;  // true para trechos em L16/L18/L20
};
```

Regras:
- cada segmento conecta exatamente dois nós;
- uma mesma linha pode ter vários segmentos (ex.: L22_SUPERIOR, L22_TRAVESSAO, L22_INFERIOR);
- segmentos de L16, L18 e L20 são `protectedByInterval: true`;
- segmentos técnicos (continuação reta além da área de manobra) são modelados mas marcados.

### C — Conexões dos AMVs

Cada AMV no grafo conecta três nós (ponta comum + dois ramos).

Acrescentar ao `SwitchDefinition` existente:

```ts
type SwitchDefinition = {
  // campos já existentes ...
  nodeCommon: string;   // nó da ponta única do AMV
  nodeA: string;        // nó do ramo na posição A
  nodeB: string;        // nó do ramo na posição B
};
```

Com essa informação, dado o estado atual do AMV (posição A ou B), o motor
sabe qual par de nós está conectado.

### D — Arquivo de topologia

Criar `app/src/yard/data/brisamarTopology.ts` com:
- todos os nós (`TrackNode[]`);
- todos os segmentos (`TrackSegment[]`);
- conexões dos AMVs atualizadas em `brisamarSwitches.ts`.

Derivar **exclusivamente** do `MAPA_BRISAMAR_V1_CONSOLIDADO.md`
e das coordenadas SVG já validadas em `YardCanvas.tsx`.

**Não inventar topologia.** Se um trecho estiver ambíguo no mapa, parar e perguntar.

### E — Funções de consulta (grafo)

Criar `app/src/yard/data/brisamarTopologyGraph.ts` com funções puras:

```ts
// Retorna os segmentos conectados a um nó
function getSegmentsAtNode(nodeId: string, segments: TrackSegment[]): TrackSegment[]

// Dado o AMV no estado atual, retorna o par de nós conectados
function getActiveSwitchConnection(
  switchDef: SwitchDefinition,
  position: SwitchPosition,
): [string, string]

// Dado um segmento e o nó de chegada, retorna o nó de saída
function getExitNode(segment: TrackSegment, entryNodeId: string): string | null
```

---

## Fora do escopo desta etapa

NÃO implementar agora:
- movimentação por arraste;
- detecção de colisão;
- chave contra (lógica de bloqueio);
- ocupação de AMV por material rodante;
- atualização do estado de posição de composição no store;
- placas PARE funcionais;
- intervalo nas linhas L16/L18/L20.

---

## Testes obrigatórios

```powershell
npm run lint
npm run test
npm run build
```

Cobrir:
- `getExitNode` para ambas as direções de um segmento;
- `getActiveSwitchConnection` para posição A e B;
- `getSegmentsAtNode` para nó com um, dois e três segmentos.

---

## Referências

- `docs/MAPA_BRISAMAR_V1_CONSOLIDADO.md`
- `docs/MODELO_DOMINIO.md` seções 2 e 3
- `app/src/types/switch.ts`
- `app/src/yard/data/brisamarSwitches.ts`
