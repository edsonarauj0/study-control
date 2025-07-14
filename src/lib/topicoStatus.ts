export interface RevisionItem {
  dias: number
  concluido?: boolean
}

export interface AtividadeExtended {
  id: string
  tipo: 'aula' | 'questoes' | 'revisao'
  nome?: string
  status?: 'pendente' | 'concluido'
  tempo?: number
  total?: number
  acertos?: number
  erros?: number
  dataInicial?: string
  revisoes?: RevisionItem[]
}

export interface TopicoMetrics {
  statusGeral: 'Não Iniciado' | 'Em Progresso' | 'Concluído'
  desempenhoMedio: number
  proximaRevisao: string | null
  progressoTeorico: { concluidas: number; total: number }
}

export function calculateTopicoStatus(
  atividades: AtividadeExtended[],
): TopicoMetrics {
  if (!atividades.length) {
    return {
      statusGeral: 'Não Iniciado',
      desempenhoMedio: 0,
      proximaRevisao: null,
      progressoTeorico: { concluidas: 0, total: 0 },
    }
  }
  const aulas = atividades.filter(a => a.tipo === 'aula')
  const questoes = atividades.filter(a => a.tipo === 'questoes')
  const revisoes = atividades.filter(a => a.tipo === 'revisao')

  const concluidas = aulas.filter(a => a.status === 'concluido').length
  const progressoTeorico = {
    concluidas,
    total: aulas.length,
  }

  let desempenhoMedio = 0
  if (questoes.length) {
    const soma = questoes.reduce((acc, q) => {
      const total = q.total ?? 0
      const acertos = q.acertos ?? 0
      return acc + (total ? acertos / total : 0)
    }, 0)
    desempenhoMedio = Number(((soma / questoes.length) * 100).toFixed(2))
  }

  let proximaRevisao: string | null = null
  if (revisoes.length) {
    const datas = revisoes.flatMap(rev => {
      const base = rev.dataInicial ? new Date(rev.dataInicial) : new Date()
      return (rev.revisoes ?? []).map(r => {
        const d = new Date(base)
        d.setDate(d.getDate() + r.dias)
        return r.concluido ? null : d
      })
    }).filter(Boolean) as Date[]
    if (datas.length) {
      const min = datas.reduce((a, b) => (a < b ? a : b))
      proximaRevisao = min.toISOString()
    }
  }

  const concluidasTodas =
    aulas.length > 0 && concluidas === aulas.length &&
    desempenhoMedio >= 80 &&
    revisoes.some(rev => (rev.revisoes ?? []).every(r => r.concluido))

  return {
    statusGeral: concluidasTodas ? 'Concluído' : 'Em Progresso',
    desempenhoMedio,
    proximaRevisao,
    progressoTeorico,
  }
}
