import { useState, useEffect } from 'react';
// Importa as funções do seu novo serviço e o tipo Materia!
import { fetchMaterias, Materia } from '../../../services/materiasService'

interface Props {
    organizacaoId: string
}
function ListaDeMaterias({ organizacaoId }: Props) {
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                // Usa a função do serviço para buscar os dados
                const dados = await fetchMaterias(organizacaoId);
                setMaterias(dados);
            } catch (error) {
                console.error("Erro no componente ao buscar matérias:", error);
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
    }, [organizacaoId]);

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <div>
            <h2>Minhas Matérias</h2>
            <ul>
                {materias.map(materia => (
                    <li key={materia.id}>
                        {materia.nome}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListaDeMaterias;
