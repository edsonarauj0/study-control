import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { fetchOrganizacoes, fetchOrganizacaoTree, Organizacao } from '@/services/organizacoesService'

interface OrganizacaoContextValue {
  organizacoes: Organizacao[]
  activeOrganizacao: Organizacao | null
  setActiveOrganizacao: (org: Organizacao) => void
  reloadOrganizacoes: () => Promise<void>
  organizacaoTree: any | null
}

const OrganizacaoContext = createContext<OrganizacaoContextValue | undefined>(
  undefined
)

export function OrganizacaoProvider({ children }: { children: ReactNode }) {
  const [organizacoes, setOrganizacoes] = useState<Organizacao[]>([])
  const [activeOrganizacao, setActiveOrganizacao] = useState<Organizacao | null>(
    null
  )
  const [organizacaoTree, setOrganizacaoTree] = useState<any | null>(null)
  const reloadOrganizacoes = async () => {
    const orgs = await fetchOrganizacoes()
    setOrganizacoes(orgs)
    if (!activeOrganizacao && orgs.length > 0) {
      setActiveOrganizacao(orgs[0])
    }
  }

  useEffect(() => {
    reloadOrganizacoes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const loadOrganizacaoTree = async () => {
      if (activeOrganizacao) {
        const tree = await fetchOrganizacaoTree(activeOrganizacao.id)
        setOrganizacaoTree(tree)
      }
    }
    loadOrganizacaoTree()
  }, [activeOrganizacao])

  return (
    <OrganizacaoContext.Provider
      value={{ organizacoes, activeOrganizacao, setActiveOrganizacao, reloadOrganizacoes, organizacaoTree }}
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

