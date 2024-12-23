import { PropertyStats } from "@/lib/types"
import { MetricsCard } from "./metrics-card"
import { ArrowRightLeft, DollarSign, Home, UserCheck } from 'lucide-react'

interface MetricsDisplayProps {
  stats: PropertyStats
}

export function MetricsDisplay({ stats }: MetricsDisplayProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <MetricsCard
        title="Check-ins"
        value={stats.totalCheckIns}
        icon={UserCheck}
      />
      <MetricsCard
        title="Check-outs"
        value={stats.totalCheckOuts}
        icon={ArrowRightLeft}
      />
      <MetricsCard
        title="Available Properties"
        value={stats.availableProperties}
        icon={Home}
      />
      <MetricsCard
        title="Total Earnings"
        value={`$${stats.totalEarnings.toLocaleString()}`}
        icon={DollarSign}
      />
    </div>
  )
}

