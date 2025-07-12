import { useEffect, useState } from 'react'
import { adicionarMateria, fetchMaterias, deletarMateria, Materia } from '@/services/materiasService'
import { useOrganizacao } from '@/contexts/OrganizacaoContext'
import { useActiveRoute } from '@/hooks/useActiveRoute'
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/Button'
import { ArrowUpRight, CopyPlus, MoreHorizontal, Paperclip, Plus, StarOff, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useModal } from '@/contexts/ModalContext'
import { FormularioMaterias } from '@/components/forms/MateriaForm'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/DropdownMenu'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'

export function NavMaterias() {
  const { activeOrganizacao } = useOrganizacao()
  const [materias, setMaterias] = useState<Materia[]>([])
  const [materiaToDelete, setMateriaToDelete] = useState<Materia | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { isMobile } = useSidebar()
  const { isActiveRoute } = useActiveRoute()
  const { openModal, closeModal } = useModal();

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
          await adicionarMateria({
            ...data,
            organizacaoId: activeOrganizacao.id
          });
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
      await deletarMateria(materiaToDelete.id, materiaToDelete.organizacaoId)
      const mats = await fetchMaterias(activeOrganizacao.id)
      setMaterias(mats)
      setIsDeleteDialogOpen(false)
      setMateriaToDelete(null)
      window.location.reload()
    }
  }

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
          {materias.map(mat => {
            const materiaUrl = `/organizacao/${activeOrganizacao.id}/materia/${mat.id}`;
            const isActive = isActiveRoute(materiaUrl);
            return (
              <SidebarMenuItem key={mat.id}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link to={materiaUrl}>
                    <span className='h-4 w-4'>{mat.emoji ?? '📚'}</span>
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
                    <DropdownMenuItem onClick={() => handleDeleteMateria(mat)}>
                      <Trash2 className="text-muted-foreground" />
                      <span>Excluir</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            );
          })}
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
