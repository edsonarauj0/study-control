import { useState } from 'react'
import { adicionarMateria } from '../services/materiasService'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'

function FormularioMateria() {
    const [nome, setNome] = useState('')
    const [professor, setProfessor] = useState('')
    const [emoji, setEmoji] = useState('')
    const [organizacaoId, setOrganizacaoId] = useState('')

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setEmoji(emojiData.emoji)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Previne o recarregamento da página

        if (!nome || !professor || !organizacaoId) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            // Chama a função do serviço para adicionar a matéria
            await adicionarMateria({ nome, professor, organizacaoId, emoji });
            alert("Matéria adicionada com sucesso!");
            // Limpa os campos do formulário após o sucesso
            setNome('');
            setProfessor('');
            setEmoji('');
        } catch (error) {
            console.error("Erro ao adicionar matéria:", error);
            alert("Ocorreu um erro ao salvar.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Adicionar Nova Matéria</h3>
            <div>
                <label>Nome da Matéria:</label>
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
            </div>
            <div>
                <label>Professor:</label>
                <input
                    type="text"
                    value={professor}
                    onChange={(e) => setProfessor(e.target.value)}
                />
            </div>
            <div>
                <label>Emoji:</label>
                <EmojiPicker onEmojiClick={handleEmojiClick} />
                {emoji && (
                    <div>
                        <strong>Selecionado:</strong> {emoji}
                    </div>
                )}
            </div>
            <div>
                <label>ID da Organização:</label>
                <input
                    type="text"
                    value={organizacaoId}
                    onChange={(e) => setOrganizacaoId(e.target.value)}
                />
            </div>
            <button type="submit">Salvar Matéria</button>
        </form>
    );
}

export default FormularioMateria;

