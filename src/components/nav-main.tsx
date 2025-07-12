"use client"

import { type LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { useActiveRoute } from "@/hooks/useActiveRoute"

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon: LucideIcon
    }[]
}) {
    const { isActiveRoute } = useActiveRoute();

    return (
        <SidebarMenu>
            {items.map((item) => {
                const isActive = isActiveRoute(item.url);
                return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                            <Link to={item.url}>
                                <item.icon />
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    )
}
