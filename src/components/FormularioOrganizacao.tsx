import { useState } from 'react'
import { adicionarOrganizacao } from '../services/organizacoesService'
import { useOrganizacao } from '@/contexts/OrganizacaoContext'

function FormularioOrganizacao() {
  const [nome, setNome] = useState('')
  const { reloadOrganizacoes } = useOrganizacao()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome) return
    try {
      await adicionarOrganizacao({ nome })
      setNome('')
      reloadOrganizacoes()
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

