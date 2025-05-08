import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Button } from "@/components/ui/button"
  import { FormDialog } from "./form-dialog"
  
interface DataTableProps<T> {
    data: T[]
    columns: {
      key: keyof T
      header: string
    }[]
    onEdit: (item: T) => void
    onDelete: (item: T) => void
    onAdd: (item: Partial<T>) => void
  }
  
  
  export function DataTable<T extends { id: number | string }>({ 
    data, 
    columns, 
    onEdit, 
    onDelete, 
    onAdd 
  }: DataTableProps<T>) {
    return (
      <div>
        <div className="mb-4">
          <FormDialog
            title="Adicionar Novo Item"
            fields={columns.map(col => ({ key: col.key, label: col.header, type: 'text' }))}
            onSubmit={onAdd}
            triggerButton={<Button>Adicionar Novo</Button>}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key as string}>{column.header}</TableHead>
              ))}
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell key={column.key as string}>
                    {row[column.key] as React.ReactNode}
                  </TableCell>
                ))}
                <TableCell>
                  <FormDialog
                    title="Editar Item"
                    fields={columns.map(col => ({ key: col.key, label: col.header, type: 'text' }))}
                    onSubmit={(editedData) => onEdit({ ...row, ...editedData })}
                    triggerButton={<Button variant="outline" className="mr-2">Editar</Button>}
                    initialData={row}
                  />
                  <Button variant="destructive" onClick={() => onDelete(row)}>Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }