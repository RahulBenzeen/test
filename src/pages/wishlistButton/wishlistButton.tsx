import React, { memo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAppSelector } from "../../store/hooks";

interface WishlistButtonProps {
  productId: string;
  isWishlisted: boolean;
  toggleWishlist: (productId: string, e: React.MouseEvent) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = memo(({ productId, isWishlisted, toggleWishlist }) => {
  const { pendingChanges, optimisticUpdates } = useAppSelector(state => state.whishlist);
  const isPending = pendingChanges.includes(productId);
  const isOptimisticallyUpdated = optimisticUpdates.includes(productId);
  
  // Determine the final wishlist state considering optimistic updates
  const finalWishlistState = isOptimisticallyUpdated ? !isWishlisted : isWishlisted;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className={`rounded-full bg-white/80 backdrop-blur-sm hover:bg-white ${
              isPending ? 'animate-pulse' : ''
            }`}
            onClick={(e) => toggleWishlist(productId, e)}
            disabled={isPending}
          >
            <Heart
              className={`h-4 w-4 transition-colors duration-300 ${
                finalWishlistState ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isPending
              ? 'Updating...'
              : finalWishlistState
              ? "Remove from Wishlist"
              : "Add to Wishlist"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

WishlistButton.displayName = 'WishlistButton';

export default WishlistButton;