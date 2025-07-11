import { useEffect, useState } from 'react'
import {
  fetchOrganizacoes,
  adicionarOrganizacao,
  deletarOrganizacao,
  atualizarOrganizacao,
  Organizacao,
} from '@/services/organizacoesService'
import {
  fetchMaterias,
  adicionarMateria,
  deletarMateria,
  atualizarMateria,
  Materia,
} from '@/services/materiasService'
import {
  fetchTopicos,
  adicionarTopico,
  deletarTopico,
  atualizarTopico,
  Topico,
} from '@/services/topicosService'
import {
  fetchAtividades,
  adicionarAtividade,
  deletarAtividade,
  atualizarAtividade,
  Atividade,
} from '@/services/atividadesService'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'

export default function Settings() {
  const [orgs, setOrgs] = useState<Organizacao[]>([])
  const [selectedOrg, setSelectedOrg] = useState<Organizacao | null>(null)
  const [novoOrg, setNovoOrg] = useState('')

  const [materias, setMaterias] = useState<Materia[]>([])
  const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null)
  const [novaMateria, setNovaMateria] = useState({ nome: '', professor: '' })

  const [topicos, setTopicos] = useState<Topico[]>([])
  const [selectedTopico, setSelectedTopico] = useState<Topico | null>(null)
  const [novoTopico, setNovoTopico] = useState('')

  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [novaAtividade, setNovaAtividade] = useState('')

  const carregarOrganizacoes = async () => {
    const o = await fetchOrganizacoes()
    setOrgs(o)
  }
  useEffect(() => {
    carregarOrganizacoes()
  }, [])

  const carregarMaterias = async () => {
    if (!selectedOrg) return
    const m = await fetchMaterias(selectedOrg.id)
    setMaterias(m)
  }
  useEffect(() => {
    if (selectedOrg) carregarMaterias()
  }, [selectedOrg])

  const carregarTopicos = async () => {
    if (!selectedMateria) return
    const t = await fetchTopicos(selectedMateria.id)
    setTopicos(t)
  }
  useEffect(() => {
    if (selectedMateria) carregarTopicos()
  }, [selectedMateria])

  const carregarAtividades = async () => {
    if (!selectedTopico) return
    const a = await fetchAtividades(selectedTopico.id)
    setAtividades(a)
  }
  useEffect(() => {
    if (selectedTopico) carregarAtividades()
  }, [selectedTopico])

  const addOrganizacao = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoOrg) return
    await adicionarOrganizacao({ nome: novoOrg })
    setNovoOrg('')
    carregarOrganizacoes()
  }

  const editOrganizacao = async (org: Organizacao) => {
    const nome = prompt('Nome da organização', org.nome)
    if (!nome) return
    await atualizarOrganizacao(org.id, { nome })
    carregarOrganizacoes()
  }

  const addMateria = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrg) return
    const { nome, professor } = novaMateria
    if (!nome || !professor) return
    await adicionarMateria({ ...novaMateria, organizacaoId: selectedOrg.id })
    setNovaMateria({ nome: '', professor: '' })
    carregarMaterias()
  }

  const editMateria = async (mat: Materia) => {
    const nome = prompt('Nome da matéria', mat.nome) || mat.nome
    const professor = prompt('Professor', mat.professor) || mat.professor
    await atualizarMateria(mat.id, mat.organizacaoId, { nome, professor })
    carregarMaterias()
  }

  const addTopico = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMateria) return
    if (!novoTopico) return
    await adicionarTopico({ nome: novoTopico, materiaId: selectedMateria.id })
    setNovoTopico('')
    carregarTopicos()
  }

  const editTopico = async (top: Topico) => {
    const nome = prompt('Nome do tópico', top.nome)
    if (!nome) return
    await atualizarTopico(top.id, top.materiaId, { nome })
    carregarTopicos()
  }

  const addAtividade = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTopico) return
    if (!novaAtividade) return
    await adicionarAtividade({ nome: novaAtividade, topicoId: selectedTopico.id })
    setNovaAtividade('')
    carregarAtividades()
  }

  const editAtividade = async (act: Atividade) => {
    const nome = prompt('Nome da atividade', act.nome)
    if (!nome) return
    await atualizarAtividade(act.id, act.topicoId, { nome })
    carregarAtividades()
  }

  if (!selectedOrg) {
    return (
      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-2">Organizações</h2>
          <form onSubmit={addOrganizacao} className="flex gap-2 mb-2">
            <Input
              value={novoOrg}
              onChange={e => setNovoOrg(e.target.value)}
              placeholder="Nome da organização"
            />
            <Button type="submit">Adicionar</Button>
          </form>
          <ul className="space-y-1">
            {orgs.map(org => (
              <li key={org.id} className="flex justify-between gap-2">
                <span>{org.nome}</span>
                <div className="space-x-2">
                  <Button size="sm" onClick={() => setSelectedOrg(org)}>
                    Gerenciar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => editOrganizacao(org)}>
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      deletarOrganizacao(org.id).then(() => {
                        if (selectedOrg?.id === org.id) setSelectedOrg(null)
                        carregarOrganizacoes()
                      })
                    }}
                  >
                    Excluir
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    )
  }

  if (!selectedMateria) {
    return (
      <div className="space-y-8">
        <Button size="sm" variant="outline" onClick={() => setSelectedOrg(null)}>
          Voltar
        </Button>
        <section>
          <h2 className="text-lg font-semibold mb-2">
            Matérias de {selectedOrg.nome}
          </h2>
          <form onSubmit={addMateria} className="flex flex-col gap-2 mb-2">
            <Input
              value={novaMateria.nome}
              onChange={e => setNovaMateria({ ...novaMateria, nome: e.target.value })}
              placeholder="Nome"
            />
            <Input
              value={novaMateria.professor}
              onChange={e => setNovaMateria({ ...novaMateria, professor: e.target.value })}
              placeholder="Professor"
            />
            <Button type="submit">Adicionar</Button>
          </form>
          <ul className="space-y-1">
            {materias.map(mat => (
              <li key={mat.id} className="flex justify-between gap-2">
                <span>{mat.nome}</span>
                <div className="space-x-2">
                  <Button size="sm" onClick={() => setSelectedMateria(mat)}>
                    Gerenciar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => editMateria(mat)}>
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      deletarMateria(mat.id, mat.organizacaoId).then(carregarMaterias)
                    }}
                  >
                    Excluir
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    )
  }

  if (!selectedTopico) {
    return (
      <div className="space-y-8">
        <Button size="sm" variant="outline" onClick={() => setSelectedMateria(null)}>
          Voltar
        </Button>
        <section>
          <h2 className="text-lg font-semibold mb-2">
            Tópicos de {selectedMateria.nome}
          </h2>
          <form onSubmit={addTopico} className="flex gap-2 mb-2">
            <Input
              value={novoTopico}
              onChange={e => setNovoTopico(e.target.value)}
              placeholder="Nome do tópico"
            />
            <Button type="submit">Adicionar</Button>
          </form>
          <ul className="space-y-1">
            {topicos.map(top => (
              <li key={top.id} className="flex justify-between gap-2">
                <span>{top.nome}</span>
                <div className="space-x-2">
                  <Button size="sm" onClick={() => setSelectedTopico(top)}>
                    Gerenciar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => editTopico(top)}>
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      deletarTopico(top.id, top.materiaId).then(carregarTopicos)
                    }}
                  >
                    Excluir
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Button size="sm" variant="outline" onClick={() => setSelectedTopico(null)}>
        Voltar
      </Button>
      <section>
        <h2 className="text-lg font-semibold mb-2">
          Atividades de {selectedTopico.nome}
        </h2>
        <form onSubmit={addAtividade} className="flex gap-2 mb-2">
          <Input
            value={novaAtividade}
            onChange={e => setNovaAtividade(e.target.value)}
            placeholder="Nome da atividade"
          />
          <Button type="submit">Adicionar</Button>
        </form>
        <ul className="space-y-1">
          {atividades.map(act => (
            <li key={act.id} className="flex justify-between gap-2">
              <span>{act.nome}</span>
              <div className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => editAtividade(act)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    deletarAtividade(act.id, act.topicoId).then(carregarAtividades)
                  }}
                >
                  Excluir
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
