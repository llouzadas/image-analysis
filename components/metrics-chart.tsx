"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface MetricsSummary {
  totalLogins: number
  totalFailedAttempts: number
  totalRegistrations: number
  avgResponseTime: number
  totalTokenRefreshes: number
}

export function MetricsChart() {
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true)
        const response = await fetch("/api/metrics")

        if (!response.ok) {
          throw new Error("Falha ao carregar métricas")
        }

        const data = await response.json()
        setMetrics(data.summary)
        setError(null)
      } catch (err) {
        console.error("Erro ao buscar métricas:", err)
        setError("Não foi possível carregar as métricas")
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()

    // Atualiza as métricas a cada 30 segundos
    const interval = setInterval(fetchMetrics, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="rounded-md bg-destructive/15 p-4 text-center text-destructive">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Logins bem-sucedidos</div>
        <div className="text-sm text-muted-foreground">{metrics?.totalLogins}</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Tentativas falhas</div>
        <div className="text-sm text-muted-foreground">{metrics?.totalFailedAttempts}</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Novos registros</div>
        <div className="text-sm text-muted-foreground">{metrics?.totalRegistrations}</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Atualizações de token</div>
        <div className="text-sm text-muted-foreground">{metrics?.totalTokenRefreshes}</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Tempo médio de resposta</div>
        <div className="text-sm text-muted-foreground">{metrics?.avgResponseTime}ms</div>
      </div>
    </div>
  )
}
