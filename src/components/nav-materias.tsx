import { useEffect, useState } from 'react'
import { fetchMaterias, Materia } from '@/services/materiasService'
import { useOrganizacao } from '@/contexts/OrganizacaoContext'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { ArrowUpRight, MoreHorizontal, StarOff, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NavMaterias() {
  const { activeOrganizacao } = useOrganizacao()
  const [materias, setMaterias] = useState<Materia[]>([])
  const { isMobile } = useSidebar()
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <StarOff className="text-muted-foreground" />
                    <span>Remove from Favorites</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span>Copy Link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ArrowUpRight className="text-muted-foreground" />
                    <span>Open in New Tab</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

