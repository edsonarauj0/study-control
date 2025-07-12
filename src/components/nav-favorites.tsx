"use client"

import {
    ArrowUpRight,
    Link,
    MoreHorizontal,
    StarOff,
    Trash2,
} from "lucide-react"
import { Link as RouterLink } from "react-router-dom"
import { useActiveRoute } from "@/hooks/useActiveRoute"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'

export function NavFavorites({
    favorites,
}: {
    favorites: {
        name: string
        url: string
        emoji: string
    }[]
}) {
    const { isMobile } = useSidebar()
    const { isActiveRoute } = useActiveRoute();

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Favorites</SidebarGroupLabel>
            <SidebarMenu>
                {favorites.map((item) => {
                    const isActive = isActiveRoute(item.url);
                    return (
                        <SidebarMenuItem key={item.name}>
                            <SidebarMenuButton asChild isActive={isActive}>
                                <RouterLink to={item.url} title={item.name}>
                                    <span>{item.emoji}</span>
                                    <span>{item.name}</span>
                                </RouterLink>
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
                                        <Link className="text-muted-foreground" />
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
                    );
                })}
                <SidebarMenuItem>
                    <SidebarMenuButton className="text-sidebar-foreground/70">
                        <MoreHorizontal />
                        <span>More</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}
