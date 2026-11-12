import Link from "next/link"

import { buttonVariants } from "@workspace/ui/components/button"

export function WorkTogether() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 border-b border-border bg-background px-6 py-16 text-center sm:px-10">
      <h2 className="text-3xl font-medium text-foreground md:text-4xl">
        Let&apos;s work together
      </h2>
      <Link href="/contact" className={buttonVariants({ size: "lg" })}>
        Contact me
      </Link>
      <p className="text-sm leading-5 font-normal text-foreground/60">
        Email, phone, and social profiles.
      </p>
    </section>
  )
}
