import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logoutUserThunk, checkAuthToken } from '../../store/authSlice'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import Search from '../search/Search'
import MobileMenu from './MobileMenu'
import DesktopNav from './DesktopNav'
import UserActions from './UserActions'
import BottomNav from './BottomNav'
import { CategoryType } from '../../utils/type/category'

const categories: CategoryType[] = [
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

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-6 lg:px-8">
          <div className="flex flex-1 items-center gap-4">
            <MobileMenu 
              categories={categories}
              isAuthenticated={isAuthenticated}
              user={user}
              handleCategoryClick={handleCategoryClick}
              handleLogout={handleLogout}
              navigate={navigate}
            />
            
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold hidden sm:inline-block">NOTHING.</span>
              <span className="text-xl font-bold sm:hidden">N.</span>
            </Link>

            <DesktopNav 
              categories={categories}
              handleCategoryClick={handleCategoryClick}
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            {isMobile ? (
              <Search />
            ) : (
              <div className="hidden md:block w-[200px] lg:w-[300px]">
                <Search />
              </div>
            )}

            <UserActions 
              isAuthenticated={isAuthenticated}
              user={user}
              isMobile={isMobile}
              handleLogout={handleLogout}
            />
          </div>
        </div>
      </header>
      
      {/* Bottom Navigation for Mobile */}
      <BottomNav isAuthenticated={isAuthenticated} />
      
      {/* Add padding to main content to prevent bottom nav overlap */}
      <style>{`
        @media (max-width: 768px) {
          main {
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </>
  )
}