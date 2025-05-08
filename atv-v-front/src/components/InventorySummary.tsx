import { Package, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function InventorySummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Inventário</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Qtd em mãos</p>
              <p className="text-xl font-semibold">999</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Para receber</p>
              <p className="text-xl font-semibold">999</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

