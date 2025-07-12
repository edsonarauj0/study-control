import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Organizacao } from '@/services/organizacoesService'
import React from 'react'

interface FormOrganizacoesProps {
  orgs: Organizacao[]
  novoOrg: string
  setNovoOrg: (v: string) => void
  addOrganizacao: (e: React.FormEvent) => void
  editOrganizacao: (org: Organizacao) => void
  deletarOrganizacao: (id: string) => void
  setSelectedOrg: (org: Organizacao) => void
  BreadcrumbNav: React.ReactNode
}

export function FormOrganizacoes({
  orgs,
  novoOrg,
  setNovoOrg,
  addOrganizacao,
  editOrganizacao,
  deletarOrganizacao,
  setSelectedOrg,
  BreadcrumbNav,
}: FormOrganizacoesProps) {
  return (
    <div className="space-y-8">
      {BreadcrumbNav}
      <section>
        <h2 className="text-lg font-semibold mb-2">Organizações</h2>
        <form onSubmit={addOrganizacao} className="flex gap-2 mb-2">
          <Input
            value={novoOrg}
            onChange={e => setNovoOrg(e.target.value)}
            placeholder="Nome da organização"
          />
          <Button type="submit">Adicionar</Button>
        </form>
        <ul className="space-y-1">
          {orgs.map(org => (
            <li key={org.id} className="flex justify-between gap-2">
              <span>{org.nome}</span>
              <div className="space-x-2">
                <Button size="sm" onClick={() => setSelectedOrg(org)}>
                  Gerenciar
                </Button>
                <Button size="sm" variant="outline" onClick={() => editOrganizacao(org)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deletarOrganizacao(org.id)}
                >
                  Excluir
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
} 