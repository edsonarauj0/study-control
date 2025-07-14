import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface FormTopicosProps {
  novoTopico: string
  setNovoTopico: (v: string) => void
  descricao: string
  setDescricao: (v: string) => void
  status: 'Andamento' | 'Concluído' | 'Não iniciado'
  setStatus: React.Dispatch<React.SetStateAction<'Andamento' | 'Concluído' | 'Não iniciado'>>
  addTopico: () => void // A função não precisa mais receber o evento
  isModal?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export function FormTopicos({
  novoTopico,
  setNovoTopico,
  descricao,
  setDescricao,
  status,
  setStatus,
  addTopico, // A função vem da prop
  isModal = false,
  isOpen = false,
  onClose,
}: FormTopicosProps) {

  // ✅ Crie uma função para lidar com a submissão
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // ⬅️ **A ETAPA MAIS IMPORTANTE!**
    addTopico();        // Chama a função do componente pai
  };

  const formContent = (
    <div className="space-y-8">
      <section>
        {/* ✅ Use a nova função handleSubmit no onSubmit */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Select value={status} onValueChange={(value) => setStatus(value as 'Andamento' | 'Concluído' | 'Não iniciado')}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Concluído">Concluído</SelectItem>
              <SelectItem value="Andamento">Em andamento</SelectItem>
              <SelectItem value="Não iniciado">Não iniciado</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full">
            Adicionar
          </Button>
        </form>
      </section>
    </div>
  )

  if (isModal) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar tópico</DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    )
  }

  return formContent
}