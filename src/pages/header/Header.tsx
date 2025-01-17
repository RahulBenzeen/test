import { useState, useEffect } from 'react'
import { User, ChevronDown, Menu, Package, LogOut} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "../../components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "../../components/ui/sheet"
import Search from '../search/Search'
import Cart from '../cart/Cart'
import { Link, useNavigate } from 'react-router-dom'
import { logoutUserThunk, checkAuthToken } from '../../store/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useMediaQuery } from '../../hooks/useMediaQuery'

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
  const [isMounted, setIsMounted] = useState(false)

  const isMobile = useMediaQuery('(max-width: 768px)')
  // const isTablet = useMediaQuery('(max-width: 1024px)')

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
    navigate(`/product?category=${encodeURIComponent(category.toLowerCase())}&subcategory=${encodeURIComponent(subcategory.toLowerCase())}`)
  }

  if (!isMounted) {
    return null
  }

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-6">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
              <User className="h-5 w-5" />
              <div>
                <p className="font-medium">{user?.email}</p>
                <p className="text-sm text-muted-foreground">Logged in</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button onClick={() => navigate('/signin')} className="w-full">
                Log in
              </Button>
              <Button onClick={() => navigate('/register')} variant="outline" className="w-full">
                Sign up
              </Button>
            </div>
          )}
          
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.value} className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                  {category.name}
                </h3>
                <div className="grid gap-1">
                  {category.subcategories.map((subcategory) => (
                    <SheetClose asChild key={subcategory}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleCategoryClick(category.value, subcategory)}
                      >
                        {subcategory}
                      </Button>
                    </SheetClose>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {isAuthenticated && (
            <>
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                  Account
                </h3>
                <div className="grid gap-1">
                  <SheetClose asChild>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                  </SheetClose>
                  {user?.role === "admin" && (
                    <SheetClose asChild>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/admin')}>
                        <Package className="mr-2 h-4 w-4" />
                        Admin
                      </Button>
                    </SheetClose>
                  )}
                  <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-4">
          <MobileMenu />
          
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold hidden sm:inline-block">NOTHING.</span>
            <span className="text-xl font-bold sm:hidden">N.</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-6">
            {categories.map((category) => (
              <DropdownMenu key={category.value}>
                <DropdownMenuTrigger className="flex items-center">
                  {category.name} <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {category.subcategories.map((subcategory) => (
                    <DropdownMenuItem 
                      key={subcategory}
                      onClick={() => handleCategoryClick(category.value, subcategory)}
                    >
                      {subcategory}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {isMobile ? (
            // <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            //   <SheetTrigger asChild>
            //     <Button variant="ghost" size="icon" className="md:hidden">
            //       <SearchIcon className="h-5 w-5" />
            //       <span className="sr-only">Search</span>
            //     </Button>
            //   </SheetTrigger>
            //   <SheetContent side="top" className="h-[400px]">
            //     <SheetHeader>
            //       <SheetTitle>Search</SheetTitle>
                // </SheetHeader>
                // <div className="mt-4">
                  <Search />
                // </div>
              /* </SheetContent>
            </Sheet> */
          ) : (
            <div className="hidden md:block w-[200px] lg:w-[300px]">
              <Search />
            </div>
          )}

          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden sm:flex">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Package className="mr-2 h-4 w-4" />
                      Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className={isMobile ? "ml-2" : ""}>
                <Cart />
              </div>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/signin')}
                className="hidden sm:flex"
              >
                Log in
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                className="hidden sm:flex"
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}