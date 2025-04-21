import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t py-12 mt-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-bold mb-4 text-lg">About Nothing.</h3>
            <p className="text-sm text-gray-600">
              Premium shopping destination for all your needs. Quality products, exceptional service.
            </p>
          </div>

          {/* Customer Service Section */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:underline">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:underline">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:underline">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
              {/* Uncomment these if needed */}
              {/* <li><Link to="/careers" className="hover:underline">Careers</Link></li> */}
              {/* <li><Link to="/store-locator" className="hover:underline">Store Locator</Link></li> */}
            </ul>
          </div>

          {/* Follow Us Section */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Follow Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:underline">
                  Instagram
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Facebook
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Twitter
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Pinterest
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t mt-12 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Nothing. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
