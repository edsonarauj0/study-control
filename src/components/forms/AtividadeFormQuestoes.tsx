import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function AtividadeFormQuestoes() {
  const form = useFormContext();

  return (
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
  );
}
