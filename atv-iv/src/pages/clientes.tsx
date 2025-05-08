'use client'

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ApiService from '@/services/ApiService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Telefone {
  id: number;
  numero: string;
  ddd: string;
}

interface Endereco {
  id: number;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  codigoPostal: string;
  informacoesAdicionais: string;
}

interface Cliente {
  id: number;
  nome: string;
  nomeSocial: string;
  email: string | null;
  endereco: Endereco;
  telefones: Telefone[];
}

const clientesColumns: { key: keyof Cliente | 'telefone'; header: string }[] = [
  { key: 'id', header: 'ID' },
  { key: 'nome', header: 'Nome' },
  { key: 'nomeSocial', header: 'Nome Social' },
  { key: 'email', header: 'E-mail' }

]

const apiService = new ApiService()
const apiEndpoint = "cliente"

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentCliente, setCurrentCliente] = useState<Partial<Cliente> | null>(null)

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    setLoading(true)
    try {
      const response = await apiService.get(`${apiEndpoint}/clientes`)
      setClientes(Array.isArray(response.data) ? response.data : [])
      setError(null)
    } catch (error: any) {
      if (error.status === 302) {
        setClientes(Array.isArray(error.response.data) ? error.response.data : [])
      } else {
        setError('Erro ao carregar clientes. Por favor, tente novamente.')
        console.error('Error fetching clientes:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (novoCliente: Partial<Cliente>) => {
    try {
      const response = await apiService.post(`${apiEndpoint}/cadastrar`, novoCliente)
      console.log("Cliente adicionado com sucesso!")
      window.location.reload()
    } catch (error) {
      console.error('Error adding cliente:', error)
    }
  }

  const handleEdit = async (clienteEditado: Cliente) => {
    try {
      await apiService.put(`${apiEndpoint}/atualizar`, clienteEditado)
      setClientes(clientes.map(c => c.id === clienteEditado.id ? clienteEditado : c))
      console.log("Cliente atualizado com sucesso!")
    } catch (error) {
      console.error('Error editing cliente:', error)
    }
  }

  const handleDelete = async (clienteParaExcluir: Cliente) => {
    try {
      await apiService.delete(`${apiEndpoint}/excluir`, clienteParaExcluir)
      setClientes(clientes.filter(c => c.id !== clienteParaExcluir.id))
      console.log("Cliente excluído com sucesso!")
    } catch (error) {
      console.error('Error deleting cliente:', error)
    }
  }

  const openDialog = (cliente: Partial<Cliente> | null = null) => {
    setCurrentCliente(cliente)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setCurrentCliente(null)
    setIsDialogOpen(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const clienteData: Partial<Cliente> = {
      nome: formData.get('nome') as string,
      nomeSocial: formData.get('nomeSocial') as string,
      email: formData.get('email') as string,
      endereco: {
        estado: formData.get('estado') as string,
        cidade: formData.get('cidade') as string,
        bairro: formData.get('bairro') as string,
        rua: formData.get('rua') as string,
        numero: formData.get('numero') as string,
        codigoPostal: formData.get('codigoPostal') as string,
        informacoesAdicionais: formData.get('informacoesAdicionais') as string,
      } as Endereco,
      telefones: [{
        ddd: formData.get('ddd') as string,
        numero: formData.get('telefone') as string,
      }] as Telefone[],
    }

    if (currentCliente?.id) {
      handleEdit({ ...clienteData, id: currentCliente.id } as Cliente)
    } else {
      handleAdd(clienteData)
    }
    closeDialog()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground shadow-md">
        <nav className="container mx-auto px-4 py-4">
          <ul className="flex space-x-4">
            <li><Link to="/clientes" className="hover:underline">Clientes</Link></li>
          </ul>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Clientes</h1>
          <Button onClick={() => openDialog()}>Adicionar Cliente</Button>
        </div>
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {clientesColumns.map((column) => (
                  <TableHead key={column.key}>{column.header}</TableHead>
                ))}
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  {clientesColumns.map((column) => (
                    <TableCell key={`${cliente.id}-${column.key}`}>
                      {cliente[column.key as keyof Cliente]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button onClick={() => openDialog(cliente)} className="mr-2">Editar</Button>
                    <Button onClick={() => handleDelete(cliente)} variant="destructive">Excluir</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentCliente ? 'Editar Cliente' : 'Adicionar Cliente'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" defaultValue={currentCliente?.nome} required />
            </div>
            <div>
              <Label htmlFor="nomeSocial">Nome Social</Label>
              <Input id="nomeSocial" name="nomeSocial" defaultValue={currentCliente?.nomeSocial} />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" defaultValue={currentCliente?.email || ''} />
            </div>
            <div>
              <Label htmlFor="ddd">DDD</Label>
              <Input id="ddd" name="ddd" defaultValue={currentCliente?.telefones[0]?.ddd} required />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" name="telefone" defaultValue={currentCliente?.telefones[0]?.numero} required />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input id="estado" name="estado" defaultValue={currentCliente?.endereco?.estado} required />
            </div>
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" name="cidade" defaultValue={currentCliente?.endereco?.cidade} required />
            </div>
            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" name="bairro" defaultValue={currentCliente?.endereco?.bairro} required />
            </div>
            <div>
              <Label htmlFor="rua">Rua</Label>
              <Input id="rua" name="rua" defaultValue={currentCliente?.endereco?.rua} required />
            </div>
            <div>
              <Label htmlFor="numero">Número</Label>
              <Input id="numero" name="numero" defaultValue={currentCliente?.endereco?.numero} required />
            </div>
            <div>
              <Label htmlFor="codigoPostal">CEP</Label>
              <Input id="codigoPostal" name="codigoPostal" defaultValue={currentCliente?.endereco?.codigoPostal} required />
            </div>
            <div>
              <Label htmlFor="informacoesAdicionais">Informações Adicionais</Label>
              <Input id="informacoesAdicionais" name="informacoesAdicionais" defaultValue={currentCliente?.endereco?.informacoesAdicionais} />
            </div>
            <Button type="submit">{currentCliente ? 'Atualizar' : 'Adicionar'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}