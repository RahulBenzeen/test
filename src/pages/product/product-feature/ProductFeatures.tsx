"use client"

import React from "react"
import { Truck, Shield, RefreshCcw, Clock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Orders over ₹999",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% Protected",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description: "30 Day Policy",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Always Available",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
]

const ProductFeatures = () => (
  <TooltipProvider>
    <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg mb-8">
      {features.map((feature, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-sm">
              <div className={`p-2 ${feature.bgColor} rounded-full shrink-0`}>
                <feature.icon className={`w-4 h-4 ${feature.iconColor}`} />
              </div>
              <div className="hidden sm:block">
                <p className="font-medium">{feature.title}</p>
                <p className="text-muted-foreground text-xs">{feature.description}</p>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="sm:hidden">
            <p className="font-medium">{feature.title}</p>
            <p className="text-xs">{feature.description}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  </TooltipProvider>
)

export default React.memo(ProductFeatures)

