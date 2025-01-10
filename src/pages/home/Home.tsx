import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
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
import NonAuthRoute from '../../utils/ProtectedRoute/NonAuthRoute';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from '../admin/AdminDashboard';
import { ReactNode } from 'react';


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
const CheckoutPage = lazy(() => import('../checkoout/checkout'));
const PaymentPage = lazy(() => import('../payment/payment'));
const OrderConfirmationPage = lazy(() => import('../order-confirmation/order-confirmation'));
const ThankYouPage = lazy(() => import('../thank-you/thank-you'));
const OrderPage = lazy(() => import('../my-orders/my-order'));
const NotFound = lazy(() => import('../pageNotfound/pageNotFound'));
const Profile = lazy(() => import('../user-profile/Profile'));
const ResetPassword = lazy(() => import('../auth/resetPassword'));
const AllSpecialOffers  = lazy(() => import('../special-offer/all-special-offers'));


function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {!isAdminRoute && <Breadcrumbs />}
      <main className="flex-grow">{children}</main>
      {!isAdminRoute && <Newsletter />}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function Home() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <AuthCheck>
          <Layout>
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

                {/* Non-authenticated routes */}
                <Route element={<NonAuthRoute />}>
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                </Route>

                {/* Admin Routes (only accessible by admin) */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
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
          </Layout>
        </AuthCheck>
      </Router>
    </ErrorBoundary>
  );
}
