import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Atividade } from '@/services/atividadesService'
import { addDays } from 'date-fns'
import React from 'react'

interface FormAtividadesProps {
  atividades: Atividade[]
  novaAtividade: string
  setNovaAtividade: (v: string) => void
  addAtividade: (e: React.FormEvent) => void
  addRevisao: (nome: string, data: Date) => void
  editAtividade: (act: Atividade) => void
  deletarAtividade: (id: string, topicoId: string) => void
  selectedTopicoNome: string
  onVoltar: () => void
  BreadcrumbNav: React.ReactNode
  isModal?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export function FormAtividades({
  atividades,
  novaAtividade,
  setNovaAtividade,
  addAtividade,
  addRevisao,
  editAtividade,
  deletarAtividade,
  selectedTopicoNome,
  onVoltar,
  BreadcrumbNav,
  isModal = false,
  isOpen = false,
  onClose,
}: FormAtividadesProps) {
  const [openRevisao, setOpenRevisao] = React.useState(false)
  const [revisaoNome, setRevisaoNome] = React.useState('')
  const [dias, setDias] = React.useState(1)
  const [selectedDate, setSelectedDate] = React.useState<Date>(addDays(new Date(), 1))

  React.useEffect(() => {
    setSelectedDate(addDays(new Date(), dias))
  }, [dias])

  const handleAddRevisao = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate) return
    addRevisao(revisaoNome || 'Revisão', selectedDate)
    setRevisaoNome('')
    setDias(1)
    setOpenRevisao(false)
  }
  const formContent = (
    <div className="space-y-8">
      {!isModal && (
        <Button size="sm" variant="outline" onClick={onVoltar}>
          Voltar
        </Button>
      )}
      {!isModal && BreadcrumbNav}
      <section>
        <h2 className="text-lg font-semibold mb-2">
          Atividades de {selectedTopicoNome}
        </h2>
        <form onSubmit={addAtividade} className="flex gap-2 mb-2 flex-wrap">
          <Input
            value={novaAtividade}
            onChange={e => setNovaAtividade(e.target.value)}
            placeholder="Nome da atividade"
          />
          <Button type="submit">Adicionar</Button>
          <Button type="button" variant="outline" onClick={() => setOpenRevisao(true)}>
            Nova revisão
          </Button>
        </form>
        <Dialog open={openRevisao} onOpenChange={setOpenRevisao}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar revisão</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddRevisao} className="space-y-4">
              <Input
                value={revisaoNome}
                onChange={e => setRevisaoNome(e.target.value)}
                placeholder="Nome da revisão"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  className="w-20"
                  value={dias}
                  onChange={e => setDias(Number(e.target.value))}
                />
                <span className="text-sm text-muted-foreground">dias a partir de hoje</span>
              </div>
              <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
              <Button type="submit" className="w-full">Adicionar revisão</Button>
            </form>
          </DialogContent>
        </Dialog>
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

  if (isModal) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atividades</DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    )
  }

  return formContent
}
