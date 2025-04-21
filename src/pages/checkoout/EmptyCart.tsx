import { Button } from "../../components/ui/button"
import { ShoppingBag } from "lucide-react"

interface EmptyCartProps {
  onContinueShopping: () => void
}

export default function EmptyCart({ onContinueShopping }: EmptyCartProps) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button onClick={onContinueShopping} className="w-full sm:w-auto">
          Continue Shopping
        </Button>
      </div>
    </div>
  )
}