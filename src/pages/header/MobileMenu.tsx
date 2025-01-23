import { User, Package, LogOut, Heart } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "../../components/ui/sheet"
import { Menu } from 'lucide-react'
import { CategoryType } from '../../utils/type/category'
import {User as Users} from '../../store/authSlice'

interface MobileMenuProps {
  categories: CategoryType[]
  isAuthenticated: boolean
  user: Users|null
  handleCategoryClick: (category: string, subcategory: string) => void
  handleLogout: () => Promise<void>
  navigate: (path: string) => void
}

export default function MobileMenu({ 
  categories, 
  isAuthenticated, 
  user, 
  handleCategoryClick, 
  handleLogout,
  navigate 
}: MobileMenuProps) {
  return (
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
                  <SheetClose asChild>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/profile/wishlist')}>
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
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
}