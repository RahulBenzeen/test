import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setCategory, setBrand, setPriceRange, setRating, clearFilters } from '../../store/filterSlice'
import { fetchProducts } from '../../store/productSlice'
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Slider } from "../../components/ui/slider"
import { Button } from "../../components/ui/button"

interface ProductFilterProps {
  categories: string[]
  brands: string[]
}

const ProductFilter: React.FC<ProductFilterProps> = ({ categories, brands }) => {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.filters)
  const [localFilters, setLocalFilters] = useState({
    ...filters,
    category: filters.category || 'all',
    brand: filters.brand || 'all',
    priceRange: filters.priceRange as [number, number]
  })

  const handleFilterChange = (filterName: string, value: unknown) => {
    setLocalFilters(prev => ({ ...prev, [filterName]: value }))
  }

  const handleApplyFilters = () => {
    const filtersToApply = {
      category: localFilters.category === 'all' ? '' : localFilters.category,
      subcategory: localFilters.subcategory === 'all' ? '' : localFilters.subcategory, // Add subcategory filter
      brand: localFilters.brand === 'all' ? '' : localFilters.brand,
      minPrice: localFilters.priceRange[0],
      maxPrice: localFilters.priceRange[1],
      rating: localFilters.rating
    }

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
      brand: 'all',
      subcategory: '',
      priceRange: [0, 100000] as [number, number],
      rating: 0,
      currentPage: 1,
      itemsPerPage: 3,
      view: 'grid' as const,
    }
    dispatch(clearFilters())
    setLocalFilters(defaultFilters)
    dispatch(fetchProducts({ page: 1, limit: filters.itemsPerPage }))
  }


  return (
    <div className="bg-card p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      {/* Category Filter */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={localFilters.category} onValueChange={(value) => handleFilterChange('category', value)}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand Filter */}
      <div className="space-y-2">
        <Label htmlFor="brand">Brand</Label>
        <Select value={localFilters.brand} onValueChange={(value) => handleFilterChange('brand', value)}>
          <SelectTrigger id="brand">
            <SelectValue placeholder="Select brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((br) => (
              <SelectItem key={br} value={br}>{br}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2">
        <Label>Price Range</Label>
        <Slider
          min={0}
          max={100000}
          step={10}
          value={localFilters.priceRange}
          onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
        />
        <p className="text-sm text-muted-foreground">
          ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
        </p>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2">
        <Label htmlFor="rating">Minimum Rating</Label>
        <Select 
          value={localFilters.rating.toString()} 
          onValueChange={(value) => handleFilterChange('rating', Number(value))}
        >
          <SelectTrigger id="rating">
            <SelectValue placeholder="Select minimum rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any Rating</SelectItem>
            {[1, 2, 3, 4, 5].map((r) => (
              <SelectItem key={r} value={r.toString()}>{r} Stars & Up</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleApplyFilters}
        className="w-full mb-2"
      >
        Apply Filters
      </Button>

      <Button
        onClick={handleClearFilters}
        variant="outline"
        className="w-full"
      >
        Clear Filters
      </Button>
    </div>
  )
}

export default ProductFilter