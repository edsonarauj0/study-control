import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { Atividade } from '@/services/atividadesService'
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { FormAtividadeSchema } from '@/schema/FormAtividadeSchema';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'

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
  tipo: "aula" as const, // Ensure the type matches the discriminated union
  nome: "",
  tempo: 1,
  status: "pendente" as const,
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
              name="dataAtual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="dataAtual">Data Atual</FormLabel>
                  <FormControl>
                    <Input
                      id="dataAtual"
                      name="dataAtual"
                      type="date"
                      value={typeof field.value === 'string' ? field.value : new Date().toISOString().split('T')[0]}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data24h"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="data24h">Revisão em 24h</FormLabel>
                  <FormControl>
                    <Input
                      id="data24h"
                      name="data24h"
                      type="date"
                      value={typeof field.value === 'string' ? field.value : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data7dias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="data7dias">Revisão em 7 dias</FormLabel>
                  <FormControl>
                    <Input
                      id="data7dias"
                      name="data7dias"
                      type="date"
                      value={typeof field.value === 'string' ? field.value : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data30dias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="data30dias">Revisão em 30 dias</FormLabel>
                  <FormControl>
                    <Input
                      id="data30dias"
                      name="data30dias"
                      type="date"
                      value={typeof field.value === 'string' ? field.value : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data3meses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="data3meses">Revisão em 3 meses</FormLabel>
                  <FormControl>
                    <Input
                      id="data3meses"
                      name="data3meses"
                      type="date"
                      value={typeof field.value === 'string' ? field.value : new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data6meses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="data6meses">Revisão em 6 meses</FormLabel>
                  <FormControl>
                    <Input
                      id="data6meses"
                      name="data6meses"
                      type="date"
                      value={typeof field.value === 'string' ? field.value : new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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