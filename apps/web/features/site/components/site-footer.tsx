import { Separator } from "@workspace/ui/components/separator"

import type { SiteData } from "../services/get-site"

export function SiteFooter({
  name,
  email,
}: {
  name: string
  email: SiteData["email"]
}) {
  return (
    <footer>
      <Separator />
      <div className="flex flex-col gap-1 px-6 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p>{name}</p>
        {email ? (
          <a href={email.href} className="hover:text-foreground">
            {email.value}
          </a>
        ) : null}
      </div>
    </footer>
  )
}
