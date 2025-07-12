import React from "react"
import { type LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { useActiveRoute } from "@/hooks/useActiveRoute"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavSecondary({
    items,
    ...props
}: {
    items: {
        title: string
        url?: string
        icon: LucideIcon
        badge?: React.ReactNode
        onClick?: () => void
    }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    const { isActiveRoute } = useActiveRoute();

    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => {
                        const isActive = item.url ? isActiveRoute(item.url) : false;
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={isActive}>
                                    {item.onClick ? (
                                        <button onClick={item.onClick}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </button>
                                    ) : (
                                        <Link to={item.url ?? "#"}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    )}
                                </SidebarMenuButton>
                                {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
