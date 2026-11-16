"use client"

import { PageHeading } from "@/features/site/components/page-heading"

import { useContacts } from "../api/contact"
import { externalLinkProps } from "../utils/links"

export function ContactPage() {
  const { data } = useContacts()
  if (!data) return null

  return (
    <>
      <PageHeading
        title="Contact"
        description="Email, phone, and social profiles."
      />
      <ul className="divide-y border-t">
        {data.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="flex items-start justify-between gap-4 px-6 py-4 text-sm transition-colors hover:bg-muted sm:items-baseline sm:gap-6 sm:px-10"
              {...externalLinkProps(item.external)}
            >
              <span className="shrink-0">{item.label}</span>
              <span className="min-w-0 text-right wrap-break-word text-muted-foreground">
                {item.value}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
