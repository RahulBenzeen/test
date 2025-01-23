import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { removeFromCartAsync, updateQuantityAsync, clearCartAsync } from '../../store/cartSlice'
import { fetchAddresses } from '../../store/addressSlice'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../../store/orderSlice'
import CartSummary from './CartSummary'
import ShippingAddress from './ShippingAddress'
import EmptyCart from './EmptyCart'
import showToast from '../../utils/toast/toastUtils'

export default function CheckoutPage() {
  const cartItems = useAppSelector((state) => state.cart.items)
  const savedAddresses = useAppSelector((state) => state.address.addresses)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchAddresses())
  }, [dispatch])

  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeFromCartAsync(productId))
  }

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantityAsync({ id: productId, quantity: newQuantity }))
    } else {
      dispatch(removeFromCartAsync(productId))
    }
  }

  const handleClearCart = () => {
    dispatch(clearCartAsync())
  }

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      showToast('Please select a shipping address.', 'error')
      return
    }

    const selectedAddress = savedAddresses.find((addr) => addr._id === selectedAddressId)
    if (!selectedAddress) {
      showToast('Selected address not found.', 'error')
      return
    }

    const products = cartItems.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.discountedPrice || item.price,
      quantity: item.quantity,
    }))

    const orderData = {
      products,
      shippingAddress: selectedAddress,
      paymentMethod: 'razorpay',
    }

    dispatch(createOrder(orderData))
      .then((response) => {
        if (response.payload?.success) {
          navigate('/checkout/place-order', { state: { order: response.payload } })
        } else {
          showToast(response.payload?.message || 'Order creation failed', 'error')
        }
      })
      .catch((error) => {
        showToast('Error while creating order', 'error')
        console.error('Error while creating order:', error)
      })
  }

  if (cartItems.length === 0) {
    return <EmptyCart onContinueShopping={() => navigate('/')} />
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Cart Summary */}
        <div className="space-y-6">
          <CartSummary 
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
          />
        </div>

        {/* Shipping Address */}
        <div className="space-y-6">
          <ShippingAddress 
            addresses={savedAddresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={setSelectedAddressId}
            onAddNewAddress={() => navigate("/profile?tab=addresses")}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>
    </div>
  )
}