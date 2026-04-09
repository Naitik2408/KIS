import { MessageCircle, Phone, Mail, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CONTACT = {
  ownerName: 'Owner',
  ownerEmail: 'krishnainfotechsolution@gmail.com',
  phonePrimaryLabel: '+91 90605 57296',
  phonePrimaryDial: '+919060557296',
  phoneAlternateLabel: '+91 90605 57296',
  phoneAlternateDial: '+919060557296',
  whatsappDial: '919060557296',
}

export function ContactHubSection() {
  const whatsappUrl = `https://wa.me/${CONTACT.whatsappDial}?text=Hi%20Krishna%20Infotech%20Solutions,%20I%20want%20details%20for%20laptop%20sale%20or%20rental.`

  return (
    <section id="contact-hub" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="lg:col-span-2 p-5 sm:p-10 border-b lg:border-b-0 lg:border-r border-border bg-linear-to-br from-primary/10 via-background to-background">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              Instant Contact
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold mt-4 mb-4">Talk To Krishna Infotech Solutions Directly</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-5 sm:mb-6">
              No long forms. Reach us directly on WhatsApp, call now, or email the owner for laptop sale, rental, and support.
            </p>

            <div className="rounded-xl border border-border bg-background p-3 sm:p-4 space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Owner Email</p>
              <a
                href={`mailto:${CONTACT.ownerEmail}`}
                className="block break-all text-xs sm:text-sm font-medium text-foreground hover:text-primary transition"
              >
                {CONTACT.ownerEmail}
              </a>
            </div>
          </div>

          <div className="lg:col-span-3 p-5 sm:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-green-300/40 bg-green-50/80 dark:bg-green-950/20 p-4 sm:p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="inline-flex rounded-lg bg-green-600 text-white p-2.5 mb-4">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold tracking-wide uppercase text-green-700 dark:text-green-400 mb-1">WhatsApp</p>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Chat Instantly</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">Fastest way to get laptop availability, best price, and rental details.</p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Open WhatsApp</Button>
              </a>

              <a
                href={`tel:${CONTACT.phonePrimaryDial}`}
                className="group rounded-2xl border border-border bg-muted/40 p-4 sm:p-5 transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
              >
                <div className="inline-flex rounded-lg bg-primary text-primary-foreground p-2.5 mb-4">
                  <Phone className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground mb-1">Primary Number</p>
                <h3 className="text-base sm:text-lg font-bold mb-2">{CONTACT.phonePrimaryLabel}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">Call for sale inquiry, pricing, and immediate product confirmation.</p>
                <Button variant="outline" className="w-full">Call Now</Button>
              </a>

              <a
                href={`tel:${CONTACT.phoneAlternateDial}`}
                className="group rounded-2xl border border-border bg-muted/40 p-4 sm:p-5 transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
              >
                <div className="inline-flex rounded-lg bg-primary text-primary-foreground p-2.5 mb-4">
                  <Phone className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground mb-1">Alternate Number</p>
                <h3 className="text-base sm:text-lg font-bold mb-2">{CONTACT.phoneAlternateLabel}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">Backup contact for quick response during busy business hours.</p>
                <Button variant="outline" className="w-full">Call Alternate</Button>
              </a>

              <a
                href={`mailto:${CONTACT.ownerEmail}?subject=Laptop%20Sale%20or%20Rental%20Inquiry`}
                className="group rounded-2xl border border-border bg-muted/40 p-4 sm:p-5 transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
              >
                <div className="inline-flex rounded-lg bg-primary text-primary-foreground p-2.5 mb-4">
                  <Mail className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground mb-1">Owner Email</p>
                <h3 className="text-base sm:text-lg font-bold mb-2">Write To {CONTACT.ownerName}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">Send complete requirements for bulk order, quote, or rental timeline.</p>
                <Button variant="outline" className="w-full">Send Email</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
