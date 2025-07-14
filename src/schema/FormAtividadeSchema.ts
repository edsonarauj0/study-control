import * as z from "zod";

const AulaSchema = z.object({
  nome: z.string().nonempty("Nome é obrigatório"),
  tempo: z.coerce.number().min(1, "Tempo deve ser no mínimo 1 minuto"),

  tempo: z.number().min(1, "Tempo deve ser no mínimo 1 minuto"),

  status: z.enum(["pendente", "concluido"], "Status inválido"),
});

const RevisaoItemSchema = z.object({
  dias: z.coerce.number().min(1, "Dias deve ser no mínimo 1"),
});

const RevisaoSchema = z.object({
  dataInicial: z.date(),
  novoDia: z.date(),
  unidade: z.enum(["dias", "semanas", "meses"]),
  revisoes: z.array(RevisaoItemSchema).min(1, "Adicione ao menos uma revisão"),
});

const QuestoesSchema = z.object({
  total: z.coerce.number().min(0, "Total deve ser no mínimo 0"),
  acertos: z.coerce.number().min(0, "Acertos deve ser no mínimo 0"),
  erros: z.coerce.number().min(0, "Erros deve ser no mínimo 0"),
});

const FormAtividadeSchema = z.discriminatedUnion("tipo", [
  z.object({ tipo: z.literal("aula") }).merge(AulaSchema),
  z.object({ tipo: z.literal("aula"), nome: z.string(), tempo: z.number(), status: z.enum(["pendente", "concluido"]) }),
  z.object({ tipo: z.literal("revisao") }).merge(RevisaoSchema),
  z.object({ tipo: z.literal("questoes") }).merge(QuestoesSchema),
]);

export { FormAtividadeSchema };
