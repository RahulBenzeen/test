import { ArrowRight } from 'lucide-react';
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { useAppDispatch, useAppSelector } from '../../store/hooks'; // Combined imports
import { useEffect } from 'react';
import { fetchSpecialOffers } from '../../store/specialProductSlice'; // Import the correct thunk
import { useNavigate } from 'react-router-dom';

export default function AllSpecialOffers() {
  const { items, status, error } = useAppSelector((state) => state.specialOffers); // Assuming specialOffers slice
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSpecialOffers({ page: 1, limit: 100 })); // Fetch all special offers
  }, [dispatch]);

  // Handle loading state
  if (status === 'loading') {
    return (
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold">Special Offers</h2>
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  const shopNow = (id: string) => {
    navigate(`/product/${id}`);
  };

  // Handle error state
  if (status === 'failed') {
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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Special Offers</h2>
          <Button variant="ghost" onClick={() => navigate('/special-offers')}>
            <ArrowRight className="ml-2 h-4 w-4" /> View All Special Offers
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items?.map((product) => (
            <Card key={product._id}>
              <CardContent className="p-4">
                {product.discountPercentage > 0 && (
                  <Badge className="mb-2" variant="destructive">
                    Save {product.discountPercentage}%
                  </Badge>
                )}
                <img
                  src={product?.images[0] || "/placeholder.svg?height=300&width=400"}
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
                <Button className="w-full" onClick={() => shopNow(product._id)}>
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
