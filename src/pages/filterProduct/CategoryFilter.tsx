import { Tags } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { FilterOption } from './FilterOption'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryFilterProps) => (
  <AccordionItem value="categories">
    <AccordionTrigger className="hover:no-underline">
      <div className="flex items-center gap-2">
        <Tags className="w-4 h-4" />
        <span>Categories</span>
      </div>
    </AccordionTrigger>
    <AccordionContent>
      <ScrollArea className="h-[200px] w-full rounded-md">
        <div className="space-y-2">
          {['all', ...categories].map((cat) => (
            <FilterOption
              key={cat}
              label={cat === 'all' ? 'All Categories' : cat}
              isSelected={selectedCategory === cat}
              onClick={() => onCategoryChange(cat)}
            />
          ))}
        </div>
      </ScrollArea>
    </AccordionContent>
  </AccordionItem>
)