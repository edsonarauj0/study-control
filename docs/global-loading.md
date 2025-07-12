# Sistema de Loading Global

## Visão Geral

O sistema de loading global permite controlar um spinner de carregamento único em toda a aplicação. Isso substitui a necessidade de gerenciar estados de loading localmente em cada componente.

## Como Funciona

### 1. LoadingContext
- Gerencia um contador de operações de loading ativas
- Quando o contador > 0, o loading é exibido
- Quando o contador = 0, o loading é ocultado

### 2. GlobalLoading Component
- Componente que renderiza o spinner quando necessário
- Posicionado no nível do App para cobrir toda a tela

### 3. useGlobalLoading Hook
Fornece três métodos principais:

```typescript
const { showLoading, hideLoading, withLoading } = useGlobalLoading()
```

## Como Usar

### Método 1: Controle Manual
```typescript
import { useGlobalLoading } from '@/hooks/useGlobalLoading'

function MyComponent() {
  const { showLoading, hideLoading } = useGlobalLoading()

  const handleAction = async () => {
    showLoading()
    try {
      await someAsyncOperation()
    } finally {
      hideLoading()
    }
  }
}
```

### Método 2: Automático com withLoading
```typescript
import { useGlobalLoading } from '@/hooks/useGlobalLoading'

function MyComponent() {
  const { withLoading } = useGlobalLoading()

  const handleAction = async () => {
    await withLoading(async () => {
      await someAsyncOperation()
    })
  }
}
```

### Método 3: Em Formulários
```typescript
const handleSubmit = async (data: FormData) => {
  await withLoading(async () => {
    await submitForm(data)
  })
}
```

## Vantagens

1. **Centralizado**: Um único ponto de controle para todos os loadings
2. **Consistente**: Visual uniforme em toda a aplicação
3. **Automático**: O hook `withLoading` gerencia automaticamente show/hide
4. **Contador**: Múltiplas operações podem estar ativas simultaneamente
5. **Fácil de usar**: API simples e intuitiva

## Estrutura de Arquivos

```
src/
  contexts/
    LoadingContext.tsx      # Contexto principal
  components/
    GlobalLoading.tsx       # Componente visual
  hooks/
    useGlobalLoading.ts     # Hook utilitário
```

## Integração com AuthContext

O AuthContext já foi integrado para usar o loading global durante a autenticação inicial, garantindo que o usuário veja o spinner enquanto o Firebase verifica o estado de autenticação.
