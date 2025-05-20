import { ChevronDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CategoryType } from '../../utils/type/category'

interface DesktopNavProps {
  categories: CategoryType[]
  handleCategoryClick: (category: string, subcategory: string) => void
}

export default function DesktopNav({ categories, handleCategoryClick }: DesktopNavProps) {
  return (
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
  )
}