import { ShieldCheck, Wrench, BadgeCheck } from 'lucide-react'

const BRANDS = ['HP', 'Lenovo', 'Dell', 'Acer', 'ASUS', 'MSI']

export function LaptopBrandsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <p className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground">
          Laptop Brands We Provide
        </p>
        <h2 className="text-4xl font-bold text-foreground mt-4">Trusted Brands, Verified Machines</h2>
        <p className="max-w-3xl mx-auto mt-3 text-muted-foreground">
          We supply business and performance laptops from reliable brands, each device checked for quality, battery health, and overall condition.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {BRANDS.map((brand) => (
          <div
            key={brand}
            className="rounded-xl border border-border bg-card p-5 text-center font-semibold text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
          >
            {brand}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
            <BadgeCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Import A Grade Quality</h3>
          <p className="text-sm text-muted-foreground">Every listed laptop follows tested quality benchmarks before sale or rent.</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Verified Configuration</h3>
          <p className="text-sm text-muted-foreground">Processor, RAM, storage, and graphics details are clearly stated for each model.</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Support Ready</h3>
          <p className="text-sm text-muted-foreground">Quick guidance for setup, compatibility, and post-purchase assistance.</p>
        </div>
      </div>
    </section>
  )
}
