import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="border-t py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">About LuxeMarket</h3>
            <p className="text-sm text-muted-foreground">
              Premium shopping destination for all your needs. Quality products, exceptional service.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/shipping">Shipping Information</Link></li>
              <li><Link to="/returns">Returns & Exchanges</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick as</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/Linkbout">About Us</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/store-locator">Store Locator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Follow Us</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="#">Instagram</Link></li>
              <li><Link to="#">Facebook</Link></li>
              <li><Link to="#">Twitter</Link></li>
              <li><Link to="#">Pinterest</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          © 2024 Nothing. All rights reserved.
        </div>
      </div>
    </footer>
  )
}