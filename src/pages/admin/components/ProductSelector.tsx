import  { useState, useEffect } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../../components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import { Badge } from '../../../components/ui/badge';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Skeleton } from '../../../components/ui/skeleton';
import { cn } from '../../../lib/utils';
import { fetchProducts } from '../../../store/productSlice';
import { useAppDispatch } from '../../../store/hooks';
type ProductSelectorProps = {
  selectedProducts: string[];
  onChange: (value: string[]) => void;
  maxSelections?: number;
};

export default function ProductSelector({ 
  selectedProducts = [], 
  onChange,
  maxSelections = Infinity
}: ProductSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const products = useAppSelector((state) => state.products.items);
  const status = useAppSelector((state) => state.products.status);
  const dispatch = useAppDispatch();
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSelect = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      onChange(selectedProducts.filter(id => id !== productId));
    } else if (selectedProducts.length < maxSelections) {
      onChange([...selectedProducts, productId]);
    }
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts({page: 1, limit: 100}));
    }
  }, [dispatch, status]);


  
  const handleRemove = (productId: string) => {
    onChange(selectedProducts.filter(id => id !== productId));
  };
  
  // Find product by ID
  const getProductById = (id: string) => {
    return products.find(product => product._id === id);
  };
  
  const selectedProductsInfo = selectedProducts.map(id => {
    const product = getProductById(id);
    return {
      id,
      name: product?.name || 'Unknown Product',
      image: product?.images?.[0]?.secure_url || '',
    };
  });

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10 py-2"
          >
            <span className="truncate">
              {selectedProducts.length > 0
                ? `${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''} selected`
                : "Select products..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 md:w-[400px]">
          <Command className="w-full">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Search products..."
                className="h-9 flex-1"
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>
            <CommandList>
              <CommandEmpty>No products found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[300px]">
                  {status ==='loading'? (
                    Array(5).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center gap-2 p-2">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))
                  ) : (
                    filteredProducts.map((product) => (
                      <CommandItem
                        key={product._id}
                        value={product._id}
                        onSelect={() => handleSelect(product._id)}
                        className="flex items-center gap-2 p-2"
                        disabled={selectedProducts.length >= maxSelections && !selectedProducts.includes(product._id)}
                      >
                        <div 
                          className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden"
                        >
                          {product.images?.[0]?.secure_url ? (
                            <img 
                              src={product.images[0].secure_url} 
                              alt={product.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="text-xs text-muted-foreground">No img</div>
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">₹{product.price}</p>
                        </div>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedProducts.includes(product._id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))
                  )}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
            {maxSelections < Infinity && (
              <div className="border-t px-3 py-2">
                <p className="text-xs text-muted-foreground">
                  {selectedProducts.length} of {maxSelections} selected
                </p>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedProductsInfo.map((product) => (
            <Badge
              key={product.id}
              variant="secondary"
              className="h-8 pl-2 pr-1 flex items-center gap-1 hover:bg-muted/80 transition-colors"
            >
              {product.image && (
                <div className="h-4 w-4 rounded-sm overflow-hidden mr-1">
                  <img src={product.image} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              <span className="truncate max-w-[100px]">{product.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 ml-1 hover:bg-muted-foreground/20 rounded-full"
                onClick={() => handleRemove(product.id)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {product.name}</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}