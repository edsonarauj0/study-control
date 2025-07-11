import { useEffect, useState } from 'react'
import { fetchOrganizacoes, Organizacao } from '../services/organizacoesService'
import { fetchMaterias, Materia } from '../services/materiasService'
import { fetchTopicos, Topico } from '../services/topicosService'
import { fetchAtividades, Atividade } from '../services/atividadesService'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { ChevronRight, Plus } from 'lucide-react'

interface Hierarquia extends Organizacao {
  materias: (Materia & { topicos: (Topico & { atividades: Atividade[] })[] })[]
}

export default function NavHierarchy() {
  const [dados, setDados] = useState<Hierarquia[]>([])

  useEffect(() => {
    const carregar = async () => {
      const orgs = await fetchOrganizacoes()
      const orgData: Hierarquia[] = []
      for (const org of orgs) {
        const materias = await fetchMaterias(org.id)
        const matData = []
        for (const mat of materias) {
          const topicos = await fetchTopicos(mat.id)
          const topData = []
          for (const top of topicos) {
            const atividades = await fetchAtividades(top.id)
            topData.push({ ...top, atividades })
          }
          matData.push({ ...mat, topicos: topData })
        }
        orgData.push({ ...org, materias: matData })
      }
      setDados(orgData)
    }
    carregar()
  }, [])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Organizações</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {dados.map(org => (
            <Collapsible key={org.id}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <span>{org.nome}</span>
                  </a>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="left-2" showOnHover>
                    <ChevronRight />
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {org.materias.map(mat => (
                      <SidebarMenuSubItem key={mat.id}>
                        <Collapsible>
                          <SidebarMenuSubButton asChild>
                            <a href="#">
                              <span>{mat.nome}</span>
                            </a>
                          </SidebarMenuSubButton>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuAction className="left-2" showOnHover>
                              <ChevronRight />
                            </SidebarMenuAction>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {mat.topicos.map(top => (
                                <SidebarMenuSubItem key={top.id}>
                                  <Collapsible>
                                    <SidebarMenuSubButton asChild size="sm">
                                      <a href="#">
                                        <span>{top.nome}</span>
                                      </a>
                                    </SidebarMenuSubButton>
                                    <CollapsibleTrigger asChild>
                                      <SidebarMenuAction className="left-2" showOnHover>
                                        <ChevronRight />
                                      </SidebarMenuAction>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                      <SidebarMenuSub>
                                        {top.atividades.map(act => (
                                          <SidebarMenuSubItem key={act.id}>
                                            <SidebarMenuSubButton asChild size="sm">
                                              <a href="#">
                                                <span>{act.nome}</span>
                                              </a>
                                            </SidebarMenuSubButton>
                                          </SidebarMenuSubItem>
                                        ))}
                                      </SidebarMenuSub>
                                    </CollapsibleContent>
                                  </Collapsible>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <Plus />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
