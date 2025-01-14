'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { fetchAllUsers, deleteUser } from '../../store/adminSlice'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog'
import { Trash2, Loader2 } from 'lucide-react' // Import Trash2 and Loader2 from lucide-react
import showToast from '../../utils/toast/toastUtils'

interface Customer {
  id: string
  name: string
  email: string
  numberOfOrders: number
  role?: string
  _id?: string
}

export default function CustomerManagement() {
  const { users, status } = useAppSelector((state) => state.users)
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    customerId: null as string | null,
  })

  const dispatch = useAppDispatch()

  // Use effect to update customers when users data from Redux changes
  const [customers, setCustomers] = useState<Customer[]>(users)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllUsers())
    }
  }, [dispatch, status])

  // Update customers whenever the users state in Redux store changes
  useEffect(() => {
    setCustomers(users)
  }, [users])

  const handleDeleteCustomer = (id: string) => {
    setDeleteConfirmation({ isOpen: true, customerId: id })
  }

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, customerId: null })
  }

  const confirmDelete = () => {
    if (deleteConfirmation.customerId) {
  
      dispatch(deleteUser(deleteConfirmation.customerId))
       showToast('Customer deleted successfully', 'success') // Show success toast
      // Update the local customers list to immediately reflect the deletion
      setCustomers(customers.filter(customer => customer._id !== deleteConfirmation.customerId))
    }
    closeDeleteConfirmation()
  }

  // Show loader if status is loading
  const isLoading = status === 'loading'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Management</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin" size={24} /> {/* Loader2 icon with spinning animation */}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id || customer.email}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.role}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.numberOfOrders}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCustomer(customer._id || '')}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Dialog for delete confirmation */}
      <Dialog open={deleteConfirmation.isOpen} onOpenChange={closeDeleteConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this customer?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the customer from the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteConfirmation}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
