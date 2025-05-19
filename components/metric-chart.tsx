"use client"

import { useEffect, useRef } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"

// Registra os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface MetricDataPoint {
  timestamp: Date
  value: number
}

interface MetricResult {
  id: string
  label: string
  dataPoints: MetricDataPoint[]
}

interface MetricChartProps {
  metrics: MetricResult[]
}

export function MetricChart({ metrics }: MetricChartProps) {
  const chartRef = useRef<ChartJS>(null)

  // Cores para as linhas do gráfico
  const colors = [
    "rgb(59, 130, 246)", // blue-500
    "rgb(16, 185, 129)", // green-500
    "rgb(249, 115, 22)", // orange-500
    "rgb(236, 72, 153)", // pink-500
    "rgb(139, 92, 246)", // purple-500
    "rgb(239, 68, 68)", // red-500
  ]

  // Formata os dados para o Chart.js
  const formatChartData = () => {
    if (!metrics || metrics.length === 0) {
      return {
        labels: [],
        datasets: [],
      }
    }

    // Obtém todos os timestamps únicos de todas as métricas
    const allTimestamps = metrics
      .flatMap((metric) => metric.dataPoints.map((point) => point.timestamp.getTime()))
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => a - b)
      .map((timestamp) => new Date(timestamp))

    // Formata os labels com base no intervalo de tempo
    const labels = allTimestamps.map((timestamp) => {
      // Verifica o intervalo entre os timestamps para determinar o formato
      const isHourly =
        allTimestamps.length > 1 && allTimestamps[1].getTime() - allTimestamps[0].getTime() < 24 * 60 * 60 * 1000

      if (isHourly) {
        return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      } else {
        return timestamp.toLocaleDateString([], { day: "2-digit", month: "2-digit" })
      }
    })

    // Cria os datasets para cada métrica
    const datasets = metrics.map((metric, index) => {
      const color = colors[index % colors.length]

      // Mapeia os valores para os timestamps
      const data = allTimestamps.map((timestamp) => {
        const point = metric.dataPoints.find((p) => p.timestamp.getTime() === timestamp.getTime())
        return point ? point.value : null
      })

      return {
        label: metric.label,
        data,
        borderColor: color,
        backgroundColor: color.replace("rgb", "rgba").replace(")", ", 0.1)"),
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.2,
      }
    })

    return {
      labels,
      datasets,
    }
  }

  // Opções do gráfico
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  }

  // Atualiza o gráfico quando as métricas mudam
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update()
    }
  }, [metrics])

  return <Line ref={chartRef} data={formatChartData()} options={options} />
}
