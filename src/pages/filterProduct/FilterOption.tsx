import { Check } from 'lucide-react'
import { memo } from 'react'

interface FilterOptionProps {
  label: string
  isSelected: boolean
  onClick: () => void
  icon?: React.ReactNode
}

export const FilterOption = memo(({ 
  label, 
  isSelected, 
  onClick, 
  icon 
}: FilterOptionProps) => (
  <div
    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
      isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-2">
      {icon}
      <span className="capitalize">{label}</span>
    </div>
    {isSelected && <Check className="w-4 h-4" />}
  </div>
))

FilterOption.displayName = 'FilterOption'