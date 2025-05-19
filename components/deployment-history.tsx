"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface Deployment {
  id: string
  date: string
  status: "success" | "warning" | "failed"
  branch: string
  commit: string
  message: string
  deployer: string
}

interface DeploymentHistoryProps {
  limit?: number
}

export function DeploymentHistory({ limit = 10 }: DeploymentHistoryProps) {
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDeployments() {
      try {
        setLoading(true)
        const response = await fetch("/api/deployments")

        if (!response.ok) {
          throw new Error("Falha ao carregar dados de implantação")
        }

        const data = await response.json()
        setDeployments(data.deployments.slice(0, limit))
        setError(null)
      } catch (err) {
        console.error("Erro ao buscar implantações:", err)
        setError("Não foi possível carregar o histórico de implantações")
      } finally {
        setLoading(false)
      }
    }

    fetchDeployments()
  }, [limit])

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="rounded-md bg-destructive/15 p-4 text-center text-destructive">{error}</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Versão</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Branch</TableHead>
          <TableHead className="hidden md:table-cell">Commit</TableHead>
          <TableHead className="hidden lg:table-cell">Mensagem</TableHead>
          <TableHead className="hidden lg:table-cell">Responsável</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deployments.map((deployment) => (
          <TableRow key={deployment.id}>
            <TableCell className="font-medium">{deployment.id}</TableCell>
            <TableCell>{deployment.date}</TableCell>
            <TableCell>
              <Badge
                variant={
                  deployment.status === "success"
                    ? "default"
                    : deployment.status === "warning"
                      ? "outline"
                      : "destructive"
                }
              >
                {deployment.status === "success" ? "sucesso" : deployment.status === "warning" ? "alerta" : "falha"}
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">{deployment.branch}</TableCell>
            <TableCell className="hidden md:table-cell">{deployment.commit}</TableCell>
            <TableCell className="hidden lg:table-cell max-w-[200px] truncate">{deployment.message}</TableCell>
            <TableCell className="hidden lg:table-cell">{deployment.deployer}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
