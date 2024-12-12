'use client'

import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Pencil, Trash2, Plus } from 'lucide-react'
import AddProduct from '../admin-product/add-product'
import UpdateProductPage from '../admin-product/update-product'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'

interface Products {
  id: string
  name: string
  price: number
  stock: number
}

const dummyProducts: Products[] = [
  { id: '1', name: 'Product 1', price: 19.99, stock: 100 },
  { id: '2', name: 'Product 2', price: 29.99, stock: 50 },
  { id: '3', name: 'Product 3', price: 39.99, stock: 75 },
]

export default function ProductManagement() {
  const [products, setProducts] = useState<Products[]>(dummyProducts)
  const [editingProduct, setEditingProduct] = useState<Products | null>(null)
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list')
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; productId: string | null }>({
    isOpen: false,
    productId: null,
  })

  const handleAddProduct = (newProduct: Omit<Products, 'id'>) => {
    setProducts([...products, { id: Date.now().toString(), ...newProduct }])
    setView('list')
  }

  const openDeleteConfirmation = (id: string) => {
    setDeleteConfirmation({ isOpen: true, productId: id })
  }

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, productId: null })
  }

  const handleDeleteProduct = () => {
    if (deleteConfirmation.productId) {
      setProducts(products.filter(product => product.id !== deleteConfirmation.productId))
      closeDeleteConfirmation()
    }
  }

  const handleEditProduct = (product: Products) => {
    setEditingProduct(product)
    setView('edit')
  }

  const handleUpdateProduct = (updatedProduct: Products) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p))
    setEditingProduct(null)
    setView('list')
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Product Management</CardTitle>
        {view === 'list' && (
          <Button onClick={() => setView('add')}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {view === 'list' && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)} className="mr-2">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteConfirmation(product.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {view === 'add' && <AddProduct onAddProduct={handleAddProduct} onCancel={() => setView('list')} />}
        {view === 'edit' && editingProduct && (
          <UpdateProductPage
            product={editingProduct}
            onUpdateProduct={handleUpdateProduct}
            onCancel={() => setView('list')}
          />
        )}
      </CardContent>

      <Dialog open={deleteConfirmation.isOpen} onOpenChange={closeDeleteConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this product?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the product from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteConfirmation}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}