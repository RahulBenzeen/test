import { X } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ActiveFiltersProps {
  filters: string[]
  onRemoveFilter: (filter: string) => void
}

export const ActiveFilters = ({ filters, onRemoveFilter }: ActiveFiltersProps) => (
  <AnimatePresence>
    {filters.length > 0 && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden"
      >
        <ScrollArea className="h-[100px] w-full rounded-md border p-2">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => (
              <motion.div
                key={filter}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
              >
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 group"
                >
                  {filter}
                  <X
                    className="w-3 h-3 text-muted-foreground cursor-pointer group-hover:text-foreground transition-colors"
                    onClick={() => onRemoveFilter(filter)}
                  />
                </Badge>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </motion.div>
    )}
  </AnimatePresence>
)