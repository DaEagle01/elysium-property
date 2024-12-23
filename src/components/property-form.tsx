"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Property } from "@/lib/types"
import { toast } from "sonner"

const propertyFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["Apartment", "House", "Commercial"]),
  status: z.enum(["Available", "Rented"]),
  address: z.string().min(5, "Address must be at least 5 characters"),
  rentAmount: z
    .number({ invalid_type_error: "Rent amount must be a valid number" })
    .positive("Rent amount must be greater than 0"),
  checkInDate: z.date().optional(),
  checkOutDate: z.date().optional(),
})

interface PropertyFormProps {
  onSubmit: (data: Property) => void
}

export function PropertyForm({ onSubmit }: PropertyFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof propertyFormSchema>>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: "",
      type: "Apartment",
      status: "Available",
      address: "",
      rentAmount: 0,
    },
  })

  async function handleSubmit(values: z.infer<typeof propertyFormSchema>) {
    try {
      setIsSubmitting(true)
      const property: Property = {
        id: crypto.randomUUID(),
        ...values,
        rentAmount: Number(values.rentAmount),
        checkInDate: values.checkInDate ? values.checkInDate.toISOString() : undefined,
        checkOutDate: values.checkOutDate ? values.checkOutDate.toISOString() : undefined,
        lastUpdated: new Date().toISOString(),
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
      onSubmit(property)
      setOpen(false)
      form.reset()
    } catch {
      toast.error("Failed to add property. Please try again.", {
        style: {
          backgroundColor: "#f8d7da",
          color: "#721c24",
        },
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Property</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
          <DialogDescription>
            Add a new property to your management dashboard.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 animate-slide-in">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter property name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rental Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rental status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Rented">Rented</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter property address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rent Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter rent amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="checkInDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-in Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="checkOutDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-out Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const checkInDate = form.getValues("checkInDate");
                            return date < new Date() || (checkInDate ? date < checkInDate : false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Property...
                </>
              ) : (
                "Add Property"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
