import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticationMetrics, getPerformanceMetrics, getHttpStatusMetrics } from "@/lib/aws-cloudwatch"

export async function GET(request: NextRequest) {
  try {
    // Obtém os parâmetros da consulta
    const searchParams = request.nextUrl.searchParams
    const metricType = searchParams.get("type") || "authentication"
    const timeRange = (searchParams.get("timeRange") || "24h") as "1h" | "24h" | "7d" | "30d"

    let metrics

    // Busca as métricas com base no tipo solicitado
    switch (metricType) {
      case "authentication":
        metrics = await getAuthenticationMetrics(timeRange)
        break
      case "performance":
        metrics = await getPerformanceMetrics(timeRange)
        break
      case "httpStatus":
        metrics = await getHttpStatusMetrics(timeRange)
        break
      default:
        return NextResponse.json({ error: "Tipo de métrica inválido" }, { status: 400 })
    }

    // Verifica se as credenciais da AWS estão configuradas
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      // Se não estiverem configuradas, retorna dados simulados
      return NextResponse.json({
        source: "simulated",
        message: "Usando dados simulados porque as credenciais AWS não estão configuradas",
        metrics: generateSimulatedMetrics(metricType, timeRange),
      })
    }

    return NextResponse.json({
      source: "cloudwatch",
      metrics,
    })
  } catch (error) {
    console.error("Erro ao buscar métricas do CloudWatch:", error)

    // Em caso de erro, retorna dados simulados
    return NextResponse.json({
      source: "simulated",
      message: "Erro ao buscar métricas do CloudWatch. Usando dados simulados.",
      metrics: generateSimulatedMetrics("authentication", "24h"),
      error: error instanceof Error ? error.message : "Erro desconhecido",
    })
  }
}

// Função para gerar dados simulados quando as credenciais AWS não estão disponíveis
function generateSimulatedMetrics(metricType: string, timeRange: string) {
  const now = new Date()
  const dataPoints = []
  let numPoints = 0

  // Determina o número de pontos com base no intervalo de tempo
  switch (timeRange) {
    case "1h":
      numPoints = 12 // 5 minutos por ponto
      break
    case "24h":
      numPoints = 24 // 1 hora por ponto
      break
    case "7d":
      numPoints = 7 // 1 dia por ponto
      break
    case "30d":
      numPoints = 30 // 1 dia por ponto
      break
    default:
      numPoints = 24
  }

  // Gera timestamps para os pontos de dados
  const timestamps = []
  for (let i = 0; i < numPoints; i++) {
    const timestamp = new Date(now)

    if (timeRange === "1h") {
      timestamp.setMinutes(now.getMinutes() - (numPoints - i) * 5)
    } else if (timeRange === "24h") {
      timestamp.setHours(now.getHours() - (numPoints - i))
    } else {
      timestamp.setDate(now.getDate() - (numPoints - i))
    }

    timestamps.push(timestamp)
  }

  // Gera métricas simuladas com base no tipo
  if (metricType === "authentication") {
    return [
      {
        id: "loginSuccess",
        label: "Successful Logins",
        dataPoints: timestamps.map((timestamp) => ({
          timestamp,
          value: Math.floor(Math.random() * 50) + 30,
        })),
      },
      {
        id: "loginFailure",
        label: "Failed Logins",
        dataPoints: timestamps.map((timestamp) => ({
          timestamp,
          value: Math.floor(Math.random() * 10) + 1,
        })),
      },
      {
        id: "userRegistrations",
        label: "User Registrations",
        dataPoints: timestamps.map((timestamp) => ({
          timestamp,
          value: Math.floor(Math.random() * 5) + 1,
        })),
      },
      {
        id: "tokenRefreshes",
        label: "Token Refreshes",
        dataPoints: timestamps.map((timestamp) => ({
          timestamp,
          value: Math.floor(Math.random() * 100) + 50,
        })),
      },
    ]
  } else if (metricType === "performance") {
    return [
      {
        id: "cpuUtilization",
        label: "CPU Utilization",
        dataPoints: timestamps.map((timestamp) => ({
          timestamp,
          value: Math.floor(Math.random() * 30) + 10,
        })),
      },
      {
        id: "memoryUtilization",
        label: "Memory Utilization",
        dataPoints: timestamps.map((timestamp) => ({
          timestamp,
          value: Math.floor(Math.random() * 40) + 30,
        })),
      },
      {
        id: "requestCount",
        label: "Request Count",
        dataPoints: timestamps.map((timestamp) => ({
          timestamp,
          value: Math.floor(Math.random() * 200) + 100,
        })),
      },
      {
        id: "responseTime",
        label: "Response Time (ms)",
        dataPoints: timestamps.map((timestamp) => ({
          timestamp,
          value: Math.floor(Math.random() * 100) + 50,
        })),
      },
    ]
  } else if (metricType === "httpStatus") {
    return [
      {
        id: "status2xx",
        label: "2xx Responses",
        dataPoints: timestamps.map((timestamp) => ({
          timestamp,
          value: Math.floor(Math.random() * 150) + 100,
        })),
      },
      {
        id: "status4xx",
        label: "4xx Responses",
        dataPoints: timestamps.map((timestamp) => ({
          timestamp,
          value: Math.floor(Math.random() * 20) + 5,
        })),
      },
      {
        id: "status5xx",
        label: "5xx Responses",
        dataPoints: timestamps.map((timestamp) => ({
          timestamp,
          value: Math.floor(Math.random() * 5),
        })),
      },
    ]
  }

  return []
}
