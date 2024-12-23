export type PropertyType = "Apartment" | "House" | "Commercial"
export type RentalStatus = "Available" | "Rented"

export interface Property {
  id: string
  name: string
  type: PropertyType
  status: RentalStatus
  address: string
  rentAmount: number
  checkInDate?: string
  checkOutDate?: string
  lastUpdated: string
}

export interface PropertyStats {
  totalCheckIns: number
  totalCheckOuts: number
  availableProperties: number
  rentedProperties: number
  totalEarnings: number
}

