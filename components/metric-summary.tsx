"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

interface MetricDataPoint {
  timestamp: Date
  value: number
}

interface MetricResult {
  id: string
  label: string
  dataPoints: MetricDataPoint[]
}

interface MetricSummaryProps {
  metric: MetricResult
}

export function MetricSummary({ metric }: MetricSummaryProps) {
  // Calcula o valor atual (último ponto de dados)
  const currentValue = metric.dataPoints.length > 0 ? metric.dataPoints[metric.dataPoints.length - 1].value : 0

  // Calcula o valor anterior (penúltimo ponto de dados)
  const previousValue = metric.dataPoints.length > 1 ? metric.dataPoints[metric.dataPoints.length - 2].value : 0

  // Calcula a variação percentual
  const percentChange = previousValue !== 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0

  // Determina se a variação é positiva ou negativa
  const isPositive = percentChange >= 0

  // Formata o valor atual com base no tipo de métrica
  const formatValue = (value: number) => {
    if (metric.id.includes("Utilization")) {
      return `${value.toFixed(1)}%`
    } else if (metric.id.includes("Time")) {
      return `${value.toFixed(0)}ms`
    } else {
      return value.toFixed(0)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{formatValue(currentValue)}</div>
          {percentChange !== 0 && (
            <div className={`flex items-center text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {isPositive ? <ArrowUpIcon className="mr-1 h-3 w-3" /> : <ArrowDownIcon className="mr-1 h-3 w-3" />}
              {Math.abs(percentChange).toFixed(1)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
