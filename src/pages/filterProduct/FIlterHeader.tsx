import { Filter, RotateCcw } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface FilterHeaderProps {
  activeFiltersCount: number
  onClearFilters: () => void
}

export const FilterHeader = ({ activeFiltersCount, onClearFilters }: FilterHeaderProps) => (
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center gap-2">
      <Filter className="w-5 h-5" />
      <h2 className="text-lg font-semibold">Filters</h2>
    </div>
    {activeFiltersCount > 0 && (
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearFilters}
        className="text-muted-foreground hover:text-foreground"
      >
        <RotateCcw className="w-4 h-4 mr-1" />
        Reset
      </Button>
    )}
  </div>
)