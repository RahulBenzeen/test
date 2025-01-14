'use client'

import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchOrdersByUser } from "../../store/orderSlice"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion"
import { Loader2, ShoppingCart, AlertCircle, Search, Package, Truck, CheckCircle } from 'lucide-react'
import showToast from "../../utils/toast/toastUtils"

export default function CustomerOrderHistory() {
  const dispatch = useAppDispatch()
  const { orders, status } = useAppSelector((state) => state.order)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredOrders, setFilteredOrders] = useState(orders)

  useEffect(() => {
    dispatch(fetchOrdersByUser())
  }, [dispatch])

  useEffect(() => {
    const filtered = orders.filter((order) =>
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredOrders(filtered)
  }, [searchTerm, orders])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Package className="w-5 h-5 text-yellow-500" />
      case 'shipped': return <Truck className="w-5 h-5 text-blue-500" />
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (status === "failed") {
    showToast("Failed to fetch orders. Please try again.", "error")
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Failed to Load Orders</h2>
        <p className="text-gray-600 mb-4">We encountered an error while loading your orders.</p>
        <Button onClick={() => dispatch(fetchOrdersByUser())}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Your Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search orders by ID or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "No orders match your search. Try a different term." : "You haven't placed any orders yet. Start shopping now!"}
              </p>
              <Button variant="outline" onClick={() => window.location.href = "/shop"}>
                Shop Now
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {filteredOrders.map((order) => (
                <AccordionItem key={order._id} value={order._id ?? ''}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(order.orderStatus)}
                        <span className="font-semibold text-gray-800">Order #{order._id?.slice(-6)}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(order.orderStatus)}>
                          {order.orderStatus}
                        </Badge>
                        <span className="text-gray-600">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <h4 className="font-semibold mb-2">Order Details</h4>
                      <p>Total: <span className="font-bold">${order.totalPrice.toFixed(2)}</span></p>
                      <p>Payment Status: {order.paymentStatus}</p>
                      <p>Payment Method: {order.paymentMethod}</p>
                      <h4 className="font-semibold mt-4 mb-2">Products</h4>
                      <ul className="space-y-2">
                        {order.products.map((product) => (
                          <li key={product.product} className="flex justify-between items-center">
                            <span>{product.name} (x{product.quantity})</span>
                            <span>${(product.price * product.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                      <h4 className="font-semibold mt-4 mb-2">Shipping Address</h4>
                      <p>{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.country}, {order.shippingAddress.postalCode}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
