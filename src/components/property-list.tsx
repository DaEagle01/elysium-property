"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Property, PropertyType, RentalStatus } from "@/lib/types"
import { format } from "date-fns"
import { Badge } from "./ui/badge"
import { Input } from "@/components/ui/input"
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface PropertyListProps {
  properties: Property[]
  isLoading?: boolean
  error?: string | null
}

export function PropertyList({ properties, isLoading = false, error = null }: PropertyListProps) {
  const [typeFilter, setTypeFilter] = useState<PropertyType | "All">("All")
  const [statusFilter, setStatusFilter] = useState<RentalStatus | "All">("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredProperties = properties.filter((property) => {
    const matchesType = typeFilter === "All" || property.type === typeFilter
    const matchesStatus = statusFilter === "All" || property.status === statusFilter
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProperties = filteredProperties.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          placeholder="Search by property name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-[300px]"
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value as PropertyType | "All")}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="House">House</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as RentalStatus | "All")}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Rented">Rented</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border animate-fade-in overflow-x-auto">
        <Table>
          <TableHeader className="animate-slide-in">
            <TableRow>
              <TableHead className="min-w-[150px]">Property Name</TableHead>
              <TableHead className="min-w-[100px]">Type</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[200px]">Address</TableHead>
              <TableHead className="min-w-[100px]">Rent Amount</TableHead>
              <TableHead className="min-w-[100px]">Check-in</TableHead>
              <TableHead className="min-w-[100px]">Check-out</TableHead>
              <TableHead className="min-w-[150px]">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProperties.map((property) => (
              <TableRow key={property.id} className="animate-slide-in">
                <TableCell className="font-medium">{property.name}</TableCell>
                <TableCell>{property.type}</TableCell>
                <TableCell>
                  <Badge
                    variant={property.status === "Available" ? "default" : "secondary"}
                  >
                    {property.status}
                  </Badge>
                </TableCell>
                <TableCell>{property.address}</TableCell>
                <TableCell>${property.rentAmount.toLocaleString()}</TableCell>
                <TableCell>
                  {property.checkInDate
                    ? format(new Date(property.checkInDate), "PP")
                    : "-"}
                </TableCell>
                <TableCell>
                  {property.checkOutDate
                    ? format(new Date(property.checkOutDate), "PP")
                    : "-"}
                </TableCell>
                <TableCell>
                  {format(new Date(property.lastUpdated), "PP")}
                </TableCell>
              </TableRow>
            ))}
            {currentProperties.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No properties found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-4 space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      )}
    </div>
  )
}
