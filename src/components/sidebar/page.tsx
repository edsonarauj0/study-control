import { ReactNode, useEffect, useState } from 'react'
import { AppSidebar } from '@/components/sidebar/AppSidebar'
import { NavActions } from '@/components/navigation/NavActions'
import { useActiveRoute } from '@/hooks/useActiveRoute'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import { fetchMaterias, Materia } from '@/services/materiasService'
import { fetchOrganizacoes, Organizacao } from '@/services/organizacoesService'
import { fetchTopicos } from '@/services/topicosService';
import { fetchAtividades } from '@/services/atividadesService';
import { Topico } from '@/services/topicosService';
import { Atividade } from '@/services/atividadesService';
import { OrganizacaoProvider } from '@/contexts/OrganizacaoContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

interface SidebarProps {
    children?: ReactNode
}

export default function Sidebar({ children }: SidebarProps) {
    const { currentPath } = useActiveRoute();
    const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null);
    const [materia, setMateria] = useState<Materia | null>(null);
    const [selectedOrg, setSelectedOrg] = useState<Organizacao | null>(null);
    const [selectedTopico, setSelectedTopico] = useState<Topico | null>(null);
    const [selectedAtividade, setSelectedAtividade] = useState<Atividade | null>(null);

    useEffect(() => {
        const carregarDados = async () => {
            const pathMatch = currentPath.match(/organizacao\/([^/]+)\/materia\/([^/]+)(?:\/topico\/([^/]+))?(?:\/atividade\/([^/]+))?/);
            const orgId = pathMatch?.[1] || '';
            const materiaId = pathMatch?.[2];
            const topicoId = pathMatch?.[3];
            const atividadeId = pathMatch?.[4];

            if (orgId) {
                const organizacoes = await fetchOrganizacoes();
                const orgAtual = organizacoes.find(org => org.id === orgId);
                setSelectedOrg(orgAtual || null);
            }

            if (materiaId) {
                const materias = await fetchMaterias(orgId); // Garantido que orgId é string
                const materiaAtual = materias.find((m: Materia) => m.id === materiaId);
                setMateria(materiaAtual || null);
                setSelectedMateria(materiaAtual || null);
            }

            if (topicoId && materiaId) {
                const topicos = await fetchTopicos(orgId, materiaId); // Incluído materiaId
                const topicoAtual = topicos.find((t: Topico) => t.id === topicoId);
                setSelectedTopico(topicoAtual || null);
            }

            if (atividadeId && topicoId && materiaId) {
                const atividades = await fetchAtividades(orgId, materiaId, topicoId); // Incluídos materiaId e topicoId
                const atividadeAtual = atividades.find((a: Atividade) => a.id === atividadeId);
                setSelectedAtividade(atividadeAtual || null);
            }
        };

        carregarDados();
    }, [currentPath]);

    const BreadcrumbNav = () => ( 
        selectedOrg && materia ? (
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">
                            {selectedOrg.nome}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/organizacao/${selectedOrg.id}/materia/${materia.id}`}>
                            {materia.nome}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {selectedTopico && (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/organizacao/${selectedOrg.id}/materia/${materia.id}/topico/${selectedTopico.id}`}>
                                    {selectedTopico.nome}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </>
                    )}
                    {selectedAtividade && (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{selectedAtividade.nome}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </>
                    )}
                </BreadcrumbList>
            </Breadcrumb>
        ) : null
    );

    return (
        <OrganizacaoProvider>
            <SidebarProvider>
                <FavoritesProvider>
                    <AppSidebar />
                </FavoritesProvider>
                <SidebarInset>
                    <header className="flex h-14 shrink-0 items-center gap-2 bg-white">
                        <div className="flex flex-1 items-center gap-2 px-3">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <BreadcrumbNav />
                        </div>
                        <div className="ml-auto px-3">
                            <NavActions materiaName={selectedMateria?.nome || undefined} />
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-2 w-full max-w-6xl mx-auto md:px-6 py-6 bg-gray-100">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </OrganizacaoProvider>
    )
}