import React, { memo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip" // Update with your actual imports
import { Button } from "../../components/ui/button"
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  productId: string;
  isWishlisted: boolean;
  toggleWishlist: (productId: string, e: React.MouseEvent) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = memo(({ productId, isWishlisted, toggleWishlist }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={(e) => toggleWishlist(productId, e)}
          >
            <Heart
              className={`h-4 w-4 transition-colors duration-300 ${
                isWishlisted ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

export default WishlistButton;
