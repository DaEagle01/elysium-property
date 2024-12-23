import { Property, PropertyStats } from "./types"

const STORAGE_KEY = "propertyManagement"

interface StorageData {
  properties: Property[]
  stats: PropertyStats
}

export function getStorageData(): StorageData {
  if (typeof window === "undefined") return { properties: [], stats: getInitialStats() }
  
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    const initial = { properties: [], stats: getInitialStats() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }
  
  return JSON.parse(data)
}

export function setStorageData(data: StorageData) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function getInitialStats(): PropertyStats {
  return {
    totalCheckIns: 0,
    totalCheckOuts: 0,
    availableProperties: 0,
    rentedProperties: 0,
    totalEarnings: 0
  }
}

