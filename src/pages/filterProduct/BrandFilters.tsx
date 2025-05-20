import { Building2 } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { FilterOption } from './FilterOption'

interface BrandFilterProps {
  brands: string[]
  selectedBrand: string
  onBrandChange: (brand: string) => void
}

export const BrandFilter = ({ 
  brands, 
  selectedBrand, 
  onBrandChange 
}: BrandFilterProps) => (
  <AccordionItem value="brands">
    <AccordionTrigger className="hover:no-underline">
      <div className="flex items-center gap-2">
        <Building2 className="w-4 h-4" />
        <span>Brands</span>
      </div>
    </AccordionTrigger>
    <AccordionContent>
      <ScrollArea className="h-[200px] w-full rounded-md">
        <div className="space-y-2">
          {['all', ...brands].map((brand) => (
            <FilterOption
              key={brand}
              label={brand === 'all' ? 'All Brands' : brand}
              isSelected={selectedBrand === brand}
              onClick={() => onBrandChange(brand)}
            />
          ))}
        </div>
      </ScrollArea>
    </AccordionContent>
  </AccordionItem>
)