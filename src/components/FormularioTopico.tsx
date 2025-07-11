import { useState } from 'react'
import { adicionarTopico } from '../services/topicosService'

function FormularioTopico() {
  const [nome, setNome] = useState('')
  const [materiaId, setMateriaId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome || !materiaId) return
    try {
      await adicionarTopico({ nome, materiaId })
      setNome('')
    } catch (err) {
      console.error('Erro ao adicionar tópico:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Adicionar Tópico</h3>
      <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" />
      <input value={materiaId} onChange={e => setMateriaId(e.target.value)} placeholder="ID da Matéria" />
      <button type="submit">Salvar</button>
    </form>
  )
}

export default FormularioTopico
