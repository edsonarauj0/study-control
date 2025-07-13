import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Materia, fetchMateriaById } from '@/services/materiasService';
import { fetchTopicos, Topico } from '@/services/topicosService';
import AuthContext from '@/contexts/AuthContext';
import { useOrganizacao } from '@/contexts/OrganizacaoContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Book, Calendar, Target, PlusCircle } from 'lucide-react';
import DataTableColumnsVisibilityDemo from '@/components/table-11';
import ResponsiveCard from '@/components/ui/ResponsiveCard';

const MateriaDetails = () => {
  const { idMateria } = useParams();
  const { userId } = useContext(AuthContext);
  const { activeOrganizacao } = useOrganizacao();
  const [materia, setMateria] = useState<Materia | null>(null);
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [estudo, setEstudo] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadData = async () => {
      if (!idMateria || !userId || !activeOrganizacao) return;
      const mat = await fetchMateriaById(activeOrganizacao.id, idMateria);
      setMateria(mat);

      if (mat) {
        const baseTopicos = await fetchTopicos(activeOrganizacao.id, mat.id);

        const enrichedTopicos = baseTopicos.map(t => ({
          ...t,
          status: ((t as unknown) as Topico).status || 'not_started',
          learning: ((t as unknown) as Topico).learning || { completed_at: null },
          review: ((t as unknown) as Topico).review || { review_count: 0 },
          questions: ((t as unknown) as Topico).questions || { total_attempted: 0, correct_answers: 0, sessions: [] },
        }));
        setTopicos(enrichedTopicos);
      }
    };

    loadData();
  }, [idMateria, userId, activeOrganizacao]);

  if (!materia) {
    return <p>Carregando...</p>;
  }

  const totalTopicos = topicos.length;
  const topicosEstudados = Object.values(estudo).filter(Boolean).length;
  const percentualDesempenho = Math.round(
    (topicosEstudados / (totalTopicos || 1)) * 100
  );
  const questoesFeitas = 50;
  const questoesAcertadas = 35;

  return (
    <section
      className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6
        auto-rows-[minmax(50px,auto)] gap-4 grid-flow-dense" >
      <ResponsiveCard
        size="4x1"
        rows={1}
        compact
        className="flex flex-row justify-between gap-2" >
        <Button size="sm" className="bg-blue-500 text-white">
          Novo Tópico
        </Button>
        <Button size="sm" className="bg-green-500 text-white">
          Salvar
        </Button>
        <Button size="sm" className="bg-red-500 text-white">
          Cancelar
        </Button>
      </ResponsiveCard>


      <ResponsiveCard
        size="2x1"
        rows={6}
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
        </CardContent>
      </ResponsiveCard>

      {/* CARD - Progresso Geral */}
      <ResponsiveCard size="2x1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Progresso Geral
          </CardTitle>
          <Book className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{percentualDesempenho}%</div>
          <p className="text-xs text-gray-500">
            {topicosEstudados} de {totalTopicos} tópicos concluídos
          </p>
          <Progress
            value={percentualDesempenho}
            className="mt-2 h-2 rounded-full bg-gray-200"
            style={{ backgroundColor: '#e5e7eb' }}
          />
        </CardContent>
      </ResponsiveCard>

      {/* CARD - Questões Feitas */}
      <ResponsiveCard size="2x1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Questões Feitas
          </CardTitle>
          <Target className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{questoesFeitas}</div>
          <p className="text-xs text-gray-500">
            Total de questões respondidas
          </p>
        </CardContent>
      </ResponsiveCard>

      <ResponsiveCard size="4x1">
         {/* Tabela de Tópicos */}
      <Card className="bg-white rounded-lg shadow">
        <CardHeader>
            <CardTitle className="text-lg">Plano de Estudo</CardTitle>
            <CardDescription className="text-sm text-gray-500">Acompanhe o status de cada tópico do edital.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableColumnsVisibilityDemo topicos={topicos} />
        </CardContent>
      </Card>
      </ResponsiveCard>
      {/* Pequenos Cards */}
      {Array.from({ length: 4 }).map((_, i) => (
        <ResponsiveCard size="1x1" key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Próxima Revisão
            </CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Em 3 dias</div>
            <p className="text-xs text-gray-500">
              Tópico: Direitos Fundamentais
            </p>
          </CardContent>
        </ResponsiveCard>
      ))}
    </section>
  );
};

export default MateriaDetails;
