import { useState, useEffect, useCallback, memo } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setCategory, setBrand, setPriceRange, setRating, clearFilters } from '../../store/filterSlice'
import { fetchProducts } from '../../store/productSlice'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Accordion } from "@/components/ui/accordion"
import { FilterHeader } from './FIlterHeader'
import { ActiveFilters } from './ActiveFilters'
import { CategoryFilter } from './CategoryFilter'
import { BrandFilter } from './BrandFilters'
import { PriceFilter } from './PriceFilter'
import { RatingFilter } from './RatingFilter'

interface ProductFilterProps {
  categories: string[]
  brands: string[]
  selectedFilters: string[]
  onFilterChange: (filters: string[]) => void
  onClose?: () => void
  isMobileSheet?: boolean
}

const INITIAL_PRICE_RANGE: [number, number] = [0, 100000]

const ProductFilter = ({ 
  categories, 
  brands,
  onFilterChange,
  onClose,
  isMobileSheet = false
}: ProductFilterProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const filters = useAppSelector((state) => state.filters)
  
  const [localFilters, setLocalFilters] = useState({
    category: filters.category || 'all',
    brand: filters.brand || 'all',
    priceRange: filters.priceRange as [number, number],
    rating: filters.rating
  })
  
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // URL sync effect
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const category = searchParams.get('category') || 'all'
    const brand = searchParams.get('brand') || 'all'
    const minPrice = Number(searchParams.get('minPrice')) || 0
    const maxPrice = Number(searchParams.get('maxPrice')) || 100000
    const rating = Number(searchParams.get('rating')) || 0

    setLocalFilters({
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
  }, [location.search, dispatch, filters.itemsPerPage])

  // Update active filters
  useEffect(() => {
    const newActiveFilters: string[] = []
    
    if (localFilters.category !== 'all') {
      newActiveFilters.push(`Category: ${localFilters.category}`)
    }
    if (localFilters.brand !== 'all') {
      newActiveFilters.push(`Brand: ${localFilters.brand}`)
    }
    if (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 100000) {
      newActiveFilters.push(
        `Price: ₹${localFilters.priceRange[0].toLocaleString()} - ₹${localFilters.priceRange[1].toLocaleString()}`
      )
    }
    if (localFilters.rating > 0) {
      newActiveFilters.push(`Rating: ${localFilters.rating}+ Stars`)
    }

    setActiveFilters(newActiveFilters)
  }, [localFilters])

  const handleFilterChange = useCallback((filterName: string, value: unknown) => {
    setLocalFilters(prev => ({ ...prev, [filterName]: value }))
  }, [])

  const handleApplyFilters = useCallback(() => {
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

    dispatch(setCategory(filtersToApply.category))
    dispatch(setBrand(filtersToApply.brand))
    dispatch(setPriceRange(localFilters.priceRange))
    dispatch(setRating(filtersToApply.rating))
    dispatch(fetchProducts({ 
      ...filtersToApply, 
      page: 1, 
      limit: filters.itemsPerPage 
    }))

    if (isMobileSheet && onClose) {
      onClose()
    }
  }, [localFilters, dispatch, filters.itemsPerPage, isMobileSheet, onClose])

  const handleClearFilters = useCallback(() => {
    const defaultFilters = {
      category: 'all',
      brand: 'all',
      priceRange: INITIAL_PRICE_RANGE,
      rating: 0
    }
    
    dispatch(clearFilters())
    setLocalFilters(defaultFilters)
    dispatch(fetchProducts({ page: 1, limit: filters.itemsPerPage }))
    setActiveFilters([])
    onFilterChange([])
    navigate(location.pathname)

    if (isMobileSheet && onClose) {
      onClose()
    }
  }, [dispatch, filters.itemsPerPage, navigate, location.pathname, onFilterChange, isMobileSheet, onClose])

  const removeFilter = useCallback((filter: string) => {
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
        handleFilterChange('priceRange', INITIAL_PRICE_RANGE)
        break
    }
    handleApplyFilters()
  }, [handleFilterChange, handleApplyFilters])

  return (
    <div className={`bg-card rounded-lg shadow-md divide-y divide-border ${isMobileSheet ? 'h-full' : ''}`}>
      <div className="p-4">
        <FilterHeader 
          activeFiltersCount={activeFilters.length} 
          onClearFilters={handleClearFilters} 
        />
        <ActiveFilters 
          filters={activeFilters} 
          onRemoveFilter={removeFilter} 
        />
      </div>

      <div className="p-4 flex-1 overflow-auto">
        <Accordion type="single" collapsible className="w-full">
          <CategoryFilter
            categories={categories}
            selectedCategory={localFilters.category}
            onCategoryChange={(category) => handleFilterChange('category', category)}
          />
          <BrandFilter
            brands={brands}
            selectedBrand={localFilters.brand}
            onBrandChange={(brand) => handleFilterChange('brand', brand)}
          />
          <PriceFilter
            priceRange={localFilters.priceRange}
            onPriceChange={(range) => handleFilterChange('priceRange', range)}
          />
          <RatingFilter
            selectedRating={localFilters.rating}
            onRatingChange={(rating) => handleFilterChange('rating', rating)}
          />
        </Accordion>
      </div>

      {isMobileSheet && (
        <div className="p-4 border-t">
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="flex-1"
            >
              Apply
            </Button>
          </div>
        </div>
      )}

      {!isMobileSheet && (
        <div className="p-4">
          <Button
            onClick={handleApplyFilters}
            className="w-full"
            size="lg"
          >
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  )
}

export default memo(ProductFilter)