import  { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setCategory, setBrand, setPriceRange, setRating, clearFilters } from '../../store/filterSlice'
import { fetchProducts } from '../../store/productSlice'
import { useLocation, useNavigate } from 'react-router-dom'

import { Slider } from "../../components/ui/slider"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Tags, DollarSign, Filter, X, Building2, RotateCcw, Check } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion"
import { ScrollArea } from "../../components/ui/scroll-area"


interface ProductFilterProps {
  categories: string[]
  brands: string[]
  selectedFilters: string[]
  onFilterChange: (filters: string[]) => void
}

export default function ProductFilter({ 
  categories, 
  brands,
  onFilterChange 
}: ProductFilterProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const filters = useAppSelector((state) => state.filters)
  const [localFilters, setLocalFilters] = useState({
    ...filters,
    category: filters.category || 'all',
    brand: filters.brand || 'all',
    priceRange: filters.priceRange as [number, number]
  })
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const category = searchParams.get('category') || 'all'
    const brand = searchParams.get('brand') || 'all'
    const minPrice = Number(searchParams.get('minPrice')) || 0
    const maxPrice = Number(searchParams.get('maxPrice')) || 100000
    const rating = Number(searchParams.get('rating')) || 0

    setLocalFilters({
      ...localFilters,
      category,
      brand,
      priceRange: [minPrice, maxPrice],
      rating
    })

    dispatch(setCategory(category !== 'all' ? category : ''))
    dispatch(setBrand(brand !== 'all' ? brand : ''))
    dispatch(setPriceRange([minPrice, maxPrice]))
    dispatch(setRating(rating))

    dispatch(fetchProducts({ 
      category: category !== 'all' ? category : '',
      brand: brand !== 'all' ? brand : '',
      minPrice,
      maxPrice,
      rating,
      page: 1, 
      limit: filters.itemsPerPage 
    }))
  }, [location.search,])
// Update active filters based on the current localFilters
const updateActiveFilters = () => {
  const newActiveFilters: string[] = [];
  if (localFilters.category !== 'all') {
    newActiveFilters.push(`Category: ${localFilters.category}`);
  }
  if (localFilters.brand !== 'all') {
    newActiveFilters.push(`Brand: ${localFilters.brand}`);
  }
  if (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 100000) {
    newActiveFilters.push(`Price: ₹${localFilters.priceRange[0]} - ₹${localFilters.priceRange[1]}`);
  }
  if (localFilters.rating > 0) {
    newActiveFilters.push(`Rating: ${localFilters.rating}+ Stars`);
  }

  // Update active filters state and trigger the parent callback
  setActiveFilters(newActiveFilters);
  // onFilterChange(newActiveFilters); // Notify parent about the active filters
};

// Run `updateActiveFilters` whenever `localFilters` changes
useEffect(() => {
  updateActiveFilters();
}, [localFilters]);


  const handleFilterChange = (filterName: string, value: unknown) => {
    setLocalFilters(prev => ({ ...prev, [filterName]: value }))
  }

  const handleApplyFilters = () => {
    const filtersToApply = {
      category: localFilters.category === 'all' ? '' : localFilters.category,
      brand: localFilters.brand === 'all' ? '' : localFilters.brand,
      minPrice: localFilters.priceRange[0],
      maxPrice: localFilters.priceRange[1],
      rating: localFilters.rating
    }

    const searchParams = new URLSearchParams()
    if (filtersToApply.category) searchParams.set('category', filtersToApply.category)
    if (filtersToApply.brand) searchParams.set('brand', filtersToApply.brand)
    searchParams.set('minPrice', filtersToApply.minPrice.toString())
    searchParams.set('maxPrice', filtersToApply.maxPrice.toString())
    if (filtersToApply.rating > 0) searchParams.set('rating', filtersToApply.rating.toString())

    // navigate(`${location.pathname}?${searchParams.toString()}`)

    dispatch(setCategory(filtersToApply.category))
    dispatch(setBrand(filtersToApply.brand))
    dispatch(setPriceRange(localFilters.priceRange))
    dispatch(setRating(filtersToApply.rating))
    dispatch(fetchProducts({ 
      ...filtersToApply, 
      page: 1, 
      limit: filters.itemsPerPage 
    }))
  }

  const handleClearFilters = () => {
    const defaultFilters = {
      category: 'all',
      subcategory: '',
      brand: 'all',
      priceRange: [0, 100000] as [number, number],
      rating: 0,
      currentPage: 1,
      itemsPerPage: 12,
      view: 'grid' as const,
    }
    dispatch(clearFilters())
    setLocalFilters(defaultFilters)
    dispatch(fetchProducts({ page: 1, limit: filters.itemsPerPage }))
    setActiveFilters([])
    onFilterChange([])
    navigate(location.pathname)
  }

  const removeFilter = (filter: string) => {
    const [type] = filter.split(': ')
    switch (type) {
      case 'Category':
        handleFilterChange('category', 'all')
        break
      case 'Brand':
        handleFilterChange('brand', 'all')
        break
      case 'Rating':
        handleFilterChange('rating', 0)
        break
      case 'Price':
        handleFilterChange('priceRange', [0, 100000])
        break
    }
    handleApplyFilters()
  }

  return (
    <div className="bg-card rounded-lg shadow-md divide-y divide-border">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          {activeFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          )}
        </div>
        
        {/* Active Filters */}
        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <ScrollArea className="h-[100px] w-full rounded-md border p-2">
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter, index) => (
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
                          onClick={() => removeFilter(filter)}
                        />
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Sections */}
      <div className="p-4">
        <Accordion type="single" collapsible className="w-full">
          {/* Categories */}
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
                    <div
                      key={cat}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                        localFilters.category === cat
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => handleFilterChange('category', cat)}
                    >
                      <span className="capitalize">{cat === 'all' ? 'All Categories' : cat}</span>
                      {localFilters.category === cat && (
                        <Check className="w-4 h-4" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          {/* Brands */}
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
                    <div
                      key={brand}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                        localFilters.brand === brand
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => handleFilterChange('brand', brand)}
                    >
                      <span className="capitalize">{brand === 'all' ? 'All Brands' : brand}</span>
                      {localFilters.brand === brand && (
                        <Check className="w-4 h-4" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          {/* Price Range */}
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
                  value={localFilters.priceRange}
                  onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
                  className="mt-6"
                />
                <div className="flex items-center justify-between text-sm">
                  <span>₹{localFilters.priceRange[0].toLocaleString()}</span>
                  <span>₹{localFilters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Rating */}
          <AccordionItem value="rating">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>Rating</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {[0, ...Array(5).keys()].map((rating) => (
                  <div
                    key={rating}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                      localFilters.rating === rating
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => handleFilterChange('rating', rating)}
                  >
                    <div className="flex items-center gap-1">
                      {rating === 0 ? (
                        <span>Any Rating</span>
                      ) : (
                        <>
                          <span>{rating}+</span>
                          {Array(rating).fill(0).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </>
                      )}
                    </div>
                    {localFilters.rating === rating && (
                      <Check className="w-4 h-4" />
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Apply Filters Button */}
      <div className="p-4">
        <Button
          onClick={handleApplyFilters}
          className="w-full"
          size="lg"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )
}