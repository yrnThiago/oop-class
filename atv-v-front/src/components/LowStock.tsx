import { Package, LoaderCircle } from 'lucide-react'
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function LowStock() {
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const items = [
    { name: "Ração", stock: 7 },
    { name: "Petisco Carne", stock: 9 },
    { name: "Bolinha", stock: 10 },
  ]

  useEffect(() => {
    const getLowStockProducts = async () => {
      setIsInitialLoading(true)
      try {
        await Promise.all([
          new Promise(resolve => setTimeout(resolve, 1500))
        ]);
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsInitialLoading(false)
      }
    }

    getLowStockProducts()
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Produtos Baixo Estoque</CardTitle>
        <Button variant="link">Ver todos</Button>
      </CardHeader>
      <CardContent className="space-y-4">
      {isInitialLoading ? (
          <div className="flex-1 flex justify-center items-center h-64">
            <LoaderCircle className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <>
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-secondary rounded-lg">
                <Package className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">Estoque restante: {item.stock}</p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
              Baixo Estoque
            </span>
          </div>
        ))}
        </>
          )}
      </CardContent>
    </Card>
  )
}

