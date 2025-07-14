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
import { Button } from '@/components/ui/Button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { FormOrganizacoes } from '@/components/forms/OrganizacaoForm'
import { FormTopicos } from '@/components/forms/TopicoForm'
import { FormAtividades } from '@/components/forms/AtividadeForm'
import { NovaMateria } from '@/types/materias'
import { FormularioMaterias } from '@/components/forms/MateriaForm'
import { getAuth } from 'firebase/auth'

export default function Settings() {
  const [orgs, setOrgs] = useState<Organizacao[]>([])
  const [selectedOrg, setSelectedOrg] = useState<Organizacao | null>(null)
  const [novoOrg, setNovoOrg] = useState('')

  const [materias, setMaterias] = useState<Materia[]>([])
  const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null)

  const [topicos, setTopicos] = useState<Topico[]>([])
  const [selectedTopico, setSelectedTopico] = useState<Topico | null>(null)
  const [novoTopico, setNovoTopico] = useState('')
  const [descricao, setDescricao] = useState('')
  const [status, setStatus] = useState<'Andamento' | 'Concluído' | 'Não iniciado'>('Andamento')

  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [novaAtividade, setNovaAtividade] = useState('')

  const BreadcrumbNav = () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {selectedOrg ? (
            <BreadcrumbLink
              href="#"
              onClick={() => {
                setSelectedOrg(null)
                setSelectedMateria(null)
                setSelectedTopico(null)
              }}
            >
              Organizações
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Organizações</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {selectedOrg && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {selectedMateria ? (
                <BreadcrumbLink
                  href="#"
                  onClick={() => {
                    setSelectedMateria(null)
                    setSelectedTopico(null)
                  }}
                >
                  {selectedOrg.nome}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{selectedOrg.nome}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}
        {selectedMateria && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {selectedTopico ? (
                <BreadcrumbLink
                  href="#"
                  onClick={() => setSelectedTopico(null)}
                >
                  {selectedMateria.nome}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{selectedMateria.nome}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}
        {selectedTopico && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{selectedTopico.nome}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )

  const carregarOrganizacoes = async () => {
    const o = await fetchOrganizacoes()
    setOrgs(o)
  }

  const carregarMaterias = async () => {
    if (!selectedOrg) return
    const m = await fetchMaterias(selectedOrg.id)
    setMaterias(m)
  }

  const carregarTopicos = async () => {
    if (!selectedMateria || !selectedOrg) return
    const t = await fetchTopicos(selectedOrg.id, selectedMateria.id)
    setTopicos(t)
  }

  const carregarAtividades = async () => {
    if (!selectedTopico || !selectedMateria || !selectedOrg) return
    const a = await fetchAtividades(selectedOrg.id, selectedMateria.id, selectedTopico.id)
    setAtividades(a)
  }

  useEffect(() => {
    carregarOrganizacoes()
  }, [])

  useEffect(() => {
    if (selectedOrg) carregarMaterias()
  }, [selectedOrg])

  useEffect(() => {
    if (selectedMateria) carregarTopicos()
  }, [selectedMateria])

  useEffect(() => {
    if (selectedTopico) carregarAtividades()
  }, [selectedTopico])

  const addOrganizacao = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoOrg) return
    const userId = getAuth().currentUser?.uid
    if (!userId) throw new Error('Usuário não autenticado')
    await adicionarOrganizacao({ nome: novoOrg }, userId)
    setNovoOrg('')
    carregarOrganizacoes()
  }

  const editOrganizacao = async (org: Organizacao) => {
    const nome = prompt('Nome da organização', org.nome)
    if (!nome) return
    await atualizarOrganizacao(org.id, { nome })
    carregarOrganizacoes()
  }

  const addMateria = async (data: NovaMateria) => {
    if (!selectedOrg) return
    await adicionarMateria(selectedOrg.id, { ...data })
    carregarMaterias()
  }

  const editMateria = async (mat: Materia) => {
    const nome = prompt('Nome da matéria', mat.nome) || mat.nome
    const professor = prompt('Professor', mat.professor) || mat.professor
    const emoji = prompt('Emoji', mat.emoji ?? '') || mat.emoji || ''
    await atualizarMateria(mat.organizacaoId ?? '', mat.id, { nome, professor, emoji })
    carregarMaterias()
  }

  const addTopico = async () => {
    if (!selectedMateria || !selectedOrg) return
    await adicionarTopico(selectedOrg.id, selectedMateria.id, {
      nome: novoTopico,
      descricao: '',
      status: 'Andamento',
      questions: {
        total_attempted: 0,
        correct_answers: 0,
        sessions: [],
      },
      learning: { completed_at: null },
      review: { review_count: 0 },
    })
    setNovoTopico('')
    carregarTopicos()
  }

  const editTopico = async (top: Topico) => {
    const nome = prompt('Nome do tópico', top.nome)
    if (!nome) return
    await atualizarTopico(selectedOrg?.id ?? '', selectedMateria?.id ?? '', top.id, { nome })
    carregarTopicos()
  }

  const addAtividade = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTopico || !selectedMateria || !selectedOrg) return
    await adicionarAtividade(selectedOrg.id, selectedMateria.id, selectedTopico.id, {
      nome: novaAtividade,
      tipo: 'tarefa',
    })
    setNovaAtividade('')
    carregarAtividades()
  }

  const addRevisao = async (nome: string, data: Date) => {
    if (!selectedTopico || !selectedMateria || !selectedOrg) return
    await adicionarAtividade(selectedOrg.id, selectedMateria.id, selectedTopico.id, {
      nome,
      tipo: 'revisao',
      data: data.toISOString(),
    })
    carregarAtividades()
  }

  const editAtividade = async (act: Atividade) => {
    const nome = prompt('Nome da atividade', act.nome)
    if (!nome) return
    await atualizarAtividade(selectedOrg?.id ?? '', selectedMateria?.id ?? '', selectedTopico?.id ?? '', act.id, { nome })
    carregarAtividades()
  }

  const deletarMateria = async (materiaId: string, organizacaoId?: string) => {
    if (!organizacaoId) throw new Error('Organização não selecionada')
    await deletarMateria(organizacaoId, materiaId)
    carregarMaterias()
  }

  const deletarTopico = async (topicoId: string, materiaId: string, organizacaoId: string) => {
    if (!organizacaoId || !materiaId) throw new Error('Organização ou matéria não selecionada')
    await deletarTopico(organizacaoId, materiaId, topicoId)
    carregarTopicos()
  }

  const deletarAtividade = async (atividadeId: string, topicoId: string, materiaId: string, organizacaoId: string) => {
    if (!organizacaoId || !materiaId || !topicoId) throw new Error('Organização, matéria ou tópico não selecionado')
    await deletarAtividade(organizacaoId, materiaId, topicoId, atividadeId)
    carregarAtividades()
  }

  if (!selectedOrg) {
    return (
      <FormOrganizacoes
        orgs={orgs}
        novoOrg={novoOrg}
        setNovoOrg={setNovoOrg}
        addOrganizacao={addOrganizacao}
        editOrganizacao={editOrganizacao}
        deletarOrganizacao={async (id: Organizacao['id']) => {
          await deletarOrganizacao(id)
          if ((selectedOrg as Organizacao | null)?.id === id) setSelectedOrg(null)
          carregarOrganizacoes()
        }}
        setSelectedOrg={setSelectedOrg}
        BreadcrumbNav={<BreadcrumbNav />}
      />
    )
  }

  if (!selectedMateria) {
    return (
      <div className="space-y-8">
        {<BreadcrumbNav />}
        <FormularioMaterias
          onSubmit={addMateria}
          onCancel={() => setSelectedOrg(null)}
        />

        <ul className="space-y-1 mt-4">
          {materias.map(mat => (
            <li key={mat.id} className="flex justify-between items-center">
              <span>{mat.emoji || '📚'} {mat.nome}</span>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setSelectedMateria(mat)}>
                  Gerenciar
                </Button>
                <Button size="sm" variant="outline" onClick={() => editMateria(mat)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    await deletarMateria(mat.id, mat.organizacaoId)
                    carregarMaterias()
                  }}
                >
                  Excluir
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (!selectedTopico) {
    return (
      <FormTopicos
        novoTopico={novoTopico}
        setNovoTopico={setNovoTopico}
        descricao={descricao}
        setDescricao={setDescricao}
        status={status}
        setStatus={setStatus}
        addTopico={addTopico}
      />
    )
  }

  return (
    <FormAtividades
      atividades={atividades}
      novaAtividade={novaAtividade}
      setNovaAtividade={setNovaAtividade}
      addAtividade={addAtividade}
      addRevisao={addRevisao}
      editAtividade={editAtividade}
      deletarAtividade={async (id, topicoId) => {
        await deletarAtividade(id, topicoId, selectedMateria?.id ?? '', selectedOrg?.id ?? '')
        carregarAtividades()
      }}
      selectedTopicoNome={selectedTopico?.nome || ''}
      onVoltar={() => setSelectedTopico(null)}
      BreadcrumbNav={<BreadcrumbNav />}
    />
  )
}
