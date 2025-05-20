import React from 'react'
import { Accordion } from "@/components/ui/accordion"
import OrderItem from './OrderItem'

interface OrderListProps {
  orders: any[] // Replace with proper type
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {orders.map((order) => (
        <OrderItem key={order._id} order={order} />
      ))}
    </Accordion>
  )
}

export default React.memo(OrderList)