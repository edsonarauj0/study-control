import { useEffect, useState } from 'react'
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
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { ChevronRight } from 'lucide-react'
import { useOrganizacao } from '@/contexts/OrganizacaoContext'

interface MateriaTree extends Materia {
  topicos: (Topico & { atividades: Atividade[] })[]
}

export default function NavHierarchy() {
  const { activeOrganizacao } = useOrganizacao()
  const [materias, setMaterias] = useState<MateriaTree[]>([])

  useEffect(() => {
    const carregar = async () => {
      if (!activeOrganizacao) {
        setMaterias([])
        return
      }
      const materias = await fetchMaterias(activeOrganizacao.id)
      const matData: MateriaTree[] = []
      for (const mat of materias) {
        const topicos = await fetchTopicos(mat.id)
        const topData = [] as MateriaTree["topicos"]
        for (const top of topicos) {
          const atividades = await fetchAtividades(top.id)
          topData.push({ ...top, atividades })
        }
        matData.push({ ...mat, topicos: topData })
      }
      setMaterias(matData)
    }
    carregar()
  }, [activeOrganizacao])

  if (!activeOrganizacao) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{activeOrganizacao.nome}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {materias.map(mat => (
            <SidebarMenuItem key={mat.id}>
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
                          <SidebarMenuSubButton asChild size="sm" className="ml-6">
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
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
