import { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '../../components/ui/input';

const allProducts = [
  { id: 1, name: 'Smartphone X', category: 'Electronics', price: 999.99 },
  { id: 2, name: 'Laptop Pro', category: 'Electronics', price: 1499.99 },
  { id: 3, name: 'Men\'s T-Shirt', category: 'Clothing', price: 29.99 },
  { id: 4, name: 'Coffee Table', category: 'Home & Garden', price: 199.99 },
  { id: 5, name: 'Bestseller Novel', category: 'Books', price: 14.99 },
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof allProducts>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Debouncing the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        const filteredResults = allProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredResults);
      } else {
        setSearchResults([]);
      }
    }, 300); // Wait for 300ms before triggering the filter

    return () => clearTimeout(timer); // Cleanup on component unmount or query change
  }, [searchQuery]);

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
      {isSearchOpen && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50">
          {searchResults.map((product) => (
            <div
              key={product.id}
              className="p-2 hover:bg-muted cursor-pointer"
              onClick={() => setSearchQuery(product.name)}
            >
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-muted-foreground">{product.category}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
