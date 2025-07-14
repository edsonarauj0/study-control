import { AtividadeExtended, calculateTopicoStatus } from '@/lib/topicoStatus'

interface Props {
  atividades: AtividadeExtended[]
  topicoNome: string
}

export function TopicoStatusPanel({ atividades, topicoNome }: Props) {
  const metrics = calculateTopicoStatus(atividades)
  return (
    <div className="border rounded p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">{topicoNome}</h2>
      <p>Status Geral: {metrics.statusGeral}</p>
      <p>Desempenho Médio: {metrics.desempenhoMedio}%</p>
      <p>Próxima Revisão: {metrics.proximaRevisao ? new Date(metrics.proximaRevisao).toLocaleDateString() : 'N/A'}</p>
      <p>
        Progresso Teórico: {metrics.progressoTeorico.concluidas} de {metrics.progressoTeorico.total}
      </p>
    </div>
  )
}
