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
import { Filter, Pencil, Trash2 } from "lucide-react"
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
import { Pet, DefaultPet } from '@/types/Pet'
import { Client } from '@/types/Client'

export default function PetsTable() {
  const apiService = new ApiService()
  const apiEndpoint = "private/pets"
  const apiClientsEndpoint = "private/clients"
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const take = parseInt(import.meta.env.VITE_TABLE_TAKE);

  const [pets, setPets] = useState<Pet[]>([]);
  const [newPet, setNewPet] = useState<Pet>(DefaultPet);
  const [selectedPet, setSelectedPet] = useState<Pet>(DefaultPet);
  
  const [clients, setClients] = useState<Client[]>([]);



  const [searchTerm, setSearchTerm] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [petAddError, setPetAddError] = useState("")
  const [addIsOpen, setAddIsOpen] = useState(false)
  const [updateIsOpen, setUpdateIsOpen] = useState(false)
  const [filterPage, setFilterPage] = useState(page)
  const [totalPetsPage, setTotalPetsPage] = useState(1)

  useEffect(() => {
    const fetchPets = async () => {
      setIsInitialLoading(true)
      try {
        const [petsResponse, clientsResponse] = await Promise.all([
          apiService.get(`${apiEndpoint}`, {"take": take, "page": page}),
          apiService.get(`${apiClientsEndpoint}`, {"take": take, "page": page}),
          new Promise(resolve => setTimeout(resolve, 1500))
        ]);

        setPets(Array.isArray(petsResponse.data.pets) ? petsResponse.data.pets : [])
        setClients(Array.isArray(clientsResponse.data.clients) ? clientsResponse.data.clients : [])
        setTotalPetsPage(petsResponse.data.total? Math.ceil(petsResponse.data.total / take) : 1)
      } catch (error) {
        console.error('Error fetching data:', error)
        setPets([])
        setClients([])
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchPets()
  }, []);

  const handlePetSelect = (pet: Pet) => {
    setSelectedPet({ ...pet })
  }

  const filteredPets = pets.length > 0
  ? pets.filter(pet =>
      [pet.id.toString(), pet.name, pet.gender, pet.race, pet.type, pet.client.name]
        .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  : []

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setPetAddError("")

    try {
      const [response] = await Promise.all([
        apiService.post(apiEndpoint, newPet),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);

      if (response.data.error) {
        throw new Error(response.data.error)
      }
      setPets(prevPets => Array.isArray(prevPets) ? [...prevPets, response.data] : [response.data])
      setAddIsOpen(false);
      setNewPet(DefaultPet)
    } catch (error: any) {
      setPetAddError(error.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePet = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const [response] = await Promise.all([
        apiService.put(`${apiEndpoint}/${selectedPet.id}`, selectedPet),
        new Promise(resolve => setTimeout(resolve, 1500))
      ])

      if (response.data.error) {
        throw new Error(response.data.error)
      }
      setPets(prevPets => 
        Array.isArray(prevPets) 
          ? prevPets.map(pet => pet.id === selectedPet.id ? response.data : pet)
          : [response.data]
      )
      setUpdateIsOpen(false)
    } catch (error: any) {
      console.error("Error updating pet:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemovePet = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const [response] = await Promise.all([
        apiService.delete(`${apiEndpoint}/${selectedPet.id}`),
        new Promise(resolve => setTimeout(resolve, 1500))
      ])

      if (response.data.error) {
        throw new Error(response.data.error)
      }
      setPets(prevPets => 
        Array.isArray(prevPets) 
          ? prevPets.filter(pet => pet.id !== selectedPet.id)
          : []
      )
    } catch (error: any) {
      console.error("Error removing pet:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='min-h-[70vh] flex flex-col'>
      <CardHeader>
        <CardTitle className='text-2xl'>Pets</CardTitle>
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
                      <DialogTitle>Adicionar Novo Pet</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddPet} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          value={newPet.name}
                          onChange={(e) => setNewPet({...newPet, name: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="type">Tipo</Label> 
                        <Input
                          id="type"
                          value={newPet.type}
                          onChange={(e) => setNewPet({...newPet, type: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="race">Raça</Label> 
                        <Input
                          id="race"
                          value={newPet.race}
                          onChange={(e) => setNewPet({...newPet, race: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="gender">Sexo</Label> 
                        <Input
                          id="gender"
                          value={newPet.gender}
                          onChange={(e) => setNewPet({...newPet, gender: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="client">Dono</Label>
                        <Select
                          onValueChange={(clientId) => {
                            const newClient = clients.find(client => client.id === Number(clientId))
                            if (newClient) {
                              setNewPet({
                                ...newPet,
                                client: newClient
                              })
                            }
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            {clients.length > 0 ? (
                              <SelectValue placeholder="Escolha um dono" />
                            ) : (
                              <SelectValue placeholder="Nenhum dono criado!" />
                            )}
                          </SelectTrigger>
                          {clients.length > 0 && (
                            <SelectContent>
                              <SelectGroup>
                                {clients.map((client) => (
                                  <SelectItem key={client.id} value={client.id.toString()}>{client.name}</SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          )}
                        </Select>
                      </div>
                      
                      <div className='flex justify-end gap-1'>
                        <DialogClose asChild>
                          <Button type="button" variant="secondary" disabled={isLoading}>
                            Cancelar
                          </Button>
                        </DialogClose>
                        <Button 
                          type="submit" 
                          disabled={isLoading || !newPet.name}
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
                      {petAddError && <p className="text-red-500 text-sm">{petAddError}</p>}
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
              </div>
            </div>
            {pets.length > 0 ? (
              filteredPets.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Raça</TableHead>
                      <TableHead>Sexo</TableHead>
                      <TableHead>Dono</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPets.map((pet) => (
                      <TableRow key={pet.id}>
                        <TableCell className="font-medium">{pet.name}</TableCell>
                        <TableCell className="font-medium">{pet.type}</TableCell>
                        <TableCell className="font-medium">{pet.race}</TableCell>
                        <TableCell className="font-medium">{pet.gender}</TableCell>
                        <TableCell className="font-medium">{pet.client.name}</TableCell>
                        <TableCell>
                          <div className='flex gap-1'>
                            <Button 
                              variant="ghost" 
                              className='p-1 opacity-70' 
                              onClick={() => {
                                handlePetSelect(pet)
                                setUpdateIsOpen(true)
                              }}
                            >
                              <Pencil />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  className='p-1 opacity-70' 
                                  onClick={() => handlePetSelect(pet)}
                                >
                                  <Trash2 />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Excluir Pet</DialogTitle>
                                  <DialogDescription>Tem certeza que deseja excluir?</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleRemovePet} className="space-y-4">
                                  <div>
                                    <Label htmlFor="id">ID</Label>
                                    <Input
                                      disabled
                                      id="id"
                                      value={selectedPet.id}
                                      onChange={(e) => setSelectedPet({...selectedPet, id: Number(e.target.value)})}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="name">Nome</Label>
                                    <Input
                                      disabled
                                      id="name"
                                      value={selectedPet.name}
                                      onChange={(e) => setSelectedPet({...selectedPet, name: e.target.value})}
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
                <p className="text-center py-4">Nenhum pete encontrado com os critérios de busca.</p>
              )
            ) : (
              <NotFound name='Nenhum pete encontrado.'/>
            )}
            <Pagination name="petes" filterPage={filterPage} totalUsersPage={totalPetsPage} />
          </>
        )}
        <Dialog open={updateIsOpen} onOpenChange={setUpdateIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atualizar Pet</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdatePet} className="space-y-4">
              <div>
                <Label htmlFor="id">ID</Label>
                <Input
                  disabled
                  id="id"
                  value={selectedPet.id}
                  onChange={(e) => setSelectedPet({...selectedPet, id: Number(e.target.value)})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={selectedPet.name}
                  onChange={(e) => setSelectedPet({...selectedPet, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo</Label>
                <Input
                  id="type"
                  value={selectedPet.type}
                  onChange={(e) => setSelectedPet({...selectedPet, type: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="race">Raça</Label>
                <Input
                  id="race"
                  value={selectedPet.race}
                  onChange={(e) => setSelectedPet({...selectedPet, race: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="gender">Sexo</Label>
                <Input
                  id="gender"
                  value={selectedPet.gender}
                  onChange={(e) => setSelectedPet({...selectedPet, gender: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="client">Dono</Label>
                <Select 
                  value={selectedPet.client.id.toString()}
                  onValueChange={(clientId) => {
                    const selectedClient = clients.find(client => client.id === Number(clientId))
                    if (selectedClient) {
                      setSelectedPet({
                        ...selectedPet,
                        client: selectedClient
                      })
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Escolha um dono" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>{client.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
