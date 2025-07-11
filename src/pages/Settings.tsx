import { useEffect, useState } from 'react'
import {
  fetchOrganizacoes,
  adicionarOrganizacao,
  deletarOrganizacao,
  Organizacao,
} from '@/services/organizacoesService'
import {
  fetchMaterias,
  adicionarMateria,
  deletarMateria,
  Materia,
} from '@/services/materiasService'
import {
  fetchTodosTopicos,
  adicionarTopico,
  deletarTopico,
  Topico,
} from '@/services/topicosService'
import {
  fetchTodasAtividades,
  adicionarAtividade,
  deletarAtividade,
  Atividade,
} from '@/services/atividadesService'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'

export default function Settings() {
  const [orgs, setOrgs] = useState<Organizacao[]>([])
  const [novoOrg, setNovoOrg] = useState('')

  const [materias, setMaterias] = useState<Materia[]>([])
  const [novaMateria, setNovaMateria] = useState({
    nome: '',
    professor: '',
    organizacaoId: '',
  })

  const [topicos, setTopicos] = useState<Topico[]>([])
  const [novoTopico, setNovoTopico] = useState({ nome: '', materiaId: '' })

  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [novaAtividade, setNovaAtividade] = useState({ nome: '', topicoId: '' })

  const carregar = async () => {
    const [o, m, t, a] = await Promise.all([
      fetchOrganizacoes(),
      fetchMaterias(),
      fetchTodosTopicos(),
      fetchTodasAtividades(),
    ])
    setOrgs(o)
    setMaterias(m)
    setTopicos(t)
    setAtividades(a)
  }

  useEffect(() => {
    carregar()
  }, [])

  const addOrganizacao = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoOrg) return
    await adicionarOrganizacao({ nome: novoOrg })
    setNovoOrg('')
    carregar()
  }

  const addMateria = async (e: React.FormEvent) => {
    e.preventDefault()
    const { nome, professor, organizacaoId } = novaMateria
    if (!nome || !professor || !organizacaoId) return
    await adicionarMateria(novaMateria)
    setNovaMateria({ nome: '', professor: '', organizacaoId: '' })
    carregar()
  }

  const addTopico = async (e: React.FormEvent) => {
    e.preventDefault()
    const { nome, materiaId } = novoTopico
    if (!nome || !materiaId) return
    await adicionarTopico(novoTopico)
    setNovoTopico({ nome: '', materiaId: '' })
    carregar()
  }

  const addAtividade = async (e: React.FormEvent) => {
    e.preventDefault()
    const { nome, topicoId } = novaAtividade
    if (!nome || !topicoId) return
    await adicionarAtividade(novaAtividade)
    setNovaAtividade({ nome: '', topicoId: '' })
    carregar()
  }

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
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  deletarOrganizacao(org.id).then(carregar)
                }}
              >
                Excluir
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Matérias</h2>
        <form onSubmit={addMateria} className="flex flex-col gap-2 mb-2">
          <Input
            value={novaMateria.nome}
            onChange={e => setNovaMateria({ ...novaMateria, nome: e.target.value })}
            placeholder="Nome"
          />
          <Input
            value={novaMateria.professor}
            onChange={e =>
              setNovaMateria({ ...novaMateria, professor: e.target.value })
            }
            placeholder="Professor"
          />
          <Input
            value={novaMateria.organizacaoId}
            onChange={e =>
              setNovaMateria({ ...novaMateria, organizacaoId: e.target.value })
            }
            placeholder="ID da Organização"
          />
          <Button type="submit">Adicionar</Button>
        </form>
        <ul className="space-y-1">
          {materias.map(mat => (
            <li key={mat.id} className="flex justify-between gap-2">
              <span>
                {mat.nome} - {mat.organizacaoId}
              </span>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  deletarMateria(mat.id).then(carregar)
                }}
              >
                Excluir
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Tópicos</h2>
        <form onSubmit={addTopico} className="flex flex-col gap-2 mb-2">
          <Input
            value={novoTopico.nome}
            onChange={e => setNovoTopico({ ...novoTopico, nome: e.target.value })}
            placeholder="Nome"
          />
          <Input
            value={novoTopico.materiaId}
            onChange={e =>
              setNovoTopico({ ...novoTopico, materiaId: e.target.value })
            }
            placeholder="ID da Matéria"
          />
          <Button type="submit">Adicionar</Button>
        </form>
        <ul className="space-y-1">
          {topicos.map(top => (
            <li key={top.id} className="flex justify-between gap-2">
              <span>
                {top.nome} - {top.materiaId}
              </span>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  deletarTopico(top.id).then(carregar)
                }}
              >
                Excluir
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Atividades</h2>
        <form onSubmit={addAtividade} className="flex flex-col gap-2 mb-2">
          <Input
            value={novaAtividade.nome}
            onChange={e =>
              setNovaAtividade({ ...novaAtividade, nome: e.target.value })
            }
            placeholder="Nome"
          />
          <Input
            value={novaAtividade.topicoId}
            onChange={e =>
              setNovaAtividade({ ...novaAtividade, topicoId: e.target.value })
            }
            placeholder="ID do Tópico"
          />
          <Button type="submit">Adicionar</Button>
        </form>
        <ul className="space-y-1">
          {atividades.map(act => (
            <li key={act.id} className="flex justify-between gap-2">
              <span>
                {act.nome} - {act.topicoId}
              </span>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  deletarAtividade(act.id).then(carregar)
                }}
              >
                Excluir
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
