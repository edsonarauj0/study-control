import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { Atividade } from '@/services/atividadesService'
import React from 'react'

interface FormAtividadesProps {
  atividades: Atividade[]
  novaAtividade: string
  setNovaAtividade: (v: string) => void
  addAtividade: (e: React.FormEvent) => void
  editAtividade: (act: Atividade) => void
  deletarAtividade: (id: string, topicoId: string) => void
  selectedTopicoNome: string
  onVoltar: () => void
  BreadcrumbNav: React.ReactNode
}

export function FormAtividades({
  atividades,
  novaAtividade,
  setNovaAtividade,
  addAtividade,
  editAtividade,
  deletarAtividade,
  selectedTopicoNome,
  onVoltar,
  BreadcrumbNav,
}: FormAtividadesProps) {
  return (
    <div className="space-y-8">
      <Button size="sm" variant="outline" onClick={onVoltar}>
        Voltar
      </Button>
      {BreadcrumbNav}
      <section>
        <h2 className="text-lg font-semibold mb-2">
          Atividades de {selectedTopicoNome}
        </h2>
        <form onSubmit={addAtividade} className="flex gap-2 mb-2">
          <Input
            value={novaAtividade}
            onChange={e => setNovaAtividade(e.target.value)}
            placeholder="Nome da atividade"
          />
          <Button type="submit">Adicionar</Button>
        </form>
        <ul className="space-y-1">
          {atividades.map(act => (
            <li key={act.id} className="flex justify-between gap-2">
              <span>{act.nome}</span>
              <div className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => editAtividade(act)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deletarAtividade(act.id, act.topicoId)}
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