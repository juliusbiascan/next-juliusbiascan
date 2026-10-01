# Prisma 8

Migration Plan
```bash
pnpm turbo run migration:plan --filter=@repo/db -- --name add-user-bio
```

Migrate
```bash
pnpm turbo run db:migrate --filter=@repo/db
pnpm --filter @repo/db migration:status
```