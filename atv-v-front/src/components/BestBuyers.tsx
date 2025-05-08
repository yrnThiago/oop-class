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
import { Client } from "@/types/Client";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

export function BestBuyers() {
  const navigate = useNavigate();
  const apiService = new ApiService()
  const apiEndpoint = "private/clients"

  const [clients, setClients] = useState<Client[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const fetchClients = async () => {
      setIsInitialLoading(true)
      try {
        const [clientsResponse] = await Promise.all([
          apiService.get(`${apiEndpoint}/topSpending/10`),
          new Promise(resolve => setTimeout(resolve, 1500))
        ]);

        setClients(Array.isArray(clientsResponse.data) ? clientsResponse.data : [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setClients([])
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchClients()
  }, []);

  return (
    <Card className='max-h-[70vh] flex flex-col'>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className='text-2xl'>Maiores Compradores (Gasto Total)</CardTitle>
          <button className="text-blue-700 hover:underline" onClick={() => navigate("/pedidos")}>Ver todos</button>
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
              <TableHead>Posição</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Nome Social</TableHead>
                <TableHead>Total Gasto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client, idx) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{idx + 1}॰ Lugar</TableCell>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="font-medium">{client.socialName}</TableCell>
                  <TableCell className="font-medium">R$ {client.totalSpent?.toFixed(2)}</TableCell>
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

