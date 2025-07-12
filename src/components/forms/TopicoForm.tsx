import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { Topico } from '@/services/topicosService'
import React from 'react'

interface FormTopicosProps {
  topicos: Topico[]
  novoTopico: string
  setNovoTopico: (v: string) => void
  addTopico: (e: React.FormEvent) => void
  editTopico: (top: Topico) => void
  deletarTopico: (id: string, materiaId: string) => void
  setSelectedTopico: (top: Topico) => void
  selectedMateriaNome: string
  onVoltar: () => void
  BreadcrumbNav: React.ReactNode
}

export function FormTopicos({
  topicos,
  novoTopico,
  setNovoTopico,
  addTopico,
  editTopico,
  deletarTopico,
  setSelectedTopico,
  selectedMateriaNome,
  onVoltar,
  BreadcrumbNav,
}: FormTopicosProps) {
  return (
    <div className="space-y-8">
      <Button size="sm" variant="outline" onClick={onVoltar}>
        Voltar
      </Button>
      {BreadcrumbNav}
      <section>
        <h2 className="text-lg font-semibold mb-2">
          Tópicos de {selectedMateriaNome}
        </h2>
        <form onSubmit={addTopico} className="flex gap-2 mb-2">
          <Input
            value={novoTopico}
            onChange={e => setNovoTopico(e.target.value)}
            placeholder="Nome do tópico"
          />
          <Button type="submit">Adicionar</Button>
        </form>
        <ul className="space-y-1">
          {topicos.map(top => (
            <li key={top.id} className="flex justify-between gap-2">
              <span>{top.nome}</span>
              <div className="space-x-2">
                <Button size="sm" onClick={() => setSelectedTopico(top)}>
                  Gerenciar
                </Button>
                <Button size="sm" variant="outline" onClick={() => editTopico(top)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deletarTopico(top.id, top.materiaId)}
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