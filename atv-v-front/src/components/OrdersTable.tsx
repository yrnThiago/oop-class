import React, { useEffect, useState } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { LoaderCircle, Plus, Pencil, Trash2, Filter } from 'lucide-react'
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
import { useSearchParams } from 'react-router-dom'
import Pagination from './Pagination'
import { Order, DefaultOrder } from '@/types/Order'
import { Product, DefaultProduct } from '@/types/Product'
import { Service, DefaultService } from '@/types/Service'
import { OrderItem, DefaultOrderItem } from '@/types/OrderItem'
import { Client } from '@/types/Client'

export default function OrdersTable() {
  const apiService = new ApiService()
  const apiEndpoint = "private/orders"
  const apiProductsEndpoint = "private/products"
  const apiServicesEndpoint = "private/services"
  const apiClientsEndpoint = "private/clients"
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const take = parseInt(import.meta.env.VITE_TABLE_TAKE);

  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrder, setNewOrder] = useState<Order>(DefaultOrder);
  const [selectedOrder, setSelectedOrder] = useState<Order>(DefaultOrder);

  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [searchTerm, setSearchTerm] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [orderAddError, setOrderAddError] = useState("")
  const [addIsOpen, setAddIsOpen] = useState(false)
  const [updateIsOpen, setUpdateIsOpen] = useState(false)
  const [filterPage, setFilterPage] = useState(page)
  const [totalOrdersPage, setTotalOrdersPage] = useState(1)

  useEffect(() => {
    const fetchOrders = async () => {
      setIsInitialLoading(true)
      try {
        const [ordersResponse, productsResponse, servicesResponse, clientsResponse] = await Promise.all([
          apiService.get(`${apiEndpoint}`, {"take": take, "page": page}),
          apiService.get(`${apiProductsEndpoint}`, {"take": take, "page": page}),
          apiService.get(`${apiServicesEndpoint}`, {"take": take, "page": page}),
          apiService.get(`${apiClientsEndpoint}`, {"take": take, "page": page}),
          new Promise(resolve => setTimeout(resolve, 1500))
        ]);

        setOrders(Array.isArray(ordersResponse.data.orders) ? ordersResponse.data.orders : [])
        setProducts(Array.isArray(productsResponse.data.products) ? productsResponse.data.products : [])
        setServices(Array.isArray(servicesResponse.data.services) ? servicesResponse.data.services : [])
        setClients(Array.isArray(clientsResponse.data.clients) ? clientsResponse.data.clients : [])
        setTotalOrdersPage(ordersResponse.data.total? Math.ceil(ordersResponse.data.total / take) : 1)
      } catch (error) {
        console.error('Error fetching data:', error)
        setOrders([])
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchOrders()
  }, []);

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder({ ...order })
  }

  const formatDate = (dataTimestamp: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dataTimestamp));;
  }

  const filteredOrders = orders.length > 0
  ? orders.filter(order =>
      [order.id.toString(), order.client.name, order.status, order.totalAmount.toString(), order.createdAt && formatDate(order.createdAt), order.updatedAt && formatDate(order.updatedAt)]
        .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  : []

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setOrderAddError("")

    try {
      const orderData = {
        ...newOrder,
        items: newOrder.items.map(item => ({
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          product: item.product ? { id: item.product.id } : undefined,
          service: item.service ? { id: item.service.id } : undefined
        }))
      };

      const [response] = await Promise.all([
        apiService.post(apiEndpoint, orderData),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);

      if (response.data.error) {
        throw new Error(response.data.error)
      }
      setOrders(prevOrders => Array.isArray(prevOrders) ? [...prevOrders, response.data] : [response.data])
      setAddIsOpen(false);
      setNewOrder(DefaultOrder)
    } catch (error: any) {
      setOrderAddError(error.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const orderData = {
        ...selectedOrder,
        items: selectedOrder.items.map(item => ({
          id: item.id, 
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          product: item.product ? { id: item.product.id } : undefined,
          service: item.service ? { id: item.service.id } : undefined
        }))
      };

      const [response] = await Promise.all([
        apiService.put(`${apiEndpoint}/${selectedOrder.id}`, orderData),
        new Promise(resolve => setTimeout(resolve, 1500))
      ])

      if (response.data.error) {
        throw new Error(response.data.error)
      }
      setOrders(prevOrders => 
        Array.isArray(prevOrders) 
          ? prevOrders.map(order => order.id === selectedOrder.id ? response.data : order)
          : [response.data]
      )
      setUpdateIsOpen(false)
    } catch (error: any) {
      console.error("Error updating order:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const [response] = await Promise.all([
        apiService.delete(`${apiEndpoint}/${selectedOrder.id}`),
        new Promise(resolve => setTimeout(resolve, 1500))
      ])

      if (response.data.error) {
        throw new Error(response.data.error)
      }
      setOrders(prevOrders => 
        Array.isArray(prevOrders) 
          ? prevOrders.filter(order => order.id !== selectedOrder.id)
          : []
      )
    } catch (error: any) {
      console.error("Error removing order:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const orderColors: { [key in any]: string } = {
    "Pago": "bg-green-100 text-green-800",
    "Pendente": "bg-orange-100 text-orange-800",
    "Cancelado": "bg-red-100 text-red-800",
  }

  const handleAddItem = (e: React.MouseEvent) => {
    e.preventDefault();
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { ...DefaultOrderItem, order: newOrder }]
    });
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    const updatedItems = [...newOrder.items];
    if (field === 'product' || field === 'service') {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
        quantity: 1,
        totalPrice: value.price
      };
    } else if (field === 'quantity') {
      const item = updatedItems[index];
      const price = item.product ? item.product.price : (item.service ? item.service.price : 0);
      updatedItems[index] = {
        ...item,
        quantity: value,
        totalPrice: price * value
      };
    }
    setNewOrder({ 
      ...newOrder, 
      items: updatedItems,
      totalAmount: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
    });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = newOrder.items.filter((_, i) => i !== index);
    setNewOrder({ 
      ...newOrder, 
      items: updatedItems,
      totalAmount: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
    });
  };

  const handleAddUpdatedItem = () => {
    setSelectedOrder({
        ...selectedOrder,
        items: [...selectedOrder.items, { ...DefaultOrderItem, order: selectedOrder }]
    });
  };

  const handleUpdatedItemChange = (index: number, field: keyof OrderItem, value: any) => {
    const updatedItems = [...selectedOrder.items];
    if (field === 'product' || field === 'service') {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
        quantity: 1,
        totalPrice: value.price
      };
    } else if (field === 'quantity') {
      const item = updatedItems[index];
      const price = item.product ? item.product.price : (item.service ? item.service.price : 0);
      updatedItems[index] = {
        ...item,
        quantity: value,
        totalPrice: price * value
      };
    }
    setSelectedOrder({ 
      ...selectedOrder, 
      items: updatedItems,
      totalAmount: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
    });
  };

  const handleUpdatedRemoveItem = (index: number) => {
    const updatedItems = selectedOrder.items.filter((_, i) => i !== index);
    setSelectedOrder({ 
      ...selectedOrder, 
      items: updatedItems,
      totalAmount: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
    });
  };

  return (
    <Card className='min-h-[70vh] flex flex-col'>
      <CardHeader>
        <CardTitle className='text-2xl'>Pedidos</CardTitle>
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
                      <Plus className="mr-2" /> Adicionar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Pedido</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddOrder} className="space-y-4">
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          onValueChange={(value) => setNewOrder({...newOrder, status: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Escolha um status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pago">Pago</SelectItem>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <div className='flex items-center justify-between text-center'>
                          <Label htmlFor="items">Itens </Label>
                          <Button onClick={handleAddItem} type="button" variant="ghost" className='p-1 opacity-70' disabled={newOrder.items.length >= 5}>
                            <Plus />
                          </Button>
                        </div>

                        {newOrder.items.map((item, index) => (
                          <div className='flex mb-3' key={index}>
                            <Select
                              onValueChange={(value) => {
                                const [type, id] = value.split('-');
                                if (type === 'product') {
                                  const product = products.find(p => p.id === Number(id));
                                  if (product) handleItemChange(index, 'product', product);
                                } else if (type === 'service') {
                                  const service = services.find(s => s.id === Number(id));
                                  if (service) handleItemChange(index, 'service', service);
                                }
                              }}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Escolha um item" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="products-header" disabled>Produtos</SelectItem>
                                  {products.map((product) => (
                                    <SelectItem key={`product-${product.id}`} value={`product-${product.id}`}>{product.name}</SelectItem>
                                  ))}
                                  <SelectItem value="services-header" disabled>Serviços</SelectItem>
                                  {services.map((service) => (
                                    <SelectItem key={`service-${service.id}`} value={`service-${service.id}`}>{service.name}</SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                              className="w-20 ml-2"
                              placeholder="Qtd"
                            />
                            <Button type="button" onClick={() => handleRemoveItem(index)} variant="ghost" className='p-1 opacity-70' disabled={newOrder.items
.length === 1}>
                              <Trash2  />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div>
                        <Label htmlFor="client">Cliente</Label>
                        <Select
                          onValueChange={(clientId) => {
                            const newClient = clients.find(client => client.id === Number(clientId))
                            if (newClient) {
                              setNewOrder({
                                ...newOrder,
                                client: newClient
                              })
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            {clients.length > 0 ? (
                              <SelectValue placeholder="Escolha um cliente" />
                            ) : (
                              <SelectValue placeholder="Nenhum cliente criado!" />
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
                          disabled={isLoading || !newOrder.client || newOrder.items.length === 0}
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
                      {orderAddError && <p className="text-red-500 text-sm">{orderAddError}</p>}
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
              </div>
            </div>
            {orders.length > 0 ? (
              filteredOrders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Atualizado em</TableHead>
                      <TableHead>Pedido N॰</TableHead>
                      <TableHead>Cliente/Documento</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${orderColors[order.status]}`}>
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">{order.createdAt? formatDate(order.createdAt): "-"}</TableCell>
                        <TableCell className="font-medium">{order.updatedAt? formatDate(order.updatedAt): "-"}</TableCell>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell className="font-medium">{order.client.name}/{order.client.cpf}</TableCell>
                        <TableCell className="font-medium">R$ {order.totalAmount}</TableCell>
                        <TableCell>
                          <div className='flex gap-1'>
                            <Button 
                              variant="ghost" 
                              className='p-1 opacity-70' 
                              onClick={() => {
                                handleOrderSelect(order)
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
                                  onClick={() => handleOrderSelect(order)}
                                >
                                  <Trash2 />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Excluir Pedido</DialogTitle>
                                  <DialogDescription>Tem certeza que deseja excluir?</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleRemoveOrder} className="space-y-4">
                                  <div>
                                    <Label htmlFor="id">ID</Label>
                                    <Input
                                      disabled
                                      id="id"
                                      value={selectedOrder.id}
                                      onChange={(e) => setSelectedOrder({...selectedOrder, id: Number(e.target.value)})}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Input
                                      disabled
                                      id="status"
                                      value={selectedOrder.status}
                                      onChange={(e) => setSelectedOrder({...selectedOrder, status: e.target.value})}
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
                <p className="text-center py-4">Nenhum pedido encontrado com os critérios de busca.</p>
              )
            ) : (
              <NotFound name='Nenhum pedido encontrado.'/>
            )}
            <Pagination name="pedidos" filterPage={filterPage} totalUsersPage={totalOrdersPage} />
          </>
        )}
        <Dialog open={updateIsOpen} onOpenChange={setUpdateIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atualizar Pedido</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateOrder} className="space-y-4">
              <div>
                <Label htmlFor="id">ID</Label>
                <Input
                  disabled
                  id="id"
                  value={selectedOrder.id}
                  onChange={(e) => setSelectedOrder({...selectedOrder, id: Number(e.target.value)})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => setSelectedOrder({...selectedOrder, status: value})}
                  defaultValue={selectedOrder.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pago">Pago</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className='flex items-center justify-between text-center'>
                  <Label htmlFor="items">Itens </Label>
                  <Button onClick={handleAddUpdatedItem} variant="ghost" className='p-1 opacity-70' disabled={selectedOrder.items.length >= 5} >
                    <Plus />
                  </Button>
                </div>

                {selectedOrder.items.map((item, index) => (
                  <div className='flex mb-3' key={index}>
                    <Select
                      onValueChange={(value) => {
                        const [type, id] = value.split('-');
                        if (type === 'product') {
                          const product = products.find(p => p.id === Number(id));
                          if (product) handleUpdatedItemChange(index, 'product', product);
                        } else if (type === 'service') {
                          const service = services.find(s => s.id === Number(id));
                          if (service) handleUpdatedItemChange(index, 'service', service);
                        }
                      }}
                      defaultValue={item.product ? `product-${item.product.id}` : (item.service ? `service-${item.service.id}` : '')}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Escolha um item" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="products-header" disabled>Produtos</SelectItem>
                          {products.map((product) => (
                            <SelectItem key={`product-${product.id}`} value={`product-${product.id}`}>{product.name}</SelectItem>
                          ))}
                          <SelectItem value="services-header" disabled>Serviços</SelectItem>
                          {services.map((service) => (
                            <SelectItem key={`service-${service.id}`} value={`service-${service.id}`}>{service.name}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdatedItemChange(index, 'quantity', Number(e.target.value))}
                      className="w-20 ml-2"
                      placeholder="Qtd"
                    />
                    <Button type="button" onClick={() => handleUpdatedRemoveItem(index)} variant="ghost" className='p-1 opacity-70' disabled={selectedOrder.items.length === 1}>
                      <Trash2  />
                    </Button>
                  </div>
                ))}
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

