import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function AtividadeFormAula() {
  const form = useFormContext();

  return (
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
  );
}
