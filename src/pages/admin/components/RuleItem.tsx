import  { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ProductSelector from './ProductSelector';
import { cn } from '../../../lib/utils';

type RuleItemProps = {
  rule: {
    minQty: string;
    maxQty: string;
    discountType: string;
    discountValue: string;
    products: string[];
  };
  index: number;
  updateRule: (index: number, field: string, value: any) => void;
  removeRule: (index: number) => void;
  disabled?: boolean;
};

export default function RuleItem({ 
  rule, 
  index, 
  updateRule, 
  removeRule,
  disabled = false 
}: RuleItemProps) {
  const [expanded, setExpanded] = useState(false);
  
  const handleNumberInput = (field: string, value: string) => {
    const numValue = value === '' ? '' : value;
    updateRule(index, field, numValue);
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm transition-all hover:shadow-md overflow-hidden">
      <div className="grid grid-cols-12 gap-4 p-4 items-center">
        <div className="col-span-2">
          <Input
            type="number"
            placeholder="Min"
            value={rule.minQty}
            onChange={(e) => handleNumberInput('minQty', e.target.value)}
            className="w-full"
            disabled={disabled}
          />
        </div>
        <div className="col-span-3">
          <Select
            value={rule.discountType}
            onValueChange={(value) => updateRule(index, 'discountType', value)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Discount Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percent">Percentage (%)</SelectItem>
              <SelectItem value="price">Fixed Amount (₹)</SelectItem>
              <SelectItem value="bogo">Buy X Get Y Free</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Input
            type="number"
            placeholder="Value"
            value={rule.discountValue}
            onChange={(e) => handleNumberInput('discountValue', e.target.value)}
            className="w-full"
            disabled={disabled}
          />
        </div>
        <div className="col-span-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full justify-between"
            onClick={() => setExpanded(!expanded)}
            disabled={disabled}
          >
            <span>{rule.products.length || 0} selected</span>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <div className="col-span-1 text-right">
          <Button
            variant="ghost"
            type="button"
            onClick={() => removeRule(index)}
            disabled={disabled}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      </div>
      
      <div 
        className={cn(
          "bg-muted/30 px-4 pb-4 pt-2 border-t transition-all overflow-hidden",
          !expanded && "hidden"
        )}
      >
        <div className="mb-2">
          <p className="text-sm font-medium mb-2">Selected Products</p>
          <ProductSelector
            selectedProducts={rule.products}
            onChange={(value) => updateRule(index, 'products', value)}
          />
        </div>
        
        {rule.products.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1">Selected products:</p>
            <div className="flex flex-wrap gap-1">
              {rule.products.slice(0, 5).map((product, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {product.substring(0, 8)}...
                </Badge>
              ))}
              {rule.products.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{rule.products.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}