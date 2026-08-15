$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "===================================================="
Write-Host " Simulador Brisamar - Continuação do Bootstrap"
Write-Host "===================================================="
Write-Host ""

$root = Split-Path -Parent $PSScriptRoot
$appPath = Join-Path $root "app"

if (-not (Test-Path $appPath)) {
    throw "A pasta 'app' não foi encontrada em: $appPath"
}

Push-Location $appPath
try {
    Write-Host "Instalando/validando dependências do projeto..."
    npm install

    Write-Host ""
    Write-Host "Instalando Zustand..."
    npm install zustand

    Write-Host ""
    Write-Host "Instalando Vitest, Testing Library, jsdom e Prettier..."
    npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event prettier

    Write-Host ""
    Write-Host "Configurando scripts do package.json..."
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
    Write-Host "Executando build..."
    npm run build

    Write-Host ""
    Write-Host "Executando lint..."
    npm run lint

    Write-Host ""
    Write-Host "Bootstrap concluído com sucesso."
    Write-Host ""
    Write-Host "Para abrir a aplicação:"
    Write-Host "  cd app"
    Write-Host "  npm run dev"
}
finally {
    Pop-Location
}
