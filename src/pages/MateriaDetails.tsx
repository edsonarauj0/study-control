import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Materia, fetchMateriaById } from '@/services/materiasService'
import { fetchTopicos, Topico } from '@/services/topicosService'

export default function MateriaDetails() {
  const { idMateria } = useParams()
  const [materia, setMateria] = useState<Materia | null>(null)
  const [topicos, setTopicos] = useState<Topico[]>([])
  const [estudo, setEstudo] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const load = async () => {
      if (!idMateria) return
      const mat = await fetchMateriaById(idMateria)
      setMateria(mat)
      if (mat) {
        const tops = await fetchTopicos(mat.id)
        setTopicos(tops)
        setEstudo(prev => {
          const e = { ...prev }
          tops.forEach(t => {
            if (!(t.id in e)) e[t.id] = false
          })
          return e
        })
      }
    }
    load()
  }, [idMateria])

  if (!materia) {
    return <p>Carregando...</p>
  }

  const totalTopicos = topicos.length
  const topicosEstudados = Object.values(estudo).filter(Boolean).length
  const topicosRestantes = totalTopicos - topicosEstudados

  const tempoPrevisto = totalTopicos * 60 // minutos
  const tempoEstudado = topicosEstudados * 45

  const questoesFeitas = 50
  const questoesAcertadas = 35
  const questoesErradas = questoesFeitas - questoesAcertadas

  const percentualDesempenho = Math.round(
    (questoesAcertadas / (questoesFeitas || 1)) * 100
  )

  return (
    <div className="space-y-6 bg-white p-4 rounded-md">
      <h1 className="text-2xl font-bold">{materia.nome}</h1>

      {/* indicadores */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-3 rounded-md bg-gray-100 text-center">
          <p className="text-xs text-muted-foreground">Tópicos</p>
          <p className="text-xl font-bold">{totalTopicos}</p>
        </div>
        <div className="p-3 rounded-md bg-gray-100 text-center">
          <p className="text-xs text-muted-foreground">Estudados</p>
          <p className="text-xl font-bold">{topicosEstudados}</p>
        </div>
        <div className="p-3 rounded-md bg-gray-100 text-center">
          <p className="text-xs text-muted-foreground">Restantes</p>
          <p className="text-xl font-bold">{topicosRestantes}</p>
        </div>
      </section>

      {/* desempenho */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Desempenho</h2>
        <div className="w-full h-4 bg-gray-200 rounded">
          <div
            className="h-full bg-green-500 rounded"
            style={{ width: `${percentualDesempenho}%` }}
          />
        </div>
        <p>{percentualDesempenho}% de acertos</p>
        <ul className="list-disc pl-4">
          <li>Questões respondidas: {questoesFeitas}</li>
          <li>Acertos: {questoesAcertadas}</li>
          <li>Erros: {questoesErradas}</li>
        </ul>
      </section>

      {/* controle de estudo */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Controle de estudo</h2>
        <ul className="space-y-1">
          {topicos.map(t => (
            <li key={t.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="size-4"
                checked={estudo[t.id] || false}
                onChange={() =>
                  setEstudo(e => ({ ...e, [t.id]: !e[t.id] }))
                }
              />
              <span>{t.nome}</span>
            </li>
          ))}
        </ul>
        <ul className="list-disc pl-4">
          {topicos.map(topico => (
            <li key={topico.id}>
              <Link
                to={`/organizacao/${materia.organizacaoId}/materia/${materia.id}/topico/${topico.id}`}
                className="text-blue-500 hover:underline"
              >
                {topico.nome}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* tempo de estudo */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Tempo de estudo</h2>
        <div className="w-full h-4 bg-gray-200 rounded">
          <div
            className="h-full bg-blue-500 rounded"
            style={{ width: `${Math.round((tempoEstudado / (tempoPrevisto || 1)) * 100)}%` }}
          />
        </div>
        <ul className="list-disc pl-4">
          <li>Previsto: {tempoPrevisto} minutos</li>
          <li>Já estudados: {tempoEstudado} minutos</li>
        </ul>
      </section>
    </div>
  )
}
