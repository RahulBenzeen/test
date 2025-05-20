import React from 'react';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import ProductFilter from '../../filterProduct/filterProduct';

interface ProductHeaderProps {
  filters: {
    category: string;
    subcategory: string;
    view: 'grid' | 'list';
    sortBy?: string;
  };
  onViewChange: (value: 'grid' | 'list') => void;
  onSortChange: (value: string) => void;
  selectedFilters: string[];
  isTablet: boolean;
  categories: string[];
  brands: string[] ;
  onFilterChange: (filters: string[]) => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  filters,
  onViewChange,
  onSortChange,
  selectedFilters,
  isTablet,
  categories,
  brands,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl md:text-4xl font-bold">
          {filters.category 
            ? `${filters.category?.toUpperCase()} - ${filters.subcategory || 'All'}`
            : 'All Products'
          }
        </h1>
        <p className="text-muted-foreground mt-2">
          Discover our curated collection of premium products
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 self-stretch">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isTablet && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                  {selectedFilters.length > 0 && (
                    <Badge className="ml-2" variant="secondary">
                      {selectedFilters.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <ProductFilter 
                    categories={categories} 
                    brands={brands} 
                    selectedFilters={selectedFilters}
                    onFilterChange={onFilterChange}
                  />
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          <div className="flex items-center gap-2 flex-1 sm:flex-none">
            <ToggleGroup
              type="single"
              value={filters.view}
              onValueChange={(value: string) => value && onViewChange(value as 'grid' | 'list')}
              className="border rounded-md"
            >
              <ToggleGroupItem value="grid" aria-label="Grid view" className="px-3 py-2">
                <Grid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view" className="px-3 py-2">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            
            <Select onValueChange={onSortChange} defaultValue={filters.sortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="rating_desc">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductHeader);