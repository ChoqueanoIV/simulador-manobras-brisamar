# TASK-003 — Primeiro SVG do Pátio Brisamar

## Objetivo

Substituir a tela padrão do Vite por uma primeira representação SVG navegável do Pátio Brisamar.

Esta task é **somente visual**.

Ainda não implementar:

- locomotivas;
- vagões;
- engate;
- corte;
- movimentação ferroviária;
- intervalo;
- chave contra;
- regras de ocupação dos AMVs.

## Escopo

Criar:

- cabeçalho do simulador;
- aviso de finalidade;
- canvas do pátio;
- L16, L18, L20, L22, L24, L26, L28 e L30;
- referências Superior, Travessão e Inferior;
- 12 AMVs identificados visualmente;
- marcos;
- placas PARE;
- zoom com roda do mouse;
- pan com arraste do botão esquerdo em área vazia.

## Regra

A topologia visual deve ser validada antes de evoluir para o motor ferroviário.

## Critérios de aceite

- [ ] aplicação deixa de mostrar a tela padrão do Vite;
- [ ] Pátio Brisamar aparece como tela principal;
- [ ] linhas principais são reconhecíveis;
- [ ] AMV-01 a AMV-12 aparecem;
- [ ] zoom funciona;
- [ ] pan funciona;
- [ ] aviso de simulação aparece;
- [ ] `npm run lint` passa;
- [ ] `npm run build` passa.

## Commit sugerido

```text
feat: adiciona primeira representação svg do pátio brisamar
```
