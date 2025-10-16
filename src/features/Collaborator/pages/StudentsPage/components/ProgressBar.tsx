// Component thanh tiến độ với label

interface ProgressBarProps {
  value: number
  max: number
  label?: string
  showPercentage?: boolean
  color?: "primary" | "success" | "warning" | "error"
}

export function ProgressBar({ value, max, label, showPercentage = true, color = "primary" }: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100)

  const colorClasses = {
    primary: "bg-blue-600 dark:bg-blue-500",
    success: "bg-green-600 dark:bg-green-500",
    warning: "bg-yellow-600 dark:bg-yellow-500",
    error: "bg-red-600 dark:bg-red-500",
  }

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          {showPercentage && <span className="font-medium">{percentage}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
