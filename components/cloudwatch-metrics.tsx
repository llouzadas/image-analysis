"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { MetricChart } from "@/components/metric-chart"
import { MetricSummary } from "@/components/metric-summary"

interface MetricDataPoint {
  timestamp: Date
  value: number
}

interface MetricResult {
  id: string
  label: string
  dataPoints: MetricDataPoint[]
}

export function CloudWatchMetrics() {
  const [activeTab, setActiveTab] = useState("authentication")
  const [timeRange, setTimeRange] = useState("24h")
  const [metrics, setMetrics] = useState<MetricResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<"cloudwatch" | "simulated">("simulated")

  // Busca métricas do CloudWatch
  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/cloudwatch?type=${activeTab}&timeRange=${timeRange}`)

      if (!response.ok) {
        throw new Error("Falha ao carregar métricas do CloudWatch")
      }

      const data = await response.json()

      // Converte as strings de timestamp para objetos Date
      const processedMetrics = data.metrics.map((metric: any) => ({
        ...metric,
        dataPoints: metric.dataPoints.map((point: any) => ({
          ...point,
          timestamp: new Date(point.timestamp),
        })),
      }))

      setMetrics(processedMetrics)
      setDataSource(data.source)

      if (data.source === "simulated") {
        toast({
          title: "Dados simulados",
          description: "Usando dados simulados porque as credenciais AWS não estão configuradas.",
          variant: "default",
        })
      }

      setError(null)
    } catch (err) {
      console.error("Erro ao buscar métricas:", err)
      setError("Não foi possível carregar as métricas do CloudWatch")
      toast({
        title: "Erro",
        description: "Não foi possível carregar as métricas do CloudWatch.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Busca métricas quando a aba ou o intervalo de tempo mudam
  useEffect(() => {
    fetchMetrics()

    // Configura atualização automática a cada 5 minutos
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [activeTab, timeRange])

  // Renderiza o conteúdo com base no estado de carregamento
  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-[300px] w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[100px] w-full" />
          </div>
        </div>
      )
    }

    if (error) {
      return <div className="rounded-md bg-destructive/15 p-4 text-center text-destructive">{error}</div>
    }

    return (
      <div className="space-y-6">
        {/* Gráfico principal */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {activeTab === "authentication"
                  ? "Métricas de Autenticação"
                  : activeTab === "performance"
                    ? "Métricas de Desempenho"
                    : "Métricas de Status HTTP"}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Período:</span>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="h-8 w-[120px]">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Última hora</SelectItem>
                    <SelectItem value="24h">Últimas 24h</SelectItem>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardDescription>
              {dataSource === "cloudwatch"
                ? "Dados reais do AWS CloudWatch"
                : "Dados simulados (credenciais AWS não configuradas)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <MetricChart metrics={metrics} />
            </div>
          </CardContent>
        </Card>

        {/* Resumo das métricas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricSummary key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="authentication">Autenticação</TabsTrigger>
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
          <TabsTrigger value="httpStatus">Status HTTP</TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="mt-4">
          {renderContent()}
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          {renderContent()}
        </TabsContent>

        <TabsContent value="httpStatus" className="mt-4">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
