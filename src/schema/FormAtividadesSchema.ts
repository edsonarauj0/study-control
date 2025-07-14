import z from 'zod';

export const FormAtividadeSchema = z.object({
  tipo: z.enum(["aula", "revisao", "questoes"]),
  nome: z.string().optional(),
  tempo: z.number().optional(),
  status: z.enum(["pendente", "concluido"]).optional(),
  data24h: z.string().optional(),
  data7dias: z.string().optional(),
  data30dias: z.string().optional(),
  data3meses: z.string().optional(),
  data6meses: z.string().optional(),
  total: z.number().optional(),
  acertos: z.number().optional(),
  erros: z.number().optional(),
});