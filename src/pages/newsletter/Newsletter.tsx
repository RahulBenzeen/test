import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"

export default function Newsletter() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Subscribe to our newsletter for exclusive offers and new arrivals
        </p>
        <form className="flex gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1"
          />
          <Button>Subscribe</Button>
        </form>
      </div>
    </section>
  )
}