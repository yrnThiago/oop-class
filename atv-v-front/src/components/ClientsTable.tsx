import React, { useEffect, useState } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { LoaderCircle, Plus, UserPen, UserRoundX } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Label } from "./ui/label"
import { Filter, Download } from "lucide-react"
import ApiService from '@/services/ApiService'
import { DialogDescription } from '@radix-ui/react-dialog'
import NotFound from './NotFound'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSearchParams  } from 'react-router-dom'
import Pagination from './Pagination'
import { Client, DefaultClient } from '@/types/Client'

export default function ClientsTable() {
  const apiService = new ApiService()
  const apiEndpoint = "private/clients"
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const take = parseInt(import.meta.env.VITE_TABLE_TAKE);

  const [clients, setClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState<Client>(DefaultClient);
  const [selectedClient, setSelectedClient] = useState<Client>(DefaultClient);


  const [searchTerm, setSearchTerm] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [clientAddError, setClientAddError] = useState("")
  const [addIsOpen, setAddIsOpen] = useState(false)
  const [updateIsOpen, setUpdateIsOpen] = useState(false)
  const [filterPage, setFilterPage] = useState(page)
  const [totalClientsPage, setTotalClientsPage] = useState(1)

  useEffect(() => {
    const fetchClients = async () => {
      setIsInitialLoading(true)
      try {
        const [clientsResponse] = await Promise.all([
          apiService.get(`${apiEndpoint}`, {"take": take, "page": page}),
          new Promise(resolve => setTimeout(resolve, 1500))
        ]);

        setClients(Array.isArray(clientsResponse.data.clients) ? clientsResponse.data.clients : [])
        setTotalClientsPage(clientsResponse.data.total? Math.ceil(clientsResponse.data.total / take) : 1)
      } catch (error) {
        console.error('Error fetching data:', error)
        setClients([])
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchClients()
  }, []);

  const handleClientSelect = (client: Client) => {
    setSelectedClient({ ...client })
  }

  const filteredClients = clients.length > 0
  ? clients.filter(client =>
      [client.id.toString(), client.name, client.socialName, client.cpf, client.email, client.contactNumbers[0]]
        .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  : []

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setClientAddError("")

    try {
      const [response] = await Promise.all([
        apiService.post(apiEndpoint, newClient),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);

      if (response.data.error) {
        throw new Error(response.data.error)
      }
      setClients(prevClients => Array.isArray(prevClients) ? [...prevClients, response.data] : [response.data])
      setAddIsOpen(false);
      setNewClient(DefaultClient)
    } catch (error: any) {
      setClientAddError(error.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const [response] = await Promise.all([
        apiService.put(`${apiEndpoint}/${selectedClient.id}`, selectedClient),
        new Promise(resolve => setTimeout(resolve, 1500))
      ])

      if (response.data.error) {
        throw new Error(response.data.error)
      }
      setClients(prevClients => 
        Array.isArray(prevClients) 
          ? prevClients.map(client => client.id === selectedClient.id ? response.data : client)
          : [response.data]
      )
      setUpdateIsOpen(false)
    } catch (error: any) {
      console.error("Error updating client:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const [response] = await Promise.all([
        apiService.delete(`${apiEndpoint}/${selectedClient.id}`),
        new Promise(resolve => setTimeout(resolve, 1500))
      ])

      if (response.data.error) {
        throw new Error(response.data.error)
      }
      setClients(prevClients => 
        Array.isArray(prevClients) 
          ? prevClients.filter(client => client.id !== selectedClient.id)
          : []
      )
    } catch (error: any) {
      console.error("Error removing client:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='min-h-[70vh] flex flex-col'>
      <CardHeader>
        <CardTitle className='text-2xl'>Clientes</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {isInitialLoading ? (
          <div className="flex-1 flex justify-center items-center h-64">
            <LoaderCircle className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <>
            <div className="flex justify-end items-center mb-6">
              <div className="flex items-center flex-1 max-w-lg">
                <Input
                  placeholder="Procure por ID, Nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mr-2"
                />
              </div>
              <div className="flex gap-2">
                <Dialog open={addIsOpen} onOpenChange={setAddIsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default">
                      <Plus /> Adicionar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddClient} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          value={newClient.name}
                          onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="socialName">Nome Social</Label> 
                        <Input
                          id="socialName"
                          value={newClient.socialName}
                          onChange={(e) => setNewClient({...newClient, socialName: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="cpf">CPF</Label> 
                        <Input
                          id="cpf"
                          value={newClient.cpf}
                          onChange={(e) => setNewClient({...newClient, cpf: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label> 
                        <Input
                          id="email"
                          value={newClient.email}
                          onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="contactNumbers">Contato</Label> 
                        <Input
                          id="contactNumbers"
                          value={newClient.contactNumbers}
                          onChange={(e) => setNewClient({...newClient, contactNumbers: [e.target.value]})}
                          required
                        />
                      </div>
                      
                      <div className='flex justify-end gap-1'>
                        <DialogClose asChild>
                          <Button type="button" variant="secondary" disabled={isLoading}>
                            Cancelar
                          </Button>
                        </DialogClose>
                        <Button 
                          type="submit" 
                          disabled={isLoading || !newClient.name}
                        >
                          {isLoading ? (
                            <>
                              <LoaderCircle className="animate-spin mr-2" />
                              Aguarde
                            </>
                          ) : (
                            'Adicionar'
                          )}
                        </Button>
                      </div>
                      {clientAddError && <p className="text-red-500 text-sm">{clientAddError}</p>}
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
              </div>
            </div>
            {clients.length > 0 ? (
              filteredClients.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Nome Social</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell className="font-medium">{client.socialName}</TableCell>
                        <TableCell className="font-medium">{client.cpf}</TableCell>
                        <TableCell className="font-medium">{client.email}</TableCell>
                        <TableCell className="font-medium">{client.contactNumbers}</TableCell>
                        <TableCell>
                          <div className='flex gap-1'>
                            <Button 
                              variant="ghost" 
                              className='p-1 opacity-70' 
                              onClick={() => {
                                handleClientSelect(client)
                                setUpdateIsOpen(true)
                              }}
                            >
                              <UserPen />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  className='p-1 opacity-70' 
                                  onClick={() => handleClientSelect(client)}
                                >
                                  <UserRoundX />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Excluir Usuário</DialogTitle>
                                  <DialogDescription>Tem certeza que deseja excluir?</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleRemoveClient} className="space-y-4">
                                  <div>
                                    <Label htmlFor="id">ID</Label>
                                    <Input
                                      disabled
                                      id="id"
                                      value={selectedClient.id}
                                      onChange={(e) => setSelectedClient({...selectedClient, id: Number(e.target.value)})}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="name">Nome</Label>
                                    <Input
                                      disabled
                                      id="name"
                                      value={selectedClient.name}
                                      onChange={(e) => setSelectedClient({...selectedClient, name: e.target.value})}
                                      required
                                    />
                                  </div>
                                  
                                  <div className='flex justify-end gap-1'>
                                    <DialogClose asChild>
                                      <Button type="button" variant="secondary" disabled={isLoading}>
                                        Cancelar
                                      </Button>
                                    </DialogClose>
                                    <Button type="submit" className='bg-red-800' disabled={isLoading}>
                                      {isLoading ? (
                                        <>
                                          <LoaderCircle className="animate-spin mr-2" />
                                          Aguarde
                                        </>
                                      ) : (
                                        'Excluir'
                                      )}
                                    </Button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-4">Nenhum cliente encontrado com os critérios de busca.</p>
              )
            ) : (
              <NotFound name='Nenhum cliente encontrado.'/>
            )}
            <Pagination name="clientes" filterPage={filterPage} totalUsersPage={totalClientsPage} />
          </>
        )}
        <Dialog open={updateIsOpen} onOpenChange={setUpdateIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atualizar Usuário</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateClient} className="space-y-4">
              <div>
                <Label htmlFor="id">ID</Label>
                <Input
                  disabled
                  id="id"
                  value={selectedClient.id}
                  onChange={(e) => setSelectedClient({...selectedClient, id: Number(e.target.value)})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={selectedClient.name}
                  onChange={(e) => setSelectedClient({...selectedClient, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="socialName">Nome Social</Label>
                <Input
                  id="socialName"
                  value={selectedClient.socialName}
                  onChange={(e) => setSelectedClient({...selectedClient, socialName: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={selectedClient.cpf}
                  onChange={(e) => setSelectedClient({...selectedClient, cpf: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={selectedClient.email}
                  onChange={(e) => setSelectedClient({...selectedClient, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactNumbers">Contato</Label>
                <Input
                  id="contactNumbers"
                  value={selectedClient.contactNumbers}
                  onChange={(e) => setSelectedClient({...selectedClient, contactNumbers: [e.target.value]})}
                  required
                />
              </div>
              
              <div className='flex justify-end gap-1'>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" disabled={isLoading}>
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <LoaderCircle className="animate-spin mr-2" />
                      Aguarde
                    </>
                  ) : (
                    'Atualizar'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
