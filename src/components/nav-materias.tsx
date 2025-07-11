import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMaterias, Materia } from '@/services/materiasService'
import { useOrganizacao } from '@/contexts/OrganizacaoContext'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavMaterias() {
  const { activeOrganizacao } = useOrganizacao()
  const [materias, setMaterias] = useState<Materia[]>([])

  useEffect(() => {
    const load = async () => {
      if (!activeOrganizacao) {
        setMaterias([])
        return
      }
      const mats = await fetchMaterias(activeOrganizacao.id)
      setMaterias(mats)
    }
    load()
  }, [activeOrganizacao])

  if (!activeOrganizacao) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Matérias</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {materias.map(mat => (
            <SidebarMenuItem key={mat.id}>
              <SidebarMenuButton asChild>
                <Link to={`/organizacao/${activeOrganizacao.id}/materia/${mat.id}`}>
                  <span>{mat.emoji ?? '📚'}</span>
                  <span>{mat.nome}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

