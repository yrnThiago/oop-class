import { ShoppingBag, Home, TrendingUp, LoaderCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";

export function PurchaseReport() {
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const getPurchaseReport = async () => {
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

    getPurchaseReport()
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório Compras</CardTitle>
      </CardHeader>
      <CardContent>
      {isInitialLoading ? (
          <div className="flex-1 flex justify-center items-center h-64">
            <LoaderCircle className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">999</p>
              <p className="text-sm text-muted-foreground">Compras</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Home className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">R$ 999</p>
              <p className="text-sm text-muted-foreground">Custo</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">R$999</p>
              <p className="text-sm text-muted-foreground">Retorno</p>
            </div>
          </div>
        </div>
        </>
          )}
      </CardContent>
    </Card>
  )
}
