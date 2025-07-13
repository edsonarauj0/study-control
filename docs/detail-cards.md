# Componentes de Card para Telas de Detalhes

Este projeto inclui um componente `Card` reutilizável localizado em `src/components/ui/Card.tsx`.
Ele usa Tailwind CSS e `class-variance-authority` para oferecer diferentes tamanhos de cartão em
layout de grade.

## Como Usar

1. Importe o componente:
   ```tsx
   import { Card } from '@/components/ui/Card'
   ```
2. Crie um contêiner `grid` com `grid-cols-6` e defina as linhas conforme necessário. Em seguida
   utilize o `size` do `Card` para controlar quantas colunas e linhas ele ocupa.
   ```tsx
   <div className="grid grid-cols-6 auto-rows-[8rem] gap-4">
     <Card size="6x6">Conteúdo principal</Card>
     <Card size="2x6">Barra lateral</Card>
     <Card size="4x6">Informações</Card>
     <Card size="1x1">Item pequeno</Card>
   </div>
   ```

## Tamanhos Disponíveis

- `6x6` – ocupa toda a largura e altura da grade
- `4x6` – ocupa quatro colunas e seis linhas
- `2x6` – ocupa duas colunas e seis linhas
- `1x1` – quadrado pequeno
- `3x3`, `2x3`, `3x2`, `6x3` – tamanhos adicionais úteis em diferentes layouts

Esses cartões podem ser usados nas páginas de detalhes de Matérias, Tópicos e Atividades para
organizar indicadores, gráficos ou formulários de forma consistente.

## Exemplo de Uso em `MateriaDetails`

A página `MateriaDetails` monta uma grade `grid-cols-6` com linhas de `8rem` e organiza diferentes informações em cartões:

- Um cartão `6x3` exibe o nome da matéria e indicadores de tópicos.
- Um cartão `3x3` mostra o desempenho em questões.
- Outro cartão `3x3` apresenta o tempo de estudo acumulado.
- Um cartão `6x3` lista os tópicos com checkboxes para controlar o estudo.
