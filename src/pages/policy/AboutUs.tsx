
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users2, Target, Award } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>

      <div className="grid gap-8">
        <Card>
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <div className="mb-8">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                  alt="Our Store"
                  className="w-full h-[400px] object-cover rounded-lg mb-6"
                />
                <p className="text-lg text-gray-700 leading-relaxed">
                  Welcome to our store, where passion meets quality. Since our establishment, we've been dedicated to providing exceptional products and outstanding service to our valued customers.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                  <p className="text-gray-700">
                    Founded with a vision to revolutionize online shopping, we've grown from a small startup to a trusted name in e-commerce. Our journey has been driven by our commitment to quality, innovation, and customer satisfaction.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                  <p className="text-gray-700">
                    We strive to provide our customers with the best shopping experience possible, offering carefully curated products at competitive prices while maintaining the highest standards of customer service.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Established</h3>
                <p className="text-gray-600">2015</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users2 className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Happy Customers</h3>
                <p className="text-gray-600">50,000+</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Products</h3>
                <p className="text-gray-600">10,000+</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Awards</h3>
                <p className="text-gray-600">15+</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Quality</h3>
                <p className="text-gray-600">
                  We never compromise on the quality of our products, ensuring that every item meets our high standards.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Innovation</h3>
                <p className="text-gray-600">
                  We continuously evolve and adapt to bring you the latest trends and technologies.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Customer First</h3>
                <p className="text-gray-600">
                  Your satisfaction is our priority, and we're committed to providing exceptional service.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}