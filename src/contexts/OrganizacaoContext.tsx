import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { fetchOrganizacoes, Organizacao } from '@/services/organizacoesService'

interface OrganizacaoContextValue {
  organizacoes: Organizacao[]
  activeOrganizacao: Organizacao | null
  setActiveOrganizacao: (org: Organizacao) => void
}

const OrganizacaoContext = createContext<OrganizacaoContextValue | undefined>(
  undefined
)

export function OrganizacaoProvider({ children }: { children: ReactNode }) {
  const [organizacoes, setOrganizacoes] = useState<Organizacao[]>([])
  const [activeOrganizacao, setActiveOrganizacao] = useState<Organizacao | null>(
    null
  )

  useEffect(() => {
    const carregar = async () => {
      const orgs = await fetchOrganizacoes()
      setOrganizacoes(orgs)
      if (!activeOrganizacao && orgs.length > 0) {
        setActiveOrganizacao(orgs[0])
      }
    }
    carregar()
  }, [activeOrganizacao])

  return (
    <OrganizacaoContext.Provider
      value={{ organizacoes, activeOrganizacao, setActiveOrganizacao }}
    >
      {children}
    </OrganizacaoContext.Provider>
  )
}

export function useOrganizacao() {
  const ctx = useContext(OrganizacaoContext)
  if (!ctx) {
    throw new Error('useOrganizacao must be used within OrganizacaoProvider')
  }
  return ctx
}
