import { ReactNode } from 'react'
import { AppSidebar } from '@/components/sidebar/AppSidebar'
import { NavActions } from '@/components/navigation/NavActions'
import { useActiveRoute } from '@/hooks/useActiveRoute'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'

interface SidebarProps {
    children?: ReactNode
}

export default function Sidebar({ children }: SidebarProps) {
    const { currentPath } = useActiveRoute();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-14 shrink-0 items-center gap-2 bg-white">
                    <div className="flex flex-1 items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="line-clamp-1">
                                        {currentPath === '/' ? 'Dashboard' : 
                                         currentPath === '/settings' ? 'Configurações' :
                                         currentPath.includes('/organizacao/') ? 'Matéria' :
                                         'Study Control'}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="ml-auto px-3">
                        <NavActions />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-2 w-full max-w-4xl mx-auto px-2 md:px-8 py-10 bg-gray-100">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}