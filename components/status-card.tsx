import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatusCardProps {
  title: string
  value: string
  description: string
  icon: ReactNode
  status: "healthy" | "warning" | "error"
}

export function StatusCard({ title, value, description, icon, status }: StatusCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {icon}
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full",
                  status === "healthy" && "bg-green-500",
                  status === "warning" && "bg-yellow-500",
                  status === "error" && "bg-red-500",
                )}
              />
            </div>
            <div>
              <p className="text-sm font-medium leading-none">{title}</p>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
