import { ArrowRight } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent, CardFooter } from "../../components/ui/card"

export default function SpecialOffers() {
  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Special Offers</h2>
          <Button variant="ghost">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((offer) => (
            <Card key={offer}>
              <CardContent className="p-4">
                <Badge className="mb-2" variant="destructive">Save 20%</Badge>
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt={`Offer ${offer}`}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-lg">Limited Time Offer</h3>
                <p className="text-muted-foreground">Ends in 24 hours</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Shop Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}