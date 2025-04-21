import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchSpecialOffers } from "../../store/specialProductSlice";
import { useNavigate } from "react-router-dom";

export default function AllSpecialOffers() {
  const { items, status, error, lastFetched } = useAppSelector(
    (state) => state.specialOffers
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const currentTime = Date.now();
    const cacheTime = 5 * 60 * 1000; // 5 minutes

    if (!lastFetched || currentTime - lastFetched > cacheTime) {
      dispatch(fetchSpecialOffers({ page: 1, limit: 100 }));
    }
  }, [dispatch, lastFetched]);

  const shopNow = (id: string) => {
    navigate(`/product/${id}`);
  };

  if (status === "loading") {
    return (
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
            <h2 className="text-2xl sm:text-3xl font-bold">Special Offers</h2>
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="w-full h-48 rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <div className="mt-2 flex items-center space-x-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (status === "failed") {
    return (
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold">Special Offers</h2>
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <h2 className="text-2xl sm:text-3xl font-bold">Special Offers</h2>
          <Button
            variant="ghost"
            onClick={() => navigate("/special-offers")}
            className="flex items-center gap-2"
          >
            View All Special Offers <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items?.map((product) => (
            <Card key={product._id}>
              <CardContent className="p-4">
                {product.discountPercentage > 0 && (
                  <Badge className="mb-2" variant="destructive">
                    Save {product.discountPercentage}%
                  </Badge>
                )}
                <img
                  src={
                    product?.images[0].secure_url ||
                    "/placeholder.svg?height=300&width=400"
                  }
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-muted-foreground">Ends in 24 hours</p>
                <div className="mt-2">
                  {product.discountPercentage > 0 ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-red-500">
                        ₹{product.discountedPrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.price.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-semibold">
                      ₹{product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => shopNow(product._id)}
                >
                  Shop Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}