export function PageHeading({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="px-4 lg:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
