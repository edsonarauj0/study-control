import { useState } from 'react'
import { adicionarOrganizacao } from '../services/organizacoesService'

function FormularioOrganizacao() {
  const [nome, setNome] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome) return
    try {
      await adicionarOrganizacao({ nome })
      setNome('')
    } catch (err) {
      console.error('Erro ao adicionar organização:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Adicionar Organização</h3>
      <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" />
      <button type="submit">Salvar</button>
    </form>
  )
}

export default FormularioOrganizacao
