'use client'

import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchOrdersByUser } from "../../store/orderSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import OrderList from './order/OrderList'
import EmptyOrderState from './order/EmptyOrderState'
import LoadingState from './order/LoadingState'
import ErrorState from './order/ErrorState'
import OrderFilter from './order/OrderFilter'

export default function CustomerOrderHistory() {
  const dispatch = useAppDispatch()
  const { orders, status } = useAppSelector((state) => state.order)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  useEffect(() => {
    dispatch(fetchOrdersByUser())
  }, [dispatch])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || order.orderStatus.toLocaleLowerCase() === statusFilter
    
    const matchesDate = dateFilter === "all" || (() => {
      const orderDate = new Date(order.createdAt)
      const now = new Date()
      switch(dateFilter) {
        case "last30":
          return now.getTime() - orderDate.getTime() <= 30 * 24 * 60 * 60 * 1000
        case "last90":
          return now.getTime() - orderDate.getTime() <= 90 * 24 * 60 * 60 * 1000
        case "thisYear":
          return orderDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })()

    return matchesSearch && matchesStatus && matchesDate
  })

  if (status === "loading") return <LoadingState />
  if (status === "failed") return <ErrorState onRetry={() => dispatch(fetchOrdersByUser())} />

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4 max-w-6xl">
        <Card className="w-full shadow-xl border-0">
          <CardHeader className="border-b bg-white rounded-t-xl p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
                Order History
              </CardTitle>
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search orders by ID or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 border-gray-200 h-9 sm:h-10 text-xs sm:text-sm"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <OrderFilter
              statusFilter={statusFilter}
              dateFilter={dateFilter}
              onStatusChange={setStatusFilter}
              onDateChange={setDateFilter}
            />
            
            {filteredOrders.length === 0 ? (
              <EmptyOrderState hasSearch={searchTerm.length > 0} />
            ) : (
              <OrderList orders={filteredOrders} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}