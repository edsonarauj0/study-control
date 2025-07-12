import * as z from "zod";

export const formMateriasSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  professor: z.string().min(1, "Professor é obrigatório"),
  emoji: z.string().min(1, "Emoji é obrigatório"),
});
