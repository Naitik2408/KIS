'use client'

import { Check } from 'lucide-react'

interface ProductSpecsProps {
  specs?: {
    [key: string]: string
  }
  description: string
}

export function ProductSpecs({ specs, description }: ProductSpecsProps) {
  // Highlight important specs for quick scanning
  const highlightedSpecs = ['Processor', 'RAM', 'Storage', 'Display', 'Battery Life', 'Condition', 'OS']

  return (
    <div className="space-y-8">
      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">About this product</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {/* Specifications */}
      {specs && Object.keys(specs).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Key Specifications</h3>
          
          {/* Highlighted specs grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Object.entries(specs)
              .filter(([key]) => highlightedSpecs.includes(key))
              .map(([key, value]) => (
                <div
                  key={key}
                  className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition"
                >
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{key}</div>
                  <div className="text-sm font-bold text-foreground">{value}</div>
                </div>
              ))}
          </div>

          {/* Full specs table */}
          {Object.keys(specs).length > highlightedSpecs.length && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">All Specifications</h4>
              <div className="space-y-3 border-t border-border py-4">
                {Object.entries(specs)
                  .filter(([key]) => !highlightedSpecs.includes(key))
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2"
                    >
                      <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        {key}
                      </span>
                      <span className="text-sm text-foreground font-medium">{value}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
