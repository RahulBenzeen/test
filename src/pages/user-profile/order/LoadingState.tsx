import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-600">Loading your orders...</p>
      </div>
    </div>
  )
}

export default React.memo(LoadingState)