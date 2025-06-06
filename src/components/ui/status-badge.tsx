import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: "completed" | "pending" | "failed" | "active" | "inactive"
  variant?: "default" | "outline"
}

export function StatusBadge({ status, variant = "default" }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
      case "active":
        return { className: "bg-green-100 text-green-800", label: status === "completed" ? "Completado" : "Activa" }
      case "pending":
        return { className: "bg-yellow-100 text-yellow-800", label: "Pendiente" }
      case "failed":
        return { className: "bg-red-100 text-red-800", label: "Fallido" }
      case "inactive":
        return { className: "bg-gray-100 text-gray-800", label: "Inactiva" }
      default:
        return { className: "", label: status }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge className={config.className} variant={variant}>
      {config.label}
    </Badge>
  )
}
