import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Minus, Plus, Trash2 } from "lucide-react"
import { BundleDiscount, CartItem, Gifts } from "../../store/cartSlice"
import GiftSelection from "../cart/offer/GiftSelection"

interface CartSummaryProps {
  cartItems: CartItem[]
  onUpdateQuantity: (productId: string, newQuantity: number) => void
  onRemoveItem: (productId: string) => void
  onClearCart: () => void
  gifts: Gifts
  bundleDiscounts: BundleDiscount
  totalPrice: number
  onGiftSelect: (giftId: string) => void
  selectedGiftId: string | null
}


export default function CartSummary({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  gifts,
  bundleDiscounts,
  totalPrice,
  onGiftSelect,
  selectedGiftId,
}: CartSummaryProps) {


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Cart ({cartItems.length} items)</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearCart}
            className="text-muted-foreground hover:text-destructive"
          >
            Clear Cart
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] sm:h-[500px] pr-4">
          <ul className="space-y-6">
            {cartItems.map((item) => (
              <li key={item._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div className="flex items-start space-x-4">
                  <img 
                    src={item?.product?.images[0].secure_url} 
                    alt={item?.product?.name} 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="space-y-1">
                    <h3 className="font-medium line-clamp-2">{item?.product?.name}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">₹{(item.discountedPrice || item.price).toFixed(2)}</p>
                      {item.discountedPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          ₹{item.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                    {item.discountedPrice && (
                      <p className="text-xs text-green-600">
                        Save ₹{((item.price - item.discountedPrice) * item.quantity).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                      className="h-8 w-8"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                      className="h-8 w-8"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onRemoveItem(item._id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
              {Array.isArray(gifts) && gifts.length > 0 && (
                <GiftSelection 
                  gifts={gifts} 
                  onGiftSelect={onGiftSelect}
                  initialSelectedGiftId={selectedGiftId ?? undefined}
                />
              )}
      </CardContent>
      <CardFooter className="border-t pt-6 flex-col gap-4">
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>
          {Number(bundleDiscounts) > 0 && (
            <div className="flex justify-between items-center text-sm text-green-600">
              <span>Total Savings</span>
              <span>₹{Number(bundleDiscounts)}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}