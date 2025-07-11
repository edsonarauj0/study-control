import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Materia, fetchMateriaById } from '@/services/materiasService'
import { fetchTopicos, Topico } from '@/services/topicosService'

export default function MateriaDetails() {
  const { idMateria } = useParams()
  const [materia, setMateria] = useState<Materia | null>(null)
  const [topicos, setTopicos] = useState<Topico[]>([])

  useEffect(() => {
    const load = async () => {
      if (!idMateria) return
      const mat = await fetchMateriaById(idMateria)
      setMateria(mat)
      if (mat) {
        const tops = await fetchTopicos(mat.id)
        setTopicos(tops)
      }
    }
    load()
  }, [idMateria])

  if (!materia) {
    return <p>Carregando...</p>
  }

  const totalTopicos = topicos.length
  const topicosEstudados = Math.floor(totalTopicos / 2)
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{materia.nome}</h1>

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

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Tópicos</h2>
        <ul className="list-disc pl-4">
          <li>Total: {totalTopicos}</li>
          <li>Estudados: {topicosEstudados}</li>
          <li>Restantes: {topicosRestantes}</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Tempo de estudo</h2>
        <ul className="list-disc pl-4">
          <li>Previsto: {tempoPrevisto} minutos</li>
          <li>Já estudados: {tempoEstudado} minutos</li>
        </ul>
      </section>
    </div>
  )
}
