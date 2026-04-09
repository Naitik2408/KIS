'use client'

import { useState } from 'react'
import { ChevronDown, ThumbsUp, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { QAItem } from '@/lib/products'

interface QASectionProps {
  qaItems?: QAItem[]
}

export function QASection({ qaItems = [] }: QASectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'helpful' | 'recent'>('helpful')

  const sortedItems = [...qaItems].sort((a, b) => {
    if (sortBy === 'helpful') return b.helpful - a.helpful
    return 0
  })

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Questions & Answers</h2>

        {/* Sort and Ask Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 pb-6 border-b">
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
            >
              <option value="helpful">Most Helpful</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Ask a Question
          </Button>
        </div>

        {/* QA Items */}
        {sortedItems.length > 0 ? (
          <div className="space-y-4">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition"
              >
                {/* Question Header */}
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="w-full p-4 flex items-start justify-between hover:bg-muted/50 transition text-left"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Q: {item.question}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Asked by <span className="font-medium">{item.asker}</span> · {item.date}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 ml-2 transition-transform ${
                      expandedId === item.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Answer Section */}
                {expandedId === item.id && (
                  <div className="border-t bg-muted/20 p-4 space-y-4">
                    {item.answer ? (
                      <div className="space-y-4">
                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                          <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">Official Answer</p>
                          <p className="text-sm text-foreground leading-relaxed">{item.answer}</p>
                          <p className="text-xs text-muted-foreground mt-3">Answered by {item.answerer} · {item.date}</p>
                        </div>

                        {/* Helpful Button */}
                        <div className="flex items-center gap-4 pt-2 border-t">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-muted-foreground hover:text-foreground"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-xs">{item.helpful} helpful</span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MessageCircle className="w-4 h-4" />
                        <p className="text-sm">Waiting for answer...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No questions yet. Be the first to ask!</p>
          </div>
        )}
      </div>
    </section>
  )
}
