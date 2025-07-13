import { useEffect, useState } from 'react'
import { adicionarMateria, fetchMaterias, deletarMateria, Materia } from '@/services/materiasService'
import { fetchTopicos, Topico } from '@/services/topicosService'
import { useOrganizacao } from '@/contexts/OrganizacaoContext'
import { useActiveRoute } from '@/hooks/useActiveRoute'
import { useFavorites } from '@/contexts/FavoritesContext'
import { toast } from 'sonner'
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/Button'
import {
  ArrowUpRight,
  CopyPlus,
  MoreHorizontal,
  Plus,
  Star,
  StarOff,
  Trash2,
  Link as LinkIcon,
  ChevronRight,
  ChevronDown
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useModal } from '@/contexts/ModalContext'
import { FormularioMaterias } from '@/components/forms/MateriaForm'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'

export function NavMaterias() {
  const { activeOrganizacao } = useOrganizacao()
  const [materias, setMaterias] = useState<Materia[]>([])
  const [materiaToDelete, setMateriaToDelete] = useState<Materia | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { isMobile } = useSidebar()
  const { isActiveRoute } = useActiveRoute()
  const { openModal, closeModal } = useModal()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  const [visibleCount, setVisibleCount] = useState(5);
  const [topicosMap, setTopicosMap] = useState<Record<string, Topico[]>>({})
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

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

  const handleAddMateria = () => {
    openModal(
      <FormularioMaterias
        onSubmit={async (data) => {
          await adicionarMateria(activeOrganizacao.id, data);
          const mats = await fetchMaterias(activeOrganizacao.id);
          setMaterias(mats);
          closeModal();
        }}
      />
    );
  }

  const handleDeleteMateria = (materia: Materia) => {
    setMateriaToDelete(materia)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteMateria = async () => {
    if (materiaToDelete && activeOrganizacao) {
      await deletarMateria(materiaToDelete.id, materiaToDelete.organizacaoId ?? '')
      const mats = await fetchMaterias(activeOrganizacao.id)
      setMaterias(mats)
      setIsDeleteDialogOpen(false)
      setMateriaToDelete(null)
      window.location.reload()
    }
  }

  const handleToggleFavorite = async (materia: Materia) => {
    try {
      if (isFavorite(materia.id)) {
        await removeFromFavorites(materia.id);
        toast.success(`${materia.nome} removida dos favoritos`);
      } else {
        await addToFavorites({
          id: materia.id,
          nome: materia.nome,
          emoji: materia.emoji || '📚',
          organizacaoId: materia.organizacaoId ?? '',
          professor: materia.professor
        });
        toast.success(`${materia.nome} adicionada aos favoritos`);
      }
    } catch (error) {
      console.error('Erro ao gerenciar favorito:', error);
      toast.error('Erro ao gerenciar favorito. Tente novamente.');
    }
  };

  const handleLoadTopicos = async (materiaId: string) => {
    if (!topicosMap[materiaId]) {
      try {
        const topicos = await fetchTopicos(activeOrganizacao.id, materiaId)
        setTopicosMap(prev => ({ ...prev, [materiaId]: topicos }))
      } catch (error) {
        console.error('Erro ao buscar tópicos:', error)
        toast.error('Erro ao carregar tópicos')
      }
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Matérias</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem key="add-materia">
            <SidebarMenuButton onClick={handleAddMateria}>
              <span><CopyPlus className='h-4 w-4' /></span>
              <span>Adicionar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {materias.slice(0, visibleCount).map(mat => {
            const materiaUrl = `/organizacao/${activeOrganizacao.id}/materia/${mat.id}`;
            const isActive = isActiveRoute(materiaUrl);
            const topicos = topicosMap[mat.id] || [];
            const isOpen = openMap[mat.id] || false;

            return (
              <Collapsible
                key={mat.id}
                open={isOpen}
                onOpenChange={(open) => {
                  setOpenMap(prev => ({ ...prev, [mat.id]: open }));
                  if (open) {
                    handleLoadTopicos(mat.id);
                  }
                }}
              >
                <SidebarMenuItem>
                  <div className="flex items-center w-full group">
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center justify-center h-4 w-4 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-sm shrink-0">
                        {isOpen ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </button>
                    </CollapsibleTrigger>
                    <SidebarMenuButton asChild isActive={isActive} className="flex-1 min-w-0">
                      <Link to={materiaUrl} className="flex items-center min-w-0 w-full">
                        <span className='h-4 w-4 shrink-0'>{mat.emoji ?? '📚'}</span>
                        <span className="truncate min-w-0 block">{mat.nome}</span>
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
                        <DropdownMenuItem onClick={() => handleToggleFavorite(mat)}>
                          {isFavorite(mat.id) ? (
                            <>
                              <StarOff className="text-muted-foreground" />
                              <span>Remove from Favorites</span>
                            </>
                          ) : (
                            <>
                              <Star className="text-muted-foreground" />
                              <span>Add to Favorites</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(window.location.origin + materiaUrl)}>
                          <LinkIcon className="text-muted-foreground" />
                          <span>Copy Link</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(materiaUrl, '_blank')}>
                          <ArrowUpRight className="text-muted-foreground" />
                          <span>Open in New Tab</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteMateria(mat)}>
                          <Trash2 className="text-muted-foreground" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </SidebarMenuItem>

                <CollapsibleContent className="space-y-1">
                  {topicos.length > 0 ? (
                    <div className="ml-4 border-sidebar-border pl-4 space-y-1">
                      {topicos.map(topico => {
                        const topicoUrl = `/organizacao/${activeOrganizacao.id}/materia/${mat.id}/topico/${topico.id}`;
                        const isTopicoActive = isActiveRoute(topicoUrl);

                        return (
                          <SidebarMenuItem key={topico.id}>
                            <SidebarMenuButton asChild isActive={isTopicoActive} className="text-sm min-w-0">
                              <Link to={topicoUrl} className="flex items-center min-w-0 w-full">
                                <span className="truncate min-w-0 block">{topico.nome}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="ml-8 py-1 text-xs text-sidebar-foreground/50">
                      Nenhum tópico encontrado
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            );
          })}

          {materias.length > visibleCount && (
            <SidebarMenuItem key="show-more">
              <SidebarMenuButton className="text-sidebar-foreground/70" onClick={() => setVisibleCount((prev) => prev + 5)}>
                <MoreHorizontal />
                <span>Carregar mais</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a matéria <strong>"{materiaToDelete?.nome}"</strong>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteMateria}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarGroup>
  )
}
