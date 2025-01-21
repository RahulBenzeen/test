import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"

interface OrderFiltersProps {
  statusFilter: string
  dateFilter: string
  onStatusChange: (value: string) => void
  onDateChange: (value: string) => void
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  statusFilter,
  dateFilter,
  onStatusChange,
  onDateChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Select value={statusFilter?.toLowerCase()} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Orders</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="shipped">Shipped</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
        </SelectContent>
      </Select>

      <Select value={dateFilter} onValueChange={onDateChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Filter by date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="last30">Last 30 Days</SelectItem>
          <SelectItem value="last90">Last 90 Days</SelectItem>
          <SelectItem value="thisYear">This Year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default React.memo(OrderFilters)