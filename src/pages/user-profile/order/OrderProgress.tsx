import React from 'react'
import { Clock, Package, Truck, CheckCircle } from 'lucide-react'

const steps = [
  { id: 'pending', label: 'Order Placed', icon: Clock },
  { id: 'processing', label: 'Processing', icon: Package },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle },
]

const OrderProgress = ({ status }) => {
  const currentStep = steps.findIndex(step => step.id === status)

  return (
    <div className="w-full py-4">
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary transition-all duration-500 -translate-y-1/2"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="relative z-10 flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index <= currentStep
            const isCompleted = index < currentStep

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}
                  ${isCompleted ? 'bg-primary text-white' : ''}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`
                  mt-2 text-sm font-medium
                  ${isActive ? 'text-primary' : 'text-gray-500'}
                `}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default React.memo(OrderProgress)