import { DollarSign } from 'lucide-react'
import { Slider } from "@/components/ui/slider"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

interface PriceFilterProps {
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
}

export const PriceFilter = ({ priceRange, onPriceChange }: PriceFilterProps) => (
  <AccordionItem value="price">
    <AccordionTrigger className="hover:no-underline">
      <div className="flex items-center gap-2">
        <DollarSign className="w-4 h-4" />
        <span>Price Range</span>
      </div>
    </AccordionTrigger>
    <AccordionContent>
      <div className="space-y-4 px-2">
        <Slider
          min={0}
          max={100000}
          step={100}
          value={priceRange}
          onValueChange={(value) => onPriceChange(value as [number, number])}
          className="mt-6"
        />
        <div className="flex items-center justify-between text-sm">
          <span>₹{priceRange[0].toLocaleString()}</span>
          <span>₹{priceRange[1].toLocaleString()}</span>
        </div>
      </div>
    </AccordionContent>
  </AccordionItem>
)