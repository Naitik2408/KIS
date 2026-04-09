import { Truck, RotateCcw, Award, Shield } from 'lucide-react'

interface TrustSignalsProps {
  shippingInfo?: {
    estimatedDelivery: string
    freeShipping: boolean
    returnPolicy: string
  }
  warranty?: {
    duration: string
    coverage: string
  }
  rating: number
  reviews: number
}

export function ProductTrustSignals({
  shippingInfo,
  warranty,
  rating,
  reviews,
}: TrustSignalsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Free Shipping */}
      {shippingInfo?.freeShipping && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="font-semibold text-green-700 dark:text-green-400">Free Shipping</span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">
            {shippingInfo.estimatedDelivery}
          </p>
        </div>
      )}

      {/* Returns */}
      {shippingInfo?.returnPolicy && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-blue-700 dark:text-blue-400">Easy Returns</span>
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            {shippingInfo.returnPolicy}
          </p>
        </div>
      )}

      {/* Warranty */}
      {warranty && (
        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="font-semibold text-purple-700 dark:text-purple-400">Warranty</span>
          </div>
          <p className="text-sm text-purple-600 dark:text-purple-400">
            {warranty.duration} coverage
          </p>
        </div>
      )}

      {/* Customer Rating */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span className="font-semibold text-amber-700 dark:text-amber-400">Highly Rated</span>
        </div>
        <p className="text-sm text-amber-600 dark:text-amber-400">
          {rating}/5 ({reviews} reviews)
        </p>
      </div>
    </div>
  )
}
