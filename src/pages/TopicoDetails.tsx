import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTopicoById, Topico } from '@/services/topicosService';
import { useOrganizacao } from '@/contexts/OrganizacaoContext';

export default function TopicoDetails() {
  const { idMateria, idTopico } = useParams();
  const [topico, setTopico] = useState<Topico | null>(null);
  const { activeOrganizacao } = useOrganizacao();

  useEffect(() => {
    const load = async () => {
      if (!idTopico || !idMateria || !activeOrganizacao) return;
      const top = await fetchTopicoById(activeOrganizacao.id, idMateria, idTopico);
      setTopico(top);
    };
    load();
  }, [idTopico, idMateria, activeOrganizacao]);

  if (!topico) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="space-y-6 bg-white p-4 rounded-md">
      <nav className="text-sm text-gray-500">
        <Link to={`/organizacao/${activeOrganizacao?.id}/materia/${idMateria}`}>Matéria</Link> / {topico.nome}
      </nav>
      <h1 className="text-2xl font-bold">{topico.nome}</h1>
      <p>{topico.descricao}</p>
      {/* Adicione mais informações relevantes sobre o tópico aqui */}
    </div>
  );
}
