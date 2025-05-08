import React, { useEffect, useState } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { LoaderCircle, Plus, Pencil, Trash2 } from 'lucide-react'
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
import { Filter } from 'lucide-react'
import ApiService from '@/services/ApiService'
import { DialogDescription } from '@radix-ui/react-dialog'
import NotFound from './NotFound'
import { useSearchParams } from 'react-router-dom'
import Pagination from './Pagination'
import { Service, DefaultService } from '@/types/Service'

export default function ServicesTable() {
  const apiService = new ApiService()
  const apiEndpoint = "private/services"
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const take = parseInt(import.meta.env.VITE_TABLE_TAKE);

  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState<Service>(DefaultService);
  const [selectedService, setSelectedService] = useState<Service>(DefaultService);

  const [searchTerm, setSearchTerm] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [serviceAddError, setServiceAddError] = useState("")
  const [addIsOpen, setAddIsOpen] = useState(false)
  const [updateIsOpen, setUpdateIsOpen] = useState(false)
  const [filterPage, setFilterPage] = useState(page)
  const [totalServicesPage, setTotalServicesPage] = useState(1)

  useEffect(() => {
    const fetchServices = async () => {
      setIsInitialLoading(true)
      try {
        const [servicesResponse] = await Promise.all([
          apiService.get(`${apiEndpoint}`, {"take": take, "page": page}),
          new Promise(resolve => setTimeout(resolve, 1500))
        ]);

        setServices(Array.isArray(servicesResponse.data.services) ? servicesResponse.data.services : [])
        setTotalServicesPage(servicesResponse.data.total? Math.ceil(servicesResponse.data.total / take) : 1)
      } catch (error) {
        console.error('Error fetching data:', error)
        setServices([])
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchServices()
  }, []);

  const handleServiceSelect = (service: Service) => {
    setSelectedService({ ...service })
  }

  const filteredServices = services.length > 0
  ? services.filter(service =>
      [service.id.toString(), service.name, service.duration, service.price.toString()]
        .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  : []

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setServiceAddError("")

    try {
      const [response] = await Promise.all([
        apiService.post(apiEndpoint, newService),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);

      if (response.data.error) {
        throw new Error(response.data.error)
      }
      setServices(prevServices => Array.isArray(prevServices) ? [...prevServices, response.data] : [response.data])
      setAddIsOpen(false);
      setNewService(DefaultService)
    } catch (error: any) {
      setServiceAddError(error.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const [response] = await Promise.all([
        apiService.put(`${apiEndpoint}/${selectedService.id}`, selectedService),
        new Promise(resolve => setTimeout(resolve, 1500))
      ])

      if (response.data.error) {
        throw new Error(response.data.error)
      }
      setServices(prevServices => 
        Array.isArray(prevServices) 
          ? prevServices.map(service => service.id === selectedService.id ? response.data : service)
          : [response.data]
      )
      setUpdateIsOpen(false)
    } catch (error: any) {
      console.error("Error updating service:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveService = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const [response] = await Promise.all([
        apiService.delete(`${apiEndpoint}/${selectedService.id}`),
        new Promise(resolve => setTimeout(resolve, 1500))
      ])

      if (response.data.error) {
        throw new Error(response.data.error)
      }
      setServices(prevServices => 
        Array.isArray(prevServices) 
          ? prevServices.filter(service => service.id !== selectedService.id)
          : []
      )
    } catch (error: any) {
      console.error("Error removing service:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='min-h-[70vh] flex flex-col'>
      <CardHeader>
        <CardTitle className='text-2xl'>Serviços</CardTitle>
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
                      <DialogTitle>Adicionar Novo Serviço</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddService} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          value={newService.name}
                          onChange={(e) => setNewService({...newService, name: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="duration">Duração</Label> 
                        <Input
                          id="duration"
                          value={newService.duration}
                          onChange={(e) => setNewService({...newService, duration: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="price">Preço</Label> 
                        <Input
                          id="price"
                          type="number"
                          value={newService.price}
                          onChange={(e) => setNewService({...newService, price: Number(e.target.value)})}
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
                          disabled={isLoading || !newService.name}
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
                      {serviceAddError && <p className="text-red-500 text-sm">{serviceAddError}</p>}
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
              </div>
            </div>
            {services.length > 0 ? (
              filteredServices.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Duração</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell>{service.duration}</TableCell>
                        <TableCell>R$ {service.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className='flex gap-1'>
                            <Button 
                              variant="ghost" 
                              className='p-1 opacity-70' 
                              onClick={() => {
                                handleServiceSelect(service)
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
                                  onClick={() => handleServiceSelect(service)}
                                >
                                  <Trash2 />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Excluir Serviço</DialogTitle>
                                  <DialogDescription>Tem certeza que deseja excluir?</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleRemoveService} className="space-y-4">
                                  <div>
                                    <Label htmlFor="id">ID</Label>
                                    <Input
                                      disabled
                                      id="id"
                                      value={selectedService.id}
                                      onChange={(e) => setSelectedService({...selectedService, id: Number(e.target.value)})}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="name">Nome</Label>
                                    <Input
                                      disabled
                                      id="name"
                                      value={selectedService.name}
                                      onChange={(e) => setSelectedService({...selectedService, name: e.target.value})}
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
                <p className="text-center py-4">Nenhum serviço encontrado com os critérios de busca.</p>
              )
            ) : (
              <NotFound name='Nenhum serviço encontrado.'/>
            )}
            <Pagination name="serviços" filterPage={filterPage} totalUsersPage={totalServicesPage} />
          </>
        )}
        <Dialog open={updateIsOpen} onOpenChange={setUpdateIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atualizar Serviço</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateService} className="space-y-4">
              <div>
                <Label htmlFor="id">ID</Label>
                <Input
                  disabled
                  id="id"
                  value={selectedService.id}
                  onChange={(e) => setSelectedService({...selectedService, id: Number(e.target.value)})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={selectedService.name}
                  onChange={(e) => setSelectedService({...selectedService, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="duration">Duração</Label>
                <Input
                  id="duration"
                  value={selectedService.duration}
                  onChange={(e) => setSelectedService({...selectedService, duration: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  type="number"
                  value={selectedService.price}
                  onChange={(e) => setSelectedService({...selectedService, price: Number(e.target.value)})}
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

