import React from 'react'
import { Clock, Package, Truck, CheckCircle } from 'lucide-react'

const steps = [
  { id: 'pending', label: 'Order Placed', icon: Clock },
  { id: 'processing', label: 'Processing', icon: Package },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle },
]

const OrderProgress = ({ status }) => {
  const currentStep = steps.findIndex(step => step.id === status.toLocaleLowerCase())

  return (
    <div className="w-full py-2 sm:py-4">
      <div className="relative">
        <div className="overflow-x-auto pb-2 hide-scrollbar">
          <div className="relative min-w-[400px] px-4">
            {/* Progress Bar */}
            <div className="absolute top-1/3 left-4 right-4 h-0.5 bg-gray-200 -translate-y-1/2" />
            <div 
              className="absolute top-1/3 left-4 h-0.5 bg-primary transition-all duration-500 -translate-y-1/2"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />

            {/* Steps */}
            <div className="relative z-10 flex justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = index <= currentStep
                const isCompleted = index < currentStep

                return (
                  <div key={step.id} className="flex flex-col items-center flex-shrink-0 w-24">
                    <div className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                      transition-all duration-300
                      ${isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}
                      ${isCompleted ? 'bg-primary text-white' : ''}
                    `}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className={`
                      mt-2 text-xs sm:text-sm font-medium text-center px-1
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
      </div>
    </div>
  )
}

export default React.memo(OrderProgress)