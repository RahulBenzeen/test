import React from 'react'
import { AccordionItem, AccordionTrigger, AccordionContent } from "../../../components/ui/accordion"
import { Badge } from "../../../components/ui/badge"
import { Package, Truck, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import OrderProgress from './OrderProgress'

const OrderItem = ({ order}) => {

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />
      case 'processing': return <Package className="w-5 h-5 text-blue-500" />
      case 'shipped': return <Truck className="w-5 h-5 text-indigo-500" />
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <AccordionItem value={order._id ?? ''} className="border rounded-lg overflow-hidden">
      <AccordionTrigger className="hover:no-underline px-4 py-3">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-4">
            {getStatusIcon(order.orderStatus.toLowerCase())}
            <div className="flex flex-col items-start">
              <span className="font-semibold text-gray-800">Order #{order._id?.slice(-6)}</span>
              <span className="text-sm text-gray-500">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden md:block font-medium text-gray-700">
              ${order.totalPrice.toFixed(2)}
            </span>
            <Badge className={`${getStatusColor(order.orderStatus)} border`}>
              {order.orderStatus}
            </Badge>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="p-4 space-y-6">
          <OrderProgress status={order.orderStatus.toLowerCase()} />
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Status</span>
                    <span className="font-medium">{order.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-medium">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3">Shipping Address</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-800">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>{order.shippingAddress.country}, {order.shippingAddress.postalCode}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">Products</h4>
              <div className="space-y-3">
                {order.products.map((product) => (
                  <div key={product.product} className="flex items-center justify-between p-2 bg-white rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={product.product.images?.[0]?.secure_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium">
                      ${(product.price * product.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default React.memo(OrderItem)