"use client"

import { useState, useEffect } from "react"
import { Activity, Users, Server, GitBranch, Clock, Shield, BarChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeploymentHistory } from "@/components/deployment-history"
import { ProjectStructure } from "@/components/project-structure"
import { UserManagement } from "@/components/user-management"
import { StatusCard } from "@/components/status-card"
import { AuthTester } from "@/components/auth-tester"
import { MetricsChart } from "@/components/metrics-chart"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [healthStatus, setHealthStatus] = useState<"healthy" | "warning" | "error">("healthy")
  const router = useRouter()

  // Simula o carregamento inicial do dashboard
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)

      toast({
        title: "Dashboard carregado",
        description: "Todas as funcionalidades estão disponíveis agora.",
      })
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Simula verificação periódica de saúde da API
  useEffect(() => {
    const checkApiHealth = () => {
      // Simula uma verificação de saúde da API
      const statuses = ["healthy", "warning", "error"] as const
      const randomStatus = statuses[Math.floor(Math.random() * 10) % 3]

      // Na maioria das vezes, mantém como "healthy"
      const newStatus = Math.random() > 0.8 ? randomStatus : "healthy"

      if (newStatus !== healthStatus) {
        setHealthStatus(newStatus)

        if (newStatus === "warning") {
          toast({
            variant: "default",
            title: "Alerta de API",
            description: "A API está apresentando lentidão.",
          })
        } else if (newStatus === "error") {
          toast({
            variant: "destructive",
            title: "Erro de API",
            description: "A API está com problemas de conexão.",
          })
        } else if (newStatus === "healthy" && healthStatus !== "healthy") {
          toast({
            title: "API Normalizada",
            description: "A API voltou a operar normalmente.",
          })
        }
      }
    }

    // Verifica a saúde da API a cada 30 segundos
    const interval = setInterval(checkApiHealth, 30000)

    return () => clearInterval(interval)
  }, [healthStatus])

  // Navega para a página do CloudWatch
  const handleViewCloudWatch = () => {
    router.push("/cloudwatch")
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-semibold">AuthApi Dashboard</h1>
        <div className="ml-auto">
          <Button onClick={handleViewCloudWatch} variant="outline" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>CloudWatch</span>
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatusCard
            title="Ambiente"
            value="AuthApi-env"
            description="AWS Elastic Beanstalk"
            icon={<Server className="h-4 w-4 text-muted-foreground" />}
            status={healthStatus}
          />
          <StatusCard
            title="Região"
            value="us-east-1"
            description="N. Virginia"
            icon={<GitBranch className="h-4 w-4 text-muted-foreground" />}
            status="healthy"
          />
          <StatusCard
            title="Última Implantação"
            value="2 horas atrás"
            description="v-42 (main)"
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            status="healthy"
          />
          <StatusCard
            title="Usuários Ativos"
            value="124"
            description="+12% da semana passada"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            status="healthy"
          />
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="deployments">Implantações</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="testing">Teste de Auth</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Saúde da API</CardTitle>
                  <CardDescription>Desempenho das últimas 24 horas</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px]">
                  {loading ? (
                    <Skeleton className="h-full w-full" />
                  ) : (
                    <div className="h-full w-full rounded-md border">
                      <div className="flex h-full items-center justify-center">
                        <Activity
                          className={`h-16 w-16 ${
                            healthStatus === "healthy"
                              ? "text-green-500"
                              : healthStatus === "warning"
                                ? "text-yellow-500"
                                : "text-red-500"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estrutura do Projeto</CardTitle>
                  <CardDescription>Arquivos e diretórios principais</CardDescription>
                </CardHeader>
                <CardContent>{loading ? <Skeleton className="h-[200px] w-full" /> : <ProjectStructure />}</CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Implantações Recentes</CardTitle>
                  <CardDescription>Últimas 5 implantações na AWS</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : (
                    <DeploymentHistory limit={5} />
                  )}
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Estatísticas de Autenticação</CardTitle>
                    <CardDescription>Últimos 7 dias</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleViewCloudWatch}>
                    <BarChart className="mr-2 h-4 w-4" />
                    CloudWatch
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-8 w-full" />
                      ))}
                    </div>
                  ) : (
                    <MetricsChart />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="deployments">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Implantações</CardTitle>
                <CardDescription>Todas as implantações no AWS Elastic Beanstalk</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <Skeleton key={index} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <DeploymentHistory limit={10} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>Gerencie usuários registrados</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-10 w-[200px]" />
                      <Skeleton className="h-10 w-[100px]" />
                    </div>
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-12 w-full" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <UserManagement />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testing">
            <Card>
              <CardHeader>
                <CardTitle>Teste de Autenticação</CardTitle>
                <CardDescription>Teste os endpoints de autenticação</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-[200px] w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <AuthTester />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
