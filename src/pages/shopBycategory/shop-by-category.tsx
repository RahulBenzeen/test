
import { Link } from 'react-router-dom'
import { ArrowRight, Smartphone, Laptop, Shirt, Coffee } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardFooter } from '../../components/ui/card'

import { useNavigate } from 'react-router-dom'
const categories = [
  { 
    id: 1, 
    name: 'Electronics', 
    description: 'Cutting-edge gadgets and devices',
    icon: Smartphone,
    featured: ['Smartphones', 'Laptops', 'Accessories'],
    image: 'https://res.cloudinary.com/dkii6mubi/image/upload/v1733893374/ecommerce/mhfwwrc2buj3cgugvzkb'
  },
  { 
    id: 2, 
    name: 'Clothing', 
    description: 'Stylish apparel for every occasion',
    icon: Shirt,
    featured: ['Men\'s Wear', 'Women\'s Fashion', 'Kids\' Clothing'],
    image: 'https://res.cloudinary.com/dkii6mubi/image/upload/v1733893373/ecommerce/xvph69a7enqwws0uec07'
  },
  { 
    id: 3, 
    name: 'Home', 
    description: 'Beautiful items for your living spaces',
    icon: Coffee,
    featured: ['Furniture', 'Decor', 'Gardening Tools'],
    image: 'https://res.cloudinary.com/dkii6mubi/image/upload/v1733893373/ecommerce/nph7yjaw6vkri0cct1vr'
  },
  { 
    id: 4, 
    name: 'Books', 
    description: 'Expand your knowledge and imagination',
    icon: Laptop,
    featured: ['Fiction', 'Non-Fiction', 'Educational'],
    image: 'https://res.cloudinary.com/dkii6mubi/image/upload/v1733893373/ecommerce/xarqudmzihm2dsc9dzpm'
  }
]

export default function ShopByCategory() {
  const navigate = useNavigate();
  const handleCategoryClick = (category: string) => {
    navigate(`/product?category=${encodeURIComponent(category.toLowerCase())}`);
  };
  

  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Card key={category.id} className="group overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                    <Button variant="secondary" size="sm" onClick={() =>{handleCategoryClick(category.name?.toLowerCase())}}>
                      Explore {category.name}
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <category.icon className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                  <ul className="space-y-1">
                    {category.featured.map((item, index) => (
                      <li key={index} className="text-sm">
                        <Link to={`/product?category=${encodeURIComponent(category.name?.toLowerCase())}`} className="hover:underline">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="bg-secondary">
                <Link 
                  to={`/product?category=${encodeURIComponent(category.name?.toLowerCase())}`} 
                  className="text-primary hover:underline inline-flex items-center w-full justify-between"
                >
                  View All {category.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}