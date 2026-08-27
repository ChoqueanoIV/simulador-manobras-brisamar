# HISTÓRICO ESSENCIAL — NÃO REPETIR ERROS

Este arquivo complementa os checkpoints existentes. Os documentos reais em `docs/checkpoints/` e `docs/tasks/` continuam sendo a fonte detalhada.

## Tentativas importantes

- Primeiro render de rolling stock usou cursor mutável durante render e falhou no lint.
- Houve erro TypeScript de `section possibly undefined`; foi corrigido com narrowing.
- Foram tentados diferentes visuais de locomotiva.
- Emoji foi descartado.
- Número espelhado foi identificado como erro.
- Vagões chegaram a sobrepor/“engolir” a locomotiva; foi criada reserva visual mínima.
- Inicialmente trilho físico e estacionamento eram tratados como a mesma coisa; isso foi descartado.
- L22/L24 inicialmente eram áreas únicas; foram divididas.
- Travessão passou a ser trecho próprio.
- Alça curva inicialmente era só rota; passou a aceitar material e seguir a curva.
- L22/L24 superior sem capacidade faziam qualquer bloco ocupar 100%; capacidades foram adicionadas.
- L26/L28 tinham capacidade correta, mas geometria/escala visual inconsistente; foram ajustadas.

## Decisões descartadas

Não repetir:
- emoji para locomotiva;
- consolidar blocos iguais;
- uma única região para L22;
- uma única região para L24;
- AMV como limite de estacionamento;
- largura visual sem considerar capacidade;
- mutação de variável durante render;
- estado paralelo quando o store já oferece a regra;
- refatoração ampla durante correção pontual.

## Princípio

```text
Geometria = circulação.
Marcos/placas = estacionamento seguro.
Capacidade = referência de ocupação.
Estado = verdade funcional.
UI = representação dessas regras.
```
