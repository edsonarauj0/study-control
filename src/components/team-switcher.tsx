"use client"

import * as React from "react"
import { ChevronDown, Building2 } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'

import { useOrganizacao } from "@/contexts/OrganizacaoContext"

export function TeamSwitcher() {
    const { organizacoes, activeOrganizacao, setActiveOrganizacao } = useOrganizacao()
    const activeTeam = activeOrganizacao || organizacoes[0]

    if (!activeTeam) {
        return null
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton className="w-fit px-1.5">
                            <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                                <Building2 className="size-3" />
                            </div>
                            <span className="truncate font-semibold">{activeTeam.nome}</span>
                            <ChevronDown className="opacity-50" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-64 rounded-lg"
                        align="start"
                        side="bottom"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Organizações
                        </DropdownMenuLabel>
                        {organizacoes.map((org, index) => (
                            <DropdownMenuItem
                                key={org.id}
                                onClick={() => setActiveOrganizacao(org)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-sm border">
                                    <span className="text-xs font-medium">{index + 1}</span>
                                </div>
                                {org.nome}
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
