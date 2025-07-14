import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { Atividade } from '@/services/atividadesService'
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { FormAtividadeSchema } from '@/schema/FormAtividadeSchema';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'
import { PlusCircle, Trash2 } from 'lucide-react'

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

const defaultValues = {
  tipo: "aula" as const,
  nome: "",
  tempo: 1,
  status: "pendente" as const,
  dataInicial: new Date(),
  revisoes: [] as { dias: number }[],
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
                  onValueChange={(value) => field.onChange(value as 'aula' | 'revisao' | 'questoes')}
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
        {form.watch("tipo") === "aula" && (
          <>
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="nome">Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da matéria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tempo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="tempo">Tempo</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Tempo em horas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="status">Status</FormLabel>
                  <FormControl>
                    <select {...field} id="status" name="status" className="input">
                      <option value="pendente">Pendente</option>
                      <option value="concluido">Concluído</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {form.watch("tipo") === "revisao" && (
          <>
            <FormField
              control={form.control}
              name="dataInicial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="dataInicial">Data Inicial</FormLabel>
                  <FormControl>
                    <Input
                      id="dataInicial"
                      type="date"
                      value={new Date(field.value).toISOString().split('T')[0]}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end gap-2">
              <FormField
                control={form.control}
                name="novoDia"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Dias para revisão</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex.: 7"
                        value={field.value ? (typeof field.value === 'number' ? field.value : (field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value)) : ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const dias = Number(form.getValues("novoDia"))
                  if (!dias) return
                  append({ dias })
                  form.setValue("novoDia", new Date());
                }}
              >
                <PlusCircle className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {fields.map((field, index) => {
                const date = new Date(dataInicial)
                date.setDate(date.getDate() + (field.dias || 0))
                const formatted = date.toISOString().split('T')[0]
                return (
                  <div key={field.id} className="flex items-end gap-2">
                    <FormField
                      control={form.control}
                      name={`revisoes.${index}.dias` as const}
                      render={({ field: diasField }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Dias</FormLabel>
                          <FormControl>
                            <Input type="number" {...diasField} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Input type="date" value={formatted} readOnly className="w-40" />
                    <Button type="button" size="icon" variant="ghost" onClick={() => remove(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {form.watch("tipo") === "questoes" && (
          <>
            <FormField
              control={form.control}
              name="total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="total">Total de Questões</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Total" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="acertos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="acertos">Acertos</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Acertos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="erros"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="erros">Erros</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Erros" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

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