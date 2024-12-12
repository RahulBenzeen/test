import { useState, useEffect } from 'react'
import { User, ChevronDown, Menu, Package, CreditCard, MapPin, LogOut } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "../../components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import Search from '../search/Search'
import Cart from '../cart/Cart'
import { Link, useNavigate } from 'react-router-dom'
import { logoutUserThunk, checkAuthToken } from '../../store/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

const categories = [
  { value: 'electronics', name: 'Electronics', subcategories: ['Smartphones', 'Laptops', 'Accessories'] },
  { value: 'clothing', name: 'Clothing', subcategories: ['Men', 'Women', 'Kids'] },
  { value: 'home', name: 'Home & Garden', subcategories: ['Furniture', 'Decor', 'Kitchen'] },
  { value: 'books', name: 'Books', subcategories: ['Fiction', 'Non-fiction', 'Educational'] },
]

export default function Header() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const [isMounted, setIsMounted] = useState(false);
  

  useEffect(() => {
    const initAuth = async () => {
      setIsMounted(true)
      await dispatch(checkAuthToken()).unwrap()
    }
    initAuth()
  }, [dispatch])

  const handleLogout = async () => {
    try {
      await dispatch(logoutUserThunk()).unwrap()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleCategoryClick = (category: string, subcategory: string) => {
    navigate(`/product?category=${encodeURIComponent(category.toLowerCase())}&subcategory=${encodeURIComponent(subcategory.toLowerCase())}`);
  };
  

  if (!isMounted) {
    return null // or a loading spinner
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4">
                {categories.map((category) => (
                  <div key={category.name}>
                    <h3 className="text-lg font-medium mb-2">{category.name}</h3>
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory}
                        to={`/products?category=${category.name.toLowerCase()}&subcategory=${subcategory.toLowerCase()}`}
                        className="block text-sm py-1"
                      >
                        {subcategory}
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center space-x-2 ml-10">
            <span className="text-xl font-bold">NOTHING.</span>
           </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {categories.map((category) => (
            <DropdownMenu key={category.name}>
              <DropdownMenuTrigger className="flex items-center">
                {category.name} <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {category.subcategories.map((subcategory) => (
                  <DropdownMenuItem key={subcategory} onSelect={() => handleCategoryClick(category.value, subcategory)}>
                    {subcategory}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Search />
          {isAuthenticated && user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem onClick={() => navigate('/orders')}>
                    <Package className="mr-2 h-4 w-4" />
                    <span>Orders</span>
                  </DropdownMenuItem> */}
                  {user.role === "admin" && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Package className="mr-2 h-4 w-4" />
                      <span>Admin</span>
                    </DropdownMenuItem>
                  )}
                  {/* <DropdownMenuItem onClick={() => navigate('/addresses')}>
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>Addresses</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/payment-methods')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Payment Methods</span>
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Cart />
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/signin')}>
                Log in
              </Button>
              <Button onClick={() => navigate('/register')}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}