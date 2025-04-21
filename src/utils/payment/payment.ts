import { RazorpayOrderOptions } from "react-razorpay";

interface CreateRazorpayOptionsProps {
  key: string;
  orderId: string;
  paymentId: string;
  amount: number;
  onSuccess: (response: any) => void;
  onDismiss: () => void;
}

export const createRazorpayOptions = ({
  key,
  orderId,
  paymentId,
  amount,
  onSuccess,
  onDismiss,
}: CreateRazorpayOptionsProps): RazorpayOrderOptions => ({
  key,
  amount: amount * 100,
  currency: "INR",
  order_id: orderId,
  name: "Nothing",
  description: "Test Transaction",
  image: "https://res.cloudinary.com/dwjrssdfo/image/upload/f_auto,q_auto/v1/logo/qwy6olne94j65huvdwcp",
  handler: onSuccess,
  prefill: {
    name: "User Name",
    email: "rahulbhardwaj@benzeenautoparts.com",
    contact: "8545983083",
  },
  theme: {
    color: "#F37254",
  },
  modal: {
    ondismiss: onDismiss,
  },
});