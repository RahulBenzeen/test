
import { Button } from '../../components/ui/button';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import { Link } from 'react-router-dom';


const products = [
  { id: 1, name: 'Smartphone X', category: 'Electronics', price: 999.99, image: 'https://placehold.co/600x400' },
  { id: 2, name: 'Laptop Pro', category: 'Electronics', price: 1499.99, image: 'https://placehold.co/600x400'  },
  { id: 3, name: 'Men\'s T-Shirt', category: 'Clothing', price: 29.99, image: 'https://placehold.co/600x400'  },
  { id: 4, name: 'Coffee Table', category: 'Home & Garden', price: 199.99, image: 'https://placehold.co/600x400'}
]


export default function FeaturedProducts() {
  const dispatch = useAppDispatch()

  const handleAddToCart = (product: typeof products[0]) => {
    dispatch(addToCart({...product, quantity: 1}))
  }

  return (
    <section className="bg-muted py-16">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-background rounded-lg shadow-md overflow-hidden">
            <Link to={`/product/${product.id}`} className="block">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-muted-foreground mb-4">${product.price.toFixed(2)}</p>
              </div>
            </Link>
            <div className="px-4 pb-4">
              <Button onClick={() => handleAddToCart(product)} className="w-full">
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-8">
        <Link to="/product" className="text-primary hover:underline">
          View More
        </Link>
      </div>
    </div>
  </section>
  )
}