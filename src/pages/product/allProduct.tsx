
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addToCart } from '../../store/cartSlice'
import { setCurrentPage, setItemsPerPage, setView } from '../../store/filterSlice'
import { Button } from "../../components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group"
import { Grid, List } from 'lucide-react'
import ProductFilter from '../filterProduct/filterProduct'
import Paginator from '../paginator/paginator'


// This would typically come from an API or database
const products = [
  { id: 1, name: 'Smartphone X', category: 'Electronics', brand: 'TechCo', price: 999.99, rating: 4.5, image: 'https://placehold.co/300x200?text=Smartphone+X' },
  { id: 2, name: 'Laptop Pro', category: 'Electronics', brand: 'TechCo', price: 1499.99, rating: 4.7, image: 'https://placehold.co/300x200?text=Laptop+Pro' },
  { id: 3, name: 'Men\'s T-Shirt', category: 'Clothing', brand: 'FashionBrand', price: 29.99, rating: 4.2, image: 'https://placehold.co/300x200?text=Men\'s+T-Shirt' },
  { id: 4, name: 'Coffee Table', category: 'Home & Garden', brand: 'HomeCo', price: 199.99, rating: 4.0, image: 'https://placehold.co/300x200?text=Coffee+Table' },
  { id: 5, name: 'Wireless Earbuds', category: 'Electronics', brand: 'AudioTech', price: 129.99, rating: 4.6, image: 'https://placehold.co/300x200?text=Wireless+Earbuds' },
  { id: 6, name: 'Yoga Mat', category: 'Sports & Outdoors', brand: 'FitLife', price: 39.99, rating: 4.3, image: 'https://placehold.co/300x200?text=Yoga+Mat' },
  { id: 7, name: 'Blender', category: 'Home & Kitchen', brand: 'KitchenPro', price: 79.99, rating: 4.1, image: 'https://placehold.co/300x200?text=Blender' },
  { id: 8, name: 'Novel: "The Great Adventure"', category: 'Books', brand: 'BookHouse', price: 14.99, rating: 4.4, image: 'https://placehold.co/300x200?text=Novel' },
  // Add more products here to test pagination
]

const categories = [...new Set(products.map(p => p.category))]
const brands = [...new Set(products.map(p => p.brand))]

export default function ProductPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const filters = useAppSelector((state) => state.filters)

  const handleAddToCart = (product: typeof products[0]) => {
    dispatch(addToCart({ ...product, quantity: 1 }))
  }

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`)
  }

  const filteredProducts = products.filter(product => 
    (filters.category === 'all' || product.category === filters.category) &&
    (filters.brand === 'all' || product.brand === filters.brand) &&
    product.price <= filters.priceRange[1] &&
    product.rating >= filters.rating
  )

  const totalPages = Math.ceil(filteredProducts.length / filters.itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (filters.currentPage - 1) * filters.itemsPerPage,
    filters.currentPage * filters.itemsPerPage
  )

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  const handleItemsPerPageChange = (items: number) => {
    dispatch(setItemsPerPage(items))
  }

  const ProductCard = ({ product }: { product: typeof products[0] }) => (
    <Card className={filters.view === 'grid' ? 'flex flex-col' : 'flex flex-row'}>
      <CardHeader className={filters.view === 'grid' ? 'p-0' : 'p-4'}>
        <img
          src={product.image}
          alt={product.name}
          className={filters.view === 'grid' ? 'w-full h-48 object-cover rounded-t-lg cursor-pointer' : 'w-40 h-40 object-cover rounded-lg cursor-pointer'}
          onClick={() => handleProductClick(product.id)}
        />
      </CardHeader>
      <CardContent className={`flex-grow p-4 ${filters.view === 'list' ? 'flex-1' : ''}`}>
        <CardTitle className="text-lg mb-2 cursor-pointer" onClick={() => handleProductClick(product.id)}>
          {product.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
        <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
        <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
        <p className="text-sm text-yellow-500">★ {product.rating.toFixed(1)}</p>
      </CardContent>
      <CardFooter className={`p-4 ${filters.view === 'list' ? 'self-end' : 'pt-0'}`}>
        <Button className="w-full" onClick={() => handleAddToCart(product)}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <div className="sticky top-20">
            <ProductFilter categories={categories} brands={brands} />
          </div>
        </div>
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <ToggleGroup type="single" value={filters.view} onValueChange={(value:string) => value && dispatch(setView(value as 'grid' | 'list'))}>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <Grid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            <p className="text-sm text-muted-foreground">
              Showing {paginatedProducts.length} of {filteredProducts.length} products
            </p>
          </div>
          <div className={filters.view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8">
            <Paginator
              currentPage={filters.currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={filters.itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}