import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchTopicoById, Topico } from '@/services/topicosService'
import { useOrganizacao } from '@/contexts/OrganizacaoContext'
import ResponsiveCard from '@/components/ui/ResponsiveCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { FormAtividades } from '@/components/forms/AtividadeForm';
import { AtividadesTable } from '@/components/features/AtividadesTable';
import { TopicoStatusPanel } from '@/components/features/TopicoStatusPanel'
import { AtividadeExtended } from '@/lib/topicoStatus'
import { fetchAtividades, adicionarAtividade, deletarAtividade, atualizarAtividade, Atividade } from '@/services/atividadesService'
import { FormAtividadeSchema } from '@/schema/FormAtividadeSchema'
import { z } from 'zod'

export default function TopicoDetails() {
  const { idMateria, idTopico } = useParams();
  const [topico, setTopico] = useState<Topico | null>(null);
  const { activeOrganizacao } = useOrganizacao();
  const [showAtividadeModal, setShowAtividadeModal] = useState(false);
  const [atividades, setAtividades] = useState<AtividadeExtended[]>([])
  const [novaAtividade, setNovaAtividade] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!idTopico || !idMateria || !activeOrganizacao) return;
      const top = await fetchTopicoById(activeOrganizacao.id, idMateria, idTopico);
      setTopico(top);
      const acts = await fetchAtividades(activeOrganizacao.id, idMateria, idTopico)
      setAtividades(acts as unknown as AtividadeExtended[])
    };
    load();
  }, [idTopico, idMateria, activeOrganizacao]);

  const carregarAtividades = async () => {
    if (!activeOrganizacao || !idMateria || !idTopico) return;
    const acts = await fetchAtividades(activeOrganizacao.id, idMateria, idTopico);
    setAtividades(acts as unknown as AtividadeExtended[]);
  };

  const addAtividade = async (data: z.infer<typeof FormAtividadeSchema>) => {
    if (!activeOrganizacao || !idMateria || !idTopico) return;
    await adicionarAtividade(activeOrganizacao.id, idMateria, idTopico, {
      ...data,
      dataInicial: (data as any).dataInicial
        ? (data as any).dataInicial.toISOString()
        : undefined,
    });
    setNovaAtividade('');
    setShowAtividadeModal(false);
    carregarAtividades();
  };

  const deletarAtividadeHandler = async (atividadeId: string) => {
    if (!activeOrganizacao || !idMateria || !idTopico) return;
    await deletarAtividade(activeOrganizacao.id, idMateria, idTopico, atividadeId);
    carregarAtividades();
  };

  const editAtividade = async (act: Atividade) => {
    const nome = prompt('Nome da atividade', act.nome || '') || act.nome;
    if (!nome) return;
    await atualizarAtividade(activeOrganizacao?.id || '', idMateria || '', idTopico || '', act.id, { nome });
    carregarAtividades();
  };

  if (!topico) {
    return <p>Carregando...</p>;
  }

  return (
    <section
      className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6
        auto-rows-[minmax(50px,auto)] gap-4 grid-flow-dense" >
      <div className="col-span-4">
        <TopicoStatusPanel atividades={atividades} topicoNome={topico.nome} />
      </div>
      <ResponsiveCard
        size="4x1"
        rows={1}
        compact
        className="flex flex-row justify-end gap-2"
      >
        <Button size="icon" variant="ghost" onClick={() => setShowAtividadeModal(true)}>
          <PlusCircle className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => alert('Excluir tópico')}>
          <Trash2 className="w-4 h-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => alert('Outra ação')}>Outra ação</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ResponsiveCard>
      <FormAtividades
        isOpen={showAtividadeModal}
        onClose={() => setShowAtividadeModal(false)}
        atividades={atividades}
        novaAtividade={novaAtividade}
        setNovaAtividade={setNovaAtividade}
        addAtividade={addAtividade}
        editAtividade={editAtividade}
        deletarAtividade={deletarAtividadeHandler}
        selectedTopicoNome={topico?.nome || ''}
        onVoltar={() => setShowAtividadeModal(false)}
        BreadcrumbNav={null}
      />
      <ResponsiveCard size="full" rows={5}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <AtividadesTable atividades={atividades} />
        </CardContent>
      </ResponsiveCard>
    </section>
  );
}
