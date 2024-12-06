'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

interface Order {
  id: string
  customerName: string
  total: number
  status: string
}

const dummyOrders: Order[] = [
  { id: '1', customerName: 'John Doe', total: 59.97, status: 'Pending' },
  { id: '2', customerName: 'Jane Smith', total: 89.98, status: 'Shipped' },
  { id: '3', customerName: 'Bob Johnson', total: 119.97, status: 'Delivered' },
]

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(dummyOrders)

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleUpdateStatus(order.id, 'Shipped')} className="mr-2">
                    Mark as Shipped
                  </Button>
                  <Button onClick={() => handleUpdateStatus(order.id, 'Delivered')}>
                    Mark as Delivered
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

