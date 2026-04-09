import { LucideIcon } from 'lucide-react'

interface AdminStatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  color?: 'primary' | 'accent' | 'green' | 'blue'
}

export function AdminStatsCard({
  title,
  value,
  description,
  icon: Icon,
  color = 'primary',
}: AdminStatsCardProps) {
  const colorClasses = {
    primary: 'bg-cyan-400/15 text-cyan-700 border-cyan-200',
    accent: 'bg-amber-400/15 text-amber-700 border-amber-200',
    green: 'bg-emerald-400/15 text-emerald-700 border-emerald-200',
    blue: 'bg-indigo-400/15 text-indigo-700 border-indigo-200',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-4 sm:p-6 shadow-[0_8px_24px_rgba(2,6,23,0.06)] hover:shadow-[0_14px_34px_rgba(2,6,23,0.1)] transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-slate-500 text-xs font-semibold tracking-wide uppercase mb-2">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</p>
          {description && (
            <p className="text-slate-500 text-xs mt-2">{description}</p>
          )}
        </div>
        {Icon && (
          <div className={`${colorClasses[color]} border p-2.5 sm:p-3 rounded-xl shrink-0`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}
      </div>
    </div>
  )
}
