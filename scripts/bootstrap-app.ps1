$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "==============================================="
Write-Host " Simulador de Manobras Brisamar - Bootstrap"
Write-Host "==============================================="
Write-Host ""

function Require-Command($name) {
    if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
        throw "Comando '$name' não encontrado. Instale-o antes de continuar."
    }
}

Require-Command "node"
Require-Command "npm"
Require-Command "git"

Write-Host "Node:"
node --version
Write-Host "npm:"
npm --version
Write-Host "Git:"
git --version
Write-Host ""

$root = Split-Path -Parent $PSScriptRoot
$appPath = Join-Path $root "app"

if (Test-Path $appPath) {
    throw "A pasta 'app' já existe. O script não irá sobrescrevê-la."
}

Write-Host "Criando React + TypeScript + Vite em app/..."
Push-Location $root
try {
    npm create vite@latest app -- --template react-ts
}
finally {
    Pop-Location
}

Push-Location $appPath
try {
    Write-Host ""
    Write-Host "Instalando dependências do projeto..."
    npm install

    Write-Host ""
    Write-Host "Instalando Zustand..."
    npm install zustand

    Write-Host ""
    Write-Host "Instalando ferramentas de teste e formatação..."
    npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event prettier

    Write-Host ""
    Write-Host "Adicionando scripts ao package.json..."
    npm pkg set "scripts.test=vitest run"
    npm pkg set "scripts.test:watch=vitest"
    npm pkg set "scripts.format=prettier --write ."
    npm pkg set "scripts.format:check=prettier --check ."

    @"
node_modules
dist
coverage
.vite
*.local
.DS_Store
"@ | Set-Content -Encoding utf8 ".prettierignore"

    @"
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
"@ | Set-Content -Encoding utf8 ".prettierrc.json"

    Write-Host ""
    Write-Host "Executando build inicial..."
    npm run build

    Write-Host ""
    Write-Host "Executando lint inicial..."
    npm run lint

    Write-Host ""
    Write-Host "Bootstrap concluído."
    Write-Host "Próximo passo:"
    Write-Host "  cd app"
    Write-Host "  npm run dev"
}
finally {
    Pop-Location
}
