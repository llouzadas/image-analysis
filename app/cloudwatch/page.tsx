import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudWatchMetrics } from "@/components/cloudwatch-metrics"

export default function CloudWatchPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <h1 className="text-lg font-semibold">AWS CloudWatch - Métricas</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Métricas do AWS CloudWatch</CardTitle>
            <CardDescription>Monitoramento em tempo real da aplicação AuthApi no AWS Elastic Beanstalk</CardDescription>
          </CardHeader>
          <CardContent>
            <CloudWatchMetrics />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
