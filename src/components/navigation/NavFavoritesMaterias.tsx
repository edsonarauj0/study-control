import { Star, StarOff, ArrowUpRight, Link as LinkIcon } from "lucide-react"
import { useActiveRoute } from "@/hooks/useActiveRoute"
import { useFavorites } from "@/contexts/FavoritesContext"
import { toast } from 'sonner'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/DropdownMenu"
import { MoreHorizontal } from "lucide-react"
import { Link } from "react-router-dom"

export function NavFavoritesMaterias() {
    const { favoritesMaterias, removeFromFavorites, loading } = useFavorites();
    const { isMobile } = useSidebar();
    const { isActiveRoute } = useActiveRoute();

    if (loading) {
        return (
            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                <SidebarGroupLabel>Favoritas</SidebarGroupLabel>
                <SidebarMenu>
                    <div className="px-2 py-1 text-sm text-muted-foreground">Carregando...</div>
                </SidebarMenu>
            </SidebarGroup>
        );
    }

    if (favoritesMaterias.length === 0) {
        return null;
    }

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Favoritas</SidebarGroupLabel>
            <SidebarMenu>
                {favoritesMaterias.map((materia) => {
                    const materiaUrl = `/organizacao/${materia.organizacaoId}/materia/${materia.id}`;
                    const isActive = isActiveRoute(materiaUrl);
                    
                    return (
                        <SidebarMenuItem key={materia.id}>
                            <SidebarMenuButton asChild isActive={isActive} className="!p-1">
                                <Link
                                    to={materiaUrl}
                                    title={materia.nome}
                                >
                                    <span className="h-4 w-4">{materia.emoji || '📚'}</span>
                                    <span>{materia.nome}</span>
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
                                    <DropdownMenuItem onClick={async () => {
                                        try {
                                            await removeFromFavorites(materia.id);
                                            toast.success(`${materia.nome} removida dos favoritos`);
                                        } catch (error) {
                                            console.error('Erro ao remover dos favoritos:', error);
                                            toast.error('Erro ao remover dos favoritos. Tente novamente.');
                                        }
                                    }}>
                                        <StarOff className="text-muted-foreground" />
                                        <span>Remove from Favorites</span>
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
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
