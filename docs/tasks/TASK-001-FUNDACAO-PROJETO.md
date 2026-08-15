# TASK-001 — Fundação do projeto

## Objetivo

Criar a base técnica do **Simulador de Manobras do Pátio Brisamar** antes da implementação do mapa e do motor ferroviário.

## Nome sugerido do repositório

`simulador-manobras-brisamar`

## Estrutura desejada após esta task

```text
PROJETO SIMULADOR BRISAMAR/
├── AGENTS.md
├── README.md
├── docs/
│   ├── ARQUITETURA.md
│   ├── BACKLOG_MVP.md
│   ├── MAPA_BRISAMAR_V1_CONSOLIDADO.md
│   ├── MODELO_DOMINIO.md
│   └── tasks/
│       ├── README.md
│       └── TASK-001-FUNDACAO-PROJETO.md
├── app/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
└── scripts/
    └── bootstrap-app.ps1
```

## Decisão de organização

A aplicação React ficará em `app/`.

Isso mantém na raiz do repositório:

- documentação;
- instruções para agentes;
- scripts;
- arquivos futuros de projeto.

O código executável fica isolado em `app/`.

## Pré-requisitos

Antes de executar:

```powershell
node --version
npm --version
git --version
```

Os três comandos precisam responder com versões instaladas.

## Inicialização

Na raiz de `PROJETO SIMULADOR BRISAMAR`, execute:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\bootstrap-app.ps1
```

O script criará o projeto React + TypeScript + Vite dentro de `app/` e instalará as dependências iniciais.

## Dependências iniciais

Produção:

- React
- TypeScript
- Zustand

Desenvolvimento:

- Vite
- ESLint
- Prettier
- Vitest
- jsdom
- Testing Library

## Validações

Depois da instalação:

```powershell
cd app

npm run dev
npm run lint
npm run test
npm run build
```

## Critérios de aceite

- [ ] aplicação abre localmente;
- [ ] TypeScript funcionando;
- [ ] ESLint funcionando;
- [ ] Prettier configurado;
- [ ] Vitest executando;
- [ ] Zustand instalado;
- [ ] build de produção funcionando;
- [ ] documentos permanecem na raiz;
- [ ] nenhuma dependência de backend, banco ou cloud.

## Git

Depois de validar:

```powershell
git init
git add .
git commit -m "chore: inicia estrutura do simulador de manobras brisamar"
```

Depois criar o repositório no GitHub e conectar o remoto.

## Fora do escopo desta task

Ainda não implementar:

- desenho do pátio;
- AMVs;
- vagões;
- locomotivas;
- zoom;
- pan;
- motor ferroviário;
- intervalo;
- engate;
- corte.

Essa task termina quando a fundação técnica estiver funcionando.
