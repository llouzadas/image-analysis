import { NextResponse } from "next/server"

// Esta é uma API simulada para métricas
// Em um ambiente real, você se conectaria à sua API .NET ou AWS CloudWatch

export async function GET() {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Gera dados aleatórios para simular métricas em tempo real
  const currentDate = new Date()
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate)
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  }).reverse()

  // Gera dados de login para os últimos 7 dias
  const loginData = last7Days.map((date) => ({
    date,
    successful: Math.floor(Math.random() * 150) + 100,
    failed: Math.floor(Math.random() * 20) + 5,
  }))

  // Gera dados de registro para os últimos 7 dias
  const registrationData = last7Days.map((date) => ({
    date,
    count: Math.floor(Math.random() * 15) + 5,
  }))

  // Gera dados de tempo de resposta para os últimos 7 dias
  const responseTimeData = last7Days.map((date) => ({
    date,
    avgTime: Math.floor(Math.random() * 100) + 80,
    p95Time: Math.floor(Math.random() * 150) + 120,
  }))

  // Gera dados de uso de token para os últimos 7 dias
  const tokenUsageData = last7Days.map((date) => ({
    date,
    refreshes: Math.floor(Math.random() * 200) + 150,
    validations: Math.floor(Math.random() * 500) + 400,
  }))

  // Resumo das métricas
  const summary = {
    totalLogins: loginData.reduce((sum, day) => sum + day.successful, 0),
    totalFailedAttempts: loginData.reduce((sum, day) => sum + day.failed, 0),
    totalRegistrations: registrationData.reduce((sum, day) => sum + day.count, 0),
    avgResponseTime: Math.floor(responseTimeData.reduce((sum, day) => sum + day.avgTime, 0) / responseTimeData.length),
    totalTokenRefreshes: tokenUsageData.reduce((sum, day) => sum + day.refreshes, 0),
  }

  return NextResponse.json({
    summary,
    loginData,
    registrationData,
    responseTimeData,
    tokenUsageData,
  })
}
