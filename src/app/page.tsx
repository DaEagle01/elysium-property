"use client"

import { useEffect, useState } from "react"
import { PropertyForm } from "@/components/property-form"
import { PropertyList } from "@/components/property-list"
import { MetricsDisplay } from "@/components/metrics-display"
import { Property, PropertyStats } from "@/lib/types"
import { getStorageData, setStorageData } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { toast } from "sonner"

export default function DashboardPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [stats, setStats] = useState<PropertyStats>({
    totalCheckIns: 0,
    totalCheckOuts: 0,
    availableProperties: 0,
    rentedProperties: 0,
    totalEarnings: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await getStorageData()
        setProperties(data.properties)
        setStats(data.stats)
      } catch {
        setError("Failed to load dashboard data. Please try again.")
        toast.error("Failed to load dashboard data", {
          style: {
            backgroundColor: "#f8d7da",
            color: "#721c24",
          },
        });
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const updateStats = (properties: Property[]) => {
    const newStats: PropertyStats = {
      totalCheckIns: properties.filter((p) => p.checkInDate).length,
      totalCheckOuts: properties.filter((p) => p.checkOutDate).length,
      availableProperties: properties.filter((p) => p.status === "Available").length,
      rentedProperties: properties.filter((p) => p.status === "Rented").length,
      totalEarnings: properties.reduce((sum, p) => sum + p.rentAmount, 0),
    }
    setStats(newStats)
    setStorageData({ properties, stats: newStats })
  }

  const handleAddProperty = (property: Property) => {
    const updatedProperties = [...properties, property]
    setProperties(updatedProperties)
    updateStats(updatedProperties)
    toast.success("Property added successfully", {
      style: {
        backgroundColor: "#d4edda",
        color: "#155724",
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between animate-slide-in">
        <div className="space-y-1 mb-4 sm:mb-0">
          <h2 className="text-2xl font-semibold tracking-tight">
            Property Management Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage and monitor your properties
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PropertyForm onSubmit={handleAddProperty} />
        </div>
      </div>

      <MetricsDisplay stats={stats} />

      <div className="space-y-4 animate-slide-in">
        <h3 className="text-lg font-medium">Properties</h3>
        <PropertyList properties={properties} />
      </div>
    </div>
  )
}
