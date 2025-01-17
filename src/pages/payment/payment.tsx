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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/card"
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay"
import showToast from '../../utils/toast/toastUtils'
import { Loader2, CreditCard } from 'lucide-react'
import { fetchCart } from '../../store/cartSlice'
import { useAppDispatch } from '../../store/hooks'
import { ScrollArea } from "../../components/ui/scroll-area"

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
          image: "https://res.cloudinary.com/dwjrssdfo/image/upload/f_auto,q_auto/v1/logo/qwy6olne94j65huvdwcp",
          handler: function (response: any) {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

            api.post('/api/payment/confirm', {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            }).then(() => {
              dispatch(fetchCart())
              redirect('/thank-you', {
                replace: true,
                state: { orderId, paymentId }
              })
            }).catch(() => {
              showToast('Payment verification failed.', 'error')
            })
          },
          prefill: {
            name: "User Name",
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
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Order Summary
              </CardTitle>
              <CardDescription>
                Review your order details before payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] rounded-md border p-4">
                <div className="space-y-4">
                  {orderData.order?.order.products?.map((product: any, index: number) => (
                    <div key={index} className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
                      </div>
                      <p className="font-medium">₹{product.price * product.quantity}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center font-medium">
                  <span>Total Amount</span>
                  <span>₹{orderData.order?.order.products?.reduce((total: number, product: any) => {
      return total + product.price * product.quantity;
    }, 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose your preferred payment option</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value)
                              setSelectedMethod(value)
                            }}
                            defaultValue={field.value}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                          >
                            {[
                              { value: 'upi', label: 'UPI' },
                              { value: 'phonePe', label: 'PhonePe' },
                              { value: 'googlePay', label: 'Google Pay' },
                              { value: 'netbanking', label: 'Netbanking' },
                            ].map((option) => (
                              <div
                                key={option.value}
                                className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                                  field.value === option.value
                                    ? 'border-primary bg-primary/5'
                                    : 'hover:border-primary/50'
                                }`}
                              >
                                <RadioGroupItem value={option.value} id={option.value} />
                                <Label
                                  htmlFor={option.value}
                                  className="flex-1 cursor-pointer"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            ))}
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
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full"
                size="lg"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isProcessing || !form.getValues().paymentMethod}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${orderData.order?.order.products?.reduce((total: number, product: any) => {
                    return total + product.price * product.quantity;
                  }, 0)}`
                )}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                By proceeding with the payment, you agree to our Terms of Service
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}