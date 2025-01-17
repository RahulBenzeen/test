import { Card, CardContent } from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useEffect } from 'react'
import { fetchRecentlyViewedProducts } from '../../store/productDetailSlice'

export default function RecentlyViewed() {
  const { recentlyViewed, status } = useAppSelector(state => state.productDetails);
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchRecentlyViewedProducts());
    }
  }, [dispatch, isAuthenticated]);

  console.log('isAuthenticated: ',isAuthenticated)
  // Don't render anything if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (status === "loading") {
    return (
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-64 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="min-w-[250px]">
                <CardContent className="p-4">
                  <Skeleton className="w-full aspect-square rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Don't show the section if there are no recently viewed items
  if (!recentlyViewed?.length) {
    return null;
  }

  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Recently Viewed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {recentlyViewed.map((item) => (
            <Card key={item._id} className="min-w-[250px]">
              <CardContent className="p-4">
                <img
                  src={item.images[0] || "/placeholder.svg?height=200&width=200"}
                  alt={item.name}
                  className="w-full aspect-square object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold truncate">{item.name}</h3>
                <p className="text-muted-foreground">₹{item.price.toFixed(2)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}