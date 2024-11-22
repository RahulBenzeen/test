import React from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setCategory, setBrand, setPriceRange, setRating, clearFilters } from '../../store/filterSlice'
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
  const { category, brand, priceRange, rating } = useAppSelector((state) => state.filters)

  return (
    <div className="bg-card p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      {/* Category Filter */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={(value) => dispatch(setCategory(value))}>
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
        <Select value={brand} onValueChange={(value) => dispatch(setBrand(value))}>
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
          max={1000}
          step={10}
          value={[priceRange[1]]}
          onValueChange={(value) => dispatch(setPriceRange([0, value[0]]))}
        />
        <p className="text-sm text-muted-foreground">Up to ${priceRange[1]}</p>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2">
        <Label htmlFor="rating">Minimum Rating</Label>
        <Select value={rating.toString()} onValueChange={(value) => dispatch(setRating(Number(value)))}>
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
        onClick={() => dispatch(clearFilters())}
        variant="outline"
        className="w-full"
      >
        Clear Filters
      </Button>
    </div>
  )
}

export default ProductFilter;