import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { Atividade } from '@/services/atividadesService'
import React, { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { FormAtividadeSchema } from '@/schema/FormAtividadeSchema';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'
import { PlusCircle, Trash2 } from 'lucide-react'
import { AtividadeFormAula } from './AtividadeFormAula';
import { AtividadeFormRevisao } from './AtividadeFormRevisao';
import { AtividadeFormQuestoes } from './AtividadeFormQuestoes';

interface FormAtividadesProps {
  atividades: Atividade[]
  novaAtividade: string
  setNovaAtividade: (v: string) => void
  addAtividade: (data: z.infer<typeof FormAtividadeSchema>) => void
  editAtividade: (act: Atividade) => void
  deletarAtividade: (id: string, topicoId: string) => void
  selectedTopicoNome: string
  onVoltar: () => void
  BreadcrumbNav: React.ReactNode
  isOpen?: boolean
  onClose?: () => void
}

const defaultValues: z.infer<typeof FormAtividadeSchema> = {
  tipo: "aula",
  nome: "",
  tempo: 1,
  status: "pendente",
};

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
  isOpen = false,
  onClose,
}: FormAtividadesProps) {
  const form = useForm<z.infer<typeof FormAtividadeSchema>>({
    resolver: zodResolver(FormAtividadeSchema),
    defaultValues
  })
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'revisoes'
  })
  const dataInicial = form.watch('dataInicial')
  const tipoLabels: Record<string, string> = {
    aula: "Aula",
    revisao: "Revisão",
    questoes: "Questões"
  };
  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(addAtividade)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="tipo">Tipo de Atividade</FormLabel>
              <FormControl>
                <Select
                  value={field.value || "aula"}
                  onValueChange={(value) => {
                    field.onChange(value as 'aula' | 'revisao' | 'questoes');

                    if (value === 'revisao') {
                      form.reset({
                        tipo: 'revisao',
                        dataInicial: new Date(),
                        novoDia: new Date(),
                        unidade: 'dias',
                        revisoes: [],
                      });
                    } else if (value === 'aula') {
                      form.reset({
                        tipo: 'aula',
                        nome: '',
                        tempo: 0,
                        status: 'pendente',
                      });
                    } else if (value === 'questoes') {
                      form.reset({
                        tipo: 'questoes',
                        total: 0,
                        acertos: 0,
                        erros: 0,
                      });
                    }
                  }}

                >
                  <SelectTrigger className="input" id="tipo" name="tipo">
                    {tipoLabels[field.value || "aula"]}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aula">Aula</SelectItem>
                    <SelectItem value="revisao">Revisão</SelectItem>
                    <SelectItem value="questoes">Questões</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campos específicos para cada tipo de atividade */}
        {form.watch("tipo") === "aula" && <AtividadeFormAula />}
        {form.watch("tipo") === "revisao" && <AtividadeFormRevisao />}
        {form.watch("tipo") === "questoes" && <AtividadeFormQuestoes />}

        <Button type="submit">Salvar</Button>
      </form>
    </Form>

  )
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle>Adicionar tópico</DialogTitle>
        </DialogHeader>
        <p id="dialog-description" className="sr-only">
          Preencha o formulário para adicionar um novo tópico.
        </p>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}