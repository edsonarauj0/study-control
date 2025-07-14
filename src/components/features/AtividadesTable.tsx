import { Atividade } from '@/services/atividadesService'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function AtividadesTable({ atividades }: { atividades: Atividade[] }) {
  if (!atividades.length) {
    return <p className="text-sm text-muted-foreground">Nenhuma atividade cadastrada.</p>
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tipo</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Tempo</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Acertos</TableHead>
          <TableHead>Erros</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {atividades.map((a) => (
          <TableRow key={a.id}>
            <TableCell className="capitalize">{a.tipo}</TableCell>
            <TableCell>{a.nome || '-'}</TableCell>
            <TableCell>{a.status || '-'}</TableCell>
            <TableCell>{a.tempo ?? '-'}</TableCell>
            <TableCell>{a.total ?? '-'}</TableCell>
            <TableCell>{a.acertos ?? '-'}</TableCell>
            <TableCell>{a.erros ?? '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
