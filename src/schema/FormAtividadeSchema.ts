import * as z from "zod";

const AulaSchema = z.object({
  nome: z.string().nonempty("Nome é obrigatório"),
  tempo: z.number().min(1, "Tempo deve ser no mínimo 1 minuto"),
  status: z.enum(["pendente", "concluído"], "Status inválido"),
});

const RevisaoSchema = z.object({
  dataAtual: z.date(),
  data24h: z.date(),
  data7dias: z.date(),
  data30dias: z.date(),
  data3meses: z.date(),
  data6meses: z.date(),
});

const QuestoesSchema = z.object({
  total: z.number().min(0, "Total deve ser no mínimo 0"),
  acertos: z.number().min(0, "Acertos deve ser no mínimo 0"),
  erros: z.number().min(0, "Erros deve ser no mínimo 0"),
});

const FormAtividadeSchema = z.discriminatedUnion("tipo", [
  z.object({ tipo: z.literal("aula") }).merge(AulaSchema),
  z.object({ tipo: z.literal("revisao") }).merge(RevisaoSchema),
  z.object({ tipo: z.literal("questoes") }).merge(QuestoesSchema),
]);

export { FormAtividadeSchema };
