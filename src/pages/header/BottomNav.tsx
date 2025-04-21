import { Home, User, ShoppingBag, Heart } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

interface BottomNavProps {
  isAuthenticated: boolean;
  onFilterClick?: () => void;
  showFilter?: boolean;
  isFilterActive?: boolean;
}

export default function BottomNav({ 
  isAuthenticated, 
}: BottomNavProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors
            ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button
          onClick={() => navigate('/product')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors
            ${isActive('/product') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-xs mt-1">Products</span>
        </button>

        {/* {showFilter && (
          <button
            onClick={onFilterClick}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors
              ${isFilterActive ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Filter className="h-5 w-5" />
            <span className="text-xs mt-1">Filter</span>
          </button>
        )} */}

        {isAuthenticated && (
          <button
            onClick={() => navigate('/profile/wishlist')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors
              ${isActive('/profile/wishlist') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs mt-1">Wishlist</span>
          </button>
        )}

        <button
          onClick={() => navigate(isAuthenticated ? '/profile' : '/signin')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors
            ${isActive(isAuthenticated ? '/profile' : '/signin') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">{isAuthenticated ? 'Profile' : 'Login'}</span>
        </button>
      </div>
    </div>
  )
}