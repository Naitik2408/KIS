import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag, CalendarClock, Building2, Laptop } from 'lucide-react'

export function LaptopBuyRentSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="rental">
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-border bg-linear-to-br from-background to-muted/40">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground">
              <ShoppingBag className="w-3.5 h-3.5" />
              Buy Laptops
            </p>
            <h3 className="text-3xl font-bold mt-4 mb-3">Own the Right Laptop for Daily Work</h3>
            <p className="text-muted-foreground mb-6">
              Choose from tested laptops with clear specifications and fair pricing. Best for students, professionals, and office setups.
            </p>
            <ul className="space-y-2 text-sm text-foreground mb-7">
              <li className="flex items-center gap-2"><Laptop className="w-4 h-4 text-primary" /> Business and performance models</li>
              <li className="flex items-center gap-2"><Laptop className="w-4 h-4 text-primary" /> Import A Grade options available</li>
              <li className="flex items-center gap-2"><Laptop className="w-4 h-4 text-primary" /> Ready-to-use Windows setup</li>
            </ul>
            <Link href="/products">
              <Button className="w-full sm:w-auto">Browse Laptops</Button>
            </Link>
          </div>

          <div className="p-8 sm:p-10 bg-linear-to-br from-primary/10 via-background to-background">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
              <CalendarClock className="w-3.5 h-3.5" />
              Rent Laptops
            </p>
            <h3 className="text-3xl font-bold mt-4 mb-3">Need Laptops on Rent? We Provide That Too</h3>
            <p className="text-muted-foreground mb-6">
              We provide laptop rental for short and long duration needs like events, training batches, onboarding, and project teams.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-sm font-semibold">Flexible Duration</p>
                <p className="text-xs text-muted-foreground">Daily, weekly, and monthly rental plans</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-sm font-semibold">Bulk Availability</p>
                <p className="text-xs text-muted-foreground">Suitable for offices and institutions</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3 sm:col-span-2">
                <p className="text-sm font-semibold flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Corporate and Training Rental</p>
                <p className="text-xs text-muted-foreground">Share your requirement and get a quick quote for rental quantity and duration.</p>
              </div>
            </div>

            <a
              href="https://wa.me/919060557296?text=Hi%20Krishna%20Infotech%20Solutions,%20I%20want%20to%20rent%20some%20laptops.%20Please%20connect%20with%20me."
              target="_blank"
              rel="noreferrer"
              className="inline-block w-full sm:w-auto"
            >
              <Button variant="outline" className="w-full sm:w-auto">Request Rental Quote</Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
