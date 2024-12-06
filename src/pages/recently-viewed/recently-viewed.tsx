import { Clock } from 'lucide-react'
import { Card, CardContent } from "../../components/ui/card"
// import { useAppDispatch, useAppSelector } from '../../store/hooks'
// import { useEffect } from 'react'
// import { fetchRecentlyViewedProducts } from '../../store/productDetailSlice'

export default function RecentlyViewed() {

//   const { recentlyViewed, status } = useAppSelector(state => state.productDetails);
//   const dispatch = useAppDispatch();
//   console.log({recentlyViewed})

// useEffect(() => {
  
//     dispatch(fetchRecentlyViewedProducts());
  
// }, [dispatch, status]);


  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex items-center gap-2 mb-8">
        <Clock className="h-6 w-6" />
        <h2 className="text-3xl font-bold">Recently Viewed</h2>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <Card key={item} className="min-w-[250px]">
            <CardContent className="p-4">
              <img
                src="/placeholder.svg?height=200&width=200"
                alt={`Recent item ${item}`}
                className="w-full aspect-square object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold truncate">Product Name</h3>
              <p className="text-muted-foreground">$XX.XX</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}