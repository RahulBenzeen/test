import React, { useState } from 'react'
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, CheckCircle, AlertCircle, Clock, Ban } from 'lucide-react'
import { Button } from "@/components/ui/button"
import OrderProgress from './OrderProgress'
import CancelOrderDialog from './CancelOrderDialog'
import { useAppDispatch } from "../../../store/hooks"
import showToast from "../../../utils/toast/toastUtils"
import { cancelOrder } from '../../../store/orderSlice'

const OrderItem = ({ order }) => {
  const dispatch = useAppDispatch()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
      case 'processing': return <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
      case 'shipped': return <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
      case 'delivered': return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
      case 'cancelled': return <Ban className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
      default: return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const canCancel = ['pending', 'processing'].includes(order.orderStatus.toLowerCase())
  const retryPayments = ['pending'].includes(order.orderStatus.toLowerCase())

  const handleCancelOrder = async (reason: string) => {
    setIsCancelling(true)
    try {
      await dispatch(cancelOrder(order._id)).unwrap()
      showToast('Order cancelled successfully', 'success')
      setShowCancelDialog(false)
    } catch  {
      showToast('Failed to cancel order', 'error')
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <>
      <AccordionItem value={order._id ?? ''} className="border rounded-lg overflow-hidden">
        <AccordionTrigger className="hover:no-underline px-2 sm:px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-2 sm:gap-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {getStatusIcon(order.orderStatus.toLowerCase())}
              <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-800 text-sm sm:text-base">
                  Order #{order._id?.slice(-6)}
                </span>
                <span className="text-xs sm:text-sm text-gray-500">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-2 sm:space-x-4">
              <span className="text-sm sm:text-base font-medium text-gray-700">
                ${order.totalPrice.toFixed(2)}
              </span>
              <Badge className={`${getStatusColor(order.orderStatus.toLowerCase())} border text-xs sm:text-sm whitespace-nowrap`}>
                {order.orderStatus}
              </Badge>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-2 sm:p-4 space-y-4 sm:space-y-6">
            <OrderProgress status={order.orderStatus.toLowerCase()} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">Order Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Payment Status</span>
                      <span className="font-medium">{order.paymentStatus}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-medium">${order.totalPrice.toFixed(2)}</span>
                    </div>
                    {order.cancelReason && (
                      <div className="pt-2 border-t">
                        <span className="text-gray-600 text-xs sm:text-sm">Cancellation Reason:</span>
                        <p className="text-xs sm:text-sm mt-1 text-gray-800">{order.cancelReason}</p>
                      </div>
                    )}
                  </div>
                  {canCancel && (
                    <div className="mt-4 pt-4 border-t">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.preventDefault()
                          setShowCancelDialog(true)
                        }}
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Cancel Order
                      </Button>
                    </div>
                  )}
                  {retryPayments && (
                    <div className="mt-4 pt-4 border-t">
                      <Button 
                        variant="default" 
                        size="sm"
                        className="w-full"
                   
                      >
                       Retry Payment
                      </Button>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">Shipping Address</h4>
                  <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-gray-800">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    <p>{order.shippingAddress.country}, {order.shippingAddress.postalCode}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">Products</h4>
                <div className="space-y-3">
                  {order.products.map((product) => (
                    <div key={product.product} className="flex items-center justify-between p-2 bg-white rounded-md">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={product.product.images?.[0]?.secure_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-xs sm:text-sm line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium text-xs sm:text-sm whitespace-nowrap ml-2">
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

      <CancelOrderDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelOrder}
        isLoading={isCancelling}
      />
    </>
  )
}

export default React.memo(OrderItem)