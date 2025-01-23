import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRazorpay } from "react-razorpay";
import { useAppDispatch } from "../../store/hooks";
import { fetchCart } from "../../store/cartSlice";
import api from "../../api";
import showToast from "../../utils/toast/toastUtils";
import { OrderSummary } from "./OrderSummary";
import { PaymentMethodForm } from "./PaymentMethodForm";
import { createRazorpayOptions } from "../../utils/payment/payment";

export default function PaymentPage() {
  const redirect = useNavigate();
  const location = useLocation();
  const orderData = location.state || {};
  const { Razorpay } = useRazorpay();
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useAppDispatch();

  const totalAmount = orderData.order?.order.products?.reduce(
    (total: number, product: { price: number; quantity: number }) => 
      total + product.price * product.quantity,
    0
  );

  async function handlePayment(values: any) {
    setIsProcessing(true);
    try {
      const response = await api.post("/api/payment/create", {
        orderId: orderData.order.orderId,
        paymentMethod: orderData.order.order.paymentMethod,
      });

      if (!response.data?.orderId || !response.data?.paymentId) {
        throw new Error("Missing orderId or paymentId in response.");
      }

      const { orderId, paymentId } = response.data;

      const options = createRazorpayOptions({
        key: "rzp_test_Bs8cNGqoVFMPB6",
        orderId,
        paymentId,
        amount: totalAmount,
        onSuccess: async (response) => {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
          try {
            await api.post("/api/payment/confirm", {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            });
            dispatch(fetchCart());
            redirect("/thank-you", {
              replace: true,
              state: { orderId, paymentId },
            });
          } catch {
            showToast("Payment verification failed.", "error");
          }
        },
        onDismiss: () => setIsProcessing(false),
      });

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      showToast("Failed to process payment. Please try again.", "error");
      setIsProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <OrderSummary products={orderData.order?.order.products || []} />
          <PaymentMethodForm
            onSubmit={handlePayment}
            totalAmount={totalAmount}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}