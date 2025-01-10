import { useState } from 'react'
import api from '../../api'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from "../../components/ui/button"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay"
import showToast from '../../utils/toast/toastUtils'
import { Loader2 } from 'lucide-react'
import { fetchCart } from '../../store/cartSlice'  // Import your cartSlice's fetchCart action
import { useAppDispatch } from '../../store/hooks'

const formSchema = z.object({
  paymentMethod: z.enum(['upi', 'phonePe', 'googlePay', 'netbanking']),
  upiId: z.string().optional(),
  bankName: z.string().optional(),
})

export default function PaymentPage() {
  const redirect = useNavigate()
  const location = useLocation()
  const orderData = location.state || {}
  const { Razorpay } = useRazorpay()
  const [selectedMethod, setSelectedMethod] = useState<string | undefined>()
  const [isProcessing, setIsProcessing] = useState(false)
  const dispatch = useAppDispatch()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: undefined,
      upiId: '',
      bankName: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsProcessing(true)
    try {
      const response = await api.post('/api/payment/create', {
        orderId: orderData.order.orderId,
        paymentMethod: orderData.order.paymentMethod,
      })

      if (response.data && response.data.orderId && response.data.paymentId) {
        const { orderId, paymentId } = response.data

        const options: RazorpayOrderOptions = {
          key: 'rzp_test_Bs8cNGqoVFMPB6',
          amount: orderData.amount * 100,
          currency: 'INR',
          order_id: orderId,
          name: "Nothing",
          description: "Test Transaction",
          image: "https://yourdomain.com/your-logo.png",
          handler: function (response: any) {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

            api.post('/api/payment/confirm', {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            }).then(() => {
              // Dispatch fetchCart action to update the cart after successful payment
              dispatch(fetchCart())

              // Redirect to the Thank You page
              redirect('/thank-you', {
                state: { orderId, paymentId }
              })
            }).catch(() => {
              showToast('Payment verification failed.', 'error')
            })
          },
          prefill: {
            name: "User Name", // Replace with actual user name
            email: "rahulbhardwaj@benzeenautoparts.com",
            contact: "8545983083",
          },
          theme: {
            color: "#F37254",
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false)
            }
          }
        }

        const rzp = new Razorpay(options)
        rzp.open()
      } else {
        throw new Error('Missing orderId or paymentId in response.')
      }
    } catch (error) {
      showToast('Error creating payment order:', 'error')
      if (error.response) {
        showToast('Error response data:', 'error')
      }
      showToast('Failed to process payment. Please try again.', 'error')
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>Choose your preferred payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedMethod(value)
                        }}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-3 space-y-0">
                          <RadioGroupItem value="upi" id="upi" />
                          <Label htmlFor="upi">UPI</Label>
                        </div>
                        <div className="flex items-center space-x-3 space-y-0">
                          <RadioGroupItem value="phonePe" id="phonePe" />
                          <Label htmlFor="phonePe">PhonePe</Label>
                        </div>
                        <div className="flex items-center space-x-3 space-y-0">
                          <RadioGroupItem value="googlePay" id="googlePay" />
                          <Label htmlFor="googlePay">Google Pay</Label>
                        </div>
                        <div className="flex items-center space-x-3 space-y-0">
                          <RadioGroupItem value="netbanking" id="netbanking" />
                          <Label htmlFor="netbanking">Netbanking</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedMethod === 'upi' && (
                <FormField
                  control={form.control}
                  name="upiId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UPI ID</FormLabel>
                      <FormControl>
                        <Input placeholder="yourname@upi" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your UPI ID (e.g., yourname@upi)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {selectedMethod === 'netbanking' && (
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your bank name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the name of your bank for netbanking
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Process Payment'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
