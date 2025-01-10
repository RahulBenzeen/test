'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchAllOrders, updateOrderStatus } from '../../store/allOrdersSlice'  // Import deleteOrder action
import { Loader2, Trash2 } from 'lucide-react'
import { deleteOrders } from '../../store/orderSlice'
import showToast from '../../utils/toast/toastUtils'

export default function OrderManagement() {
  // Fetch orders and status from Redux store
  const { orders, status } = useAppSelector(state => state.allOrders)
  const dispatch = useAppDispatch()

  // State for managing confirmation dialogs
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean
    orderId: string | null
    newStatus: string | null
  }>({
    open: false,
    orderId: null,
    newStatus: null
  })

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    orderId: string | null
  }>({
    open: false,
    orderId: null
  })

  // State for handling the loader during status update
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // Fetch orders when component mounts
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllOrders())
    }
  }, [dispatch, status])

  // Handle opening the confirmation dialog
  const handleOpenDialog = (orderId: string, newStatus: string) => {
    setConfirmationDialog({
      open: true,
      orderId,
      newStatus
    })
  }

  // Handle opening the delete confirmation dialog
  const handleOpenDeleteDialog = (orderId: string) => {
    setDeleteDialog({
      open: true,
      orderId
    })
  }

  // Handle closing the dialogs
  const handleCloseDialog = () => {
    setConfirmationDialog({
      open: false,
      orderId: null,
      newStatus: null
    })
    setDeleteDialog({
      open: false,
      orderId: null
    })
  }

  // Handle updating the order status
  const handleConfirmUpdateStatus = async () => {
    try {
      if (confirmationDialog.orderId && confirmationDialog.newStatus) {
        setUpdatingStatus(true)  // Set loading state to true before the update
        
        // Dispatch the status update action
        await dispatch(updateOrderStatus({
          id: confirmationDialog.orderId,
          orderStatus: confirmationDialog.newStatus
        }))
  
        setUpdatingStatus(false)  // Set loading state to false after the update
  
        // Show success toast
        showToast(`Order marked as ${confirmationDialog.newStatus} successfully`, 'success')
  
        // Re-fetch orders after status update to update the list in the store
        await dispatch(fetchAllOrders())  // Await for fetch to complete
      }
      handleCloseDialog() // Close the dialog after confirming
    } catch  {
      setUpdatingStatus(false)  // Ensure loader is hidden if there's an error
      // Show error toast with the error message
      showToast(`Failed to update the order status`, 'error')
    }
  }
  

  // Handle deleting the order
// Handle deleting the order
const handleConfirmDelete = async () => {
  try {
    if (deleteDialog.orderId) {
      // Dispatch delete order action
      await dispatch(deleteOrders(deleteDialog.orderId))

      // Show success toast
      showToast("Order deleted successfully", 'success')

      // Re-fetch orders after deletion to update the list in the store
      dispatch(fetchAllOrders())
    }
    handleCloseDialog()  // Close the dialog after confirming deletion
  } catch  {
    // Show error toast with the error message
    showToast(`Failed to delete the order`, 'error')
  }
}

  // Show loading state while orders are being fetched or updated
  if (status === 'loading' || updatingStatus) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Show error message if fetching failed
  if (status === 'failed') {
    return <div>Error: Failed to load orders</div>
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
              <TableHead>Customer Name</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.user?.name}</TableCell>
                <TableCell>
                  {/* Display product names and quantities */}
                  {order.products.map((product) => (
                    <div key={product._id}>
                      {product.name} (x{product.quantity})
                    </div>
                  ))}
                </TableCell>
                <TableCell>${order.totalPrice?.toFixed(2)}</TableCell>
                <TableCell>{order.orderStatus}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleOpenDialog(order._id, 'Shipped')}
                    className="mr-2"
                    disabled={order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered'}
                  >
                    Mark as Shipped
                  </Button>
                  <Button
                    onClick={() => handleOpenDialog(order._id, 'Delivered')}
                    disabled={order.orderStatus === 'Delivered'}
                  >
                    Mark as Delivered
                  </Button>
                  <Button
                    onClick={() => handleOpenDeleteDialog(order._id)}
                    className="ml-2"
                    variant="ghost"
                  >
                    <Trash2 className="h-5 w-5" /> {/* Delete Icon */}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Confirmation Dialog for Order Status Update */}
      <Dialog open={confirmationDialog.open} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to mark this order as {confirmationDialog.newStatus}?</DialogTitle>
            <DialogDescription>
              This action will update the order status to {confirmationDialog.newStatus}. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmUpdateStatus}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Order Deletion */}
      <Dialog open={deleteDialog.open} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this order?</DialogTitle>
            <DialogDescription>
              This action will permanently delete the order. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
