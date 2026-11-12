# Prisma 7

Generate the client
```bash
pnpm --filter @repo/db db:generate
```

Create and apply a migration in development
```bash
pnpm --filter @repo/db db:migrate
```

Apply committed migrations
```bash
pnpm --filter @repo/db db:deploy
```
