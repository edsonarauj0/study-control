import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchTopicoById, Topico } from '@/services/topicosService'
import { useOrganizacao } from '@/contexts/OrganizacaoContext'
import ResponsiveCard from '@/components/ui/ResponsiveCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { FormAtividades } from '@/components/forms/AtividadeForm';
import { TopicoStatusPanel } from '@/components/features/TopicoStatusPanel'
import { AtividadeExtended } from '@/lib/topicoStatus'
import { fetchAtividades } from '@/services/atividadesService'

export default function TopicoDetails() {
  const { idMateria, idTopico } = useParams();
  const [topico, setTopico] = useState<Topico | null>(null);
  const { activeOrganizacao } = useOrganizacao();
  const [showAtividadeModal, setShowAtividadeModal] = useState(false);
  const [atividades, setAtividades] = useState<AtividadeExtended[]>([])

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
        atividades={[]} // TODO: replace with actual atividades array
        novaAtividade={""} // TODO: replace with actual novaAtividade string
        setNovaAtividade={() => {}} // TODO: replace with actual setter function
        addAtividade={() => {}} // TODO: replace with actual add function
        editAtividade={() => {}} // TODO: replace with actual edit function
        deletarAtividade={() => {}} // TODO: replace with actual delete function
        selectedTopicoNome={topico?.nome || ""}
        onVoltar={() => setShowAtividadeModal(false)}
        BreadcrumbNav={null} // TODO: replace with actual BreadcrumbNav component if needed
      />
      <ResponsiveCard
        size="2x1"
        rows={5}
        className="lg:col-start-5"
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Card Vertical
          </CardTitle>
          <Book className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Ocupa altura total</div>
          <p className="text-xs text-gray-500">
            Este card ocupa duas colunas em desktop, mas se ajusta em telas menores.
          </p>
          <div style={{ height: '500px' }}></div>
        </CardContent>
      </ResponsiveCard>
      <ResponsiveCard size="4x1" rows={5}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Plano de Estudo</CardTitle>
            <CardDescription className="text-sm text-gray-500">Acompanhe o status de cada tópico do edital.</CardDescription>
          </CardHeader>
          <CardContent>
          </CardContent>
      </ResponsiveCard>
    </section>
  );
}
