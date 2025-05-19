import { CloudWatchClient, GetMetricDataCommand, type MetricDataQuery } from "@aws-sdk/client-cloudwatch"

// Configuração do cliente CloudWatch
const createCloudWatchClient = () => {
  return new CloudWatchClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  })
}

// Tipos para métricas
export interface MetricDataPoint {
  timestamp: Date
  value: number
}

export interface MetricResult {
  id: string
  label: string
  dataPoints: MetricDataPoint[]
}

// Função para buscar dados de métricas do CloudWatch
export async function fetchCloudWatchMetrics(
  startTime: Date,
  endTime: Date,
  metricQueries: MetricDataQuery[],
): Promise<MetricResult[]> {
  try {
    const client = createCloudWatchClient()

    const command = new GetMetricDataCommand({
      StartTime: startTime,
      EndTime: endTime,
      MetricDataQueries: metricQueries,
    })

    const response = await client.send(command)

    if (!response.MetricDataResults) {
      return []
    }

    // Transforma os resultados no formato que precisamos
    return response.MetricDataResults.map((result) => {
      const dataPoints: MetricDataPoint[] = []

      if (result.Timestamps && result.Values) {
        for (let i = 0; i < result.Timestamps.length; i++) {
          dataPoints.push({
            timestamp: result.Timestamps[i],
            value: result.Values[i],
          })
        }
      }

      return {
        id: result.Id || "",
        label: result.Label || "",
        dataPoints,
      }
    })
  } catch (error) {
    console.error("Erro ao buscar métricas do CloudWatch:", error)
    throw error
  }
}

// Métricas predefinidas para a aplicação AuthApi
export const AUTH_API_METRICS = {
  // Métricas de CPU e memória
  cpuUtilization: {
    id: "cpuUtilization",
    label: "CPU Utilization",
    metricQuery: {
      Id: "cpuUtilization",
      MetricStat: {
        Metric: {
          Namespace: "AWS/ElasticBeanstalk",
          MetricName: "CPUUtilization",
          Dimensions: [
            {
              Name: "EnvironmentName",
              Value: "AuthApi-env",
            },
          ],
        },
        Period: 300, // 5 minutos
        Stat: "Average",
      },
      ReturnData: true,
    },
  },
  memoryUtilization: {
    id: "memoryUtilization",
    label: "Memory Utilization",
    metricQuery: {
      Id: "memoryUtilization",
      MetricStat: {
        Metric: {
          Namespace: "AWS/ElasticBeanstalk",
          MetricName: "MemoryUtilization",
          Dimensions: [
            {
              Name: "EnvironmentName",
              Value: "AuthApi-env",
            },
          ],
        },
        Period: 300, // 5 minutos
        Stat: "Average",
      },
      ReturnData: true,
    },
  },

  // Métricas de requisições
  requestCount: {
    id: "requestCount",
    label: "Request Count",
    metricQuery: {
      Id: "requestCount",
      MetricStat: {
        Metric: {
          Namespace: "AWS/ElasticBeanstalk",
          MetricName: "RequestCount",
          Dimensions: [
            {
              Name: "EnvironmentName",
              Value: "AuthApi-env",
            },
          ],
        },
        Period: 300, // 5 minutos
        Stat: "Sum",
      },
      ReturnData: true,
    },
  },
  responseTime: {
    id: "responseTime",
    label: "Response Time",
    metricQuery: {
      Id: "responseTime",
      MetricStat: {
        Metric: {
          Namespace: "AWS/ElasticBeanstalk",
          MetricName: "ApplicationLatency",
          Dimensions: [
            {
              Name: "EnvironmentName",
              Value: "AuthApi-env",
            },
          ],
        },
        Period: 300, // 5 minutos
        Stat: "Average",
      },
      ReturnData: true,
    },
  },

  // Métricas de status HTTP
  status2xx: {
    id: "status2xx",
    label: "2xx Responses",
    metricQuery: {
      Id: "status2xx",
      MetricStat: {
        Metric: {
          Namespace: "AWS/ElasticBeanstalk",
          MetricName: "StatusCode2XX",
          Dimensions: [
            {
              Name: "EnvironmentName",
              Value: "AuthApi-env",
            },
          ],
        },
        Period: 300, // 5 minutos
        Stat: "Sum",
      },
      ReturnData: true,
    },
  },
  status4xx: {
    id: "status4xx",
    label: "4xx Responses",
    metricQuery: {
      Id: "status4xx",
      MetricStat: {
        Metric: {
          Namespace: "AWS/ElasticBeanstalk",
          MetricName: "StatusCode4XX",
          Dimensions: [
            {
              Name: "EnvironmentName",
              Value: "AuthApi-env",
            },
          ],
        },
        Period: 300, // 5 minutos
        Stat: "Sum",
      },
      ReturnData: true,
    },
  },
  status5xx: {
    id: "status5xx",
    label: "5xx Responses",
    metricQuery: {
      Id: "status5xx",
      MetricStat: {
        Metric: {
          Namespace: "AWS/ElasticBeanstalk",
          MetricName: "StatusCode5XX",
          Dimensions: [
            {
              Name: "EnvironmentName",
              Value: "AuthApi-env",
            },
          ],
        },
        Period: 300, // 5 minutos
        Stat: "Sum",
      },
      ReturnData: true,
    },
  },

  // Métricas personalizadas para autenticação (assumindo que você as configurou no CloudWatch)
  loginSuccess: {
    id: "loginSuccess",
    label: "Successful Logins",
    metricQuery: {
      Id: "loginSuccess",
      MetricStat: {
        Metric: {
          Namespace: "AuthApi/Authentication",
          MetricName: "SuccessfulLogins",
          Dimensions: [
            {
              Name: "Environment",
              Value: "Production",
            },
          ],
        },
        Period: 300, // 5 minutos
        Stat: "Sum",
      },
      ReturnData: true,
    },
  },
  loginFailure: {
    id: "loginFailure",
    label: "Failed Logins",
    metricQuery: {
      Id: "loginFailure",
      MetricStat: {
        Metric: {
          Namespace: "AuthApi/Authentication",
          MetricName: "FailedLogins",
          Dimensions: [
            {
              Name: "Environment",
              Value: "Production",
            },
          ],
        },
        Period: 300, // 5 minutos
        Stat: "Sum",
      },
      ReturnData: true,
    },
  },
  userRegistrations: {
    id: "userRegistrations",
    label: "User Registrations",
    metricQuery: {
      Id: "userRegistrations",
      MetricStat: {
        Metric: {
          Namespace: "AuthApi/Authentication",
          MetricName: "UserRegistrations",
          Dimensions: [
            {
              Name: "Environment",
              Value: "Production",
            },
          ],
        },
        Period: 300, // 5 minutos
        Stat: "Sum",
      },
      ReturnData: true,
    },
  },
  tokenRefreshes: {
    id: "tokenRefreshes",
    label: "Token Refreshes",
    metricQuery: {
      Id: "tokenRefreshes",
      MetricStat: {
        Metric: {
          Namespace: "AuthApi/Authentication",
          MetricName: "TokenRefreshes",
          Dimensions: [
            {
              Name: "Environment",
              Value: "Production",
            },
          ],
        },
        Period: 300, // 5 minutos
        Stat: "Sum",
      },
      ReturnData: true,
    },
  },
}

// Função para obter métricas de autenticação
export async function getAuthenticationMetrics(timeRange: "1h" | "24h" | "7d" | "30d") {
  // Calcula o intervalo de tempo
  const endTime = new Date()
  let startTime: Date

  switch (timeRange) {
    case "1h":
      startTime = new Date(endTime.getTime() - 60 * 60 * 1000) // 1 hora atrás
      break
    case "24h":
      startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000) // 24 horas atrás
      break
    case "7d":
      startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 dias atrás
      break
    case "30d":
      startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 dias atrás
      break
    default:
      startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000) // 24 horas por padrão
  }

  // Métricas de autenticação
  const metricQueries = [
    AUTH_API_METRICS.loginSuccess.metricQuery,
    AUTH_API_METRICS.loginFailure.metricQuery,
    AUTH_API_METRICS.userRegistrations.metricQuery,
    AUTH_API_METRICS.tokenRefreshes.metricQuery,
  ]

  return fetchCloudWatchMetrics(startTime, endTime, metricQueries)
}

// Função para obter métricas de desempenho
export async function getPerformanceMetrics(timeRange: "1h" | "24h" | "7d" | "30d") {
  // Calcula o intervalo de tempo
  const endTime = new Date()
  let startTime: Date

  switch (timeRange) {
    case "1h":
      startTime = new Date(endTime.getTime() - 60 * 60 * 1000) // 1 hora atrás
      break
    case "24h":
      startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000) // 24 horas atrás
      break
    case "7d":
      startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 dias atrás
      break
    case "30d":
      startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 dias atrás
      break
    default:
      startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000) // 24 horas por padrão
  }

  // Métricas de desempenho
  const metricQueries = [
    AUTH_API_METRICS.cpuUtilization.metricQuery,
    AUTH_API_METRICS.memoryUtilization.metricQuery,
    AUTH_API_METRICS.requestCount.metricQuery,
    AUTH_API_METRICS.responseTime.metricQuery,
  ]

  return fetchCloudWatchMetrics(startTime, endTime, metricQueries)
}

// Função para obter métricas de status HTTP
export async function getHttpStatusMetrics(timeRange: "1h" | "24h" | "7d" | "30d") {
  // Calcula o intervalo de tempo
  const endTime = new Date()
  let startTime: Date

  switch (timeRange) {
    case "1h":
      startTime = new Date(endTime.getTime() - 60 * 60 * 1000) // 1 hora atrás
      break
    case "24h":
      startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000) // 24 horas atrás
      break
    case "7d":
      startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 dias atrás
      break
    case "30d":
      startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 dias atrás
      break
    default:
      startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000) // 24 horas por padrão
  }

  // Métricas de status HTTP
  const metricQueries = [
    AUTH_API_METRICS.status2xx.metricQuery,
    AUTH_API_METRICS.status4xx.metricQuery,
    AUTH_API_METRICS.status5xx.metricQuery,
  ]

  return fetchCloudWatchMetrics(startTime, endTime, metricQueries)
}
