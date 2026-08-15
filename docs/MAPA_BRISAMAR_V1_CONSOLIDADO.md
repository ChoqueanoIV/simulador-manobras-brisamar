# MAPA_BRISAMAR_V1.md

## 1. Objetivo

Este documento consolida o **Mapa Lógico v1 do Pátio Brisamar** para servir como fonte de verdade inicial do simulador de planejamento de manobras.

A numeração dos AMVs é interna ao projeto e não representa nomenclatura ferroviária oficial.

---

## 2. Referências do pátio

O pátio é representado pelas linhas:

- L16
- L18
- L20
- L22
- L24
- L26
- L28
- L30

As referências **Superior**, **Travessão** e **Inferior** servem apenas para localização espacial no desenho.

As capacidades são interpretadas **de marco a marco**, e não pela extensão total de uma linha.

Os marcos podem ser ultrapassados normalmente por locomotivas e vagões.

As placas PARE só podem ser ultrapassadas com intervalo concedido.

---

## 3. AMVs mapeados

### AMV-01
- Posição A: L22 ↔ L26
- Posição B: L22 ↔ L28
- Intervalo: não obrigatório
- Regra de ocupação: não pode ser manipulado com locomotiva ou vagão sobre o AMV

### AMV-02
- Posição A: L24 ↔ L24
- Posição B: L24 ↔ região de acesso L26/L28
- Intervalo: não obrigatório
- Regra de ocupação: não pode ser manipulado com locomotiva ou vagão sobre o AMV

> Observação: na implementação, a posição B deverá ser representada por um nó/segmento lógico específico da conexão que recebe o acesso vindo da região de L26/L28.

### AMV-03
- Posição A: L24 ↔ L24
- Posição B: L24 ↔ L30
- Intervalo: não obrigatório
- Regra de ocupação: não pode ser manipulado com locomotiva ou vagão sobre o AMV

### AMV-04
- Posição A: L24 ↔ L24
- Posição B: L24 ↔ L22
- Intervalo: não obrigatório
- Regra de ocupação: não pode ser manipulado com locomotiva ou vagão sobre o AMV

### AMV-05
- Posição A: L22 ↔ L22
- Posição B: L22 ↔ L24
- Intervalo: não obrigatório
- Regra de ocupação: não pode ser manipulado com locomotiva ou vagão sobre o AMV

### AMV-06
- Posição A: L16 ↔ L16 (reto)
- Posição B: L16 ↔ diagonal de manobra
- Intervalo: obrigatório para manipulação
- Sem intervalo: AMV bloqueado para manipulação
- Regra de ocupação: mesmo com intervalo, não pode ser manipulado com locomotiva ou vagão sobre o AMV
- A continuação reta da L16 existe fisicamente, mas não faz parte da área de manobra do praticante

### AMV-07
- Posição A: L18 ↔ L18 (reto)
- Posição B: L18 ↔ diagonal de manobra
- Intervalo: obrigatório para manipulação
- Sem intervalo: AMV bloqueado para manipulação
- Regra de ocupação: mesmo com intervalo, não pode ser manipulado com locomotiva ou vagão sobre o AMV
- A continuação reta da L18 existe fisicamente, mas não faz parte da área de manobra do praticante

### AMV-08
- Posição A: L20 ↔ L20 (reto)
- Posição B: L20 ↔ diagonal de manobra
- Intervalo: obrigatório para manipulação
- Sem intervalo: AMV bloqueado para manipulação
- Regra de ocupação: mesmo com intervalo, não pode ser manipulado com locomotiva ou vagão sobre o AMV
- A continuação reta da L20 existe fisicamente, mas não faz parte da área de manobra do praticante

### AMV-09
- Posição A: L22 ↔ L22
- Posição B: L22 ↔ L20
- Intervalo: obrigatório para mudar para a posição de acesso à L20
- Sem intervalo:
  - a circulação L22 ↔ L22 é permitida
  - o praticante não pode manipular o AMV para L22 ↔ L20
- Com intervalo:
  - o AMV pode ser manipulado entre as duas posições
- Ao entregar intervalo:
  - o AMV deve obrigatoriamente ficar em L22 ↔ L22
- Se houver locomotiva ou vagão sobre o AMV:
  - não pode ser manipulado
  - não é permitido entregar o intervalo enquanto o AMV estiver ocupado

### AMV-10
- Posição A: L22 ↔ L22
- Posição B: L22 ↔ L24
- Intervalo: não obrigatório
- Regra de ocupação: não pode ser manipulado com locomotiva ou vagão sobre o AMV

### AMV-11
- Posição A: L24 ↔ L24
- Posição B: L24 ↔ L22
- Intervalo: não obrigatório
- Regra de ocupação: não pode ser manipulado com locomotiva ou vagão sobre o AMV

### AMV-12
- Posição A: L22 ↔ L22
- Posição B: L22 ↔ L24
- Intervalo: não obrigatório
- Regra de ocupação: não pode ser manipulado com locomotiva ou vagão sobre o AMV

---

## 4. Regras gerais de AMV

Todos os AMVs:

- possuem apenas duas posições;
- mudam de posição instantaneamente;
- precisam mostrar visualmente sua posição atual;
- não podem ser manipulados se houver qualquer locomotiva ou vagão sobre sua região física;
- devem exibir cadeado quando estiverem bloqueados para manipulação.

A mesma posição de um AMV pode ser favorável em um sentido e contra no sentido oposto.

### Chave contra

Uma chave está **contra** quando, considerando:

- o sentido da composição;
- a extremidade pela qual ela chega;
- a posição atual do AMV;

a passagem resultaria em condição física de quebra da chave.

Nesse caso, o simulador deve impedir a passagem da composição.

### Chave direcionada para outro caminho

Se o AMV não estiver contra, mas estiver direcionado para uma linha diferente da intenção do praticante, a composição não deve ser bloqueada.

Ela deve seguir pelo caminho fisicamente determinado pela posição atual da chave.

---

## 5. Intervalo da estação

Toda simulação começa:

- sem intervalo concedido;
- com AMV-09 obrigatoriamente em L22 ↔ L22.

### Sem intervalo

- AMV-06 bloqueado para manipulação
- AMV-07 bloqueado para manipulação
- AMV-08 bloqueado para manipulação
- AMV-09 não pode ser mudado para L22 ↔ L20
- circulação L22 ↔ L22 pelo AMV-09 continua permitida
- movimentações internas nas linhas protegidas não são permitidas
- placas PARE não podem ser ultrapassadas

### Com intervalo concedido

- AMV-06 liberado
- AMV-07 liberado
- AMV-08 liberado
- AMV-09 pode ser operado para L22 ↔ L20
- movimentações nas linhas protegidas são permitidas
- placas PARE podem ser ultrapassadas

### Entrega do intervalo

Ao entregar o intervalo:

1. o AMV-09 deve estar livre;
2. o AMV-09 deve retornar para L22 ↔ L22;
3. AMV-06, AMV-07 e AMV-08 voltam a ficar bloqueados;
4. AMV-09 volta a ficar impedido de ser operado para L20;
5. materiais já estacionados em L16, L18 e L20 podem permanecer onde estão;
6. esses materiais não poderão ser movimentados novamente sem novo intervalo.

---

## 6. Continuação técnica das L16, L18 e L20

As linhas L16, L18 e L20 possuem continuidade reta além da área representada como área de manobra.

Esses trechos:

- existem para representar corretamente a geometria dos AMVs;
- são controlados externamente;
- não devem ser tratados como áreas livres de manobra do praticante;
- ajudam o motor a determinar a diferença entre uma passagem favorável e uma chave contra.

---

## 7. Capacidades marco a marco

As referências atualmente conhecidas no desenho são:

### Superior do pátio
- L30: 28 a 30 vagões
- L28: 4 vagões
- L26: 4 vagões
- L24: 18 vagões
- L22: 22 vagões
- L20: 30 vagões
- L18: 25 vagões
- L16: 20 vagões

### Travessão
- L24: 11 a 12 vagões
- L22: 11 a 12 vagões

### Inferior do pátio
- L24: 55 vagões
- L22: 55 vagões

Essas capacidades são **referências visuais**, não travas rígidas.

Excedentes devem gerar apenas alerta visual, sem bloquear a simulação.

---

## 8. Placas PARE

- sem intervalo: não podem ser ultrapassadas;
- com intervalo: podem ser ultrapassadas;
- o movimento deve ser bloqueado no limite da placa enquanto não houver intervalo.

---

## 9. Estado inicial do mapa

Ao abrir o programa:

- nenhuma locomotiva estará posicionada;
- nenhum vagão estará posicionado;
- não haverá composição;
- não haverá intervalo;
- AMV-09 estará em L22 ↔ L22;
- os demais AMVs podem iniciar em qualquer uma de suas duas posições válidas.

---

## 10. Próxima etapa técnica

Este mapa lógico passa a permitir o início da modelagem de software.

A próxima etapa deverá transformar a topologia em entidades computáveis:

- `TrackSegment`
- `Switch`
- `Marker`
- `StopBoard`
- `RollingStock`
- `Locomotive`
- `WagonBlock`
- `Coupling`
- `Composition`
- `IntervalState`
- `SimulationState`

Também deverá ser criado o grafo lógico de conexões para que o motor consiga determinar:

- por qual trilho a composição deve continuar;
- quando um AMV está contra;
- quando um AMV está ocupado;
- quando uma área protegida está bloqueada;
- quando a placa PARE impede circulação.
