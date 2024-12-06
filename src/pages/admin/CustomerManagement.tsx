'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

interface Customer {
  id: string
  name: string
  email: string
  totalOrders: number
}

const dummyCustomers: Customer[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', totalOrders: 5 },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', totalOrders: 3 },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', totalOrders: 7 },
]

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>(dummyCustomers)

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter(customer => customer.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.totalOrders}</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDeleteCustomer(customer.id)}>
                    Delete
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

