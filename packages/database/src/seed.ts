import { db } from "./index";

const existing = await db.user.findMany({ select: { id: true } });
if (existing.length === 0) {
  await db.user.create({ data: { email: "alice@prisma.io", name: "Alice" } });
  await db.user.create({ data: { email: "bob@prisma.io", name: "Bob" } });
}
console.log(
  await db.user.findMany({ select: { id: true, email: true, name: true } }),
);
await db.$disconnect();
