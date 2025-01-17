import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const fetchCloudinaryImages = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/products/cloudinary/images`);
    const data = await response.json();
    return data.success ? data.images : [];
  } catch (error) {
    console.error("Failed to fetch Cloudinary images:", error);
    return [];
  }
};

export default function Banner() {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const getImages = async () => {
      const fetchedImages = await fetchCloudinaryImages();
      setImages(fetchedImages);
    };
    getImages();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const timer = setInterval(() => {
        if (!isTransitioning) {
          setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        }
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [images, isTransitioning]);

  const changeImage = useCallback((direction: 'next' | 'prev') => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentImage((prevImage) => {
      const newIndex = direction === 'next'
        ? (prevImage + 1) % images.length
        : (prevImage - 1 + images.length) % images.length;
      return newIndex;
    });

    setTimeout(() => setIsTransitioning(false), 500);
  }, [images.length, isTransitioning]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isSignificantSwipe = Math.abs(distance) > 50;

    if (isSignificantSwipe) {
      if (distance > 0) {
        changeImage('next');
      } else {
        changeImage('prev');
      }
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <section 
      className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        {images.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={image.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out transform ${
              index === currentImage 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-tight">
          There's something in Nothing.
        </h1>
        <p className="text-base xs:text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-xs xs:max-w-sm sm:max-w-xl md:max-w-2xl mx-auto">
          Discover our curated collection of premium products.
        </p>
        <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 w-full xs:w-auto max-w-xs sm:max-w-none mx-auto">
          <Link to="/product" className="w-full xs:w-auto">
            <Button 
              size="lg" 
              className="w-full xs:w-auto text-base sm:text-lg py-6 px-6 sm:px-8 min-w-[160px] max-w-[200px]"
            >
              Shop Now
            </Button>
          </Link>
          <Link to="/product" className="w-full xs:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full xs:w-auto text-base sm:text-lg py-6 px-6 sm:px-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors min-w-[160px] max-w-[200px]"
            >
              View Collections
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigation Buttons - Hidden on mobile, shown on larger screens */}
      <div className="hidden sm:block">
        <button
          onClick={() => changeImage('prev')}
          className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/75 transition-colors rounded-full p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
        <button
          onClick={() => changeImage('next')}
          className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/75 transition-colors rounded-full p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2 sm:space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => !isTransitioning && setCurrentImage(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentImage 
                ? 'bg-white scale-110' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}