import { Star } from 'lucide-react'
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { FilterOption } from './FilterOption'

interface RatingFilterProps {
  selectedRating: number
  onRatingChange: (rating: number) => void
}

const RATING_OPTIONS = [
  { value: 0, label: 'Any Rating' },
  { value: 1, label: '1+ Star' },
  { value: 2, label: '2+ Stars' },
  { value: 3, label: '3+ Stars' },
  { value: 4, label: '4+ Stars' },
  { value: 5, label: '5 Stars' }
]

export const RatingFilter = ({ selectedRating, onRatingChange }: RatingFilterProps) => (
  <AccordionItem value="rating">
    <AccordionTrigger className="hover:no-underline">
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4" />
        <span>Rating</span>
      </div>
    </AccordionTrigger>
    <AccordionContent>
      <div className="space-y-2">
        {RATING_OPTIONS.map((rating) => (
          <FilterOption
            key={`rating-${rating.value}`}
            label={rating.label}
            isSelected={selectedRating === rating.value}
            onClick={() => onRatingChange(rating.value)}
            icon={rating.value > 0 && (
              <div className="flex">
                {Array.from({ length: rating.value }).map((_, i) => (
                  <Star 
                    key={`star-${rating.value}-${i}`} 
                    className="w-4 h-4 fill-yellow-400 text-yellow-400" 
                  />
                ))}
              </div>
            )}
          />
        ))}
      </div>
    </AccordionContent>
  </AccordionItem>
)