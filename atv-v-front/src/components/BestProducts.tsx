import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import ApiService from '@/services/ApiService';
import { Product } from "@/types/Product";
import { LoaderCircle } from "lucide-react";

export function BestProductsTable() {
  const apiService = new ApiService()
  const apiEndpoint = "private/orders"

  const [orders, setProducts] = useState<{ product: Product; totalSold: number }[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsInitialLoading(true)
      try {
        const [ordersResponse] = await Promise.all([
          apiService.get(`${apiEndpoint}/topProducts`),
          new Promise(resolve => setTimeout(resolve, 1500))
        ]);

        setProducts(Array.isArray(ordersResponse.data) ? ordersResponse.data : [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setProducts([])
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchProducts()
  }, []);

  return (
    <Card className='max-h-[70vh] flex flex-col'>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className='text-2xl'>Produtos Mais Vendidos</CardTitle>
          <button className="text-blue-700 hover:underline">Ver todos</button>
        </div>
        
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {isInitialLoading ? (
          <div className="flex-1 flex justify-center items-center h-64 min-h-[40vh]">
            <LoaderCircle className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <>
      <Table>
        <TableHeader>
          <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço Unitário</TableHead>
              <TableHead>Qtd Vendida</TableHead>
              <TableHead>Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.product.name} className="border-t">
                <TableCell className="py-3 font-medium">{order.product.name}</TableCell>
                <TableCell className="py-3 font-medium">{order.product.category}</TableCell>
                <TableCell className="py-3 font-medium">R$ {order.product.price.toFixed(2)}</TableCell>
                <TableCell className="py-3 font-medium">{order.totalSold}</TableCell>
                <TableCell className="py-3 font-medium">R$ {(order.product.price * order.totalSold).toFixed(2) }</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </>
        )}
      </CardContent>
      </Card>
  )
}

