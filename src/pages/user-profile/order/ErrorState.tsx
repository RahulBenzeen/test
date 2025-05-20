import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  onRetry: () => void
}

const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Orders</h2>
        <p className="text-gray-600 mb-4">We encountered an error while loading your orders.</p>
        <Button 
          onClick={onRetry}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          Try Again
        </Button>
      </div>
    </div>
  )
}

export default React.memo(ErrorState)