export function PageHeading({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <header className="px-6 py-14 sm:px-10 sm:py-20">
      <h1 className="max-w-4xl text-2xl font-medium leading-none text-balance md:text-4xl lg:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>
    </header>
  )
}
