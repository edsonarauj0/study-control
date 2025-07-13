import { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Materia, fetchMateriaById } from '@/services/materiasService'
import { fetchTopicos, Topico } from '@/services/topicosService'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import AuthContext from '@/contexts/AuthContext'
import { useOrganizacao } from '@/contexts/OrganizacaoContext'

export default function MateriaDetails() {
  const { idMateria } = useParams()
  const { userId } = useContext(AuthContext)
  const { activeOrganizacao } = useOrganizacao()
  const [materia, setMateria] = useState<Materia | null>(null)
  const [topicos, setTopicos] = useState<Topico[]>([])
  const [estudo, setEstudo] = useState<Record<string, boolean>>({})
  
  useEffect(() => {
    const load = async () => {
      if (!idMateria || !userId || !activeOrganizacao) return
      const mat = await fetchMateriaById(activeOrganizacao.id, idMateria)
      setMateria(mat)
      if (mat) {
        const tops = await fetchTopicos(mat.organizacaoId || activeOrganizacao.id, mat.id)
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
  }, [idMateria, userId, activeOrganizacao])

  if (!materia) {
    return <p>Carregando...</p>
  }

  const BreadcrumbNav = () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/organizacao/${materia.organizacaoId}`}>
            Organização
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{materia.nome}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )

  const totalTopicos = topicos.length
  const topicosEstudados = Object.values(estudo).filter(Boolean).length
  const topicosRestantes = totalTopicos - topicosEstudados

  const tempoPrevisto = totalTopicos * 60
  const tempoEstudado = topicosEstudados * 45

  const questoesFeitas = 50
  const questoesAcertadas = 35
  const questoesErradas = questoesFeitas - questoesAcertadas

  const percentualDesempenho = Math.round(
    (questoesAcertadas / (questoesFeitas || 1)) * 100
  )

  return (
    <div className="space-y-4">
      {/* Quadro superior */}
      <div className="w-full bg-white p-4 rounded-md flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">{materia.nome}</h1>
        <div className="flex flex-wrap gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Adicionar Tópico
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md">
            Adicionar Atividade
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-md">
            Editar
          </button>
        </div>
      </div>

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

        {/* Quadro mais fino à direita */}
        <div className="w-full md:w-1/3 bg-white p-4 rounded-md">
          <h2 className="text-lg font-semibold">Gráficos e Valores</h2>
          <div className="h-32 bg-gray-200 rounded-md flex items-center justify-center">
            <p>Gráfico 1</p>
          </div>
          <div className="h-32 bg-gray-200 rounded-md flex items-center justify-center mt-4">
            <p>Gráfico 2</p>
          </div>
        </div>
      </div>
    </div>
  )
}
