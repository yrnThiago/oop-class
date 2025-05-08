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
import { Product, DefaultProduct } from '@/types/Product'

export default function ProductsTable() {
  const apiService = new ApiService()
  const apiEndpoint = "private/products"
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const take = parseInt(import.meta.env.VITE_TABLE_TAKE);

  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>(DefaultProduct);
  const [selectedProduct, setSelectedProduct] = useState<Product>(DefaultProduct);

  const [searchTerm, setSearchTerm] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [productAddError, setProductAddError] = useState("")
  const [addIsOpen, setAddIsOpen] = useState(false)
  const [updateIsOpen, setUpdateIsOpen] = useState(false)
  const [filterPage, setFilterPage] = useState(page)
  const [totalProductsPage, setTotalProductsPage] = useState(1)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsInitialLoading(true)
      try {
        const [productsResponse] = await Promise.all([
          apiService.get(`${apiEndpoint}`, {"take": take, "page": page}),
          new Promise(resolve => setTimeout(resolve, 1500))
        ]);

        setProducts(Array.isArray(productsResponse.data.products) ? productsResponse.data.products : [])
        setTotalProductsPage(productsResponse.data.total? Math.ceil(productsResponse.data.total / take) : 1)
      } catch (error) {
        console.error('Error fetching data:', error)
        setProducts([])
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchProducts()
  }, []);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct({ ...product })
  }

  const filteredProducts = products.length > 0
  ? products.filter(product =>
      [product.id.toString(), product.name, product.category, product.price.toString(), product.stock.toString()]
        .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  : []

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setProductAddError("")

    try {
      const [response] = await Promise.all([
        apiService.post(apiEndpoint, newProduct),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);

      if (response.data.error) {
        throw new Error(response.data.error)
      }
      setProducts(prevProducts => Array.isArray(prevProducts) ? [...prevProducts, response.data] : [response.data])
      setAddIsOpen(false);
      setNewProduct(DefaultProduct)
    } catch (error: any) {
      setProductAddError(error.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const [response] = await Promise.all([
        apiService.put(`${apiEndpoint}/${selectedProduct.id}`, selectedProduct),
        new Promise(resolve => setTimeout(resolve, 1500))
      ])

      if (response.data.error) {
        throw new Error(response.data.error)
      }
      setProducts(prevProducts => 
        Array.isArray(prevProducts) 
          ? prevProducts.map(product => product.id === selectedProduct.id ? response.data : product)
          : [response.data]
      )
      setUpdateIsOpen(false)
    } catch (error: any) {
      console.error("Error updating product:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const [response] = await Promise.all([
        apiService.delete(`${apiEndpoint}/${selectedProduct.id}`),
        new Promise(resolve => setTimeout(resolve, 1500))
      ])

      if (response.data.error) {
        throw new Error(response.data.error)
      }
      setProducts(prevProducts => 
        Array.isArray(prevProducts) 
          ? prevProducts.filter(product => product.id !== selectedProduct.id)
          : []
      )
    } catch (error: any) {
      console.error("Error removing product:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='min-h-[70vh] flex flex-col'>
      <CardHeader>
        <CardTitle className='text-2xl'>Produtos</CardTitle>
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
                  placeholder="Procure por ID, Nome, Categoria..."
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
                      <DialogTitle>Adicionar Novo Produto</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddProduct} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="category">Categoria</Label> 
                        <Input
                          id="category"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="price">Preço</Label> 
                        <Input
                          id="price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="stock">Estoque</Label> 
                        <Input
                          id="stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
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
                          disabled={isLoading || !newProduct.name}
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
                      {productAddError && <p className="text-red-500 text-sm">{productAddError}</p>}
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
              </div>
            </div>
            {products.length > 0 ? (
              filteredProducts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <div className='flex gap-1'>
                            <Button 
                              variant="ghost" 
                              className='p-1 opacity-70' 
                              onClick={() => {
                                handleProductSelect(product)
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
                                  onClick={() => handleProductSelect(product)}
                                >
                                  <Trash2 />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Excluir Produto</DialogTitle>
                                  <DialogDescription>Tem certeza que deseja excluir?</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleRemoveProduct} className="space-y-4">
                                  <div>
                                    <Label htmlFor="id">ID</Label>
                                    <Input
                                      disabled
                                      id="id"
                                      value={selectedProduct.id}
                                      onChange={(e) => setSelectedProduct({...selectedProduct, id: Number(e.target.value)})}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="name">Nome</Label>
                                    <Input
                                      disabled
                                      id="name"
                                      value={selectedProduct.name}
                                      onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
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
                <p className="text-center py-4">Nenhum produto encontrado com os critérios de busca.</p>
              )
            ) : (
              <NotFound name='Nenhum produto encontrado.'/>
            )}
            <Pagination name="produtos" filterPage={filterPage} totalUsersPage={totalProductsPage} />
          </>
        )}
        <Dialog open={updateIsOpen} onOpenChange={setUpdateIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atualizar Produto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <Label htmlFor="id">ID</Label>
                <Input
                  disabled
                  id="id"
                  value={selectedProduct.id}
                  onChange={(e) => setSelectedProduct({...selectedProduct, id: Number(e.target.value)})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={selectedProduct.name}
                  onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={selectedProduct.category}
                  onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  type="number"
                  value={selectedProduct.price}
                  onChange={(e) => setSelectedProduct({...selectedProduct, price: Number(e.target.value)})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock">Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  value={selectedProduct.stock}
                  onChange={(e) => setSelectedProduct({...selectedProduct, stock: Number(e.target.value)})}
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

