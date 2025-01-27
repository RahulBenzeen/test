import { User, Package, LogOut, Heart } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import Cart from '../cart/Cart'
import { useNavigate } from 'react-router-dom'
import {User as Users} from '../../store/authSlice'
interface UserActionsProps {
  isAuthenticated: boolean
  user: Users|null
  isMobile: boolean
  handleLogout: () => Promise<void>
}

export default function UserActions({ isAuthenticated, user, isMobile, handleLogout }: UserActionsProps) {
  const navigate = useNavigate()

  return (
    <>
      {isAuthenticated ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
            onClick={() => navigate('/profile/wishlist')}
          >
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
          </Button>
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
              <DropdownMenuItem onClick={() => navigate('/profile/wishlist')}>
                <Heart className="mr-2 h-4 w-4" />
                Wishlist
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
    </>
  )
}