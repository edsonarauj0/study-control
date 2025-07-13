import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/textarea'
import { Topico } from '@/services/topicosService'
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface FormTopicosProps {
  topicos: Topico[]
  novoTopico: string
  setNovoTopico: (v: string) => void
  descricao: string
  setDescricao: (v: string) => void
  status: string
  setStatus: (v: string) => void
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
  descricao,
  setDescricao,
  status,
  setStatus,
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
        <form onSubmit={addTopico} className="space-y-4">
          <Input
            value={novoTopico}
            onChange={e => setNovoTopico(e.target.value)}
            placeholder="Nome do tópico"
            className="w-full"
          />
          <Textarea
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            placeholder="Descrição do tópico"
            className="w-full"
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="success">Concluído</SelectItem>
              <SelectItem value="processing">Em andamento</SelectItem>
              <SelectItem value="failed">Não concluído</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full">
            Adicionar
          </Button>
        </form>
        <ul className="space-y-1 mt-4">
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
                  onClick={() => deletarTopico(top.id, top.id)}
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