import { PurchaseReport } from "./PurchaseReport"
import { InventoryChart } from "./InventoryChart"
import { BestProductsTable } from "./BestProducts"
import { InventorySummary } from "./InventorySummary"
import { ProductSummary } from "./ProductSummary"
import { LowStock } from "./LowStock"
import { BestBuyers } from "./BestBuyers"
import { BestProductBuyers } from "./BestProductBuyers"
import { BestServiceBuyers } from "./BestServiceBuyers"
import { BestServicesTable } from "./BestServices"

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 space-y-8">
        <PurchaseReport />
        <InventoryChart />
        <BestBuyers />
        <BestProductBuyers />
        <BestServiceBuyers />
        <BestProductsTable />
        <BestServicesTable />
      </div>
      <div className="space-y-8">
        <ProductSummary />
        <LowStock />
      </div>
    </div>
  )
}

