import { Users, Layers, LoaderCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";

export function ProductSummary() {
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const getProductInfo = async () => {
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

    getProductInfo()
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo de Produtos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
      {isInitialLoading ? (
          <div className="flex-1 flex justify-center items-center h-64">
            <LoaderCircle className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Número de fornecedores</p>
              <p className="text-xl font-semibold">999</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Layers className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Número de categorias</p>
              <p className="text-xl font-semibold">999</p>
            </div>
          </div>
        </div>
        </>
          )}
      </CardContent>
    </Card>
  )
}
