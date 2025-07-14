import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchTopicoById, Topico } from '@/services/topicosService'
import {
  fetchAtividades,
  adicionarAtividade,
  atualizarAtividade,
  deletarAtividade as deletarAtividadeService,
  Atividade,
} from '@/services/atividadesService'
import { FormAtividades } from '@/components/forms/AtividadeForm'
import { Button } from '@/components/ui/Button'
import { PlusCircle } from 'lucide-react'
import { useOrganizacao } from '@/contexts/OrganizacaoContext'

export default function TopicoDetails() {
  const { idMateria, idTopico } = useParams();
  const [topico, setTopico] = useState<Topico | null>(null);
  const { activeOrganizacao } = useOrganizacao();
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [novaAtividade, setNovaAtividade] = useState('')
  const [showAtividadeModal, setShowAtividadeModal] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!idTopico || !idMateria || !activeOrganizacao) return;
      const top = await fetchTopicoById(activeOrganizacao.id, idMateria, idTopico);
      setTopico(top);
      const acts = await fetchAtividades(activeOrganizacao.id, idMateria, idTopico);
      setAtividades(acts);
    };
    load();
  }, [idTopico, idMateria, activeOrganizacao]);

  const carregarAtividades = async () => {
    if (!idTopico || !idMateria || !activeOrganizacao) return
    const acts = await fetchAtividades(activeOrganizacao.id, idMateria, idTopico)
    setAtividades(acts)
  }

  const addAtividade = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novaAtividade || !idTopico || !idMateria || !activeOrganizacao) return
    await adicionarAtividade(activeOrganizacao.id, idMateria, idTopico, {
      nome: novaAtividade,
      tipo: 'tarefa',
    })
    setNovaAtividade('')
    carregarAtividades()
  }

  const addRevisao = async (nome: string, data: Date) => {
    if (!idTopico || !idMateria || !activeOrganizacao) return
    await adicionarAtividade(activeOrganizacao.id, idMateria, idTopico, {
      nome,
      tipo: 'revisao',
      data: data.toISOString(),
    })
    carregarAtividades()
  }

  const editAtividade = async (act: Atividade) => {
    const nome = prompt('Nome da atividade', act.nome)
    if (!nome || !idTopico || !idMateria || !activeOrganizacao) return
    await atualizarAtividade(activeOrganizacao.id, idMateria, idTopico, act.id, {
      nome,
    })
    carregarAtividades()
  }

  const deletarAtv = async (atividadeId: string, _topicoId: string) => {
    if (!idTopico || !idMateria || !activeOrganizacao) return
    await deletarAtividadeService(
      activeOrganizacao.id,
      idMateria,
      idTopico,
      atividadeId
    )
    carregarAtividades()
  }

  if (!topico) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="space-y-6 bg-white p-4 rounded-md">
      <nav className="text-sm text-gray-500">
        <Link to={`/organizacao/${activeOrganizacao?.id}/materia/${idMateria}`}>Matéria</Link> / {topico.nome}
      </nav>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{topico.nome}</h1>
        <Button size="icon" variant="ghost" onClick={() => setShowAtividadeModal(true)}>
          <PlusCircle className="w-5 h-5" />
        </Button>
      </div>
      <p>{topico.descricao}</p>
      {/* Adicione mais informações relevantes sobre o tópico aqui */}
      <FormAtividades
        isModal
        isOpen={showAtividadeModal}
        onClose={() => setShowAtividadeModal(false)}
        atividades={atividades}
        novaAtividade={novaAtividade}
        setNovaAtividade={setNovaAtividade}
        addAtividade={addAtividade}
        addRevisao={addRevisao}
        editAtividade={editAtividade}
        deletarAtividade={deletarAtv}
        selectedTopicoNome={topico.nome}
        onVoltar={() => setShowAtividadeModal(false)}
        BreadcrumbNav={<></>}
      />
    </div>
  );
}
