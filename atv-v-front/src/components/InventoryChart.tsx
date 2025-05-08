"use client"

import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react";
import { LoaderCircle } from 'lucide-react'


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

const labels = ["Jan", "Fev", "Mar", "Abr", "Maio", "Jun", "Jul", "Ago", "Set", "Out"]

const data = {
  labels,
  datasets: [
    {
      label: "Entrada",
      data: [2500, 2700, 1500, 900, 1300, 400, 2500, 1500, 1400, 900],
      backgroundColor: "rgba(59, 130, 246, 0.5)",
    },
    {
      label: "Saída",
      data: [1900, 1900, 2200, 1400, 1800, 1100, 1900, 1200, 1300, 1400],
      backgroundColor: "rgba(34, 197, 94, 0.5)",
    },
  ],
}

export function InventoryChart() {
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Entradas e Saídas</CardTitle>
        <Select defaultValue="annual">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="annual">Anual</SelectItem>
            <SelectItem value="monthly">Mensal</SelectItem>
            <SelectItem value="weekly">Semanal</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
      {isInitialLoading ? (
          <div className="flex-1 flex justify-center items-center h-64">
            <LoaderCircle className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <>
        <Bar options={options} data={data} height={100} />
        </>
          )}
      </CardContent>
    </Card>
  )
}

