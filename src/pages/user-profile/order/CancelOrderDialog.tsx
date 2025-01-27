import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { Textarea } from "../../../components/ui/textarea"
import { AlertCircle, Loader2 } from 'lucide-react'

interface CancelOrderDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => Promise<void>
  isLoading: boolean
}

const CancelOrderDialog: React.FC<CancelOrderDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading
}) => {
  const [reason, setReason] = React.useState('')
  const [error, setError] = React.useState('')

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for cancellation')
      return
    }
    if (reason.length < 10) {
      setError('Please provide a more detailed reason (minimum 10 characters)')
      return
    }
    try {
      await onConfirm(reason)
      setReason('')
      setError('')
    } catch  {
      setError('Failed to cancel order. Please try again.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
          <DialogDescription>
            Please provide a reason for cancelling this order. This will help us improve our service.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Enter your reason for cancellation..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              setError('')
            }}
            className="min-h-[100px]"
          />
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              'Confirm Cancellation'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default React.memo(CancelOrderDialog)