import React from "react"
import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2 } from "lucide-react"

interface RetryPaymentDialogProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  isLoading: boolean
}

const RetryPaymentDialog: React.FC<RetryPaymentDialogProps> = ({ isOpen, onClose, orderId, isLoading }) => {
  const router = useNavigate()

  const handleRetryPayment = () => {
    router(`/checkout}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Retry Payment</DialogTitle>
          <DialogDescription>
            Your payment is currently pending. Please retry the payment to complete your order.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 text-sm text-amber-600">
            <AlertCircle className="h-4 w-4" />
            <span>Your order will not be processed until the payment is completed.</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleRetryPayment} disabled={isLoading} className="bg-primary hover:bg-primary/90">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Retry Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default React.memo(RetryPaymentDialog)

