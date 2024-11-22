import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../header/Header';
import Breadcrumbs from '../breadcrum/breadcrum';
import Footer from '../footer/Footer';
import Newsletter from '../newsletter/Newsletter';
import ErrorBoundary from '../../utils/ErrorHandler/ErrorBoundary';
import ProtectedRoute from '../../utils/ProtectedRoute/ProtectedRoute';
import AdminRoute from '../../utils/ProtectedRoute/AdminRoute';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';
import ErrorFallback from '../ErrorFallback/ErrorFallback';
import AuthCheck from '../auth/AuthCheck';
import 'react-toastify/dist/ReactToastify.css';

// Lazy-loaded components
const Banner = lazy(() => import('../banner/Banner'));
const FeaturedProducts = lazy(() => import('../featuredProducts/FeaturedProducts'));
const ShopByCategory = lazy(() => import('../shopBycategory/shop-by-category'));
const RecentlyViewed = lazy(() => import('../recently-viewed/recently-viewed'));
const SpecialOffers = lazy(() => import('../special-offer/special-offer'));
const ProductDetailPage = lazy(() => import('../productDetail/productDetail'));
const ProductPage = lazy(() => import('../product/allProduct'));
const SignIn = lazy(() => import('../auth/login'));
const Register = lazy(() => import('../auth/register'));
const AddProductPage = lazy(() => import('../admin-product/add-product'));
const DeleteProductPage = lazy(() => import('../admin-product/remove-product'));
const UpdateProductPage = lazy(() => import('../admin-product/update-product'));
const CheckoutPage = lazy(() => import('../checkoout/checkout'));
const PaymentPage = lazy(() => import('../payment/payment'));
const OrderConfirmationPage = lazy(() => import('../order-confirmation/order-confirmation'));
const ThankYouPage = lazy(() => import('../thank-you/thank-you'));
const OrderPage = lazy(() => import('../my-orders/my-order'));
const NotFound = lazy(() => import('../pageNotfound/pageNotFound'));
const Profile = lazy(() => import('../user-profile/Profile'));

export default function Home() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <AuthCheck>
          <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <Breadcrumbs />
            <main className="flex-grow">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={
                    <>
                      <Banner />
                      <FeaturedProducts />
                      <ShopByCategory />
                      <RecentlyViewed />
                      <SpecialOffers />
                    </>
                  } />

                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/product" element={<ProductPage />} />

                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/register" element={<Register />} />

                  {/* Admin Routes (only accessible by admin) */}
                  <Route element={<AdminRoute />}>
                    <Route path="/add-product" element={<AddProductPage />} />
                    <Route path="/delete-product" element={<DeleteProductPage />} />
                    <Route path="/update-product" element={<UpdateProductPage />} />
                  </Route>

                  {/* Protected Routes (only accessible by logged-in users) */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/place-order" element={<PaymentPage />} />
                    <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                    <Route path="/thank-you" element={<ThankYouPage />} />
                    <Route path="/my-order" element={<OrderPage />} />
                    <Route path="/profile" element={<Profile />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Newsletter />
            <Footer />
          </div>
        </AuthCheck>
      </Router>
    </ErrorBoundary>
  );
}