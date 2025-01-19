import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { Button } from "../../../components/ui/button"

interface EmptyOrderStateProps {
  hasSearch: boolean
}

const EmptyOrderState: React.FC<EmptyOrderStateProps> = ({ hasSearch }) => {
  return (
    <div className="text-center py-12">
      <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {hasSearch ? "No Orders Found" : "No Orders Yet"}
      </h3>
      <p className="text-gray-500 mb-4">
        {hasSearch 
          ? "No orders match your search criteria. Try different filters or terms."
          : "Start shopping to see your orders here!"
        }
      </p>
      <Button 
        variant="outline"
        onClick={() => window.location.href = "/shop"}
        className="hover:bg-primary hover:text-white transition-colors"
      >
        Browse Products
      </Button>
    </div>
  )
}

export default React.memo(EmptyOrderState)