import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { searchProducts } from '../../store/productDetailSlice';
import debounce from 'lodash/debounce';
import { FetchProductsParams } from '../../store/productSlice';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { searchResults, searchStatus } = useAppSelector((state) => state.productDetails);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        const params: FetchProductsParams = { page: 1, limit: 10, search: query };
        dispatch(searchProducts(params));
      }
    }, 300),
    [dispatch]
  );

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  return (
    <div className="relative">
      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search products..."
        className="pl-8 pr-4 w-[200px] lg:w-[300px]"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsSearchOpen(true)}
        onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
      />
      {isSearchOpen && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
          {searchStatus === 'loading' ? (
            <div className="p-2 text-center text-muted-foreground">
              Searching...
            </div>
          ) : searchResults?.length > 0 ? (
            searchResults.map((product) => (
              <div
                key={product._id}
                className="p-2 flex items-center gap-4 hover:bg-muted cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={product.images[0].secure_url || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">{product.category}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}