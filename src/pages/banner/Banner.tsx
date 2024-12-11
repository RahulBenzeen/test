import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  { src: 'https://res.cloudinary.com/dkii6mubi/image/upload/f_auto,q_auto/v1/ecommerce/nbbaa29z6wtwep84urb0', alt: "Luxury Shopping" },
  { src: 'https://res.cloudinary.com/dkii6mubi/image/upload/f_auto,q_auto/v1/ecommerce/ddul5ud64r174pdtiid0', alt: "Premium Collection" },
  { src: 'https://res.cloudinary.com/dkii6mubi/image/upload/f_auto,q_auto/v1/ecommerce/t1rourjmvhcf1nt2al3w', alt: "Exclusive Deals" },
];

export default function Banner() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextImage = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prevImage) => (prevImage - 1 + images.length) % images.length);
  };

  return (
    <section className="relative h-[600px] bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
      <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to LuxeMarket</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          Discover our curated collection of premium products
        </p>
        <div className="flex gap-4">
          <Link to={'/product'}>
            <Button size="lg" className="text-lg">
              Shop Now
            </Button>
          </Link>
          <Link to={'/product'}>
            <Button size="lg" variant="outline" className="text-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors">
              View Collections
            </Button>
          </Link>
        </div>
      </div>
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black bg-opacity-50 hover:bg-opacity-75 transition-colors rounded-full p-2"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black bg-opacity-50 hover:bg-opacity-75 transition-colors rounded-full p-2"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentImage ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}