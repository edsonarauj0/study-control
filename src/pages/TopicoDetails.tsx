import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTopicoById, Topico } from '@/services/topicosService';

export default function TopicoDetails() {
  const { idMateria, idTopico } = useParams();
  const [topico, setTopico] = useState<Topico | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!idTopico || !idMateria) return;
      const top = await fetchTopicoById(idMateria, idTopico);
      setTopico(top);
    };
    load();
  }, [idTopico, idMateria]);

  if (!topico) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="space-y-6 bg-white p-4 rounded-md">
      <nav className="text-sm text-gray-500">
        <Link to={`/organizacao/${topico.organizacaoId}/materia/${idMateria}`}>Matéria</Link> / {topico.nome}
      </nav>
      <h1 className="text-2xl font-bold">{topico.nome}</h1>
      <p>{topico.descricao}</p>
      {/* Adicione mais informações relevantes sobre o tópico aqui */}
    </div>
  );
}
