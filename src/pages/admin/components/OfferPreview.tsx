import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from '@/components/ui/motion';

type BundleRule = {
  minQty: string;
  maxQty: string;
  discountType: string;
  discountValue: string;
  products: string[];
};

type OfferPreviewProps = {
  rules: BundleRule[];
};

export default function OfferPreview({ rules }: OfferPreviewProps) {
  const hasValidRules = rules.some(rule => 
    rule.minQty && rule.discountValue && rule.products.length > 0
  );

  return (
    <Card className="h-full bg-muted/20">
      <CardHeader className="pb-2 pt-4 px-4 bg-muted/30 border-b">
        <CardTitle className="text-base font-medium">Offer Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {hasValidRules ? (
          <div className="p-4 space-y-4">
            <div className="bg-background rounded-lg p-4 border shadow-sm">
              <h3 className="font-medium text-base mb-3">Bundle Discount</h3>
              
              {rules.filter(rule => 
                rule.minQty && rule.discountValue && rule.products.length > 0
              ).map((rule, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="mb-3 last:mb-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="bg-primary/10">
                      {rule.minQty}{rule.maxQty ? `-${rule.maxQty}` : '+'} items
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={rule.discountType === 'percent' ? 'bg-accent/10' : 'bg-secondary/10'}
                    >
                      {rule.discountType === 'percent' 
                        ? `${rule.discountValue}% OFF` 
                        : rule.discountType === 'price'
                          ? `₹${rule.discountValue} OFF`
                          : `Buy ${rule.minQty} Get ${rule.discountValue} Free`
                      }
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Applies to {rule.products.length} product{rule.products.length !== 1 ? 's' : ''}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="rounded-lg border p-4 bg-background/50">
              <h4 className="text-sm font-medium mb-2">Customer View Example</h4>
              <div className="bg-card border rounded p-3 text-sm">
                <div className="font-medium mb-1">Bundle &amp; Save!</div>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  {rules.filter(rule => 
                    rule.minQty && rule.discountValue && rule.products.length > 0
                  ).map((rule, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <span>•</span>
                      <span>
                        Buy {rule.minQty}{rule.maxQty ? `-${rule.maxQty}` : '+'} items: 
                        {rule.discountType === 'percent' 
                          ? ` ${rule.discountValue}% off` 
                          : rule.discountType === 'price'
                            ? ` ₹${rule.discountValue} off`
                            : ` Get ${rule.discountValue} free`
                        }
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-2 text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎁</span>
              </div>
              <p className="text-sm">Configure your offer rules to see a preview</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}