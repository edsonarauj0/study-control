import { useState } from 'react'
import { adicionarAtividade } from '../services/atividadesService'

function FormularioAtividade() {
  const [nome, setNome] = useState('')
  const [topicoId, setTopicoId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome || !topicoId) return
    try {
      await adicionarAtividade({ nome, topicoId })
      setNome('')
    } catch (err) {
      console.error('Erro ao adicionar atividade:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Adicionar Atividade</h3>
      <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" />
      <input value={topicoId} onChange={e => setTopicoId(e.target.value)} placeholder="ID do Tópico" />
      <button type="submit">Salvar</button>
    </form>
  )
}

export default FormularioAtividade
