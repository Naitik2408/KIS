import { ShieldCheck, Wrench, UserCircle2 } from 'lucide-react'

const MEMBERS = [
  {
    name: 'Krishna Kanhaiya',
    role: 'Owner',
    image: '/members/krishna-kanhaiya-sample.svg',
    description:
      'Leads Krishna Infotech Solutions and handles customer guidance for laptop sale, rental planning, and business support.',
    icon: UserCircle2,
    badge: 'Core Leadership',
  },
  {
    name: 'Saurav',
    role: 'Certified Laptop Repair Specialist',
    image: '/members/saurav-sample.svg',
    description:
      'Highly qualified to repair all kinds of laptops and certified to handle diagnostics, motherboard-level fixes, and performance recovery.',
    icon: Wrench,
    badge: 'Certified Technician',
  },
]

export function TeamMembersSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8" id="members">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            Team Members
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground">Meet The Main Members</h2>
          <p className="text-muted-foreground mt-2 mx-auto max-w-2xl">
            The people behind reliable laptop sales, rentals, and professional repair support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MEMBERS.map((member) => {
            const Icon = member.icon

            return (
              <article
                key={member.name}
                className="rounded-2xl border border-border bg-card p-4 sm:p-5 hover:border-primary/35 transition-colors"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-5">
                  <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-lg border border-border bg-muted sm:h-auto sm:w-28 sm:min-h-28">
                    <img
                      src={member.image}
                      alt={`${member.name} sample profile`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                        {member.badge}
                      </span>
                      <span className="inline-flex items-center justify-center rounded-md bg-primary/10 text-primary p-2">
                        <Icon className="w-4 h-4" />
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground leading-tight">{member.name}</h3>
                    <p className="text-sm text-primary font-medium mt-1">{member.role}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-3">{member.description}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
